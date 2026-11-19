import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Lock, User, AlertCircle, LogIn } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const cleanInput = username.trim().toLowerCase();

    if (!/^[a-z0-9_.-]+$/.test(cleanInput)) {
      setError("Masukkan username yang valid tanpa @.");
      return;
    }

    setLoading(true);

    const emailFormat = `${cleanInput}@dreamsheep.local`;

    try {
      await signInWithEmailAndPassword(auth, emailFormat, password);
    } catch (err) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Username atau password salah. Silakan coba lagi.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Terlalu banyak percobaan gagal. Tunggu beberapa saat.");
      } else {
        setError("Gagal masuk ke sistem. Periksa koneksi internet Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-40 h-24 rounded-2xl bg-[#F5F7FA] p-3 flex items-center justify-center mb-4">
            <img
              src="/dreamsheep-logo.png"
              alt="Logo DreamSheep"
              className="w-full h-full object-contain scale-[1.5]"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#23436B]">DreamSheep</h1>
          <p className="text-xs text-slate-500 mt-1">
            Smart Livestock Monitoring System
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-2.5 text-rose-700 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#23436B] mb-1.5">
              Username
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                required
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#4F7EB6] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#23436B] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#4F7EB6] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#23436B] hover:bg-[#1a3454] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogIn size={18} />
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8">
          DreamSheep © 2026 • IPB University
        </p>
      </div>
    </div>
  );
}