import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import {
  FiDownload,
  FiFileText,
  FiTrash2,
  FiDatabase,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

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

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [storage, setStorage] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const reportRes = await api.get("/reports");
      setOrders(reportRes.data.orders || []);

      const storageRes = await api.get("/storage");
      setStorage(storageRes.data);
    } catch (error) {
      console.error("Failed to load reports:", error);
      alert("Тайлангийн мэдээлэл ачааллахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const downloadFile = (blobData, filename) => {
    const url = window.URL.createObjectURL(new Blob([blobData]));
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadExcel = async () => {
    try {
      const res = await api.get("/reports/export/excel", {
        responseType: "blob",
      });

      downloadFile(res.data, "tlj-report.xlsx");
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Excel тайлан татахад алдаа гарлаа");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await api.get("/reports/export/pdf", {
        responseType: "blob",
      });

      downloadFile(res.data, "tlj-report.pdf");
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("PDF тайлан татахад алдаа гарлаа");
    }
  };

  const completedOrders = orders.filter((order) => order.status === "completed");
  const cancelledOrders = orders.filter((order) => order.status === "cancelled");
  const deliveryOrders = orders.filter((order) => order.orderType === "delivery");
  const pickupOrders = orders.filter((order) => order.orderType === "pickup");

  const selectedDeleteOrders =
    deleteType === "completed" ? completedOrders : cancelledOrders;

  const selectedDeleteLabel =
    deleteType === "completed" ? "дууссан" : "цуцлагдсан";

  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0
  );

  const cancelledValue = cancelledOrders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0
  );

  const totalDeleteValue = selectedDeleteOrders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0
  );

  const topProducts = useMemo(() => {
    const map = {};

    completedOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!map[item.name]) {
          map[item.name] = { name: item.name, units: 0, revenue: 0 };
        }

        map[item.name].units += Number(item.qty || 0);
        map[item.name].revenue +=
          Number(item.qty || 0) * Number(item.price || 0);
      });
    });

    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [completedOrders]);

  const handleDeleteOrders = async () => {
    try {
      await api.delete("/reports/orders", {
        data: { status: deleteType },
      });

      setDeleteType(null);
      fetchReports();
    } catch (error) {
      console.error("Failed to delete report orders:", error);
      alert("Захиалга устгахад алдаа гарлаа");
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Тайлан</h1>
          <p className="mt-2 text-slate-500">
            Орлого, захиалгын төлөв, хүргэлт болон очиж авах мэдээлэл
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 rounded-2xl bg-[#0b5a35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#09492b]"
          >
            <FiDownload />
            Excel татах
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <FiFileText />
            PDF татах
          </button>

          <button
            onClick={() => setDeleteType("completed")}
            className="flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            <FiTrash2 />
            Дууссан устгах
          </button>

          <button
            onClick={() => setDeleteType("cancelled")}
            className="flex items-center gap-2 rounded-2xl bg-red-100 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-200"
          >
            <FiTrash2 />
            Цуцлагдсан устгах
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          Ачааллаж байна...
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            <div className="flex gap-3">
              <FiAlertTriangle className="mt-0.5 shrink-0" />
              <p>
                Эхлээд Excel/PDF тайлангаа татаж аваад дараа нь дууссан эсвэл
                цуцлагдсан захиалгыг цэвэрлэнэ.
              </p>
            </div>
          </div>

          {storage && (
            <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <FiDatabase className="text-[#0b5a35]" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Database Storage
                  </h2>
                  <p className="text-sm text-slate-500">
                    MongoDB болон uploads folder-ийн хэмжээ
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Storage Size</p>
                  <h3 className="mt-2 text-xl font-bold text-[#0b5a35]">
                    {storage.database?.storageSize?.formatted || "0 B"}
                  </h3>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Data Size</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {storage.database?.dataSize?.formatted || "0 B"}
                  </h3>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Index Size</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {storage.database?.indexSize?.formatted || "0 B"}
                  </h3>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Uploads</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {storage.uploads?.size?.formatted || "0 B"}
                  </h3>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Total Used</p>

                <h3 className="mt-1 text-2xl font-bold text-[#0b5a35]">
                  {storage.totalUsed?.formatted || "0 B"} /{" "}
                  {storage.limit?.maxStorage?.formatted || "512 MB"}
                </h3>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#0b5a35]"
                    style={{
                      width: `${Math.min(storage.limit?.usedPercent || 0, 100)}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Ашигласан: {storage.limit?.usedPercent || 0}% · Database:{" "}
                  {storage.database?.name || "-"} · Collections:{" "}
                  {storage.collections?.length || 0}
                </p>
              </div>
            </div>
          )}

          <div className="mb-8 grid gap-5 md:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Нийт орлого</p>
              <h2 className="mt-3 text-2xl font-bold text-[#0b5a35]">
                ₮{totalRevenue.toLocaleString()}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Зөвхөн дууссан захиалга
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Нийт захиалга</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                {orders.length}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Хүргэлт {deliveryOrders.length} · Очиж авах {pickupOrders.length}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Дууссан</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                {completedOrders.length}
              </h2>
              <p className="mt-2 text-xs text-slate-400">Орлогод тооцогдоно</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Цуцлагдсан</p>
              <h2 className="mt-3 text-2xl font-bold text-red-600">
                {cancelledOrders.length}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                ₮{cancelledValue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <FiDatabase className="text-[#0b5a35]" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Захиалгын жагсаалт
                </h2>
                <p className="text-sm text-slate-500">
                  Тайланд бүх захиалгын төлөв багтана
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">№</th>
                    <th className="px-4 py-3">Хэрэглэгч</th>
                    <th className="px-4 py-3">Төрөл</th>
                    <th className="px-4 py-3">Төлөв</th>
                    <th className="px-4 py-3">Огноо</th>
                    <th className="px-4 py-3">Нийт</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-4 py-3 font-semibold">
                        {order.orderNumber || order._id}
                      </td>
                      <td className="px-4 py-3">{order.customerName || "-"}</td>
                      <td className="px-4 py-3">
                        {typeLabels[order.orderType] || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {statusLabels[order.status] || order.status}
                      </td>
                      <td className="px-4 py-3">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        ₮{Number(order.totalPrice || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center">
                        Захиалга олдсонгүй
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Шилдэг борлуулалттай бүтээгдэхүүн
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Дууссан захиалгууд дээр үндэслэв
            </p>

            <div className="mt-5 space-y-3">
              {topProducts.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Борлуулалтын мэдээлэл алга.
                </p>
              ) : (
                topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        #{index + 1} {product.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {product.units} ширхэг
                      </p>
                    </div>

                    <p className="font-bold text-[#0b5a35]">
                      ₮{product.revenue.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {deleteType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {selectedDeleteLabel} захиалга устгах
              </h2>

              <button
                onClick={() => setDeleteType(null)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <FiX />
              </button>
            </div>

            <p className="text-sm text-slate-600">
              Энэ үйлдэл зөвхөн {selectedDeleteLabel} захиалгад нөлөөлнө.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Устгах захиалга</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                {selectedDeleteOrders.length}
              </h3>

              <p className="mt-4 text-sm text-slate-500">Нийт үнийн дүн</p>
              <h3 className="mt-1 text-xl font-bold text-red-600">
                ₮{totalDeleteValue.toLocaleString()}
              </h3>
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
                className="flex-1 rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Устгах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;