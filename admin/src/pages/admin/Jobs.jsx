import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import api from "../../api/axios";

const emptyForm = {
  title: "",
  department: "",
  location: "Улаанбаатар",
  employmentType: "full-time",
  salary: "",
  description: "",
  requirements: "",
  benefits: "",
  isActive: true,
};

const typeLabels = {
  "full-time": "Бүтэн цаг",
  "part-time": "Хагас цаг",
  intern: "Дадлага",
  temporary: "Түр",
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingJob, setEditingJob] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchJobs = async () => {
    const res = await api.get("/jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreate = () => {
    setEditingJob(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title || "",
      department: job.department || "",
      location: job.location || "Улаанбаатар",
      employmentType: job.employmentType || "full-time",
      salary: job.salary || "",
      description: job.description || "",
      requirements: job.requirements || "",
      benefits: job.benefits || "",
      isActive: job.isActive,
    });
    setIsOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingJob) {
      await api.put(`/jobs/${editingJob._id}`, form);
    } else {
      await api.post("/jobs", form);
    }

    setIsOpen(false);
    fetchJobs();
  };

  const toggleActive = async (job) => {
    await api.put(`/jobs/${job._id}`, { isActive: !job.isActive });
    fetchJobs();
  };

  const deleteJob = async (id) => {
    const ok = window.confirm("Энэ ажлын байрыг устгах уу?");
    if (!ok) return;

    await api.delete(`/jobs/${id}`);
    fetchJobs();
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ажлын байр</h1>
          <p className="mt-2 text-slate-500">
            Вэбсайт дээр харагдах ажлын зарууд
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#0b5a35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#09492b]"
        >
          <FiPlus />
          Ажлын байр нэмэх
        </button>
      </div>

      <div className="space-y-5">
        {jobs.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            Ажлын байр олдсонгүй
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {job.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {job.department || "Хэлтэсгүй"} · {job.location} ·{" "}
                    {typeLabels[job.employmentType]}
                  </p>
                  {job.salary && (
                    <p className="mt-2 text-sm font-semibold text-[#0b5a35]">
                      {job.salary}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => toggleActive(job)}
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    job.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                </button>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm text-slate-600">
                {job.description}
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => openEdit(job)}
                  className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Засах
                </button>

                <button
                  onClick={() => deleteJob(job._id)}
                  className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  <FiTrash2 />
                  Устгах
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSubmit}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingJob ? "Ажлын байр засах" : "Ажлын байр нэмэх"}
              </h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <FiX />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Албан тушаал"
                required
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
              />

              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Хэлтэс"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
              />

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Байршил"
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
              />

              <select
                name="employmentType"
                value={form.employmentType}
                onChange={handleChange}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
              >
                <option value="full-time">Бүтэн цаг</option>
                <option value="part-time">Хагас цаг</option>
                <option value="intern">Дадлага</option>
                <option value="temporary">Түр</option>
              </select>

              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="Цалин"
                className="md:col-span-2 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
              />
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ажлын тайлбар"
              required
              rows="4"
              className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />

            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              placeholder="Шаардлага"
              rows="4"
              className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />

            <textarea
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              placeholder="Давуу тал / хангамж"
              rows="4"
              className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />

            <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Идэвхтэй харагдуулах
            </label>

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-[#0b5a35] px-5 py-3 font-semibold text-white hover:bg-[#09492b]"
            >
              Хадгалах
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Jobs;