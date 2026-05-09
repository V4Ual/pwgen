// app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  savePassword,
  getAllPasswords,
  deletePassword,
  type StoredPassword,
} from "@/lib/db";

export default function Home() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [savedPasswords, setSavedPasswords] = useState<StoredPassword[]>([]);
  const [copySuccess, setCopySuccess] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved passwords from IndexedDB on mount
  useEffect(() => {
    const loadPasswords = async () => {
      try {
        const passwords = await getAllPasswords();
        setSavedPasswords(passwords);
      } catch (error) {
        console.error("Failed to load passwords:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPasswords();
  }, []);

  // Generate random password based on criteria
  const generatePassword = useCallback(() => {
    const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijkmnopqrstuvwxyz";
    const numberChars = "23456789";
    const symbolChars = "!@#$%^&*()_+[]{}<>?";

    let allowedChars = "";
    if (includeUppercase) allowedChars += uppercaseChars;
    if (includeLowercase) allowedChars += lowercaseChars;
    if (includeNumbers) allowedChars += numberChars;
    if (includeSymbols) allowedChars += symbolChars;

    if (allowedChars === "") {
      setPassword("Please select at least one character type");
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      generatedPassword += allowedChars[randomIndex];
    }

    // Ensure at least one character from each selected type (better distribution)
    let finalPassword = generatedPassword;
    if (includeUppercase && !finalPassword.match(/[A-Z]/)) {
      finalPassword =
        finalPassword.slice(1) +
        uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    }
    if (includeLowercase && !finalPassword.match(/[a-z]/)) {
      finalPassword =
        finalPassword.slice(1) +
        lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    }
    if (includeNumbers && !finalPassword.match(/[2-9]/)) {
      finalPassword =
        finalPassword.slice(1) +
        numberChars[Math.floor(Math.random() * numberChars.length)];
    }
    if (includeSymbols && !finalPassword.match(/[!@#$%^&*()_+[\]{}<>?]/)) {
      finalPassword =
        finalPassword.slice(1) +
        symbolChars[Math.floor(Math.random() * symbolChars.length)];
    }

    setPassword(finalPassword);
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  // Generate on mount and when settings change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Copy password to clipboard
  const copyToClipboard = async () => {
    if (!password || password.includes("Please select")) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopySuccess("✓ Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  // Save current password to IndexedDB
  const handleSave = async () => {
    if (!password || password.includes("Please select")) {
      setSaveSuccess("Generate a valid password first");
      setTimeout(() => setSaveSuccess(""), 2000);
      return;
    }

    const service =
      serviceName.trim() || `Password-${new Date().toLocaleDateString()}`;

    try {
      await savePassword({
        password,
        service,
        createdAt: new Date().toISOString(),
      });

      // Refresh the list
      const updatedPasswords = await getAllPasswords();
      setSavedPasswords(updatedPasswords);
      setSaveSuccess(`✓ Saved for "${service}"`);
      setServiceName(""); // Clear service name input
      setTimeout(() => setSaveSuccess(""), 2000);
    } catch (error) {
      console.error("Save failed:", error);
      setSaveSuccess("Failed to save");
      setTimeout(() => setSaveSuccess(""), 2000);
    }
  };

  // Delete a saved password
  const handleDelete = async (id: number) => {
    try {
      await deletePassword(id);
      const updatedPasswords = await getAllPasswords();
      setSavedPasswords(updatedPasswords);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Copy a saved password to clipboard
  const copySavedPassword = async (pwd: string, service: string) => {
    try {
      await navigator.clipboard.writeText(pwd);
      setCopySuccess(`✓ Copied ${service}`);
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  // Password strength indicator
  const getStrength = () => {
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (includeUppercase) score++;
    if (includeLowercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    if (score <= 2) return { text: "Weak", color: "bg-red-500", width: "33%" };
    if (score <= 4)
      return { text: "Fair", color: "bg-yellow-500", width: "66%" };
    return { text: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen bg-[#050816] overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-10 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(34,211,238,0.5)]">
              VaultForge
            </span>
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Next Generation Password Vault Experience
          </p>
        </header>

        <div className="grid lg:grid-cols-[420px_1fr] gap-8">
          {/* Generator Card */}
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-[32px] blur opacity-40 group-hover:opacity-100 transition duration-500" />

            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30">
                  ⚡
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Password Generator
                  </h2>
                  <p className="text-sm text-gray-400">
                    AI Style Secure Passwords
                  </p>
                </div>
              </div>

              {/* Password Display */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl rounded-2xl" />

                <div className="relative bg-black/40 border border-cyan-400/20 rounded-2xl p-5 pr-14 shadow-inner shadow-cyan-500/10">
                  <span className="font-mono text-cyan-300 text-lg break-all">
                    {password || "Generate Password"}
                  </span>
                </div>

                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 hover:scale-110 transition-all duration-300 shadow-lg shadow-cyan-500/40 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>

              {copySuccess && (
                <div className="mb-4 text-green-400 text-center font-medium">
                  {copySuccess}
                </div>
              )}

              {/* Length */}
              <div className="mb-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-300">Password Length</span>
                  <span className="text-cyan-400 font-semibold">{length}</span>
                </div>

                <input
                  type="range"
                  min="8"
                  max="32"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-cyan-500 to-purple-600"
                />
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {[
                  {
                    label: "Uppercase Letters",
                    checked: includeUppercase,
                    onChange: setIncludeUppercase,
                  },
                  {
                    label: "Lowercase Letters",
                    checked: includeLowercase,
                    onChange: setIncludeLowercase,
                  },
                  {
                    label: "Numbers",
                    checked: includeNumbers,
                    onChange: setIncludeNumbers,
                  },
                  {
                    label: "Symbols",
                    checked: includeSymbols,
                    onChange: setIncludeSymbols,
                  },
                ].map((item, i) => (
                  <label
                    key={i}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-3 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <span className="text-gray-200">{item.label}</span>

                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.onChange(e.target.checked)}
                      className="w-5 h-5 accent-cyan-500"
                    />
                  </label>
                ))}
              </div>

              {/* Strength */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Security Level</span>
                  <span
                    className={`font-semibold ${
                      strength.text === "Strong"
                        ? "text-green-400"
                        : strength.text === "Fair"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {strength.text}
                  </span>
                </div>

                <div className="h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
                  <div
                    style={{ width: strength.width }}
                    className={`h-full ${strength.color} transition-all duration-500 shadow-lg`}
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generatePassword}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-[0_15px_35px_rgba(59,130,246,0.45)]"
              >
                ✨ Generate Password
              </button>
            </div>
          </div>

          {/* Vault Section */}
          <div className="space-y-6">
            {/* Save Card */}
            <div className="relative group">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[30px] blur opacity-30 group-hover:opacity-100 transition duration-500" />

              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[30px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-2xl shadow-lg">
                    💾
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Save Password
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Store locally with IndexedDB
                    </p>
                  </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-4">
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="Enter service name..."
                    className="flex-1 bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 outline-none focus:border-cyan-400 transition-all"
                  />

                  <button
                    onClick={handleSave}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/30"
                  >
                    Save Vault
                  </button>
                </div>

                {saveSuccess && (
                  <div className="text-emerald-400 mt-3 text-center">
                    {saveSuccess}
                  </div>
                )}
              </div>
            </div>

            {/* Vault List */}
            <div className="relative group">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-[30px] blur opacity-30 group-hover:opacity-100 transition duration-500" />

              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[30px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      🏦 Password Vault
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                      {savedPasswords.length} Secure Passwords
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-16 text-gray-400">
                    Loading Vault...
                  </div>
                ) : savedPasswords.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-7xl mb-4 opacity-50">🔐</div>

                    <h3 className="text-xl font-semibold text-gray-300">
                      Vault Empty
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Save your first secure password
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {savedPasswords.map((item) => (
                      <div
                        key={item.id}
                        className="bg-black/30 border border-white/10 hover:border-cyan-400/40 rounded-3xl p-5 transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_15px_35px_rgba(34,211,238,0.15)]"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-cyan-400 font-bold text-lg">
                                {item.service}
                              </span>

                              <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="font-mono text-gray-300 mt-3 break-all bg-black/30 rounded-xl px-4 py-3 border border-white/5">
                              {item.password}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                copySavedPassword(item.password, item.service)
                              }
                              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 hover:scale-110 transition-all flex items-center justify-center shadow-lg shadow-cyan-500/30"
                            >
                              📋
                            </button>

                            <button
                              onClick={() => handleDelete(item.id!)}
                              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 hover:scale-110 transition-all flex items-center justify-center shadow-lg shadow-red-500/30"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-10">
          🔒 Local Storage Only • No Cloud Sync • Fully Private
        </footer>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 999px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}
