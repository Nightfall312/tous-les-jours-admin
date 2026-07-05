import { useEffect, useMemo, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import api from "../../api/axios";

const statusLabels = {
  new: "Шинэ",
  reviewed: "Шалгасан",
  contacted: "Холбогдсон",
  rejected: "Татгалзсан",
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/careers");
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to load applications:", error);
      alert("Анкет ачааллахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    if (statusFilter === "all") return applications;
    return applications.filter((app) => app.status === statusFilter);
  }, [applications, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/careers/${id}`, { status });
      fetchApplications();
    } catch (error) {
      console.error("Failed to update application:", error);
      alert("Анкетын төлөв өөрчлөхөд алдаа гарлаа");
    }
  };

  const deleteApplication = async (id) => {
    const ok = window.confirm("Энэ анкетыг устгах уу?");
    if (!ok) return;

    try {
      await api.delete(`/careers/${id}`);
      fetchApplications();
    } catch (error) {
      console.error("Failed to delete application:", error);
      alert("Анкет устгахад алдаа гарлаа");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Ажлын анкет</h1>
        <p className="mt-2 text-slate-500">
          Вэбсайтаар ирсэн ажилд орох хүсэлтүүд
        </p>
      </div>

      <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
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
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          Ачааллаж байна...
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          Анкет олдсонгүй
        </div>
      ) : (
        <div className="space-y-5">
          {filteredApplications.map((app) => (
            <div key={app._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {app.fullName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(app.createdAt).toLocaleString()}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-semibold text-[#0b5a35]">
                  {statusLabels[app.status] || app.status}
                </span>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Утас</h3>
                  <p className="mt-2 text-sm text-slate-600">{app.phone}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">Имэйл</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {app.email || "-"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Сонирхож буй албан тушаал
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {app.position}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="text-sm font-bold text-slate-800">
                    Туршлага
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                    {app.experience || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="text-sm font-bold text-slate-800">
                    Нэмэлт мэдээлэл
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                    {app.message || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0b5a35]"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => deleteApplication(app._id)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  <FiTrash2 />
                  Устгах
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;