import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Footer = () => {
  const [settings, setSettings] = useState({
    bakeryName: "Tous Les Jours",
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
    <footer className="border-t border-[#e6dccb] bg-[#0b5a35] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <h2 className="text-2xl font-black">{settings.bakeryName}</h2>
          <p className="mt-2 text-sm text-green-100">
            Шинэхэн бэйкэри бүтээгдэхүүн хүргэлтээр.
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

      <div className="border-t border-white/10 py-4 text-center text-sm text-green-100">
        © {new Date().getFullYear()} {settings.bakeryName}. Бүх эрх хуулиар
        хамгаалагдсан.
      </div>
    </footer>
  );
};

export default Footer;