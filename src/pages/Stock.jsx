import React, { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoQrCodeOutline, IoClose } from "react-icons/io5";
import api from "../utils/api";

const Stock = () => {
  const [sortBy, setSortBy] = useState("nama");
  const [sortAsc, setSortAsc] = useState(true);

  // State untuk data produk dari API
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data produk dari API saat mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get("/products/")
      .then((res) => setData(res.data))
      .catch(() => setError("Gagal mengambil data produk"))
      .finally(() => setLoading(false));
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Modal handler
  const openEditModal = (item) => {
    setEditItem(item); // langsung pakai data dari tabel
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${editItem.id}/`, {
        nama: editItem.nama,
        barcode: editItem.barcode,
        id_kategori: categories.find(
          (cat) => cat.nama === (editItem.kategori || editItem.nama_kategori)
        )?.id,
        id_satuan: units.find(
          (unit) => unit.nama === (editItem.satuan || editItem.nama_satuan)
        )?.id,
        harga_beli: editItem.harga_beli,
        harga_jual: editItem.harga_jual,
      });
      // Refresh data produk setelah edit
      const res = await api.get("/products/");
      setData(res.data);
      closeModal();
    } catch (err) {
      alert(
        "Gagal mengedit barang. Pastikan data sudah benar.\n\n" +
          (err.response?.data?.detail || err.message)
      );
    }
  };

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    nama: "",
    barcode: "",
    kategori: "",
    satuan: "",
    harga_beli: "",
    harga_jual: "",
  });

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]); // Tambah state untuk satuan

  // Fetch kategori dari API saat mount
  useEffect(() => {
    api
      .get("/categories/")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // Fetch satuan dari API saat mount
  useEffect(() => {
    api
      .get("/units/")
      .then((res) => setUnits(res.data))
      .catch(() => setUnits([]));
  }, []);

  // Handler untuk modal tambah
  const openAddModal = () => {
    setNewItem({
      nama: "",
      barcode: "",
      kategori: "",
      satuan: "",
      harga_beli: "",
      harga_jual: "",
      jumlah_stok: "", // Tambahkan jumlah stok default
    });
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products/", {
        nama: newItem.nama,
        barcode: newItem.barcode,
        id_kategori: categories.find((cat) => cat.nama === newItem.kategori)
          ?.id,
        id_satuan: units.find((unit) => unit.nama === newItem.satuan)?.id,
        harga_beli: newItem.harga_beli,
        harga_jual: newItem.harga_jual,
      });
      // Refresh data produk setelah tambah
      const res = await api.get("/products/");
      setData(res.data);
      closeAddModal();
    } catch (err) {
      alert("Gagal menambah barang. Pastikan data sudah benar.");
    }
  };

  // Sorting function
  const sortedData = [...data].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortAsc ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortAsc ? 1 : -1;
    return 0;
  });

  // Icon SVG
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

  return (
    <div className="">
      <h1 className="text-2xl font-bold pb-2">Stock</h1>
      <div className="bg-white rounded-[20px] py-4 px-6 shadow-md">
        <div className="flex items-center justify-between space-x-2 mb-4">
          <p className="text-sm font-semibold">Daftar Stock Barang</p>
          <form className="flex items-center gap-2">
            <label
              for="default-search"
              class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                class="block w-50 p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-[15px] bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Cari barang..."
                required
              />
            </div>
          </form>
        </div>

        <div
          className="relative overflow-x-auto shadow-md sm:rounded-lg"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {loading ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 z-50 sticky top-0">
                <tr>
                  <th className="px-1 py-2 text-center">No</th>
                  <th
                    className="px-1 py-2 cursor-pointer select-none"
                    onClick={() => handleSort("barcode")}
                  >
                    <div className="flex items-center">
                      Barcode
                      <SortIcon active={sortBy === "barcode"} asc={sortAsc} />
                    </div>
                  </th>
                  <th
                    className="px-1 py-2 cursor-pointer select-none"
                    onClick={() => handleSort("nama")}
                  >
                    <div className="flex items-center">
                      Nama Barang
                      <SortIcon active={sortBy === "nama"} asc={sortAsc} />
                    </div>
                  </th>
                  <th className="px-1 py-2">Kategori</th>
                  <th className="px-1 py-2">Satuan</th>
                  <th
                    className="px-1 py-2 cursor-pointer select-none"
                    onClick={() => handleSort("harga_beli")}
                  >
                    <div className="flex items-center">
                      Harga Beli
                      <SortIcon
                        active={sortBy === "harga_beli"}
                        asc={sortAsc}
                      />
                    </div>
                  </th>
                  <th
                    className="px-1 py-2 cursor-pointer select-none"
                    onClick={() => handleSort("harga_jual")}
                  >
                    <div className="flex items-center">
                      Harga Jual
                      <SortIcon
                        active={sortBy === "harga_jual"}
                        asc={sortAsc}
                      />
                    </div>
                  </th>
                  <th
                    className="px-1 py-2 cursor-pointer select-none"
                    onClick={() => handleSort("jumlah_stock")}
                  >
                    <div className="flex items-center">
                      Jumlah Stock
                      <SortIcon
                        active={sortBy === "jumlah_stock"}
                        asc={sortAsc}
                      />
                    </div>
                  </th>
                  <th className="px-1 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, idx) => (
                  <tr key={item.id || idx} className="bg-white border-b">
                    <td className="px-1 py-1 text-center">{idx + 1}</td>
                    <td className="px-1 py-1">{item.barcode}</td>
                    <td className="px-1 py-1">{item.nama}</td>
                    <td className="px-1 py-1">{item.nama_kategori}</td>
                    <td className="px-1 py-1">{item.nama_satuan}</td>
                    <td className="px-1 py-1">Rp.{item.harga_beli}</td>
                    <td className="px-1 py-1">Rp.{item.harga_jual}</td>
                    <td className="px-1 py-1">{item.jumlah_stok}</td>
                    <td className="px-1 py-1">
                      <button
                        className="bg-[#1E686D] hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                        onClick={() => openEditModal(item)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            className="bg-[#1E686D] p-2 rounded-lg text-xs text-white hover:bg-green-600"
            onClick={openAddModal}
          >
            Tambah Stock Barang
          </button>
        </div>
      </div>
      {/* Modal Tambah */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Tambah Stock Barang</h2>
              {/* <button
                type="button"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[#1E686D] transition"
                title="Scan QR"
              >
                <IoQrCodeOutline size={22} />
              </button> */}
            </div>
            <p className="text-xs mb-4 text-gray-400">
              Tambahkan detail barang
            </p>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs">Nama Barang</label>
                <input
                  type="text"
                  name="nama"
                  value={newItem.nama}
                  onChange={handleAddChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Barcode</label>
                <input
                  type="text"
                  name="barcode"
                  value={newItem.barcode}
                  onChange={handleAddChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Kategori</label>
                <select
                  name="kategori"
                  value={newItem.kategori}
                  onChange={handleAddChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.nama}>
                      {cat.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs">Satuan</label>
                <select
                  name="satuan"
                  value={newItem.satuan}
                  onChange={handleAddChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                >
                  <option value="">Pilih satuan</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.nama}>
                      {unit.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs">Harga Beli</label>
                <input
                  type="number"
                  name="harga_beli"
                  value={newItem.harga_beli}
                  onChange={handleAddChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Harga Jual</label>
                <input
                  type="number"
                  name="harga_jual"
                  value={newItem.harga_jual}
                  onChange={handleAddChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Jumlah Stock</label>
                <input
                  type="number"
                  name="jumlah_stok"
                  value={newItem.jumlah_stok}
                  onChange={handleAddChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="text-sm px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-sm rounded-lg bg-[#1E686D] hover:bg-green-600 text-white"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-lg font-bold">Edit Stock Barang</h2>
            <p className="text-xs mb-4 text-gray-400">Ubah detail barang</p>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs">Nama Barang</label>
                <input
                  type="text"
                  name="nama"
                  value={editItem.nama}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Barcode</label>
                <input
                  type="number"
                  name="barcode"
                  value={editItem.barcode}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs">Kategori</label>
                <select
                  name="kategori"
                  value={editItem.kategori || editItem.nama_kategori || ""}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.nama}>
                      {cat.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs">Satuan</label>
                <select
                  name="satuan"
                  value={editItem.satuan || editItem.nama_satuan || ""} // gunakan value dari data yang sedang diedit
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                >
                  <option value="">Pilih satuan</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.nama}>
                      {unit.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs">Harga Beli</label>
                <input
                  type="text"
                  name="harga_beli"
                  value={editItem.harga_beli}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Harga Jual</label>
                <input
                  type="text"
                  name="harga_jual"
                  value={editItem.harga_jual}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-1 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-sm rounded-lg bg-[#1E686D] hover:bg-green-600 text-white"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
