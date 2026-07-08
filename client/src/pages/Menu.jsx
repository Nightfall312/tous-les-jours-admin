import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_URL = API_URL.replace("/api", "");

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
      ]);

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      console.error(err);
      alert("Меню ачаалахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (product) => {
    if (!product.images || product.images.length === 0) {
      return "https://placehold.co/600x500?text=Tous+Les+Jours";
    }

    return `${SERVER_URL}${product.images[0]}`;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category?._id === selectedCategory ||
        product.category === selectedCategory;

      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  const addToCart = (product) => {
    if (!product.isAvailable || product.stock <= 0) {
      alert("Энэ бүтээгдэхүүн одоогоор дууссан байна.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item) => item._id === product._id);

    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: getImageUrl(product),
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600">
          Меню ачааллаж байна...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-[1500px] px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#0B5A35]">
            Өнөөдрийн шинэхэн бүтээгдэхүүн
          </h1>

          <p className="mt-2 text-gray-500">
            Шинэхэн талх, бялуу болон амттангаа хүргэлтээр захиалаарай.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">

          {/* Sidebar */}
          <aside className="sticky top-24 h-fit">
            <CategorySidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </aside>

          {/* Products */}
          <div>

            {/* Search */}
            <div className="relative mb-8">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Бүтээгдэхүүн хайх..."
                className="h-14 w-full rounded-2xl border border-gray-200 bg-white pl-14 pr-5 text-lg outline-none transition focus:border-[#0B5A35] focus:ring-2 focus:ring-[#0B5A35]/20"
              />
            </div>

            {/* Title */}
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Бүтээгдэхүүн
              </h2>

              <span className="rounded-full bg-[#0B5A35]/10 px-4 py-2 text-sm font-semibold text-[#0B5A35]">
                {filteredProducts.length} бүтээгдэхүүн
              </span>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-16 text-center">
                <h3 className="text-2xl font-bold text-gray-700">
                  Бүтээгдэхүүн олдсонгүй
                </h3>

                <p className="mt-3 text-gray-500">
                  Өөр ангилал сонгох эсвэл хайлтын үгээ өөрчилж үзнэ үү.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    imageUrl={getImageUrl(product)}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu;