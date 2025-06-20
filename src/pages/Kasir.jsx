import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { FaPlusCircle } from "react-icons/fa";
import { IoQrCodeOutline, IoClose } from "react-icons/io5";
import { MdContactPage } from "react-icons/md";

// Helper untuk localStorage
const getLS = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};
const setLS = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const capitalizeWords = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const Kasir = () => {
  const getUserRole = () => localStorage.getItem("role"); // "admin" atau "kasir"
  const getUserLokasi = () => localStorage.getItem("id_lokasi");
  const [totalHutangPelanggan, setTotalHutangPelanggan] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  //const [lokasiList, setLokasiList] = useState([]);
  const [selectedLokasi, setSelectedLokasi] = useState(getUserLokasi());
  const userRole = getUserRole();

  useEffect(() => {
    if (userRole === "admin") {
      api
        .get("/lokasi/", { headers: getAuthHeaders() })
        .then((res) => setLokasiList(res.data || []));
    }
  }, [userRole]);

  const strukRef = useRef(null);
  const handlePrintStruk = () => {
    let printContents = strukRef.current.innerHTML;
    const printWindow = window.open("", "", "width=300,height=600");
    const logoBase64 = "images/icon-outlook.svg"; // base64 logo
    const nomorTransaksi = "TRX-" + Date.now();
    const tanggalStr = new Date().toLocaleString("id-ID");

    printWindow.document.write(`
<html>
  <head>
    <title>Struk Belanja</title>
   <style>
    @media print {
    body {
      margin: 0;
      padding: 0;
    }
  }
  body {
    font-family: Arial, sans-serif;
    font-size: 14px;
    margin: 0;
    padding: 0;
    background: #fff;
    color: #000;
  }

  .struk {
    max-width: 280px;
    margin: auto;
    padding: 12px 6px;
  }

  .logo {
    display: block;
    margin: 0 auto 5px;
    max-height: 60px;
  }

  .struk-header {
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 4px;
  }

  .subheader {
    text-align: center;
    font-size: 13px;
    margin-bottom: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    font-size: 14px;
    padding: 4px 2px;
  }

  th {
    border-bottom: 1px solid #000;
  }

  .right {
    text-align: right;
  }

  .center {
    text-align: center;
  }

  .total {
    border-top: 1px dashed #000;
    margin-top: 8px;
    padding-top: 8px;
    font-weight: bold;
  }

  .thankyou {
    margin-top: 12px;
    font-style: italic;
    text-align: center;
    font-size: 13px;
  }

  .note {
    text-align: center;
    font-size: 12px;
    margin-top: 6px;
    color: #333;
  }
</style>

  </head>
  <body onload="window.print(); window.close();">
    <div class="struk">
      <img class="logo" src="${logoBase64}" alt="logo" />
      <div class="struk-header">BASMALAH PLASTIK</div>
      <div class="subheader">Tanggal: ${tanggalStr}</div>

      ${printContents}

      <div class="thankyou">-- Terima kasih --</div>
      <div class="note">Barang yang sudah dibeli<br/>tidak dapat dikembalikan.</div>
    </div>
  </body>
</html>
`);

    printWindow.document.close();
  };

  // Gunakan localStorage untuk data pembelian
  const [dataPembelian, setDataPembelian] = useState(() =>
    getLS("kasir_dataPembelian", [])
  );

  // Simpan ke localStorage setiap kali dataPembelian berubah
  useEffect(() => {
    setLS("kasir_dataPembelian", dataPembelian);
  }, [dataPembelian]);

  const [sortBy, setSortBy] = useState("nama_produk");
  const [sortAsc, setSortAsc] = useState(true);

  const [data, setData] = useState([]);

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

  // State untuk modal daftar produk
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

      const lokasiId = userRole === "admin" ? selectedLokasi : getUserLokasi();

      api
        .get("/stok/", {
          headers: getAuthHeaders(),
          params: lokasiId ? { id_lokasi: lokasiId } : {},
        })
        .then((res) => setProdukList(res.data.data))
        .catch(() => setProdukError("Gagal mengambil data produk"))
        .finally(() => setProdukLoading(false));
    }
  }, [barangModalOpen, selectedLokasi, userRole]);

  useEffect(() => {
    // Jika produkList masih kosong, fetch data produk dari API
    if (produkList.length === 0) {
      setProdukLoading(true);
      setProdukError(null);
      api
        .get("/stok/", { headers: getAuthHeaders() })
        .then((res) => setProdukList(res.data.data))
        .catch((err) => setProdukError("Gagal mengambil data produk"))
        .finally(() => setProdukLoading(false));
    }
  }, []); // hanya dijalankan sekali saat mount

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

  const [searchPelanggan, setSearchPelanggan] = useState("");
  const [tambahPelangganModalOpen, setTambahPelangganModalOpen] =
    useState(false);
  const [tambahNamaPelanggan, setTambahNamaPelanggan] = useState("");
  const [tambahKontakPelanggan, setTambahKontakPelanggan] = useState("");

  const openTambahPelangganModal = () => setTambahPelangganModalOpen(true);

  // Filter pelanggan sesuai pencarian
  const filteredPelangganList = pelangganList.filter((item) =>
    item.nama_pelanggan
      ?.toLowerCase()
      .includes(searchPelanggan.trim().toLowerCase())
  );

  // Hitung subtotal
  const subtotal = dataPembelian.reduce(
    (sum, item) => sum + Number(item.harga_jual) * Number(item.qty),
    0
  );

  // Hitung diskon
  let diskon = 0;
  if (diskonType === "persen" && diskonValue) {
    diskon = (subtotal * Number(diskonValue)) / 100;
  } else if (diskonType === "nominal" && diskonValue) {
    diskon = Number(diskonValue);
  }

  // Total setelah diskon
  const total = subtotal - diskon;

  // State bayar dan kembalian
  const [bayar, setBayar] = useState("");
  const [bayarNominal, setBayarNominal] = useState(0);

  // Handler untuk input bayar agar selalu format nominal
  const handleBayarChange = (e) => {
    // Hanya ambil angka
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setBayar(raw ? "Rp." + Number(raw).toLocaleString("id-ID") : "");
    setBayarNominal(raw ? Number(raw) : 0);
  };

  // Kembalian tetap pakai bayarNominal
  const kembalian = bayarNominal - total;

  // Fungsi untuk mengubah kuantitas pembelian
  const handlePembelianChange = (idx, field, value) => {
    setDataPembelian((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  // Fungsi untuk menghapus item pembelian
  const handleHapusPembelian = (idx) => {
    setDataPembelian((prev) => prev.filter((_, i) => i !== idx));
  };

  const [newItem, setNewItem] = useState({
    nama_pelanggan: "",
    // jmlh_hutang: "",
    // status: "",
  });

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handler untuk modal pilih kontak
  const openKontakModal = () => {
    setKontakModalOpen(true);
  };
  const closeKontakModal = () => {
    setKontakModalOpen(false);
  };

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 2000);
  };

  useEffect(() => {
    const fetchHutangPelanggan = async () => {
      if (!newItem.id_pelanggan) return;

      try {
        const res = await api.get("/transaksi/", {
          headers: getAuthHeaders(),
          params: { id_pelanggan: newItem.id_pelanggan },
        });

        let latestHutang = 0;
        if (
          res.data &&
          res.data.length > 0 &&
          res.data[0].total_hutang !== undefined
        ) {
          latestHutang = res.data[0].total_hutang;
        }
        const tambahanHutang = kembalian < 0 ? Math.abs(kembalian) : 0;
        const totalAkhir = latestHutang + tambahanHutang;
        setTotalHutangPelanggan(totalAkhir); // <- ini sudah benar
        //setTotalHutangPelanggan(latestHutang);
      } catch (err) {
        console.error("Gagal ambil total hutang:", err);
        setTotalHutangPelanggan(null);
      }
    };

    fetchHutangPelanggan();
  }, [newItem.id_pelanggan]);

  const handleSubmitTransaksi = async () => {
    // if (isSubmitting) return;
    // setIsSubmitting(true);
    const id_kasir = Number(localStorage.getItem("id_kasir"));
    const id_lokasi = Number(localStorage.getItem("id_lokasi"));

    // Cek jika tidak ada item yang dibeli
    if (dataPembelian.length === 0) {
      showAlert("error", "Tidak ada produk yang dibeli.");
      return;
    }
    // Cek jika nominal bayar 0 atau kurang dari 0, harus input pelanggan
    if (bayarNominal <= 0 || kembalian < 0) {
      if (!newItem.nama_pelanggan || newItem.nama_pelanggan.trim() === "") {
        showAlert("error", "Jika hutang pelanggan wajib diisi.");
        return;
      }
    }

    try {
      const payload = {
        id_kasir,
        id_lokasi,
        id_pelanggan: Number(newItem.id_pelanggan) || null,
        nama_pelanggan: newItem.nama_pelanggan || "",
        kontak: newItem.kontak || "",
        total: Math.round(total),
        tunai: Math.round(bayarNominal),
        kembalian: Math.max(0, Math.round(kembalian)),
        items: dataPembelian.map((item) => ({
          id_produk: Number(item.id_produk),
          qty: Number(item.qty),
          harga_jual: Number(item.harga_jual),
        })),
      };

      if (payload.items.some((i) => !i.id_produk && i.id_produk !== 0)) {
        showAlert("error", "Ada produk dengan ID tidak valid.");
        return;
      }

      // Simpan transaksi ke backend
      const res = await api.post("/transaksi/", payload, {
        headers: getAuthHeaders(),
      });

      showAlert("success", "Transaksi berhasil disimpan!");
      handlePrintStruk();
      showAlert("success", "Struk berhasil dicetak!");

      setDataPembelian([]);
      setBayar("");
      setBayarNominal(0);
      setDiskonValue("");
      setNewItem({ nama_pelanggan: "" });
    } catch (err) {
      console.error(err);
      showAlert(
        "error",
        "Gagal menyimpan transaksi:\n" +
          (err.response?.data?.detail || err.message)
      );
    }
    // finally {
    //   setIsSubmitting(false);
    // }
  };

  const handleSubmitTanpaCetakStruk = async () => {
    //if (isSubmitting) return; // cegah double klik
    //setIsSubmitting(true);
    const id_kasir = Number(localStorage.getItem("id_kasir"));
    const id_lokasi = Number(localStorage.getItem("id_lokasi"));

    if (dataPembelian.length === 0) {
      showAlert("error", "Tidak ada produk yang dibeli.");
      return;
    }

    if (bayarNominal <= 0 || kembalian < 0) {
      if (!newItem.nama_pelanggan || newItem.nama_pelanggan.trim() === "") {
        showAlert("error", "Jika hutang pelanggan wajib diisi.");
        return;
      }
    }

    try {
      const payload = {
        id_kasir,
        id_lokasi,
        id_pelanggan: Number(newItem.id_pelanggan) || null,
        nama_pelanggan: newItem.nama_pelanggan || "",
        kontak: newItem.kontak || "",
        total: Math.round(total),
        tunai: Math.round(bayarNominal),
        kembalian: Math.max(0, Math.round(kembalian)),
        items: dataPembelian.map((item) => ({
          id_produk: Number(item.id_produk),
          qty: Number(item.qty),
          harga_jual: Number(item.harga_jual),
        })),
      };

      if (payload.items.some((i) => !i.id_produk && i.id_produk !== 0)) {
        showAlert("error", "Ada produk dengan ID tidak valid.");
        return;
      }

      await api.post("/transaksi/", payload, {
        headers: getAuthHeaders(),
      });

      showAlert("success", "Transaksi berhasil disimpan!");

      setDataPembelian([]);
      setBayar("");
      setBayarNominal(0);
      setDiskonValue("");
      setNewItem({ nama_pelanggan: "" });
    } catch (err) {
      console.error(err);
      showAlert(
        "error",
        "Gagal menyimpan transaksi:\n" +
          (err.response?.data?.detail || err.message)
      );
    }
    // finally {
    //   setIsSubmitting(false);
    // }
  };

  const scanInputRef = useRef(null);

  // Fokus otomatis ke input scan saat komponen dirender
  useEffect(() => {
    if (scanInputRef.current) {
      scanInputRef.current.focus();
    }
  }, []);

  const [lokasiList, setLokasiList] = useState([]);
  const [filterLokasi, setFilterLokasi] = useState("");

  // State untuk modal lihat data mutasi
  const [lihatHistoryTransaksiOpen, setLihatHistoryTransaksi] = useState(false);
  const [filterHistoryTransaksi, setFilterHistoryTransaksi] = useState({
    tanggal_awal: "",
    tanggal_akhir: "",
    status_hutang: "",
    id_pelanggan: "",
    id_lokasi: userRole === "kasir" ? getUserLokasi() : "",
  });
  const [dataHistoryTransaksi, setDataHistoryTransaksi] = useState([]);
  const [loadingHistoryTransaksi, setLoadingHistoryTransaksi] = useState(false);
  const [historyTransaksiList, setHistoryTransaksiList] = useState([]);

  useEffect(() => {
    if (barangModalOpen) {
      api
        .get("/lokasi/", { headers: getAuthHeaders() })
        .then((res) => setLokasiList(res.data || []))
        .catch(() => setLokasiList([]));
    }
  }, [barangModalOpen]);

  // Fetch lokasi dan produk untuk filter saat modal dibuka
  useEffect(() => {
    if (lihatHistoryTransaksiOpen) {
      api
        .get("/lokasi/", { headers: getAuthHeaders() })
        .then((res) => setLokasiList(res.data || []));
    }
  }, [lihatHistoryTransaksiOpen]);

  // Tambahkan pengambilan data pelanggan untuk filter modal transaksi
  useEffect(() => {
    if (lihatHistoryTransaksiOpen) {
      api
        .get("/pelanggan/", { headers: getAuthHeaders() })
        .then((res) => setHistoryTransaksiList(res.data || []))
        .catch(() => setHistoryTransaksiList([]));
    }
  }, [lihatHistoryTransaksiOpen]);

  // Fetch data mutasi dari endpoint baru
  useEffect(() => {
    if (lihatHistoryTransaksiOpen) {
      setLoadingHistoryTransaksi(true);
      api
        .get("/transaksi/", {
          headers: getAuthHeaders(),
          params: {
            tanggal_awal: filterHistoryTransaksi.tanggal_awal,
            tanggal_akhir: filterHistoryTransaksi.tanggal_akhir,
            id_pelanggan: filterHistoryTransaksi.id_pelanggan,
            ...(userRole === "kasir"
              ? { id_lokasi: getUserLokasi() }
              : filterHistoryTransaksi.id_lokasi
              ? { id_lokasi: filterHistoryTransaksi.id_lokasi }
              : {}),
          },
        })

        .then((res) => {
          const sortedData = (res.data || []).sort(
            (a, b) => b.id_transaksi - a.id_transaksi
          );
          setDataHistoryTransaksi(sortedData);
        })

        .catch(() => setDataHistoryTransaksi([]))
        .finally(() => setLoadingHistoryTransaksi(false));
    }
  }, [
    lihatHistoryTransaksiOpen,
    filterHistoryTransaksi.tanggal_awal,
    filterHistoryTransaksi.tanggal_akhir,
    filterHistoryTransaksi.id_pelanggan,
    filterHistoryTransaksi.id_lokasi,
  ]);

  // Handler filter
  const handleFilterRiwayatTransaksiChange = (e) => {
    const { name, value } = e.target;
    setFilterHistoryTransaksi((prev) => ({ ...prev, [name]: value }));
  };

  const openLihatHistoryTransaksi = () => setLihatHistoryTransaksi(true);
  const closeLihatHistoryTransaksi = () => setLihatHistoryTransaksi(false);

  // Tambahkan state dan fungsi search produk untuk modal daftar barang
  const [searchProduk, setSearchProduk] = useState("");
  const handleSearchProdukChange = (e) => setSearchProduk(e.target.value);

  // Filter produkList berdasarkan searchProduk
  const filteredProdukList = produkList.filter((item) => {
    const cocokCari =
      item.nama_produk?.toLowerCase().includes(searchProduk.toLowerCase()) ||
      item.barcode?.toLowerCase().includes(searchProduk.toLowerCase()) ||
      item.kategori?.toLowerCase().includes(searchProduk.toLowerCase()) ||
      item.satuan?.toLowerCase().includes(searchProduk.toLowerCase());
    const cocokLokasi = filterLokasi ? item.id_lokasi == filterLokasi : true;
    const stokTersedia = Number(item.jumlah) > 0;

    return cocokCari && cocokLokasi && stokTersedia;
  });

  return (
    <div className="">
      {alert.show && (
        <div
          className={`fixed top-4 left-1/2 z-[9999] -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white text-sm font-semibold ${
            alert.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
          style={{ minWidth: 220, textAlign: "center" }}
        >
          {alert.message}
        </div>
      )}
      <h1 className="text-2xl font-bold pb-2">Kasir</h1>
      <div ref={strukRef} style={{ display: "none" }}>
        <table style={{ width: "100%", fontSize: "12px" }}>
          <thead>
            <tr>
              <th align="left">Barang</th>
              <th align="center">Satuan</th>
              <th align="center">Qty</th>
              <th align="right">Harga</th>
            </tr>
          </thead>
          <tbody>
            {dataPembelian.map((item, idx) => (
              <tr key={idx}>
                <td className="capitalize">
                  {capitalizeWords(item.nama_produk).length > 18
                    ? capitalizeWords(item.nama_produk).slice(0, 18) + "…"
                    : capitalizeWords(item.nama_produk)}
                </td>
                <td align="center" className="capitalize">
                  {capitalizeWords(item.satuan)}
                </td>
                <td align="center" className="capitalize">
                  {item.qty}
                </td>
                <td align="right">
                  Rp{Number(item.harga_jual).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <div style={{ fontSize: "12px" }}>
          <div>SubTotal: Rp{subtotal.toLocaleString("id-ID")}</div>

          <div>
            Diskon: {diskon === 0 ? "-" : `Rp${diskon.toLocaleString("id-ID")}`}
          </div>
          <div>
            <strong>Total: Rp{total.toLocaleString("id-ID")}</strong>
          </div>
          <div>
            Bayar:
            {bayarNominal === 0
              ? "-"
              : `Rp${bayarNominal.toLocaleString("id-ID")}`}
          </div>
          <div>
            {kembalian < 0
              ? `Hutang: Rp${Math.abs(kembalian).toLocaleString("id-ID")}`
              : `Kembali: Rp${kembalian.toLocaleString("id-ID")}`}
          </div>

          <div>Pelanggan: {capitalizeWords(newItem.nama_pelanggan || "-")}</div>

          {newItem.nama_pelanggan && totalHutangPelanggan !== null && (
            <div>
              Total Hutang: Rp
              {Number(totalHutangPelanggan).toLocaleString("id-ID")}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg py-4 px-6 shadow-md">
        <div className="text-sm font-semibold">Pembelian</div>
        <div className="text-xs text-gray-500">
          Detail pembelian ditampilkan disini
        </div>
        <div className="flex items-center gap-2 mt-2 mb-4">
          <button
            className="bg-[#1E686D] p-2 rounded-[10px] text-xs text-white hover:bg-green-600"
            onClick={() => setBarangModalOpen(true)}
          >
            Lihat Daftar Produk
          </button>
          <button
            className="bg-green-400 p-2 rounded-[10px] text-xs text-white hover:bg-green-600"
            onClick={() => openLihatHistoryTransaksi(true)}
          >
            Lihat Daftar Transaksi
          </button>
          {/* Input scan barcode/QR */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <IoQrCodeOutline size={20} className="text-[#1E686D]" />
            </span>
            <input
              ref={scanInputRef}
              type="text"
              placeholder="Scan/masukkan barcode..."
              className="border rounded-[10px] px-2 py-1.5 text-sm w-56 hover:border-[#1E686D] focus:outline-none focus:ring-2 focus:ring-[#1E686D] pl-8"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  const kode = e.target.value.trim();
                  const found = produkList.find(
                    (item) => item.barcode === kode
                  );

                  if (!found) {
                    showAlert("error", "Produk tidak ditemukan!");
                  } else if (Number(found.jumlah) <= 0) {
                    showAlert(
                      "error",
                      "Stok produk kosong, tidak dapat ditambahkan."
                    );
                  } else {
                    setDataPembelian((prev) => {
                      const idx = prev.findIndex(
                        (b) => b.id_produk === found.id_produk
                      );
                      if (idx !== -1) {
                        return prev.map((b, i) =>
                          i === idx ? { ...b, qty: Number(b.qty) + 1 } : b
                        );
                      }
                      return [
                        ...prev,
                        {
                          id_produk: found.id_produk,
                          nama_produk: found.nama_produk,
                          qty: 1,
                          satuan: found.satuan,
                          harga_jual: found.harga_jual,
                        },
                      ];
                    });
                  }

                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>

        {/*  Tabel pembelian */}
        <div className="bg-white rounded-lg p-2 shadow-md border border-[#1E686D]">
          <div
            className="relative overflow-x-auto"
            style={{ maxHeight: "170px", overflowY: "auto" }}
          >
            {dataPembelian.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                Silahkan scan produk yang dibeli
              </div>
            ) : (
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                  <tr>
                    <th className="px-0.5 py-1 text-left">Produk</th>
                    <th className="px-0.5 py-1 text-left">Qty</th>
                    <th className="px-0.5 py-1 text-left">Satuan</th>
                    <th className="px-0.5 py-1 text-left">Harga</th>
                    <th className="px-0.5 py-1 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPembelian.map((item, id_produk) => (
                    <tr key={id_produk} className="bg-gray-200">
                      <td className="px-0.5 py-0.5 capitalize">
                        {item.nama_produk.length > 30
                          ? item.nama_produk.slice(0, 30) + "…"
                          : item.nama_produk}
                      </td>
                      <td className="px-0.5 py-0.5">
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) =>
                            handlePembelianChange(
                              id_produk,
                              "qty",
                              e.target.value
                            )
                          }
                          className="w-16 border rounded px-1 py-0.5 text-center"
                        />
                      </td>
                      <td className="px-0.5 py-0.5 capitalize">
                        {item.satuan}
                      </td>
                      <td className="px-0.5 py-0.5">Rp.{item.harga_jual}</td>
                      <td className="px-0.5 py-0.5">
                        <button
                          className="bg-white hover:bg-gray-300 text-black px-2 py-1 rounded text-xs"
                          onClick={() => handleHapusPembelian(id_produk)}
                        >
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
        <div className="flex justify-end mt-4">
          <div className="flex flex-col md:flex-row gap-8 justify-between mt-2">
            <div className="space-y-4 w-full md:w-1/2 pr-4">
              <div className="flex justify-between">
                <label className="text-sm text-gray-700 pr-2">SubTotal</label>
                <input
                  type="text"
                  value={`Rp. ${subtotal.toLocaleString("id-ID")}`}
                  className="text-sm text-end border rounded-lg px-2 w-40"
                  readOnly
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700 pr-2">Diskon</label>
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

              <div className="flex justify-between">
                <label className="text-sm text-gray-700 font-semibold pr-2">
                  Total
                </label>
                <input
                  type="text"
                  value={`Rp. ${total.toLocaleString("id-ID")}`}
                  className="text-sm text-end border rounded-lg px-2 w-40 font-semibold"
                  readOnly
                />
              </div>
            </div>

            <div className="space-y-4 w-full md:w-1/2 pr-4">
              <div className="flex justify-between">
                <label className="text-sm text-gray-700 pr-2">Bayar</label>
                <input
                  type="text"
                  inputMode="numeric"
                  min={0}
                  value={bayar.toLocaleString("id-ID")}
                  onChange={handleBayarChange}
                  className="text-sm text-end border rounded-lg px-2 w-40"
                />
              </div>
              <div className="flex justify-between">
                <label
                  className={`text-sm pr-2 font-semibold ${
                    kembalian < 0 ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {kembalian < 0 ? "Hutang" : "Kembalian"}
                </label>
                <input
                  type="text"
                  value={
                    kembalian < 0
                      ? `Rp. ${Math.abs(kembalian).toLocaleString("id-ID")}`
                      : `Rp. ${kembalian.toLocaleString("id-ID")}`
                  }
                  className={`text-sm text-end border rounded-lg px-2 w-40 ${
                    kembalian < 0 ? "text-red-700" : "text-green-700"
                  }`}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs">Nama Pelanggan</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    name="nama"
                    value={newItem.nama_pelanggan}
                    onChange={handleAddChange}
                    className="border rounded-lg px-2 py-1 w-full pr-10 capitalize text-sm"
                    placeholder="pilih pelanggan...."
                  />
                  <button
                    type="button"
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-red-500 text-xs underline hover:text-red-700"
                    onClick={() =>
                      setNewItem({
                        ...newItem,
                        id_pelanggan: null,
                        nama_pelanggan: "",
                        kontak: "",
                      })
                    }
                  >
                    Hapus
                  </button>
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#1E686D] hover:text-green-600"
                    title="Pilih dari daftar pelanggan"
                    onClick={openKontakModal}
                  >
                    <MdContactPage size={25} />
                  </button>
                </div>
              </div>

              <div className="text-center mt-1 space-x-2">
                <button
                  className="bg-gray-600 text-sm text-white px-4 py-2 rounded-[10px] w-full md:w-auto transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105 hover:shadow-lg"
                  type="button"
                  onClick={handleSubmitTanpaCetakStruk}
                  //disabled={isSubmitting}
                >
                  Simpan
                </button>
                <button
                  className="bg-black text-sm text-white px-4 py-2 rounded-[10px] w-full md:w-auto transition duration-300 ease-in-out transform hover:bg-gray-800 hover:scale-105 hover:shadow-lg"
                  type="button"
                  onClick={handleSubmitTransaksi}
                  //disabled={isSubmitting}
                >
                  Simpan & Cetak
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Kontak */}
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
                  className="bg-green-400 hover:bg-green-500 text-white px-3 py-2 rounded-[10px] text-xs"
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
                        <div className="font-semibold text-sm capitalize">
                          {item.nama_pelanggan}
                        </div>
                        <div className="text-xs text-gray-600">
                          {item.kontak || "Tidak ada kontak"}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="mt-2 md:mt-0 bg-[#1E686D] hover:bg-green-600 text-white px-4 py-1 rounded-[10px] text-xs"
                        onClick={() => {
                          setNewItem((prev) => ({
                            ...prev,
                            id_pelanggan: item.id_pelanggan,
                            kontak: item.kontak || "",
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
                  className="text-sm px-4 py-1 rounded-[10px] bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

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
                {userRole === "admin" && (
                  <div className="mb-2">
                    <label htmlFor="" className="text-xs">
                      Pilih Lokasi
                    </label>
                    <select
                      value={selectedLokasi}
                      onChange={(e) => setSelectedLokasi(e.target.value)}
                      className="border rounded-[10px] px-2 py-0.5 text-sm w-full capitalize text-gray-900 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">-- Semua Lokasi --</option>
                      {lokasiList.map((lokasi) => (
                        <option key={lokasi.id_lokasi} value={lokasi.id_lokasi}>
                          {lokasi.nama_lokasi}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
                    value={searchProduk}
                    onChange={handleSearchProdukChange}
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
                        <th className="px-2 py-1.5">Nama Produk</th>
                        <th className="px-2 py-1.5">Kategori</th>
                        <th className="px-2 py-1.5">Satuan</th>
                        <th className="px-2 py-1.5">Harga Jual</th>
                        <th className="px-2 py-1.5">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProdukList.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center text-gray-400 py-8"
                          >
                            Data tidak ditemukan.
                          </td>
                        </tr>
                      ) : (
                        filteredProdukList.map((item, idx) => (
                          <tr
                            key={item.id_produk}
                            className="bg-white border-b"
                          >
                            <td className="px-2 py-1.5 text-center">
                              {idx + 1}
                            </td>
                            <td className="px-2 py-1.5 text-center">
                              {item.barcode}
                            </td>
                            <td className="px-2 py-1.5 capitalize">
                              {item.nama_produk.length > 30
                                ? item.nama_produk.slice(0, 30) + "…"
                                : item.nama_produk}
                            </td>
                            <td className="px-2 py-1.5 capitalize">
                              {item.kategori}
                            </td>
                            <td className="px-2 py-1.5 capitalize">
                              {item.satuan}
                            </td>
                            <td className="px-2 py-1.5 capitalize">
                              Rp.{item.harga_jual}
                            </td>
                            <td className="px-2 py-1.5">
                              <button
                                onClick={() => {
                                  setDataPembelian((prev) => {
                                    // Cek apakah produk sudah ada di pembelian
                                    const idx = prev.findIndex(
                                      (b) =>
                                        b.nama_produk === item.nama_produk &&
                                        b.satuan === item.satuan
                                    );
                                    if (idx !== -1) {
                                      // Jika sudah ada, tambahkan kuantitas
                                      return prev.map((b, i) =>
                                        i === idx
                                          ? {
                                              ...b,
                                              qty: Number(b.qty) + 1,
                                            }
                                          : b
                                      );
                                    }
                                    // Jika belum ada, tambahkan baru
                                    return [
                                      ...prev,
                                      {
                                        id_produk: item.id_produk, // harus integer, bukan null
                                        nama_produk: item.nama_produk,
                                        qty: 1,
                                        satuan: item.satuan,
                                        harga_jual: item.harga_jual,
                                      },
                                    ];
                                  });
                                  setBarangModalOpen(false);
                                }}
                                className="bg-[#1E686D] hover:bg-green-600 text-white px-3 py-1 rounded-[10px] text-xs"
                              >
                                Pilih
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Modal Lihat Data Mutasi */}
        {lihatHistoryTransaksiOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Data Transaksi</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={closeLihatHistoryTransaksi}
                >
                  <IoClose size={24} />
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-2 mb-4">
                {userRole === "admin" && (
                  <select
                    name="id_lokasi"
                    value={filterHistoryTransaksi.id_lokasi}
                    onChange={handleFilterRiwayatTransaksiChange}
                    className="border rounded px-2 py-1 text-xs capitalize"
                  >
                    <option value="">Pilih Lokasi</option>
                    {lokasiList.map((lokasi) => (
                      <option key={lokasi.id_lokasi} value={lokasi.id_lokasi}>
                        {lokasi.nama_lokasi}
                      </option>
                    ))}
                  </select>
                )}
                {/* Input tanggal & pelanggan sudah ada */}

                <input
                  type="date"
                  name="tanggal_awal"
                  value={filterHistoryTransaksi.tanggal_awal}
                  onChange={handleFilterRiwayatTransaksiChange}
                  className="border rounded px-2 py-1 text-xs"
                />

                <input
                  type="date"
                  name="tanggal_akhir"
                  value={filterHistoryTransaksi.tanggal_akhir}
                  onChange={handleFilterRiwayatTransaksiChange}
                  className="border rounded px-2 py-1 text-xs"
                />
                <select
                  name="id_pelanggan"
                  value={filterHistoryTransaksi.id_pelanggan}
                  onChange={handleFilterRiwayatTransaksiChange}
                  className="border rounded px-2 py-1 text-xs capitalize"
                >
                  <option value="">Pilih Pelanggan</option>
                  {historyTransaksiList.map((pelanggan) => (
                    <option
                      key={pelanggan.id_pelanggan}
                      value={pelanggan.id_pelanggan}
                    >
                      {pelanggan.nama_pelanggan || "Tidak ada nama"}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="relative overflow-x-auto"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {loadingHistoryTransaksi ? (
                  <div className="text-center py-8">
                    Memuat data transaksi...
                  </div>
                ) : dataHistoryTransaksi.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    Tidak ada data transaksi
                  </div>
                ) : (
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead>
                      <tr>
                        <th className="px-2 py-1">Tanggal</th>
                        <th className="px-2 py-1">Nama Pelanggan</th>
                        <th className="px-2 py-1">Lokasi</th>
                        <th className="px-2 py-1">Total Belanja</th>
                        <th className="px-2 py-1">Status Hutang</th>

                        {/* <th className="px-2 py-1">Lokasi Asal</th>
                        <th className="px-2 py-1">Lokasi Tujuan</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {dataHistoryTransaksi.map((item, idx) => (
                        <tr key={idx} className="bg-gray-100">
                          <td className="px-2 py-1">{item.tanggal}</td>
                          <td className="px-2 py-1 capitalize">
                            {item.nama_pelanggan || "-"}
                          </td>
                          <td className="px-2 py-1 capitalize">
                            {item.nama_lokasi}
                          </td>
                          <td className="px-2 py-1">{`Rp. ${item.total.toLocaleString(
                            "id-ID"
                          )}`}</td>
                          <td className="px-2 py-1 capitalize">
                            <span
                              className={
                                !item.status_hutang ||
                                item.status_hutang === "-"
                                  ? "text-black font-semibold"
                                  : item.status_hutang.toLowerCase() === "lunas"
                                  ? "text-green-600 font-semibold"
                                  : "text-red-600 font-semibold"
                              }
                            >
                              {item.status_hutang || "-"}
                            </span>
                          </td>
                          {/* <td className="px-2 py-1">{item.lokasi_asal}</td>
                          <td className="px-2 py-1">{item.lokasi_tujuan}</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Tambah Pelanggan */}
        {tambahPelangganModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
              <h2 className="text-lg font-bold mb-4">Tambah Pelanggan</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await api.post(
                      "/pelanggan/",
                      {
                        nama_pelanggan: tambahNamaPelanggan,
                        kontak: tambahKontakPelanggan,
                      },
                      { headers: getAuthHeaders() }
                    );
                    setTambahPelangganModalOpen(false);
                    setTambahNamaPelanggan("");
                    setTambahKontakPelanggan("");
                    // Refresh data pelanggan jika modal kontak terbuka
                    if (kontakModalOpen) {
                      setPelangganLoading(true);
                      api
                        .get("/pelanggan/", { headers: getAuthHeaders() })
                        .then((res) => setPelangganList(res.data || []))
                        .finally(() => setPelangganLoading(false));
                    }
                  } catch (err) {
                    alert("Gagal menambah pelanggan!");
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs mb-1">Nama Pelanggan</label>
                  <input
                    type="text"
                    className="border rounded px-2 py-1 w-full"
                    required
                    value={tambahNamaPelanggan}
                    onChange={(e) => setTambahNamaPelanggan(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Kontak</label>
                  <input
                    type="text"
                    className="border rounded px-2 py-1 w-full"
                    value={tambahKontakPelanggan}
                    onChange={(e) => setTambahKontakPelanggan(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTambahPelangganModalOpen(false)}
                    className="text-sm px-4 py-1 rounded-[10px] bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 text-sm rounded-[10px] bg-[#1E686D] hover:bg-green-600 text-white"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kasir;
