import React, { useState, useEffect, useRef } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoQrCodeOutline, IoClose } from "react-icons/io5";
import api from "../utils/api";

const Stock = () => {
  const [sortBy, setSortBy] = useState("nama_produk"); // Default sort by nama_produk
  const [sortAsc, setSortAsc] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // State untuk data produk dari API
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data produk dari API saat mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get("/stok/", { headers: getAuthHeaders() })
      .then((res) => setData(res.data.data))
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
    // Cek barcode sudah ada
    const barcodeExists = data.some((item) => item.barcode === newItem.barcode);
    if (barcodeExists) {
      alert("Barcode sudah terdaftar, gunakan barcode lain!");
      return;
    }
    try {
      await api.put(
        `/stok/${editItem.id_stok}`,
        {
          id_produk: editItem.id_produk, // Asumsi id_produk sudah ada di data
          //id_produk: null, // Asumsi id_produk sudah ada di data
          id_lokasi: 1, // Asumsi lokasi default adalah 1
          nama_produk: editItem.nama_produk,
          barcode: editItem.barcode,
          kategori: editItem.kategori,
          satuan: editItem.satuan,
          // id_kategori: categories.find(
          //   (cat) => cat.nama === (editItem.kategori || editItem.kategori)
          // )?.id,
          // id_satuan: units.find(
          //   (unit) => unit.nama === (editItem.satuan || editItem.satuan)
          // )?.id,
          harga_beli: Number(editItem.harga_beli),
          harga_jual: Number(editItem.harga_jual),
          jumlah: Number(editItem.jumlah),
        },
        { headers: getAuthHeaders() }
      );
      // Refresh data produk setelah edit
      const res = await api.get("/stok/");
      setData(res.data.data);
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
    nama_produk: "",
    barcode: "",
    kategori: "",
    satuan: "",
    harga_beli: "",
    harga_jual: "",
    jumlah: "",
  });

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]); // Tambah state untuk satuan

  // Fetch kategori dari API saat mount
  // useEffect(() => {
  //   api
  //     .get("/categories/")
  //     .then((res) => setCategories(res.data))
  //     .catch(() => setCategories([]));
  // }, []);

  // // Fetch satuan dari API saat mount
  // useEffect(() => {
  //   api
  //     .get("/units/")
  //     .then((res) => setUnits(res.data))
  //     .catch(() => setUnits([]));
  // }, []);

  // Handler untuk modal tambah
  const openAddModal = () => {
    setNewItem({
      nama_produk: "",
      barcode: "",
      kategori: "",
      satuan: "",
      harga_beli: "",
      harga_jual: "",
      jumlah: "",
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
    // Cek barcode sudah ada
    const barcodeExists = data.some((item) => item.barcode === newItem.barcode);
    if (barcodeExists) {
      alert("Barcode sudah terdaftar, cek kembali produk Anda.");
      return;
    }
    try {
      await api.post(
        "/stok/",
        {
          id_produk: null, // ID produk akan di-generate oleh API
          id_lokasi: 1, // Asumsi lokasi default adalah 1
          nama_produk: newItem.nama_produk,
          barcode: newItem.barcode,
          kategori: newItem.kategori,
          satuan: newItem.satuan,
          harga_beli: Number(newItem.harga_beli),
          harga_jual: Number(newItem.harga_jual),
          jumlah: Number(newItem.jumlah),
        },
        { headers: getAuthHeaders() }
      );
      // Refresh data produk setelah tambah
      const res = await api.get("/stok/");
      setData(res.data.data);
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

  const [mutasiModalOpen, setMutasiModalOpen] = useState(false);
  const [mutasiForm, setMutasiForm] = useState({
    tanggal_awal: "",
    tanggal_akhir: "",
    id_lokasi_asal: "",
    id_lokasi_tujuan: "",
  });
  const [lokasiList, setLokasiList] = useState([]);

  // Fetch lokasi untuk dropdown
  useEffect(() => {
    if (mutasiModalOpen) {
      api
        .get("/lokasi/", { headers: getAuthHeaders() })
        .then((res) => setLokasiList(res.data || []))
        .catch(() => setLokasiList([]));
    }
  }, [mutasiModalOpen]);

  const openMutasiModal = () => setMutasiModalOpen(true);
  const closeMutasiModal = () => setMutasiModalOpen(false);

  const handleMutasiChange = (e) => {
    const { name, value } = e.target;
    setMutasiForm((prev) => ({ ...prev, [name]: value }));
  };

  const [mutasiItems, setMutasiItems] = useState([]);

  // Handler untuk mengubah qty mutasi
  const handleMutasiQtyChange = (idx, value) => {
    setMutasiItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, qty: Number(value) } : item
      )
    );
  };

  // Handler untuk menghapus produk dari daftar mutasi
  const handleHapusMutasi = (idx) => {
    setMutasiItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Contoh: Tambahkan produk ke mutasiItems saat klik tombol "Mutasi" di tabel utama
  const handleAddToMutasi = (item) => {
    // Cegah duplikasi produk
    if (!mutasiItems.some((x) => x.id_stok === item.id_stok)) {
      setMutasiItems((prev) => [
        ...prev,
        {
          ...item,
          id_produk: item.id_produk, // gunakan id_produk jika ada, jika tidak gunakan id_stok
          qty: 1, // default qty mutasi
        },
      ]);
    }
  };

  // State untuk modal lihat data mutasi
  const [lihatMutasiOpen, setLihatMutasiOpen] = useState(false);
  const [filterMutasi, setFilterMutasi] = useState({
    tanggal_awal: "",
    tanggal_akhir: "",
    id_lokasi_asal: "",
    id_lokasi_tujuan: "",
    id_produk: "",
  });
  const [dataMutasi, setDataMutasi] = useState([]);
  const [loadingMutasi, setLoadingMutasi] = useState(false);
  const [produkList, setProdukList] = useState([]);

  // Fetch lokasi dan produk untuk filter saat modal dibuka
  useEffect(() => {
    if (lihatMutasiOpen) {
      api
        .get("/lokasi/", { headers: getAuthHeaders() })
        .then((res) => setLokasiList(res.data || []));
      api
        .get("/stok/", { headers: getAuthHeaders() })
        .then((res) => setProdukList(res.data.data || []));
    }
  }, [lihatMutasiOpen]);

  // Handler filter
  const handleFilterMutasiChange = (e) => {
    const { name, value } = e.target;
    setFilterMutasi((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch data mutasi dari endpoint baru
  useEffect(() => {
    if (lihatMutasiOpen) {
      setLoadingMutasi(true);
      api
        .get("/mutasi-stok/", {
          headers: getAuthHeaders(),
          params: {
            tanggal_awal: filterMutasi.tanggal_awal,
            tanggal_akhir: filterMutasi.tanggal_akhir,
            id_lokasi_asal: filterMutasi.id_lokasi_asal,
            id_lokasi_tujuan: filterMutasi.id_lokasi_tujuan,
            id_produk: filterMutasi.id_produk,
          },
        })
        .then((res) => setDataMutasi(res.data.data || []))
        .catch(() => setDataMutasi([]))
        .finally(() => setLoadingMutasi(false));
    }
  }, [
    lihatMutasiOpen,
    filterMutasi.tanggal_awal,
    filterMutasi.tanggal_akhir,
    filterMutasi.id_lokasi_asal,
    filterMutasi.id_lokasi_tujuan,
    filterMutasi.id_produk,
  ]);

  const openLihatMutasi = () => setLihatMutasiOpen(true);
  const closeLihatMutasi = () => setLihatMutasiOpen(false);

  const handleMutasiSubmit = async (e) => {
    e.preventDefault();
    // Validasi minimal 1 item dan field wajib
    if (
      !mutasiForm.id_lokasi_asal ||
      !mutasiForm.id_lokasi_tujuan ||
      mutasiItems.length === 0 ||
      mutasiItems.some(
        (item) =>
          item.id_produk === undefined ||
          item.id_produk === null ||
          item.qty === undefined ||
          item.qty === null ||
          item.keterangan === undefined ||
          item.keterangan.trim() === ""
      )
    ) {
      alert("Lengkapi semua data mutasi dan keterangan produk!");
      return;
    }

    try {
      const payload = mutasiItems.map((item) => ({
        id_produk: Number(item.id_produk),
        id_lokasi_asal: Number(mutasiForm.id_lokasi_asal),
        id_lokasi_tujuan: Number(mutasiForm.id_lokasi_tujuan),
        qty: Number(item.qty),
        keterangan: item.keterangan,
      }));

      await api.post(
        "/mutasi-stok/",
        {
          id_produk: Number(mutasiItems[0].id_produk),
          id_lokasi_asal: Number(mutasiForm.id_lokasi_asal),
          id_lokasi_tujuan: Number(mutasiForm.id_lokasi_tujuan),
          qty: Number(mutasiItems[0].qty),
          keterangan: mutasiItems[0].keterangan,
        },
        { headers: getAuthHeaders() }
      );

      setMutasiItems([]);
      closeMutasiModal();
      alert("Mutasi berhasil dikirim!");
    } catch (err) {
      alert("Gagal melakukan mutasi stok.");
    }
  };

  // Tambahkan fungsi hapus di dalam komponen Stock
  const handleDelete = async (item) => {
    if (window.confirm(`Yakin ingin menghapus "${item.nama_produk}"?`)) {
      try {
        await api.delete(`/stok/${item.id_stok}`, {
          headers: getAuthHeaders(),
        });
        // Refresh data setelah hapus
        const res = await api.get("/stok/");
        setData(res.data.data);
      } catch (err) {
        alert("Gagal menghapus barang.");
      }
    }
  };
  const scanInputRef = useRef(null);

  // Fokus otomatis ke input scan saat komponen dirender
  useEffect(() => {
    if (scanInputRef.current) {
      scanInputRef.current.focus();
    }
  }, []);

  // Tambahkan efek agar input barcode pada modal tambah otomatis terisi saat addModalOpen dan newItem.barcode berubah
  useEffect(() => {
    if (addModalOpen && newItem.barcode) {
      // Fokus ke input barcode jika ada barcode hasil scan
      const barcodeInput = document.querySelector('input[name="barcode"]');
      if (barcodeInput) {
        barcodeInput.focus();
        barcodeInput.select();
      }
    }
  }, [addModalOpen, newItem.barcode]);

  // Tambahkan state dan fungsi search input di dalam komponen Stock
  const [search, setSearch] = useState("");

  // Fungsi untuk handle perubahan input search
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Filter data produk berdasarkan search (nama_produk, barcode, kategori, satuan)
  const filteredData = sortedData.filter(
    (item) =>
      (item.nama_produk &&
        item.nama_produk.toLowerCase().includes(search.toLowerCase())) ||
      (item.barcode &&
        item.barcode.toLowerCase().includes(search.toLowerCase())) ||
      (item.kategori &&
        item.kategori.toLowerCase().includes(search.toLowerCase())) ||
      (item.satuan && item.satuan.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="">
      <h1 className="text-2xl font-bold pb-2">Stock</h1>
      <div className="bg-white rounded-[20px] py-4 px-6 shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <p className="text-sm font-semibold">Daftar Stock Barang</p>
          <input
            ref={scanInputRef}
            type="text"
            placeholder="Scan/masukkan barcode produk"
            className="border rounded-lg px-2 py-1 text-sm w-56 hover:border-[#1E686D] focus:outline-none focus:ring-2 focus:ring-[#1E686D]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                const barcode = e.target.value.trim();
                const existing = data.find((item) => item.barcode === barcode);
                if (existing) {
                  // Jika barcode sudah ada, buka modal edit dan isi datanya
                  setEditItem(existing);
                  setModalOpen(true);
                } else {
                  // Jika barcode baru, buka modal tambah dan isi kolom barcode
                  setNewItem((prev) => ({
                    ...prev,
                    barcode,
                  }));
                  setAddModalOpen(true);
                }
                e.target.value = "";
              }
            }}
          />
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
                value={search}
                onChange={handleSearchChange}
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
                    onClick={() => handleSort("nama_produk")}
                  >
                    <div className="flex items-center">
                      Nama Barang
                      <SortIcon
                        active={sortBy === "nama_produk"}
                        asc={sortAsc}
                      />
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
                    onClick={() => handleSort("jumlah")}
                  >
                    <div className="flex items-center">
                      Jumlah Stock
                      <SortIcon active={sortBy === "jumlah"} asc={sortAsc} />
                    </div>
                  </th>
                  <th className="px-1 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-gray-400 py-8">
                      Data tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <tr key={item.id || idx} className="bg-white border-b">
                      <td className="px-1 py-1 text-center">{idx + 1}</td>
                      <td className="px-1 py-1">{item.barcode}</td>
                      <td className="px-1 py-1 capitalize">
                        {item.nama_produk}
                      </td>
                      <td className="px-1 py-1 capitalize">{item.kategori}</td>
                      <td className="px-1 py-1 capitalize">{item.satuan}</td>
                      <td className="px-1 py-1">Rp.{item.harga_beli}</td>
                      <td className="px-1 py-1">Rp.{item.harga_jual}</td>
                      <td className="px-1 py-1">{item.jumlah}</td>
                      <td className="px-1 py-1">
                        <button
                          className="bg-[#1E686D] hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
                          onClick={() => handleAddToMutasi(item)}
                        >
                          Mutasi
                        </button>
                        <button
                          className="ml-2 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg text-xs"
                          onClick={() => openEditModal(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="ml-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg text-xs"
                          onClick={() => handleDelete(item)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-2">
            <button
              className="bg-[#1E686D] p-2 rounded-lg text-xs text-white hover:bg-green-600"
              onClick={openAddModal}
            >
              Tambah Stock Barang
            </button>
            <button
              className="bg-green-400 p-2 rounded-lg text-xs text-white hover:bg-green-600"
              onClick={openLihatMutasi}
            >
              Lihat Data Mutasi
            </button>
          </div>
        </div>
        <div className="bg-white border border-[#1E686D] rounded-lg p-2 shadow-md mt-4">
          <div
            className="relative overflow-x-auto"
            style={{ maxHeight: "170px", overflowY: "auto" }}
          >
            {mutasiItems.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                Produk yang dimutasi muncul disini
              </div>
            ) : (
              <>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead>
                    <tr>
                      <th className="px-0.5 py-0.5">Nama Produk</th>
                      <th className="px-0.5 py-0.5">Qty Mutasi</th>
                      <th className="px-0.5 py-0.5">Satuan</th>
                      <th className="px-0.5 py-0.5">Harga Jual</th>
                      <th className="px-0.5 py-0.5">Keterangan</th>
                      <th className="px-0.5 py-0.5">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mutasiItems.map((item, idx) => (
                      <tr key={idx} className="bg-gray-200">
                        <td className="px-0.5 py-0.5">{item.nama_produk}</td>
                        <td className="px-0.5 py-0.5">
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={(e) =>
                              handleMutasiQtyChange(idx, e.target.value)
                            }
                            className="w-16 border rounded px-1 py-0.5 text-center"
                          />
                        </td>
                        <td className="px-0.5 py-0.5">{item.satuan}</td>
                        <td className="px-0.5 py-0.5">Rp.{item.harga_jual}</td>
                        <td className="px-0.5 py-0.5">
                          <input
                            type="text"
                            value={item.keterangan || ""}
                            onChange={(e) =>
                              setMutasiItems((prev) =>
                                prev.map((itm, i) =>
                                  i === idx
                                    ? { ...itm, keterangan: e.target.value }
                                    : itm
                                )
                              )
                            }
                            className="w-32 border rounded px-1 py-0.5"
                            placeholder="Keterangan"
                            required
                          />
                        </td>
                        <td className="px-0.5 py-0.5">
                          <button
                            className="bg-white hover:bg-gray-300 text-black px-2 py-1 rounded text-xs"
                            onClick={() => handleHapusMutasi(idx)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-2">
                  <button
                    className="bg-[#1E686D] hover:bg-green-600 text-white px-4 py-1 rounded text-xs"
                    onClick={openMutasiModal}
                  >
                    Kirim
                  </button>
                </div>
              </>
            )}
          </div>
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
                  name="nama_produk"
                  value={newItem.nama_produk}
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
                <input
                  type="text"
                  name="kategori"
                  value={newItem.kategori}
                  onChange={handleAddChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Satuan</label>
                <input
                  type="text"
                  name="satuan"
                  value={newItem.satuan}
                  onChange={handleAddChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              {/* <div>
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
              </div> */}
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
                  name="jumlah"
                  value={newItem.jumlah}
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
                  name="nama_produk"
                  value={editItem.nama_produk}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Barcode</label>
                <input
                  type="text"
                  name="barcode"
                  value={editItem.barcode}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs">Kategori</label>
                <input
                  type="text"
                  name="kategori"
                  value={editItem.kategori}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>

              {/* <div>
                <label className="block text-xs">Kategori</label>
                <select
                  name="kategori"
                  value={editItem.kategori || editItem.kategori || ""}
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
              </div> */}

              <div>
                <label className="block text-xs">Satuan</label>
                <input
                  type="text"
                  name="satuan"
                  value={editItem.satuan}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>

              {/* <div>
                <label className="block text-xs">Satuan</label>
                <select
                  name="satuan"
                  value={editItem.satuan || editItem.satuan || ""} // gunakan value dari data yang sedang diedit
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
              </div> */}

              <div>
                <label className="block text-xs">Harga Beli</label>
                <input
                  type="number"
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
                  type="number"
                  name="harga_jual"
                  value={editItem.harga_jual}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs">Jumlah Stock</label>
                <input
                  type="number"
                  name="jumlah"
                  value={editItem.jumlah}
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

      {/* Modal Mutasi Stock */}
      {mutasiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-lg font-bold mb-4">Mutasi Stock</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-xs mb-1">Lokasi Asal</label>
                <select
                  name="id_lokasi_asal"
                  value={mutasiForm.id_lokasi_asal}
                  onChange={handleMutasiChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                >
                  <option value="">Pilih Lokasi Asal</option>
                  {lokasiList.map((lokasi) => (
                    <option key={lokasi.id_lokasi} value={lokasi.id_lokasi}>
                      {lokasi.nama_lokasi}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1">Lokasi Tujuan</label>
                <select
                  name="id_lokasi_tujuan"
                  value={mutasiForm.id_lokasi_tujuan}
                  onChange={handleMutasiChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                >
                  <option value="">Pilih Lokasi Tujuan</option>
                  {lokasiList.map((lokasi) => (
                    <option key={lokasi.id_lokasi} value={lokasi.id_lokasi}>
                      {lokasi.nama_lokasi}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeMutasiModal}
                  className="text-sm px-4 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-sm rounded-lg bg-[#1E686D] hover:bg-green-600 text-white"
                  onClick={handleMutasiSubmit}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Lihat Data Mutasi */}
      {lihatMutasiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Data Mutasi Stock</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeLihatMutasi}
              >
                <IoClose size={24} />
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-2 mb-4">
              <input
                type="date"
                name="tanggal_awal"
                value={filterMutasi.tanggal_awal}
                onChange={handleFilterMutasiChange}
                className="border rounded px-2 py-1 text-xs"
                placeholder="Tanggal Awal"
              />
              <input
                type="date"
                name="tanggal_akhir"
                value={filterMutasi.tanggal_akhir}
                onChange={handleFilterMutasiChange}
                className="border rounded px-2 py-1 text-xs"
                placeholder="Tanggal Akhir"
              />
              <select
                name="id_lokasi_asal"
                value={filterMutasi.id_lokasi_asal}
                onChange={handleFilterMutasiChange}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="">Lokasi Asal</option>
                {lokasiList.map((lokasi) => (
                  <option key={lokasi.id_lokasi} value={lokasi.id_lokasi}>
                    {lokasi.nama_lokasi}
                  </option>
                ))}
              </select>
              <select
                name="id_lokasi_tujuan"
                value={filterMutasi.id_lokasi_tujuan}
                onChange={handleFilterMutasiChange}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="">Lokasi Tujuan</option>
                {lokasiList.map((lokasi) => (
                  <option key={lokasi.id_lokasi} value={lokasi.id_lokasi}>
                    {lokasi.nama_lokasi}
                  </option>
                ))}
              </select>
              <select
                name="id_produk"
                value={filterMutasi.id_produk}
                onChange={handleFilterMutasiChange}
                className="border rounded px-2 py-1 text-xs"
              >
                <option value="">Pilih Produk</option>
                {produkList.map((produk) => (
                  <option key={produk.id_produk} value={produk.id_produk}>
                    {produk.nama_produk}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="relative overflow-x-auto"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {loadingMutasi ? (
                <div className="text-center py-8">Memuat data mutasi...</div>
              ) : dataMutasi.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  Tidak ada data mutasi
                </div>
              ) : (
                <table className="w-full text-sm text-left text-gray-500">
                  <thead>
                    <tr>
                      <th className="px-2 py-1">Tanggal</th>
                      <th className="px-2 py-1">Nama Produk</th>
                      <th className="px-2 py-1">Qty</th>
                      <th className="px-2 py-1">Satuan</th>
                      <th className="px-2 py-1">Lokasi Asal</th>
                      <th className="px-2 py-1">Lokasi Tujuan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataMutasi.map((item, idx) => (
                      <tr key={idx} className="bg-gray-100">
                        <td className="px-2 py-1">{item.tanggal}</td>
                        <td className="px-2 py-1">{item.nama_produk}</td>
                        <td className="px-2 py-1">{item.qty}</td>
                        <td className="px-2 py-1">{item.satuan}</td>
                        <td className="px-2 py-1">{item.lokasi_asal}</td>
                        <td className="px-2 py-1">{item.lokasi_tujuan}</td>
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
  );
};

export default Stock;
