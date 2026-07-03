import { useState } from "react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("admin@tlj.mn");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend дараа: POST /api/admin/login
    if (email === "admin@tlj.mn" && password === "admin123") {
      localStorage.setItem("adminAuth", "true");
      onLogin();
    } else {
      setError("Имэйл эсвэл нууц үг буруу байна.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7f2] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0b5a35]">Tous Les Jours</h1>
          <p className="mt-2 text-sm text-slate-500">Админ нэвтрэх хэсэг</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Имэйл
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Нууц үг
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#0b5a35] px-5 py-3 font-semibold text-white hover:bg-[#09492b]"
          >
            Нэвтрэх
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;