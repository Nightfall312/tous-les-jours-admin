import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import api from "../../api/axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [categoriesRes, productsRes] = await Promise.all([
        api.get("/categories"),
        api.get("/products"),
      ]);

      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const getProductCount = (categoryId) => {
    return products.filter((product) => {
      const productCategoryId = product.category?._id || product.category;
      return productCategoryId === categoryId;
    }).length;
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name || "",
      description: category.description || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setForm({ name: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, form);
      } else {
        await api.post("/categories", form);
      }

      closeModal();
      fetchData();
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Ангилал хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const productCount = getProductCount(category._id);

    if (productCount > 0) {
      alert("Энэ ангилалд бүтээгдэхүүн байгаа тул устгах боломжгүй.");
      return;
    }

    const confirmDelete = window.confirm(
      "Энэ ангиллыг устгахдаа итгэлтэй байна уу?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/categories/${category._id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Ангилал устгахад алдаа гарлаа");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Ангилал</h1>
          <p className="mt-1 text-sm text-slate-500">
            Бүтээгдэхүүний ангиллыг зохион байгуулах
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#0b5a35] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#09492b]"
        >
          <FiPlus />
          Ангилал нэмэх
        </button>
      </div>

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ангилал хайх..."
            className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#0b5a35]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Ангилал</th>
              <th className="px-6 py-4">Тайлбар</th>
              <th className="px-6 py-4">Бүтээгдэхүүн</th>
              <th className="px-6 py-4">Төлөв</th>
              <th className="px-6 py-4 text-right">Үйлдэл</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                  Ачааллаж байна...
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                  Ангилал олдсонгүй
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category._id} className="border-t border-slate-100">
                  <td className="px-6 py-5 font-semibold">{category.name}</td>

                  <td className="px-6 py-5 text-slate-600">
                    {category.description || "-"}
                  </td>

                  <td className="px-6 py-5">
                    {getProductCount(category._id)}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {category.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => openEditModal(category)}
                      className="mr-4 text-slate-500 hover:text-[#0b5a35]"
                    >
                      <FiEdit2 size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(category)}
                      className="text-slate-500 hover:text-red-600"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-2xl font-bold">
                  {editingCategory ? "Ангилал засах" : "Шинэ ангилал"}
                </h2>
                <p className="text-sm text-slate-500">
                  Ангиллын мэдээллийг бөглөнө үү
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Ангиллын нэр
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  placeholder="Жишээ: Бялуу"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Тайлбар
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows="4"
                  placeholder="Ангиллын тайлбар"
                  className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold"
                >
                  Болих
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-[#0b5a35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#09492b] disabled:opacity-60"
                >
                  {saving ? "Хадгалж байна..." : "Хадгалах"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;