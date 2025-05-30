import React from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Users,
  FileText,
  DollarSign,
  LogOut,
  BadgeInfo,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: "Kasir", icon: <LayoutDashboard size={18} />, path: "/kasir" },
    { name: "Stock", icon: <Package size={18} />, path: "/stock" },
    { name: "Pelanggan", icon: <Users size={18} />, path: "/pelanggan" },
    { name: "Hutang", icon: <DollarSign size={18} />, path: "/hutang" },
    { name: "Laporan", icon: <FileText size={18} />, path: "/laporan" },
    { name: "Tentang", icon: <BadgeInfo size={18} />, path: "/tentang" },
  ];

  return (
    <div
      className={`h-screen bg-[#1E686D] text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between">
          {isOpen && <h1 className="text-lg font-bold">BASMALAH PLASTIK</h1>}
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={20} /> : <Menu size={30} />}
          </button>
        </div>
        {isOpen && (
          <span className="text-xs text-gray-300">by Outlook Project</span>
        )}
      </div>

      {/* Menu items */}
      <div className="flex-1 px-2 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              [
                "w-full flex items-center gap-3 text-left p-3 rounded-lg transition",
                isActive
                  ? "bg-green-400 text-white font-bold"
                  : "bg-white text-black hover:bg-[#D8D8D8]",
              ].join(" ")
            }
          >
            {item.icon}
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button className="flex text-bold items-center gap-2 w-full text-left text-sm hover:text-red-400">
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
