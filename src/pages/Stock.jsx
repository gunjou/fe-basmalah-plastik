import React from "react";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoQrCodeOutline } from "react-icons/io5";

const Stock = () => {
  // Data dummy
  const [sortBy, setSortBy] = useState("nama");
  const [sortAsc, setSortAsc] = useState(true);

  const [data, setData] = useState([
    {
      id: 1,
      nama: "Plastik A",
      stok: 20,
      no_batch: "34218976",
      harga: "10.000",
      satuan: "Pcs",
    },
    {
      id: 2,
      nama: "Plastik B",
      stok: 15,
      no_batch: "34218976",
      harga: "10.000",
      satuan: "Pack",
    },
    {
      id: 3,
      nama: "Plastik C",
      stok: 30,
      no_batch: "34218976",
      harga: "10.000",
      satuan: "Kg",
    },
    {
      id: 4,
      nama: "Plastik A",
      stok: 20,
      no_batch: "34218976",
      harga: "10.000",
      satuan: "Pcs",
    },
    {
      id: 5,
      nama: "Plastik B",
      stok: 15,
      no_batch: "34218976",
      harga: "10.000",
      satuan: "Pack",
    },
    {
      id: 6,
      nama: "Plastik C",
      stok: 30,
      no_batch: "34218976",
      harga: "10.000",
      satuan: "Kg",
    },
    {
      id: 7,
      nama: "Plastik A",
      stok: 20,
      no_batch: "34218976",
      harga: "10.000",
      satuan: "Pcs",
    },
    {
      id: 8,
      nama: "Plastik B",
      stok: 15,
      no_batch: "34218976",
      harga: "10.000",
      satuan: "Pack",
    },
    {
      id: 9,
      nama: "Plastik C",
      stok: 30,
      no_batch: "34218976",
      harga: "10.000",
      satuan: "Kg",
    },
    {
      id: 10,
      nama: "Plastik A",
      stok: 20,
      no_batch: "34218976",
      harga: "10.000",
      satuan: "Pcs",
    },
    {
      id: 11,
      nama: "Plastik B",
      stok: 15,
      no_batch: "34218976",
      harga: "10.000",
      satuan: "Pack",
    },
    {
      id: 12,
      nama: "Plastik C",
      stok: 30,
      no_batch: "34218976",
      harga: "10.000",
      satuan: "Kg",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Modal handler
  const openEditModal = (item) => {
    setEditItem(item);
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

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setData((prev) =>
      prev.map((item) => (item.id === editItem.id ? { ...editItem } : item))
    );
    closeModal();
  };

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    nama: "",
    stok: "",
    satuan: "",
    no_batch: "",
    harga: "",
  });

  // Handler untuk modal tambah
  const openAddModal = () => {
    setNewItem({
      nama: "",
      stok: "",
      satuan: "",
      no_batch: "",
      harga: "",
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

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setData((prev) => [
      ...prev,
      {
        ...newItem,
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
      },
    ]);
    closeAddModal();
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

  // Handler
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
          <form class="flex items-center gap-2">
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
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 z-50 sticky top-0">
              <tr>
                <th className="px-1 py-2 text-center">No</th>
                <th
                  className="px-1 py-2 cursor-pointer select-none"
                  onClick={() => handleSort("nama")}
                >
                  <div className="flex items-center">
                    Nama Barang
                    <SortIcon active={sortBy === "nama"} asc={sortAsc} />
                  </div>
                </th>
                <th
                  className="px-1 py-2 cursor-pointer select-none"
                  onClick={() => handleSort("stok")}
                >
                  <div className="flex items-center">
                    Jumlah Stock
                    <SortIcon active={sortBy === "stok"} asc={sortAsc} />
                  </div>
                </th>
                <th
                  className="px-1 py-2 cursor-pointer select-none"
                  onClick={() => handleSort("satuan")}
                >
                  <div className="flex items-center">
                    Satuan
                    <SortIcon active={sortBy === "satuan"} asc={sortAsc} />
                  </div>
                </th>

                <th
                  className="px-1 py-2 cursor-pointer select-none"
                  onClick={() => handleSort("no_batch")}
                >
                  <div className="flex items-center">
                    NO Batch
                    <SortIcon active={sortBy === "no_batch"} asc={sortAsc} />
                  </div>
                </th>
                <th
                  className="px-1 py-2 cursor-pointer select-none"
                  onClick={() => handleSort("harga")}
                >
                  <div className="flex items-center">
                    Harga
                    <SortIcon active={sortBy === "harga"} asc={sortAsc} />
                  </div>
                </th>
                <th className="px-1 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, idx) => (
                <tr key={idx} className="bg-white border-b">
                  <td className="px-1 py-1 text-center">{idx + 1}</td>
                  <td className="px-1 py-1">{item.nama}</td>
                  <td className="px-1 py-1">{item.stok}</td>
                  <td className="px-1 py-1">{item.satuan}</td>
                  <td className="px-1 py-1">{item.no_batch}</td>
                  <td className="px-1 py-1">Rp.{item.harga}</td>
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
                <label className="block text-xs">Jumlah Stock</label>
                <input
                  type="number"
                  name="stok"
                  value={newItem.stok}
                  onChange={handleAddChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
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
                  <option value="" className="">
                    Pilih satuan
                  </option>
                  <option value="Pcs">Pcs</option>
                  <option value="Pack">Pack</option>
                  <option value="Kg">Kg</option>
                  <option value="Lembar">Lembar</option>
                  <option value="Dus">Dus</option>
                </select>
              </div>
              <div>
                <label className="block text-xs">No Batch</label>
                <input
                  type="text"
                  name="no_batch"
                  value={newItem.no_batch}
                  onChange={handleAddChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Harga</label>
                <input
                  type="text"
                  name="harga"
                  value={newItem.harga}
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
                <label className="block text-xs">Jumlah Stock</label>
                <input
                  type="number"
                  name="stok"
                  value={editItem.stok}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Satuan</label>
                <select
                  name="satuan"
                  value={editItem.satuan}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                >
                  <option value="">Pilih satuan</option>
                  <option value="Pcs">Pcs</option>
                  <option value="Pack">Pack</option>
                  <option value="Kg">Kg</option>
                  <option value="Lembar">Lembar</option>
                  <option value="Dus">Dus</option>
                </select>
              </div>
              <div>
                <label className="block text-xs">No Batch</label>
                <input
                  type="text"
                  name="no_batch"
                  value={editItem.no_batch}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Harga</label>
                <input
                  type="text"
                  name="harga"
                  value={editItem.harga}
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
