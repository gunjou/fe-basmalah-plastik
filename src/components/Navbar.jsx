import React from "react";
import { LogOut } from "lucide-react";

const Navbar = ({ isSidebarOpen }) => {
  return (
    <div className="h-16 w-full bg-white shadow flex items-center justify-between px-6">
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
        <span className="text-sm text-gray-600">Maria Gabriela</span>
        <button className="flex items-center gap-1 text-black hover:text-red-700 transition">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
