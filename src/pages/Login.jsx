import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../utils/api";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch("https://api.basmalahplastik.shop/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Simpan token ke localStorage/sessionStorage jika perlu
        localStorage.setItem("token", data.token);
        // Redirect ke halaman utama/dashboard (ganti sesuai kebutuhan)
        window.location.href = "/kasir";
      } else {
        setErrorMsg(data.message || "Login gagal");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan, silakan coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-[#72BDAF] to-[#1E686D] relative">
      {/* Wave image at the bottom */}
      <img
        src="images/wave.png"
        alt=""
        className="fixed bottom-0 left-0 w-full pointer-events-none select-none z-0"
      />
      {/* Left side - Login Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-8 z-10">
        <div className="w-full max-w-md bg-white p-8 rounded-[20px] shadow-lg">
          <h2 className="text-2xl font-bold text-left text-gray-800">Login</h2>
          <div className="mb-6 text-sm">
            <span>Login untuk menggunakan aplikasi</span>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Ingat saya
              </label>
              <a href="#" className="text-blue-500 hover:underline">
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white rounded-lg bg-[#1E686D] rounded-[15px] hover:bg-[#72BDAF] transition"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            © 2025,{" "}
            <a href="#" className="text-purple-500">
              Outlook Project
            </a>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="md:w-1/2 w-full flex items-center justify-center z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">BASMALAH PLASTIK</h1>
          <img
            src="images/kasir.png"
            alt="Login Illustration"
            className="w-80 h-auto mt-4 mb-4"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
