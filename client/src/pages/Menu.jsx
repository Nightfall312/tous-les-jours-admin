import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import api from "../api/axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_URL = API_URL.replace("/api", "");

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [search, setSearch] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMenuData();
        updateCartCount();
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

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
    };

    const getImageUrl = (product) => {
        if (!product.images || product.images.length === 0) {
            return "https://placehold.co/500x400?text=Tous+Les+Jours";
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

            return matchesCategory && matchesSearch && product.productType === "main";
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

        updateCartCount();

        // Tell the Navbar that the cart has changed
        window.dispatchEvent(new Event("cartUpdated"));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[white] px-4 py-20 text-center">
                <p className="text-lg font-medium text-slate-600">
                    Меню ачааллаж байна...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[white]">
            

            <section className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-8 rounded-3xl bg-[#0b5a35] p-8 text-white">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-100">
                        Order Online
                    </p>
                    <h2 className="mt-3 text-4xl font-black md:text-5xl">
                        Fresh bread, cake & desserts
                    </h2>
                    <p className="mt-3 max-w-2xl text-green-50">
                        Өнөөдрийн шинэхэн бүтээгдэхүүнээс сонгоод хүргэлтээр захиалаарай.
                    </p>
                </div>

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Бүтээгдэхүүн хайх..."
                            className="w-full rounded-2xl border border-[#e6dccb] bg-white py-3 pl-11 pr-4 outline-none focus:border-[#0b5a35]"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`whitespace-nowrap rounded-full px-5 py-3 font-semibold ${selectedCategory === "all"
                                    ? "bg-[#0b5a35] text-white"
                                    : "bg-white text-slate-700"
                                }`}
                        >
                            Бүгд
                        </button>

                        {categories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => setSelectedCategory(category._id)}
                                className={`whitespace-nowrap rounded-full px-5 py-3 font-semibold ${selectedCategory === category._id
                                        ? "bg-[#0b5a35] text-white"
                                        : "bg-white text-slate-700"
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="rounded-3xl bg-white p-10 text-center">
                        <p className="text-slate-500">Бүтээгдэхүүн олдсонгүй.</p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => {
                            const unavailable = !product.isAvailable || product.stock <= 0;

                            return (
                                <div
                                    key={product._id}
                                    className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <Link to={`/menu/${product._id}`}>
                                        <div className="relative h-52 overflow-hidden bg-slate-100">
                                            <img
                                                src={getImageUrl(product)}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />

                                            {unavailable && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                    <span className="rounded-full bg-white px-4 py-2 font-bold text-red-600">
                                                        Дууссан
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <div className="p-5">
                                        <p className="text-sm font-medium text-[#0b5a35]">
                                            {product.category?.name || "Бүтээгдэхүүн"}
                                        </p>

                                        <Link to={`/menu/${product._id}`}>
                                            <h3 className="mt-1 line-clamp-2 text-lg font-bold text-slate-800 hover:text-[#0b5a35]">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <p className="mt-2 line-clamp-2 min-h-[48px] text-sm text-slate-500">
                                            {product.description || "Шинэхэн бэйкэри бүтээгдэхүүн"}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between">
                                            <p className="text-xl font-black text-slate-900">
                                                {Number(product.price).toLocaleString()}₮
                                            </p>

                                            <button
                                                onClick={() => addToCart(product)}
                                                disabled={unavailable}
                                                className="rounded-full bg-[#0b5a35] px-4 py-2 text-sm font-bold text-white hover:bg-[#084728] disabled:cursor-not-allowed disabled:bg-slate-300"
                                            >
                                                Сагслах
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Menu;