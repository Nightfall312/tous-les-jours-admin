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
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Бүтээгдэхүүн</h1>
          <p className="mt-1 text-sm text-slate-500">
            Бялуу, нэмэлт бүтээгдэхүүн болон ундааны жагсаалт
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#0b5a35] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#09492b]"
        >
          <FiPlus />
          Бүтээгдэхүүн нэмэх
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Зураг</th>
              <th className="px-6 py-4">Нэр</th>
              <th className="px-6 py-4">Ангилал</th>
              <th className="px-6 py-4">Төрөл</th>
              <th className="px-6 py-4">Үнэ</th>
              <th className="px-6 py-4">Үлдэгдэл</th>
              <th className="px-6 py-4">Төлөв</th>
              <th className="px-6 py-4 text-right">Үйлдэл</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-10 text-center text-slate-500">
                  Ачааллаж байна...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-10 text-center text-slate-500">
                  Бүтээгдэхүүн олдсонгүй
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="border-t border-slate-100">
                  <td className="px-6 py-5">
                    {product.images?.[0] ? (
                      <img
                        src={`${SERVER_URL}${product.images[0]}`}
                        alt={product.name}
                        className="h-14 w-14 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-50 text-[#0b5a35]">
                        🍰
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-5 font-semibold">{product.name}</td>

                  <td className="px-6 py-5 text-slate-600">
                    {product.category?.name || "Ангилалгүй"}
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {product.productType === "main" ? "Үндсэн" : "Нэмэлт"}
                    </span>
                  </td>

                  <td className="px-6 py-5 font-semibold">
                    ₮{Number(product.price).toLocaleString()}
                  </td>

                  <td className="px-6 py-5">{product.stock}</td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.isAvailable ? "Идэвхтэй" : "Идэвхгүй"}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
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