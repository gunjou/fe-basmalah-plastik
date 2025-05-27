import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { IoQrCodeOutline, IoClose } from "react-icons/io5";

const Kasir = () => {
  const [sortBy, setSortBy] = useState("nama");
  const [sortAsc, setSortAsc] = useState(true);

  const [data, setData] = useState([]);

  // Data pembelian, mulai dari kosong
  const [dataPembelian, setDataPembelian] = useState([]);

  // Handler untuk edit kuantitas/satuan
  const handlePembelianChange = (idx, field, value) => {
    setDataPembelian((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  // Sorting function
  const sortedData = [...data].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortAsc ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortAsc ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ active, asc }) => (
    <svg
      className={`w-3 h-3 ms-1.5 inline ${
        active ? "text-[#1E686D]" : "text-gray-400"
      }`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      style={{ transform: asc ? "rotate(0deg)" : "rotate(180deg)" }}
    >
      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
    </svg>
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  // State untuk modal daftar barang
  const [barangModalOpen, setBarangModalOpen] = useState(false);
  const [diskonType, setDiskonType] = useState("persen");
  const [diskonValue, setDiskonValue] = useState("");

  const [produkList, setProdukList] = useState([]);
  const [produkLoading, setProdukLoading] = useState(false);
  const [produkError, setProdukError] = useState(null);

  // Fetch produk saat modal daftar barang dibuka
  useEffect(() => {
    if (barangModalOpen) {
      setProdukLoading(true);
      setProdukError(null);
      api
        .get("/products/")
        .then((res) => setProdukList(res.data))
        .catch((err) => setProdukError("Gagal mengambil data produk"))
        .finally(() => setProdukLoading(false));
    }
  }, [barangModalOpen]);

  return (
    <div className="">
      <h1 className="text-2xl font-bold pb-2">Kasir</h1>
      <div className="bg-white rounded-lg py-4 px-6 shadow-md">
        <div className="text-sm font-semibold">Pembelian</div>
        <div className="text-xs text-gray-500">
          Detail pembelian ditampilkan disini
        </div>
        <div className="flex items-center gap-2 mt-2 mb-4">
          <button
            className="bg-[#1E686D] p-2 rounded-lg text-xs text-white hover:bg-green-600"
            onClick={() => setBarangModalOpen(true)}
          >
            Lihat Daftar Barang
          </button>
        </div>
        <div className="bg-white rounded-lg p-2 shadow-md">
          <div
            className="relative overflow-x-auto"
            style={{ maxHeight: "170px", overflowY: "auto" }}
          >
            {dataPembelian.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                Silakan scan barang yang dibeli
              </div>
            ) : (
              <table className="w-full text-sm text-left text-gray-500">
                <tbody>
                  {dataPembelian.map((item, idx) => (
                    <tr key={idx} className="bg-gray-200">
                      <td className="px-0.5 py-0.5">{item.nama}</td>
                      <td className="px-0.5 py-0.5">
                        <input
                          type="number"
                          min={1}
                          value={item.kuantitas}
                          onChange={(e) =>
                            handlePembelianChange(
                              idx,
                              "kuantitas",
                              e.target.value
                            )
                          }
                          className="w-16 border rounded px-1 py-0.5 text-center"
                        />
                      </td>
                      <td className="px-0.5 py-0.5">{item.satuan}</td>
                      <td className="px-0.5 py-0.5">Rp.{item.harga}</td>
                      <td className="px-0.5 py-0.5">
                        <button className="bg-white hover:bg-gray-300 text-black px-2 py-1 rounded text-xs">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <div class="flex flex-col md:flex-row gap-8 justify-between mt-2">
            <div class="space-y-4 w-full md:w-1/2 pr-4">
              <div class="flex justify-between">
                <label class="text-sm text-gray-700 pr-2">Sub Total</label>
                <input
                  type="text"
                  value="Rp. 80.000"
                  class="text-sm text-end border rounded-lg px-2 w-40"
                  readonly
                />
              </div>

              <div class="flex justify-between items-center">
                <label class="text-sm text-gray-700 pr-2">Diskon</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={0}
                    value={diskonValue}
                    onChange={(e) => setDiskonValue(e.target.value)}
                    className="text-sm text-end border rounded-lg px-2 w-24"
                    placeholder="Diskon"
                  />
                  <select
                    value={diskonType}
                    onChange={(e) => setDiskonType(e.target.value)}
                    className="text-xs border rounded-lg px-2 py-1"
                  >
                    <option value="persen">%</option>
                    <option value="nominal">Rp</option>
                  </select>
                </div>
              </div>

              <div class="flex justify-between">
                <label class="text-sm text-gray-700 font-semibold pr-2">
                  Total
                </label>
                <input
                  type="text"
                  value="Rp. 72.000"
                  class="text-sm text-end border rounded-lg px-2 w-40 font-semibold"
                  readonly
                />
              </div>
            </div>

            <div class="space-y-4 w-full md:w-1/2 pr-4">
              <div class="flex justify-between">
                <label class="text-sm text-gray-700 pr-2">Bayar</label>
                <input
                  type="text"
                  value="Rp. 100.000"
                  class="text-sm text-end border rounded-lg px-2 w-40"
                />
              </div>

              <div class="flex justify-between">
                <label class="text-sm text-gray-700 pr-2">Kembalian</label>
                <input
                  type="text"
                  value="Rp. 28.000"
                  class="text-sm text-end text-red-700 border rounded-lg px-2 w-40"
                  readonly
                />
              </div>

              <div class="text-center pt-4 ">
                <button class="bg-black text-sm text-white px-4 py-2 rounded-lg w-full md:w-auto transition duration-300 ease-in-out transform hover:bg-gray-800 hover:scale-105 hover:shadow-lg">
                  Cetak Struk
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Modal Daftar Barang */}
        {barangModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Daftar Barang</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setBarangModalOpen(false)}
                >
                  <IoClose size={28} />
                </button>
              </div>

              <form className="flex items-center gap-2 mb-4">
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-50 p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-[15px] bg-gray-50 focus:ring-green-500 focus:border-green-500"
                    placeholder="Cari barang..."
                  />
                </div>
              </form>
              <div
                className="relative overflow-x-auto shadow-md sm:rounded-lg"
                style={{ maxHeight: "250px", overflowY: "auto" }}
              >
                {produkLoading ? (
                  <div className="text-center py-8">Memuat data...</div>
                ) : produkError ? (
                  <div className="text-center text-red-500 py-8">
                    {produkError}
                  </div>
                ) : (
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 z-50 sticky top-0">
                      <tr>
                        <th className="px-2 py-1.5 text-center">No</th>
                        <th className="px-2 py-1.5 text-center">Barcode</th>
                        <th className="px-2 py-1.5">Nama Barang</th>
                        <th className="px-2 py-1.5">Kategori</th>
                        <th className="px-2 py-1.5">Satuan</th>
                        <th className="px-2 py-1.5">Harga Jual</th>
                        <th className="px-2 py-1.5">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produkList.map((item, idx) => (
                        <tr key={item.id} className="bg-white border-b">
                          <td className="px-2 py-1.5 text-center">{idx + 1}</td>
                          <td className="px-2 py-1.5 text-center">
                            {item.barcode}
                          </td>
                          <td className="px-2 py-1.5">{item.nama}</td>
                          <td className="px-2 py-1.5">{item.nama_kategori}</td>
                          <td className="px-2 py-1.5">{item.nama_satuan}</td>
                          <td className="px-2 py-1.5">Rp.{item.harga_jual}</td>
                          <td className="px-2 py-1.5">
                            <button
                              onClick={() => {
                                setDataPembelian((prev) => {
                                  // Cek apakah barang sudah ada di pembelian
                                  const idx = prev.findIndex(
                                    (b) =>
                                      b.nama === item.nama &&
                                      b.satuan === item.nama_satuan
                                  );
                                  if (idx !== -1) {
                                    // Jika sudah ada, tambahkan kuantitas
                                    return prev.map((b, i) =>
                                      i === idx
                                        ? {
                                            ...b,
                                            kuantitas: Number(b.kuantitas) + 1,
                                          }
                                        : b
                                    );
                                  }
                                  // Jika belum ada, tambahkan baru
                                  return [
                                    ...prev,
                                    {
                                      nama: item.nama,
                                      kuantitas: 1,
                                      satuan: item.nama_satuan,
                                      harga: item.harga_jual,
                                    },
                                  ];
                                });
                                setBarangModalOpen(false);
                              }}
                              className="bg-[#1E686D] hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Pilih
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kasir;
