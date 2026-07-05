import { useState } from "react";
import api from "../api/axios";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("admin@tlj.mn");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data));

      onLogin();
    } catch (err) {
      setError("Имэйл эсвэл нууц үг буруу байна.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow"
      >
        <h1 className="text-3xl font-bold text-[#0b5a35]">Tous Les Jours</h1>
        <p className="mt-2 text-slate-500">Админ нэвтрэх хэсэг</p>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold">Имэйл</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold">Нууц үг</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-[#0b5a35] py-3 font-semibold text-white"
        >
          Нэвтрэх
        </button>
      </form>
    </div>
  );
};

export default Login;