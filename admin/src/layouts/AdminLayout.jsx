import { NavLink, Outlet } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiTag,
  FiShoppingBag,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiBell,
  FiSearch,
} from "react-icons/fi";
import logo from "../assets/tlj-logo.png";

const menuItems = [
  { name: "Хяналтын самбар", path: "/admin/dashboard", icon: FiHome },
  { name: "Бүтээгдэхүүн", path: "/admin/products", icon: FiBox },
  { name: "Ангилал", path: "/admin/categories", icon: FiTag },
  { name: "Захиалга", path: "/admin/orders", icon: FiShoppingBag },
  { name: "Тайлан", path: "/admin/reports", icon: FiBarChart2 },
  { name: "Тохиргоо", path: "/admin/settings", icon: FiSettings },
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#fbfcfb] text-slate-900">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white">
        <div className="flex h-24 items-center px-6">
          <img src={logo} alt="Tous Les Jours" className="w-44" />
        </div>

        <nav className="px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                    ? "bg-[#0b5a35] text-white shadow-sm"
                    : "text-slate-600 hover:bg-green-50 hover:text-[#0b5a35]"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("adminAuth");
            window.location.href = "/login";
          }}
        >
          Гарах
        </button>
      </aside>

      <main className="ml-64">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div>
            <h1 className="text-2xl font-bold">Хяналтын самбар</h1>
            <p className="text-sm text-slate-500">
              Сайн байна уу, өнөөдрийн үйл ажиллагаа
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Захиалга, бүтээгдэхүүн хайх..."
                className="w-80 rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#0b5a35]"
              />
            </div>

            <button className="relative rounded-2xl border border-slate-200 p-3">
              <FiBell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#0b5a35]" />
            </button>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2">
              <div className="text-right">
                <p className="text-sm font-semibold">Админ</p>
                <p className="text-xs text-slate-500">Менежер</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#0b5a35] font-bold text-white">
                AD
              </div>
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;