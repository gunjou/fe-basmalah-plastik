import React, { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoQrCodeOutline, IoClose } from "react-icons/io5";
import { MdContactPage } from "react-icons/md";
import api from "../utils/api";

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
  const [sortBy, setSortBy] = useState("nama");
  const [sortAsc, setSortAsc] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // State untuk data hutang dari API
  const [data, setData] = useState([]);
  const [hutangLoading, setHutangLoading] = useState(false);
  const [hutangError, setHutangError] = useState(null);

  // Ambil data hutang dari API saat mount
  useEffect(() => {
    setHutangLoading(true);
    setHutangError(null);
    api
      .get("/hutang/", { headers: getAuthHeaders() })
      .then((res) => setData(res.data || []))
      .catch(() => setHutangError("Gagal mengambil data hutang"))
      .finally(() => setHutangLoading(false));
    api
      .get("/pelanggan/", { headers: getAuthHeaders() })
      .then((res) => setData(res.data || []));
  }, []);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    nama_pelanggan: "",
    sisa_hutang: "",
    status_hutang: "",
  });

  // Handler untuk modal tambah
  const openAddModal = () => {
    setNewItem({
      nama_pelanggan: "",
      sisa_hutang: "",
      status_hutang: "",
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
      const id_hutang = selectedPelanggan?.id_pelanggan;
      await api.post(
        `/hutang/${id_hutang}`,
        {
          //nama_pelanggan: newItem.nama_pelanggan,
          sisa_hutang: newItem.sisa_hutang,
          status_hutang: newItem.status_hutang,
        },
        {
          headers: getAuthHeaders(),
        }
      );
      setHutangLoading(true);
      const res = await api.get("/hutang/");
      setData(res.data || []);
      closeAddModal();
    } catch (err) {
      alert("Gagal menambah hutang");
      setHutangLoading(false);
    }
  };

  const [pencatatanModalOpen, setPencatatanModalOpen] = useState(false);

  // Handler untuk modal tambah
  const openPencatatanModal = () => {
    setNewItem({
      nama_pelanggan: "",
      sisa_hutang: "",
      status_hutang: "",
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

  // State untuk daftar pelanggan dari API
  const [pelangganList, setPelangganList] = useState([]);
  const [pelangganLoading, setPelangganLoading] = useState(false);
  const [pelangganError, setPelangganError] = useState(null);

  // Modal Pilih Kontak
  const [kontakModalOpen, setKontakModalOpen] = useState(false);

  // Ambil data pelanggan saat modal dibuka
  useEffect(() => {
    if (kontakModalOpen) {
      setPelangganLoading(true);
      setPelangganError(null);
      api
        .get("/pelanggan/", { headers: getAuthHeaders() })
        .then((res) => setPelangganList(res.data || []))
        .catch(() => setPelangganError("Gagal mengambil data pelanggan"))
        .finally(() => setPelangganLoading(false));
    }
  }, [kontakModalOpen]);

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

  const [selectedPelanggan, setSelectedPelanggan] = useState(null);

  const [searchPelanggan, setSearchPelanggan] = useState("");
  const [tambahPelangganModalOpen, setTambahPelangganModalOpen] =
    useState(false);

  const openTambahPelangganModal = () => setTambahPelangganModalOpen(true);
  // Filter pelanggan sesuai pencarian
  const filteredPelangganList = pelangganList.filter((item) =>
    item.nama_pelanggan
      ?.toLowerCase()
      .includes(searchPelanggan.trim().toLowerCase())
  );

  // Tambahkan sebelum return
  const hutangByPelanggan = data.reduce((acc, item) => {
    const id = item.id_pelanggan;
    if (!acc[id]) {
      acc[id] = {
        id_pelanggan: id,
        nama_pelanggan: item.nama_pelanggan,
        sisa_hutang: 0,
        status_hutang: item.status_hutang,
      };
    }
    acc[id].sisa_hutang += Number(item.sisa_hutang) || 0;
    // Jika ada status Lunas, tampilkan Lunas, jika tidak, tampilkan status terakhir
    if (item.status_hutang === "Lunas") {
      acc[id].status_hutang = "Lunas";
    }
    return acc;
  }, {});

  // Ubah ke array untuk mapping di tabel
  const hutangList = Object.values(hutangByPelanggan);

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
          {hutangLoading ? (
            <div className="text-center py-8">Memuat data hutang...</div>
          ) : hutangError ? (
            <div className="text-center text-red-500 py-8">{hutangError}</div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 z-50 sticky top-0">
                <tr>
                  <th className="px-1 py-2 text-center">No</th>
                  <th
                    className="px-1 py-2 cursor-pointer select-none"
                    onClick={() => handleSort("id_pelanggan")}
                  >
                    <div className="flex items-center">
                      Id Pelanggan
                      <SortIcon
                        active={sortBy === "id_pelanggan"}
                        asc={sortAsc}
                      />
                    </div>
                  </th>
                  <th
                    className="px-1 py-2 cursor-pointer select-none"
                    onClick={() => handleSort("sisa_hutang")}
                  >
                    <div className="flex items-center">
                      Jumlah Hutang
                      <SortIcon
                        active={sortBy === "sisa_hutang"}
                        asc={sortAsc}
                      />
                    </div>
                  </th>
                  <th
                    className="px-1 py-2 cursor-pointer select-none"
                    onClick={() => handleSort("status_hutang")}
                  >
                    <div className="flex items-center">
                      Status
                      <SortIcon
                        active={sortBy === "status_hutang"}
                        asc={sortAsc}
                      />
                    </div>
                  </th>
                  <th className="px-1 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {hutangList.map((item, idx) => (
                  <tr
                    key={item.id_pelanggan || idx}
                    className="bg-white border-b"
                  >
                    <td className="px-1 py-1 text-center">{idx + 1}</td>
                    <td className="px-1 py-1">{item.id_pelanggan}</td>
                    <td className="px-1 py-1">
                      Rp.{item.sisa_hutang.toLocaleString("id-ID")}
                    </td>
                    <td className="px-1 py-1">
                      <span
                        className={
                          item.status_hutang === "Lunas"
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {item.status_hutang}
                      </span>
                    </td>
                    <td className="px-1 py-1">
                      <button
                        className="bg-[#1E686D] hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                        onClick={() => {
                          setSelectedPelanggan({
                            id_pelanggan: item.id_pelanggan,
                            sisa_hutang: item.sisa_hutang,
                            status_hutang: item.status_hutang,
                          });
                          setPilihModalOpen(true);
                        }}
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
                  newItem.status_hutang !== "Bayar"
                    ? "bg-[#1E686D] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() =>
                  setNewItem((prev) => ({ ...prev, status_hutang: "" }))
                }
              >
                Tambah Hutang
              </button>
              <button
                className={`flex-1 py-3 font-semibold transition-all duration-200 ${
                  newItem.status_hutang === "Bayar"
                    ? "bg-[#1E686D] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() =>
                  setNewItem((prev) => ({ ...prev, status_hutang: "Bayar" }))
                }
              >
                Bayar Hutang
              </button>
            </div>
            {/* Konten Slide */}
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">
                {newItem.status_hutang === "Bayar"
                  ? "Form Bayar Hutang"
                  : "Form Tambah Hutang"}
              </h2>
              {/* Form Tambah Hutang */}
              {newItem.status_hutang !== "Bayar" && (
                <form onSubmit={handleAddSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs">Nama</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        name="nama_pelanggan"
                        value={newItem.nama_pelanggan}
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
                      name="sisa_hutang"
                      value={newItem.sisa_hutang}
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
              {newItem.status_hutang === "Bayar" && (
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
                        name="nama_pelanggan"
                        value={newItem.nama_pelanggan}
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
                      name="sisa_hutang"
                      value={newItem.sisa_hutang}
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
                <h2 className="text-white text-lg font-bold">
                  {selectedPelanggan?.id_pelanggan || "-"}
                </h2>
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
                    <p className="text-red-600 font-semibold">
                      Rp.
                      {selectedPelanggan?.sisa_hutang?.toLocaleString(
                        "id-ID"
                      ) || "0"}
                    </p>
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
                  newItem.status_hutang !== "Bayar"
                    ? "bg-[#1E686D] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() =>
                  setNewItem((prev) => ({ ...prev, status_hutang: "" }))
                }
              >
                Tambah Hutang
              </button>
              <button
                className={`flex-1 py-3 font-semibold transition-all duration-200 ${
                  newItem.status_hutang === "Bayar"
                    ? "bg-[#1E686D] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() =>
                  setNewItem((prev) => ({ ...prev, status_hutang: "Bayar" }))
                }
              >
                Bayar Hutang
              </button>
            </div>
            {/* Konten Slide */}
            <div className="p-6">
              {/* Form Tambah Hutang */}
              {newItem.status_hutang !== "Bayar" && (
                <form onSubmit={handlePencatatanSubmit} className="space-y-3">
                  <div className="block font-bold">Gibran</div>
                  <div>
                    <label className="block text-xs text-gray-500">
                      Nominal Hutang
                    </label>
                    <input
                      type="text"
                      name="sisa_hutang"
                      value={newItem.sisa_hutang}
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
              {newItem.status_hutang === "Bayar" && (
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
                      name="sisa_hutang"
                      value={newItem.sisa_hutang}
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

      {kontakModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-lg font-bold mb-4">Daftar Pelanggan</h2>
            {/* Search & Tambah Pelanggan */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Cari pelanggan..."
                className="border rounded-lg px-2 py-1 w-full"
                value={searchPelanggan}
                onChange={(e) => setSearchPelanggan(e.target.value)}
              />
              <button
                type="button"
                className="bg-[#1E686D] hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs"
                onClick={openTambahPelangganModal}
              >
                Tambah
              </button>
            </div>
            <div
              className="space-y-3 mb-4"
              style={{ maxHeight: 300, overflowY: "auto" }}
            >
              {pelangganLoading ? (
                <div className="text-center py-4">Memuat data...</div>
              ) : pelangganError ? (
                <div className="text-center text-red-500 py-4">
                  {pelangganError}
                </div>
              ) : filteredPelangganList.length === 0 ? (
                <div className="text-center text-gray-400 py-4">
                  Tidak ada data pelanggan
                </div>
              ) : (
                filteredPelangganList.slice(0, 10).map((item) => (
                  <div
                    key={item.id_pelanggan}
                    className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg px-4 py-3 shadow-sm bg-gray-50"
                  >
                    <div>
                      <div className="font-semibold text-sm">
                        {item.nama_pelanggan}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="mt-2 md:mt-0 bg-[#1E686D] hover:bg-green-600 text-white px-4 py-1 rounded text-xs"
                      onClick={() => {
                        setNewItem((prev) => ({
                          ...prev,
                          nama_pelanggan: item.nama_pelanggan,
                        }));
                        setKontakModalOpen(false);
                      }}
                    >
                      Pilih
                    </button>
                  </div>
                ))
              )}
              {filteredPelangganList.length > 10 && (
                <div className="text-xs text-gray-400 text-center">
                  Menampilkan 10 data pertama dari{" "}
                  {filteredPelangganList.length} hasil
                </div>
              )}
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
