import { useEffect, useState } from "react";
import {
  FiBox,
  FiGrid,
  FiShoppingBag,
  FiDollarSign,
  FiAlertTriangle,
} from "react-icons/fi";
import api from "../../api/axios";

const statusLabels = {
  new: "Шинэ",
  preparing: "Бэлтгэж байна",
  readyForPickup: "Авахад бэлэн",
  outForDelivery: "Хүргэлтэнд гарсан",
  completed: "Дууссан",
  cancelled: "Цуцлагдсан",
};

const typeLabels = {
  delivery: "Хүргэлт",
  pickup: "Очиж авах",
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      alert("Хянах самбар ачааллахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="rounded-3xl bg-white p-8 shadow-sm">Ачааллаж байна...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Хянах самбар</h1>
        <p className="mt-2 text-slate-500">
          Бүтээгдэхүүн, захиалга болон орлогын ерөнхий мэдээлэл
        </p>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <FiBox className="text-2xl text-[#0b5a35]" />
          <p className="mt-4 text-sm text-slate-500">Бүтээгдэхүүн</p>
          <h2 className="mt-2 text-2xl font-bold">{stats.totalProducts}</h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <FiGrid className="text-2xl text-[#0b5a35]" />
          <p className="mt-4 text-sm text-slate-500">Ангилал</p>
          <h2 className="mt-2 text-2xl font-bold">{stats.totalCategories}</h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <FiShoppingBag className="text-2xl text-[#0b5a35]" />
          <p className="mt-4 text-sm text-slate-500">Нийт захиалга</p>
          <h2 className="mt-2 text-2xl font-bold">{stats.totalOrders}</h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <FiDollarSign className="text-2xl text-[#0b5a35]" />
          <p className="mt-4 text-sm text-slate-500">Нийт орлого</p>
          <h2 className="mt-2 text-2xl font-bold text-[#0b5a35]">
            ₮{Number(stats.totalRevenue || 0).toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Шинэ захиалга</p>
          <h2 className="mt-2 text-2xl font-bold">{stats.newOrders}</h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Дууссан захиалга</p>
          <h2 className="mt-2 text-2xl font-bold">{stats.completedOrders}</h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-red-600">
            <FiAlertTriangle />
            <p className="text-sm font-semibold">Нөөцийн анхааруулга</p>
          </div>
          <h2 className="mt-2 text-2xl font-bold">
            {stats.lowStockProducts + stats.outOfStockProducts}
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Цөөн үлдсэн {stats.lowStockProducts} · Дууссан{" "}
            {stats.outOfStockProducts}
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Сүүлийн захиалгууд</h2>
        <p className="mt-1 text-sm text-slate-500">Хамгийн сүүлд орсон 5 захиалга</p>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">№</th>
                <th className="px-4 py-3">Хэрэглэгч</th>
                <th className="px-4 py-3">Төрөл</th>
                <th className="px-4 py-3">Төлөв</th>
                <th className="px-4 py-3">Нийт</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {stats.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-3 font-semibold">
                      {order.orderNumber || order._id}
                    </td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">
                      {typeLabels[order.orderType] || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {statusLabels[order.status] || order.status}
                    </td>
                    <td className="px-4 py-3">
                      ₮{Number(order.totalPrice || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                    Захиалга олдсонгүй
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;