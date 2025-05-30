import React from "react";
import { LogOut } from "lucide-react";
import api from "../utils/api"; // pastikan path sesuai
import { useNavigate } from "react-router-dom";

const Navbar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      // Optional: tampilkan pesan error jika perlu
    }
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-16 w-full bg-white shadow-lg border-b flex items-center justify-between px-6">
      {/* Sembunyikan teks jika sidebar terbuka */}
      <h2
        className={`text-lg font-semibold ${isSidebarOpen ? "invisible" : ""}`}
      >
        Basmalah Plastik
      </h2>

      <div className="flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Maria Gabriela</span>
          <span className="text-xs text-gray-400 -mt-1">Admin</span>
        </div>
        <button
          className="flex items-center gap-1 text-bold text-[#1E686D] hover:text-green-600 transition"
          onClick={handleLogout}
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
