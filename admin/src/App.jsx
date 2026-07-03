import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";

import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Reports from "./pages/admin/Report";
import Settings from "./pages/admin/Settings";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("adminAuth") === "true"
  );

  const handleLogin = () => {
    localStorage.setItem("adminAuth", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
  localStorage.removeItem("adminAuth");
  localStorage.removeItem("token");
  setIsLoggedIn(false);
};

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" />} />

      <Route path="/admin" element={<AdminLayout onLogout={handleLogout} />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;