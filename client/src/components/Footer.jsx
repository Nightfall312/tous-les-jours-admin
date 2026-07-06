import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import logoWhite from "../assets/logo-white.png";

const Footer = () => {
  const [settings, setSettings] = useState({
    bakeryName: "Аркилект Трэйд ХХК",
    businessPhone: "",
    openingHours: "07:00",
    closingHours: "20:00",
    facebook: "",
    instagram: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        setSettings((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error(err);
      }
    };

    loadSettings();
  }, []);

  return (
    <footer className="bg-[#0B5A35] text-white">

      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10 px-6 pt-10 pb-6">

        {/* Logo */}
        <div>
          <img
            src={logoWhite}
            alt="Tous Les Jours"
            className="w-56 h-auto object-contain"
          />

          <p className="mt-5 max-w-xs text-sm leading-6 text-green-100">
            Шинэхэн бэйкэри бүтээгдэхүүнийг хүргэлтээр захиалаарай.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-bold">Цэс</h3>
          <div className="flex flex-col gap-2 text-sm text-green-100">
            <Link to="/">Меню</Link>
            <Link to="/careers">Ажлын байр</Link>
            <Link to="/contact">Холбоо барих</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-bold">Ажиллах цаг</h3>
          <p className="text-sm text-green-100">
            {settings.openingHours} - {settings.closingHours}
          </p>

          <h3 className="mb-3 mt-5 font-bold">Утас</h3>
          <p className="text-sm text-green-100">
            {settings.businessPhone || "Утасны дугаар оруулаагүй"}
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-bold">Сошиал</h3>
          <div className="flex flex-col gap-2 text-sm text-green-100">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-5 pb-3 text-center text-sm text-green-100">
        © {new Date().getFullYear()} {settings.bakeryName}. Бүх эрх хуулиар
        хамгаалагдсан.
      </div>
    </footer>
  );
};

export default Footer;