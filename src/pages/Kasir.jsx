import React from "react";

const Kasir = () => {
  // Contoh data dummy
  const data = [
    { id: 1, nama: "Plastik A", qty: 2, harga: 5000, total: 10000 },
    { id: 2, nama: "Plastik B", qty: 1, harga: 7000, total: 7000 },
    { id: 3, nama: "Plastik C", qty: 3, harga: 4000, total: 12000 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Kasir</h1>
      <p className="text-gray-600 mb-4">Transaksi Penjualan</p>
      <div class="rounded-[20px] mb-4 mr-2 ml-2 px-2 shadow-md bg-white w-full h-full"></div>
    </div>
  );
};

export default Kasir;
