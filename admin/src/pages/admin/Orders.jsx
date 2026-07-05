import { useEffect, useMemo, useState } from "react";
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

const paymentLabels = {
  pending: "Хүлээгдэж байна",
  paid: "Төлөгдсөн",
  refunded: "Буцаагдсан",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders:", error);
      alert("Захиалга ачааллахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchType = typeFilter === "all" || order.orderType === typeFilter;

      return matchStatus && matchType;
    });
  }, [orders, statusFilter, typeFilter]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Захиалгын төлөв өөрчлөхөд алдаа гарлаа");
    }
  };

  const deleteOrder = async (orderId) => {
    const ok = window.confirm("Энэ захиалгыг устгах уу?");
    if (!ok) return;

    try {
      await api.delete(`/orders/${orderId}`);
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("Захиалга устгахад алдаа гарлаа");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Захиалга</h1>
        <p className="mt-2 text-slate-500">
          Хүргэлт болон очиж авах захиалгууд
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm md:flex-row">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0b5a35]"
        >
          <option value="all">Бүх төлөв</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0b5a35]"
        >
          <option value="all">Бүх төрөл</option>
          <option value="delivery">Хүргэлт</option>
          <option value="pickup">Очиж авах</option>
        </select>
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            Ачааллаж байна...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            Захиалга олдсонгүй
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {order.orderNumber || order._id}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {typeLabels[order.orderType]}
                  </span>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {paymentLabels[order.paymentStatus]}
                  </span>

                  <span className="rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-semibold text-[#0b5a35]">
                    {statusLabels[order.status]}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Захиалагч
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-slate-600">{order.phone}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {order.orderType === "delivery"
                      ? "Хүргэлтийн хаяг"
                      : "Авах цаг"}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {order.orderType === "delivery"
                      ? order.address || "-"
                      : order.pickupTime || "-"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Нийт төлбөр
                  </h3>
                  <p className="mt-2 text-lg font-bold text-[#0b5a35]">
                    ₮{Number(order.totalPrice).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <h3 className="mb-3 text-sm font-bold text-slate-800">
                  Бүтээгдэхүүн
                </h3>

                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-slate-600"
                    >
                      <span>
                        {item.name} x {item.qty}
                      </span>
                      <span>₮{Number(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {order.notes && (
                <div className="mt-4 rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-800">
                  {order.notes}
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0b5a35]"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => deleteOrder(order._id)}
                  className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  Устгах
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;