import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import api, { SERVER_URL } from "../../api/axios";
import ProductModal from "../../components/products/ProductModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        product.category?._id === categoryFilter ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleToggleAvailable = async (product) => {
    try {
      await api.put(`/products/${product._id}`, {
        isAvailable: !product.isAvailable,
      });

      fetchData();
    } catch (error) {
      console.error("Failed to update product status:", error);
      alert("Бүтээгдэхүүний төлөв солиход алдаа гарлаа");
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await api.put(`/products/${product._id}`, {
        isFeatured: !product.isFeatured,
      });

      fetchData();
    } catch (error) {
      console.error("Failed to update featured status:", error);
      alert("Онцлох төлөв солиход алдаа гарлаа");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Бүтээгдэхүүн устгахад алдаа гарлаа");
    }
  };

  const getStockLabel = (stock) => {
    if (stock <= 0) return "Дууссан";
    if (stock <= 5) return "Цөөн үлдсэн";
    return "Байгаа";
  };

  const getStockClass = (stock) => {
    if (stock <= 0) return "bg-red-100 text-red-700";
    if (stock <= 5) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Бүтээгдэхүүн</h1>
          <p className="mt-2 text-slate-500">
            Бялуу, нэмэлт бүтээгдэхүүн болон ундааны жагсаалт
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#0b5a35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#09492b]"
        >
          <FiPlus />
          Бүтээгдэхүүн нэмэх
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Бүтээгдэхүүн хайх..."
            className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#0b5a35]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0b5a35]"
        >
          <option value="all">Бүх ангилал</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Зураг</th>
                <th className="px-6 py-4">Нэр</th>
                <th className="px-6 py-4">Ангилал</th>
                <th className="px-6 py-4">Төрөл</th>
                <th className="px-6 py-4">Үнэ</th>
                <th className="px-6 py-4">Үлдэгдэл</th>
                <th className="px-6 py-4">Төлөв</th>
                <th className="px-6 py-4">Онцлох</th>
                <th className="px-6 py-4">Үйлдэл</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-10 text-center">
                    Ачааллаж байна...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-10 text-center">
                    Бүтээгдэхүүн олдсонгүй
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      {product.images?.[0] ? (
                        <img
                          src={`${SERVER_URL}${product.images[0]}`}
                          alt={product.name}
                          className="h-14 w-14 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-slate-100" />
                      )}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {product.name}
                    </td>

                    <td className="px-6 py-4">
                      {product.category?.name || "Ангилалгүй"}
                    </td>

                    <td className="px-6 py-4">
                      {product.productType === "main" ? "Үндсэн" : "Нэмэлт"}
                    </td>

                    <td className="px-6 py-4">
                      ₮{Number(product.price).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStockClass(
                          product.stock
                        )}`}
                      >
                        {product.stock} · {getStockLabel(product.stock)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleAvailable(product)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.isAvailable ? "Идэвхтэй" : "Идэвхгүй"}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.isFeatured
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {product.isFeatured ? "Онцлох" : "Энгийн"}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="mr-3 font-semibold text-[#0b5a35]"
                      >
                        Засах
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="font-semibold text-red-600"
                      >
                        Устгах
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default Products;