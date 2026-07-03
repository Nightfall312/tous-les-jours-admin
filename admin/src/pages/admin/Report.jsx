import { useMemo, useState } from "react";
import {
  FiDownload,
  FiFileText,
  FiTrash2,
  FiDatabase,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

const initialOrders = [
  {
    id: "TLJ-1020",
    customer: "Сараа",
    status: "delivered",
    total: 42000,
    date: "2026-07-01",
  },
  {
    id: "TLJ-1021",
    customer: "Бат",
    status: "delivered",
    total: 68000,
    date: "2026-07-01",
  },
  {
    id: "TLJ-1022",
    customer: "Номин",
    status: "cancelled",
    total: 31500,
    date: "2026-07-02",
  },
  {
    id: "TLJ-1023",
    customer: "Тэмүүлэн",
    status: "delivered",
    total: 57000,
    date: "2026-07-02",
  },
  {
    id: "TLJ-1024",
    customer: "Анужин",
    status: "cancelled",
    total: 39000,
    date: "2026-07-03",
  },
];

const products = [
  { rank: 1, name: "Croissant", units: 428, revenue: 1926000, share: 100 },
  { rank: 2, name: "Sourdough Loaf", units: 312, revenue: 2184000, share: 73 },
  { rank: 3, name: "Strawberry Tart", units: 197, revenue: 2364000, share: 46 },
  { rank: 4, name: "Macarons", units: 184, revenue: 1656000, share: 43 },
  { rank: 5, name: "Cinnamon Roll", units: 142, revenue: 852000, share: 33 },
];

const Reports = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [deleteType, setDeleteType] = useState(null);

  const deliveredOrders = orders.filter((order) => order.status === "delivered");
  const cancelledOrders = orders.filter((order) => order.status === "cancelled");

  const selectedDeleteOrders =
    deleteType === "delivered" ? deliveredOrders : cancelledOrders;

  const selectedDeleteLabel =
    deleteType === "delivered" ? "хүргэгдсэн" : "цуцлагдсан";

  const totalDeleteValue = useMemo(() => {
    return selectedDeleteOrders.reduce((sum, order) => sum + order.total, 0);
  }, [selectedDeleteOrders]);

  const totalRevenue = orders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + order.total, 0);

  const handleDownloadExcel = () => {
    alert(
      "Backend later: download Excel report with all delivery statuses: delivered + cancelled."
    );
  };

  const handleDownloadPDF = () => {
    alert(
      "Backend later: download PDF report with all delivery statuses: delivered + cancelled."
    );
  };

  const handleDeleteOrders = () => {
    setOrders((prev) => prev.filter((order) => order.status !== deleteType));
    setDeleteType(null);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Тайлан</h1>
          <p className="mt-1 text-sm text-slate-500">
            Орлого, хүргэлтийн төлөв, өгөгдлийн сангийн мэдээлэл
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-[#0b5a35] hover:text-[#0b5a35]"
          >
            <FiDownload />
            Excel татах
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <FiFileText />
            PDF татах
          </button>

          <button
            onClick={() => setDeleteType("delivered")}
            className="flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
          >
            <FiTrash2 />
            Хүргэгдсэн устгах
          </button>

          <button
            onClick={() => setDeleteType("cancelled")}
            className="flex items-center gap-2 rounded-2xl bg-red-100 px-5 py-3 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-200"
          >
            <FiTrash2 />
            Цуцлагдсан устгах
          </button>
        </div>
      </div>

      <p className="mb-5 text-sm font-medium text-slate-600">
        Өдрийн төгсгөлийн тайлан: ихэнх захиалга хүргэгдсэн эсвэл цуцлагдсан байна.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Нийт орлого</p>
          <h2 className="mt-3 text-3xl font-bold">
            ₮{totalRevenue.toLocaleString()}
          </h2>
          <p className="mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Зөвхөн хүргэгдсэнээс
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Нийт захиалга</p>
          <h2 className="mt-3 text-3xl font-bold">{orders.length}</h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Хүргэгдсэн</p>
          <h2 className="mt-3 text-3xl font-bold">{deliveredOrders.length}</h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Цуцлагдсан</p>
          <h2 className="mt-3 text-3xl font-bold">{cancelledOrders.length}</h2>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-bold">DB ашиглалт</p>
            <FiDatabase className="text-[#0b5a35]" size={22} />
          </div>

          <h2 className="text-3xl font-bold">68%</h2>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[68%] rounded-full bg-[#0b5a35]" />
          </div>

          <p className="mt-3 text-xs text-slate-500">348 MB / 512 MB</p>
        </div>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <FiAlertTriangle className="mt-1 text-red-600" size={22} />
            <div>
              <p className="font-bold text-red-700">DB цэвэрлэх</p>
              <p className="mt-2 text-sm text-red-600">
                Эхлээд Excel/PDF тайлангаа татаж аваад дараа нь хүргэгдсэн эсвэл
                цуцлагдсан захиалгыг устгана.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold">Хүргэлтийн захиалгын төлөв</h2>
          <p className="mt-1 text-sm text-slate-500">
            PDF болон Excel тайланд эдгээр бүх төлөв орно.
          </p>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Захиалга №</th>
              <th className="px-6 py-4">Хэрэглэгч</th>
              <th className="px-6 py-4">Төлөв</th>
              <th className="px-6 py-4">Огноо</th>
              <th className="px-6 py-4 text-right">Нийт</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-slate-100">
                <td className="px-6 py-5 font-semibold">#{order.id}</td>
                <td className="px-6 py-5">{order.customer}</td>
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status === "delivered" ? "Хүргэгдсэн" : "Цуцлагдсан"}
                  </span>
                </td>
                <td className="px-6 py-5 text-slate-500">{order.date}</td>
                <td className="px-6 py-5 text-right font-bold">
                  ₮{order.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold">Шилдэг борлуулалттай бүтээгдэхүүн</h2>
          <p className="mt-1 text-sm text-slate-500">
            Сүүлийн 30 хоногийн борлуулалтаар эрэмбэлсэн
          </p>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Байр</th>
              <th className="px-6 py-4">Бүтээгдэхүүн</th>
              <th className="px-6 py-4">Зарагдсан</th>
              <th className="px-6 py-4">Орлого</th>
              <th className="px-6 py-4">Хувь</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.rank} className="border-t border-slate-100">
                <td className="px-6 py-5 font-semibold text-slate-500">
                  #{product.rank}
                </td>
                <td className="px-6 py-5 font-semibold">{product.name}</td>
                <td className="px-6 py-5">{product.units}</td>
                <td className="px-6 py-5 font-bold">
                  ₮{product.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-5">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#2563eb]"
                      style={{ width: `${product.share}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedDeleteLabel} захиалга устгах
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Энэ үйлдэл зөвхөн {selectedDeleteLabel} захиалгад нөлөөлнө.
                </p>
              </div>

              <button
                onClick={() => setDeleteType(null)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                Backend холбогдоогүй үед энэ нь зөвхөн frontend дээр устна.
                Backend дээр API нь status = "{deleteType}" захиалгуудыг устгана.
              </div>

              <div className="mb-5 rounded-2xl border border-slate-200 p-4">
                <div className="flex justify-between text-sm">
                  <span>Устгах захиалга</span>
                  <b>{selectedDeleteOrders.length}</b>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span>Нийт үнийн дүн</span>
                  <b>₮{totalDeleteValue.toLocaleString()}</b>
                </div>
              </div>

              <div className="max-h-52 space-y-3 overflow-y-auto">
                {selectedDeleteOrders.length > 0 ? (
                  selectedDeleteOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-sm"
                    >
                      <div>
                        <p className="font-semibold">#{order.id}</p>
                        <p className="text-slate-500">
                          {order.customer} • {order.date}
                        </p>
                      </div>
                      <p className="font-bold">₮{order.total.toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                    Устгах захиалга байхгүй.
                  </p>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteType(null)}
                  className="flex-1 rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Болих
                </button>

                <button
                  onClick={handleDeleteOrders}
                  disabled={selectedDeleteOrders.length === 0}
                  className="flex-1 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                >
                  Устгах
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;