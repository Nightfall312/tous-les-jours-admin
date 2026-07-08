import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import api from "../api/axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_URL = API_URL.replace("/api", "");

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error(err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = () => {
    if (!product?.images?.length) {
      return "https://placehold.co/700x600?text=Tous+Les+Jours";
    }

    return `${SERVER_URL}${product.images[0]}`;
  };

  const addToCart = () => {
    if (!product.isAvailable || product.stock <= 0) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((i) => i._id === product._id);

    let updated;

    if (existing) {
      updated = cart.map((i) =>
        i._id === product._id
          ? { ...i, quantity: i.quantity + quantity }
          : i
      );
    } else {
      updated = [
        ...cart,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: imageUrl(),
          quantity,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">

        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-[#0B5A35]"
        >
          <FiArrowLeft />
          Буцах
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">

          <div className="overflow-hidden rounded-3xl border border-gray-200">
            <img
              src={imageUrl()}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div>

            <p className="text-sm font-semibold text-[#0B5A35]">
              {product.category?.name}
            </p>

            <h1 className="mt-2 text-5xl font-black">
              {product.name}
            </h1>

            <p className="mt-6 text-gray-600 leading-8">
              {product.description}
            </p>

            <h2 className="mt-8 text-4xl font-black">
              {Number(product.price).toLocaleString()}₮
            </h2>

            <div className="mt-8 flex items-center gap-4">

              <button
                onClick={() =>
                  quantity > 1 && setQuantity(quantity - 1)
                }
                className="rounded-xl border p-3"
              >
                <FiMinus />
              </button>

              <span className="w-10 text-center text-xl font-bold">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-xl border p-3"
              >
                <FiPlus />
              </button>

            </div>

            <button
              onClick={addToCart}
              className="mt-10 flex items-center gap-3 rounded-2xl bg-[#0B5A35] px-8 py-4 text-lg font-semibold text-white hover:bg-[#084728]"
            >
              <FiShoppingCart />
              Сагсанд хийх
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;