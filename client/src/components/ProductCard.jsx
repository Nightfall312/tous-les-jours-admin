import { Link } from "react-router-dom";

const ProductCard = ({ product, imageUrl, onAddToCart }) => {
  const unavailable = !product.isAvailable || product.stock <= 0;

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <Link to={`/menu/${product._id}`}>

        <div className="relative overflow-hidden bg-gray-50">

          {product.isFeatured && (
            <span className="absolute left-4 top-4 z-20 rounded-full bg-[#0B5A35] px-3 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}

          {unavailable && (
            <span className="absolute right-4 top-4 z-20 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
              Дууссан
            </span>
          )}

          <img
            src={imageUrl}
            alt={product.name}
            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

      </Link>

      <div className="space-y-4 p-6">

        <div>

          <h3 className="text-xl font-bold text-gray-800 transition group-hover:text-[#0B5A35]">
            {product.name}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {product.category?.name}
          </p>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-2xl font-black text-[#0B5A35]">
            {Number(product.price).toLocaleString()}₮
          </span>

          <button
            disabled={unavailable}
            onClick={() => onAddToCart(product)}
            className="rounded-xl bg-[#0B5A35] px-5 py-3 font-semibold text-white transition hover:bg-[#084728] disabled:bg-gray-300"
          >
            Сагслах
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;