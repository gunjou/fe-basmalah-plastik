import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoQrCodeOutline, IoClose } from "react-icons/io5"; // tambahkan IoClose
import { MdContactPage } from "react-icons/md";

const dummyDetailHutang = [
  {
    pencatatan: "01 Maret 2025",
    utang: "Rp.1.000.000",
    membayarkan: "-",
  },
  {
    pencatatan: "02 Maret 2025",
    utang: "-",
    membayarkan: "Rp.200.000",
  },
  {
    pencatatan: "03 Maret 2025",
    utang: "Rp.400.000",
    membayarkan: "-",
  },
];

const dummyPelanggan = [
  {
    id: 1,
    nama: "Sindi Hikmala",
    alamat: "Jl. Melati No. 12, Malang",
  },
  {
    id: 2,
    nama: "Gabriela Watu",
    alamat: "Jl. Mawar No. 5, Surabaya",
  },
  {
    id: 3,
    nama: "Pinkan Ibanez",
    alamat: "Jl. Kenanga No. 8, Batu",
  },
];

const Hutang = () => {
  // Data dummy hutang
  const [sortBy, setSortBy] = useState("nama");
  const [sortAsc, setSortAsc] = useState(true);

  const [data, setData] = useState([
    {
      id: 1,
      nama: "Sindi Hikmala",
      jmlh_hutang: "1.000.000",
      status: "Belum Lunas",
    },
    {
      id: 2,
      nama: "Gabriela Watu",
      jmlh_hutang: "500.000",
      status: "Lunas",
    },
    {
      id: 3,
      nama: "Pinkan Ibanez",
      jmlh_hutang: "750.000",
      status: "Belum Lunas",
    },
  ]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    nama: "",
    jmlh_hutang: "",
    status: "",
  });

  // Handler untuk modal tambah
  const openAddModal = () => {
    setNewItem({
      nama: "",
      jmlh_hutang: "",
      status: "",
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

  const [pencatatanModalOpen, setPencatatanModalOpen] = useState(false);

  // Handler untuk modal tambah
  const openPencatatanModal = () => {
    setNewItem({
      nama: "",
      jmlh_hutang: "",
      status: "",
    });
    setPencatatanModalOpen(true);
  };

  const closePencatatanModal = () => {
    setPencatatanModalOpen(false);
  };

  const handlePencatatanChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handlePencatatanSubmit = (e) => {
    e.preventDefault();
    setData((prev) => [
      ...prev,
      {
        ...newItem,
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
      },
    ]);
    closePencatatanModal();
  };

  // Modal Pilih
  const [pilihModalOpen, setPilihModalOpen] = useState(false);

  // Handler untuk modal pilih
  const openPilihModal = () => {
    setPilihModalOpen(true);
  };
  const closePilihModal = () => {
    setPilihModalOpen(false);
  };

  // Modal Pilih Kontak
  const [kontakModalOpen, setKontakModalOpen] = useState(false);

  // Handler untuk modal pilih kontak
  const openKontakModal = () => {
    setKontakModalOpen(true);
  };
  const closeKontakModal = () => {
    setKontakModalOpen(false);
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
      <h1 className="text-2xl font-bold pb-2">Hutang</h1>

      <div className="bg-white rounded-[20px] py-4 px-6 shadow-md">
        <div className="flex items-center justify-between space-x-2 mb-4">
          <p className="text-sm font-semibold">Daftar Hutang</p>
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
                placeholder="Cari..."
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
                    Nama
                    <SortIcon active={sortBy === "nama"} asc={sortAsc} />
                  </div>
                </th>
                <th
                  className="px-1 py-2 cursor-pointer select-none"
                  onClick={() => handleSort("jmlh_hutang")}
                >
                  <div className="flex items-center">
                    Jumlah Hutang
                    <SortIcon active={sortBy === "jmlh_hutang"} asc={sortAsc} />
                  </div>
                </th>
                <th
                  className="px-1 py-2 cursor-pointer select-none"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    <SortIcon active={sortBy === "status"} asc={sortAsc} />
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
                  <td className="px-1 py-1">Rp.{item.jmlh_hutang}</td>
                  <td className="px-1 py-1">
                    <span
                      className={
                        item.status === "Lunas"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-1 py-1">
                    <button
                      className="bg-[#1E686D] hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                      onClick={openPilihModal}
                    >
                      Pilih
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
            Pencatatan Baru
          </button>
        </div>
      </div>

      {/* Modal Tambah */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-0 w-full max-w-md shadow-lg relative overflow-hidden">
            {/* Pilihan Slide */}
            <div className="flex">
              <button
                className={`flex-1 py-3 font-semibold transition-all duration-200 ${
                  newItem.status !== "Bayar"
                    ? "bg-[#1E686D] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setNewItem((prev) => ({ ...prev, status: "" }))}
              >
                Tambah Hutang
              </button>
              <button
                className={`flex-1 py-3 font-semibold transition-all duration-200 ${
                  newItem.status === "Bayar"
                    ? "bg-[#1E686D] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() =>
                  setNewItem((prev) => ({ ...prev, status: "Bayar" }))
                }
              >
                Bayar Hutang
              </button>
            </div>
            {/* Konten Slide */}
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">
                {newItem.status === "Bayar"
                  ? "Form Bayar Hutang"
                  : "Form Tambah Hutang"}
              </h2>
              {/* Form Tambah Hutang */}
              {newItem.status !== "Bayar" && (
                <form onSubmit={handleAddSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs">Nama</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="nama"
                        value={newItem.nama}
                        onChange={handleAddChange}
                        className="border rounded px-2 py-1 w-full pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1E686D] hover:text-green-600"
                        title="Pilih dari daftar pelanggan"
                        onClick={openKontakModal}
                      >
                        <MdContactPage size={18} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs">Jumlah Hutang</label>
                    <input
                      type="text"
                      name="jmlh_hutang"
                      value={newItem.jmlh_hutang}
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
                      Tambah Hutang
                    </button>
                  </div>
                </form>
              )}
              {/* Form Bayar Hutang */}
              {newItem.status === "Bayar" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Simpan logika pembayaran hutang di sini
                    closeAddModal();
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs">Nama</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="nama"
                        value={newItem.nama}
                        onChange={handleAddChange}
                        className="border rounded px-2 py-1 w-full pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1E686D] hover:text-green-600"
                        title="Pilih dari daftar pelanggan"
                        onClick={openKontakModal}
                      >
                        <MdContactPage size={18} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs">Jumlah Pembayaran</label>
                    <input
                      type="text"
                      name="jmlh_hutang"
                      value={newItem.jmlh_hutang}
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
                      Simpan Pembayaran
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Pilih */}
      {pilihModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[800px] relative">
            <button
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
              onClick={closePilihModal}
              aria-label="Tutup"
            >
              <IoClose size={28} />
            </button>
            {/* Header Pelanggan */}
            <div className="mt-4 py-2 mb-2 px-2 shadow-md bg-[#1E686D] w-full h-full">
              <div className="flex justify-between ml-2">
                <h2 className="text-white text-lg font-bold">Gibran</h2>
                <button
                  type="button"
                  className="bg-green-500 text-xs text-white px-3 py-1 rounded-[20px] hover:bg-green-800 flex items-center"
                >
                  <i className="fa-solid fa-pen-to-square mr-1 text-xs"></i>{" "}
                  Ubah Nama Pelanggan
                </button>
              </div>
              <div className="bg-white rounded-lg justify-between mt-2">
                <div className="flex justify-between ml-2 text-xs">
                  <div>
                    <h3>Total utang Pelanggan :</h3>
                    <p className="text-red-600 font-semibold">Rp.1.200.000</p>
                  </div>
                  <button
                    type="button"
                    // onClick={}
                    className="bg-yellow-400 mr-2 text-xs text-white mt-2 mb-2 px-3 py-1 rounded-[20px] hover:bg-yellow-600 flex items-center"
                  >
                    <i className="fa-solid fa-pen-to-square mr-1 text-xs"></i>{" "}
                    Lunasi Utang
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-between ml-2">
              <table className="table-auto w-full text-sm divide-y divide-gray-200"></table>
            </div>
            {/* Tabel utama */}
            <div className="overflow-y-auto max-h-80">
              <table className="min-w-full bg-white border border-gray-300 rounded shadow">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 border-b text-center">
                      Pencatatan
                    </th>
                    <th className="py-2 px-4 border-b text-center">Hutang</th>
                    <th className="py-2 px-4 border-b text-center">
                      Membayarkan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dummyDetailHutang.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-4 border-b text-center">
                        {item.pencatatan}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {item.utang}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {item.membayarkan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closePilihModal}
                className="text-sm px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={openPencatatanModal}
                className="px-3 py-1 text-sm rounded-lg bg-[#1E686D] hover:bg-green-600 text-white"
              >
                Pencatatan Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pencatatan */}
      {pencatatanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-0 w-full max-w-md shadow-lg relative overflow-hidden">
            {/* Pilihan Slide */}
            <div className="flex">
              <button
                className={`flex-1 py-3 font-semibold transition-all duration-200 ${
                  newItem.status !== "Bayar"
                    ? "bg-[#1E686D] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setNewItem((prev) => ({ ...prev, status: "" }))}
              >
                Tambah Hutang
              </button>
              <button
                className={`flex-1 py-3 font-semibold transition-all duration-200 ${
                  newItem.status === "Bayar"
                    ? "bg-[#1E686D] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() =>
                  setNewItem((prev) => ({ ...prev, status: "Bayar" }))
                }
              >
                Bayar Hutang
              </button>
            </div>
            {/* Konten Slide */}
            <div className="p-6">
              {/* Form Tambah Hutang */}
              {newItem.status !== "Bayar" && (
                <form onSubmit={handlePencatatanSubmit} className="space-y-3">
                  <div className="block font-bold">Gibran</div>
                  <div>
                    <label className="block text-xs text-gray-500">
                      Nominal Hutang
                    </label>
                    <input
                      type="text"
                      name="jmlh_hutang"
                      value={newItem.jmlh_hutang}
                      onChange={handlePencatatanChange}
                      className="border rounded px-2 py-1 w-full"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closePencatatanModal}
                      className="text-sm px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 text-sm rounded-lg bg-[#1E686D] hover:bg-green-600 text-white"
                    >
                      Tambah Hutang
                    </button>
                  </div>
                </form>
              )}
              {/* Form Bayar Hutang */}
              {newItem.status === "Bayar" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Simpan logika pembayaran hutang di sini
                    closePencatatanModal();
                  }}
                  className="space-y-3"
                >
                  <div className="font-bold">Gibran</div>
                  <div>
                    <label className="block text-xs text-gray-500">
                      Nominal Pembayaran
                    </label>
                    <input
                      type="text"
                      name="jmlh_hutang"
                      value={newItem.jmlh_hutang}
                      onChange={handlePencatatanChange}
                      className="border rounded px-2 py-1 w-full"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closePencatatanModal}
                      className="text-sm px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 text-sm rounded-lg bg-[#1E686D] hover:bg-green-600 text-white"
                    >
                      Simpan Pembayaran
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Kontak */}
      {kontakModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-lg font-bold mb-4">Daftar Pelanggan</h2>
            <div className="space-y-3 mb-4">
              {dummyPelanggan.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg px-4 py-3 shadow-sm bg-gray-50"
                >
                  <div>
                    <div className="font-semibold text-sm">{item.nama}</div>
                    <div className="text-xs text-gray-500">{item.alamat}</div>
                  </div>
                  <button
                    type="button"
                    className="mt-2 md:mt-0 bg-[#1E686D] hover:bg-green-600 text-white px-4 py-1 rounded text-xs"
                    onClick={() => {
                      // Aksi pilih pelanggan
                      setNewItem((prev) => ({ ...prev, nama: item.nama }));
                      setKontakModalOpen(false);
                    }}
                  >
                    Pilih
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeKontakModal}
                className="text-sm px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hutang;
