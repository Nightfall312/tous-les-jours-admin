import { useState } from "react";
import { FiX, FiUpload } from "react-icons/fi";
import api from "../../api/axios";

const ProductModal = ({ product, categories, onClose, onSaved }) => {
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name || "",
    category: product?.category?._id || product?.category || "",
    productType: product?.productType || "main",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    isFeatured: product?.isFeatured || false,
    isAvailable: product?.isAvailable ?? true,
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      images.forEach((image) => {
        formData.append("images", image);
      });

      if (isEdit) {
        await api.put(`/products/${product._id}`, formData);
      } else {
        await api.post("/products", formData);
      }

      onSaved();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Бүтээгдэхүүн хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold">
              {isEdit ? "Бүтээгдэхүүн засах" : "Бүтээгдэхүүн нэмэх"}
            </h2>
            <p className="text-sm text-slate-500">
              Бүтээгдэхүүний мэдээллийг бөглөнө үү
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <FiX size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Бүтээгдэхүүний нэр
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
              placeholder="Жишээ: Strawberry Fresh Cream Cake"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Ангилал
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
              >
                <option value="">Ангилал сонгох</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Бүтээгдэхүүний төрөл
              </label>
              <select
                name="productType"
                value={form.productType}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
              >
                <option value="main">Үндсэн бүтээгдэхүүн</option>
                <option value="addon">Нэмэлт бүтээгдэхүүн / Ундаа</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Тайлбар</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
              placeholder="Бүтээгдэхүүний дэлгэрэнгүй мэдээлэл"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">Үнэ</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
                placeholder="85000"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Үлдэгдэл
              </label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0b5a35]"
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Зураг</label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center hover:border-[#0b5a35] hover:bg-green-50">
              <FiUpload className="mb-3 text-[#0b5a35]" size={32} />
              <p className="font-semibold">Зураг оруулах</p>
              <p className="mt-1 text-sm text-slate-500">
                PNG, JPG, WEBP — хамгийн ихдээ 5 зураг
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
                className="hidden"
              />
            </label>

            {previews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {previews.map((preview) => (
                  <img
                    key={preview}
                    src={preview}
                    alt="preview"
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-8">
            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="h-4 w-4"
              />
              Онцлох бүтээгдэхүүн
            </label>

            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleChange}
                className="h-4 w-4"
              />
              Идэвхтэй
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
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
  );
};

export default ProductModal;