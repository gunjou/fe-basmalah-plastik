import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Kasir from "./pages/Kasir";
import Stock from "./pages/Stock";
import DaftarPelanggan from "./pages/DaftarPelanggan";
import Hutang from "./pages/Hutang";
import Laporan from "./pages/Laporan";
import Login from "./pages/Login";
import Tentang from "./pages/Tentang";

import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./layouts/PublicLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* /login sebagai halaman awal */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/kasir" />
            ) : (
              <PublicLayout>
                <Login />
              </PublicLayout>
            )
          }
        />

        {/* Protected routes (dengan sidebar & navbar) */}
        <Route
          path="/kasir"
          element={
            localStorage.getItem("token") ? (
              <DashboardLayout>
                <Kasir />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/stock"
          element={
            <DashboardLayout>
              <Stock />
            </DashboardLayout>
          }
        />
        <Route
          path="/pelanggan"
          element={
            <DashboardLayout>
              <DaftarPelanggan />
            </DashboardLayout>
          }
        />
        <Route
          path="/hutang"
          element={
            <DashboardLayout>
              <Hutang />
            </DashboardLayout>
          }
        />
        <Route
          path="/laporan"
          element={
            <DashboardLayout>
              <Laporan />
            </DashboardLayout>
          }
        />
        <Route
          path="/tentang"
          element={
            <DashboardLayout>
              <Tentang />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
