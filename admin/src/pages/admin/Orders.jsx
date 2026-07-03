import { useMemo, useState } from "react";
import { FiX } from "react-icons/fi";

const mockOrders = [
  {
    id: "TLJ-1024",
    customer: "София Лаурент",
    phone: "+976 9911 2233",
    date: "2026-07-03 08:00",
    status: "new",
    paymentStatus: "paid",
    transactionId: "TXN-8F4A2C91",
    total: 36000,
    address: "Хан-Уул дүүрэг, 15-р хороо",
    notes: "Төрсөн өдрийн бичиг нэмэх",
    items: [
      { name: "Strawberry Fresh Cream Cake", qty: 1, price: 32000 },
      { name: "Candle", qty: 2, price: 2000 },
    ],
  },
  {
    id: "TLJ-1025",
    customer: "Маркус Чен",
    phone: "+976 9911 4455",
    date: "2026-07-03 09:07",
    status: "outForDelivery",
    paymentStatus: "paid",
    transactionId: "TXN-42B9K201",
    total: 72000,
    address: "Сүхбаатар дүүрэг",
    notes: "11 цагаас өмнө хүргэх",
    items: [{ name: "Chocolate Cake", qty: 1, price: 72000 }],
  },
  {
    id: "TLJ-1026",
    customer: "Амелия Росси",
    phone: "+976 9911 6677",
    date: "2026-07-03 10:14",
    status: "delivered",
    paymentStatus: "paid",
    transactionId: "TXN-91AZ7340",
    total: 64800,
    address: "Баянзүрх дүүрэг",
    notes: "",
    items: [{ name: "Cheesecake", qty: 2, price: 32400 }],
  },
  {
    id: "TLJ-1027",
    customer: "Жонас Вебер",
    phone: "+976 9911 8899",
    date: "2026-07-03 11:21",
    status: "cancelled",
    paymentStatus: "refunded",
    transactionId: "TXN-77QW9032",
    total: 57600,
    address: "Чингэлтэй дүүрэг",
    notes: "Цуцлагдсан",
    items: [{ name: "Gift Box", qty: 1, price: 57600 }],
  },
];

const tabs = [
  { key: "all", label: "Бүгд" },
  { key: "new", label: "Шинэ" },
  { key: "outForDelivery", label: "Хүргэлтэнд гарсан" },
  { key: "delivered", label: "Хүргэгдсэн" },
  { key: "cancelled", label: "Цуцлагдсан" },
];

const statusMap = {
  new: "Шинэ",
  outForDelivery: "Хүргэлтэнд гарсан",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцлагдсан",
};

const statusClass = {
  new: "bg-yellow-100 text-yellow-700",
  outForDelivery: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentStatusMap = {
  paid: "Төлөгдсөн",
  refunded: "Буцаагдсан",
};

const paymentStatusClass = {
  paid: "bg-green-100 text-green-700",
  refunded: "bg-slate-100 text-slate-700",
};

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((order) => order.status === activeTab);
  }, [activeTab, orders]);

  const countByStatus = (status) => {
    if (status === "all") return orders.length;
    return orders.filter((order) => order.status === status).length;
  };

  const handleOrderStatusChange = (value) => {
    setSelectedOrder((prev) => ({
      ...prev,
      status: value,
      paymentStatus: value === "cancelled" ? "refunded" : "paid",
    }));
  };

  const handleSave = () => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrder.id ? selectedOrder : order
      )
    );

    setSelectedOrder(null);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Захиалга</h1>
        <p className="mt-1 text-sm text-slate-500">
          Нийт {orders.length} захиалга • {countByStatus("new")} шинэ
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "border-[#0b5a35] bg-[#0b5a35] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#0b5a35] hover:text-[#0b5a35]"
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                activeTab === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {countByStatus(tab.key)}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Захиалга №</th>
              <th className="px-6 py-4">Хэрэглэгч</th>
              <th className="px-6 py-4">Утас</th>
              <th className="px-6 py-4">Хаяг</th>
              <th className="px-6 py-4">Огноо</th>
              <th className="px-6 py-4">Төлөв</th>
              <th className="px-6 py-4">Төлбөр</th>
              <th className="px-6 py-4 text-right">Нийт</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                onClick={() => setSelectedOrder({ ...order })}
                className="cursor-pointer border-t border-slate-100 hover:bg-green-50/40"
              >
                <td className="px-6 py-5 font-semibold">#{order.id}</td>
                <td className="px-6 py-5">{order.customer}</td>
                <td className="px-6 py-5 text-slate-600">{order.phone}</td>
                <td className="px-6 py-5 text-slate-600">{order.address}</td>
                <td className="px-6 py-5 text-slate-600">{order.date}</td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusClass[order.status]
                    }`}
                  >
                    {statusMap[order.status]}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      paymentStatusClass[order.paymentStatus]
                    }`}
                  >
                    {paymentStatusMap[order.paymentStatus]}
                  </span>
                  <p className="mt-1 text-xs text-slate-400">Онлайн</p>
                </td>

                <td className="px-6 py-5 text-right font-bold">
                  ₮{order.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="h-full w-full max-w-lg overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-2xl font-bold">#{selectedOrder.id}</h2>
                <p className="text-sm text-slate-500">Захиалгын дэлгэрэнгүй</p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <h3 className="mb-3 font-bold">Хэрэглэгчийн мэдээлэл</h3>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                  <p>
                    <b>Нэр:</b> {selectedOrder.customer}
                  </p>
                  <p className="mt-2">
                    <b>Утас:</b> {selectedOrder.phone}
                  </p>
                  <p className="mt-2">
                    <b>Хаяг:</b> {selectedOrder.address}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-bold">Захиалсан бүтээгдэхүүн</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between rounded-2xl border border-slate-200 p-4 text-sm"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-slate-500">Тоо: {item.qty}</p>
                      </div>
                      <p className="font-bold">
                        ₮{item.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-bold">Төлбөр</h3>
                <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-500">
                      Төлбөрийн хэлбэр
                    </p>
                    <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold">
                      Онлайн
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-500">
                      Төлбөрийн төлөв
                    </p>
                    <div
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        paymentStatusClass[selectedOrder.paymentStatus]
                      }`}
                    >
                      {paymentStatusMap[selectedOrder.paymentStatus]}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-500">
                      Transaction ID
                    </p>
                    <div className="rounded-xl bg-slate-100 px-4 py-3 font-mono text-sm">
                      {selectedOrder.transactionId}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-bold">Тэмдэглэл</h3>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  {selectedOrder.notes || "Тэмдэглэл байхгүй"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Нийт үнэ</span>
                  <span>₮{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-bold">Төлөв өөрчлөх</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(statusMap).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handleOrderStatusChange(key)}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                        selectedOrder.status === key
                          ? "bg-[#0b5a35] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-green-50 hover:text-[#0b5a35]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full rounded-2xl bg-[#0b5a35] px-5 py-3 font-semibold text-white hover:bg-[#09492b]"
              >
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;