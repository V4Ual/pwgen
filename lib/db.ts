// lib/db.ts
export interface StoredPassword {
  id?: number;
  password: string;
  service: string;
  createdAt: string;
}

const DB_NAME = "PasswordVaultDB";
const DB_VERSION = 1;
const STORE_NAME = "passwords";

let dbInstance: IDBDatabase | null = null;

// Open or create IndexedDB database
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance && dbInstance.name === DB_NAME) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("IndexedDB error:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("createdAt", "createdAt", { unique: false });
        store.createIndex("service", "service", { unique: false });
      }
    };
  });
};

// Save a new password
export const savePassword = async (
  passwordData: Omit<StoredPassword, "id">,
): Promise<number> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(passwordData);

    request.onsuccess = () => {
      resolve(request.result as number);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Get all saved passwords (latest first)
export const getAllPasswords = async (): Promise<StoredPassword[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("createdAt");
    const request = index.openCursor(null, "prev"); // descending order (newest first)
    const passwords: StoredPassword[] = [];

    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        passwords.push(cursor.value);
        cursor.continue();
      } else {
        resolve(passwords);
      }
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Delete a password by id
export const deletePassword = async (id: number): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};
