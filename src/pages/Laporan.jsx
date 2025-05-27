import React from "react";
import api from "../utils/api";

const Laporan = () => {
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-1">Laporan Penjualan</h1>
      <p className="text-sm text-gray-500 mb-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, dicta.
      </p>
      <div className="rounded-[20px] mb-4 px-2 shadow-md bg-white w-full h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-4 pt-4">
          {/* Total Penjualan */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Rp 1.600.000.000
            </h2>
            <p className="text-gray-500">Total Penjualan</p>
          </div>
          {/* Keterangan Kanan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">678</h3>
              <p className="text-gray-500 text-sm">Transaksi</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Rp.3.000.000
              </h3>
              <p className="text-gray-500 text-sm">Total Hutang</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">1.985</h3>
              <p className="text-gray-500 text-sm">Produk Terjual</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laporan;
