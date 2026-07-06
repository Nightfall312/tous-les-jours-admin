import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const linkClass = ({ isActive }) =>
    `font-semibold transition ${
      isActive ? "text-[#0b5a35]" : "text-slate-600 hover:text-[#0b5a35]"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#e6dccb] bg-[#f8f3ea]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="leading-tight">
          <h1 className="text-2xl font-black text-[#0b5a35]">
            Tous Les Jours
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Fresh bakery order
          </p>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass}>
            Меню
          </NavLink>

          <NavLink to="/careers" className={linkClass}>
            Ажлын байр
          </NavLink>

          <NavLink to="/contact" className={linkClass}>
            Холбоо барих
          </NavLink>
        </nav>

        <Link
          to="/cart"
          className="relative rounded-full bg-[#0b5a35] px-5 py-3 font-semibold text-white hover:bg-[#084728]"
        >
          <FiShoppingCart className="inline text-xl" />

          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Navbar;