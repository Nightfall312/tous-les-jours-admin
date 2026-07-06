import { useEffect, useState } from "react";
import api from "../../api/axios";

const subtractOneHour = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  const newHour = (hour - 1 + 24) % 24;
  return `${String(newHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const SaveButton = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="rounded-xl bg-[#0b5a35] px-5 py-3 font-semibold text-white hover:bg-[#084728] disabled:opacity-60"
  >
    {loading ? "Хадгалж байна..." : "Өөрчлөлт хадгалах"}
  </button>
);

const TimeSpinner = ({ label, value, onChange }) => {
  const [hour, minute] = value.split(":").map(Number);

  const formatTime = (newHour, newMinute) => {
    const h = String((newHour + 24) % 24).padStart(2, "0");
    const m = String((newMinute + 60) % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const changeHour = (amount) => {
    onChange(formatTime(hour + amount, minute));
  };

  const changeMinute = (amount) => {
    let newMinute = minute + amount;
    let newHour = hour;

    if (newMinute >= 60) {
      newMinute = 0;
      newHour += 1;
    }

    if (newMinute < 0) {
      newMinute = 45;
      newHour -= 1;
    }

    onChange(formatTime(newHour, newMinute));
  };

  return (
    <div>
      <p className="mb-2 font-medium text-slate-700">{label}</p>

      <div className="flex w-fit items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex flex-col items-center">
          <button
            onClick={() => changeHour(1)}
            className="text-2xl font-bold text-slate-700 hover:text-[#0b5a35]"
          >
            ˄
          </button>

          <span className="text-3xl font-bold text-slate-800">
            {String(hour).padStart(2, "0")}
          </span>

          <button
            onClick={() => changeHour(-1)}
            className="text-2xl font-bold text-slate-700 hover:text-[#0b5a35]"
          >
            ˅
          </button>
        </div>

        <span className="text-3xl font-bold text-slate-800">:</span>

        <div className="flex flex-col items-center">
          <button
            onClick={() => changeMinute(15)}
            className="text-2xl font-bold text-slate-700 hover:text-[#0b5a35]"
          >
            ˄
          </button>

          <span className="text-3xl font-bold text-slate-800">
            {String(minute).padStart(2, "0")}
          </span>

          <button
            onClick={() => changeMinute(-15)}
            className="text-2xl font-bold text-slate-700 hover:text-[#0b5a35]"
          >
            ˅
          </button>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const [settings, setSettings] = useState({
    bakeryName: "Tous Les Jours",
    businessPhone: "+976 9911 2233",
    openingHours: "07:00",
    closingHours: "20:00",
    deliveryFee: 4500,
    enableDelivery: true,
    deliveryStartTime: "09:00",
    deliveryEndTime: "20:00",
    deliveryDuration: 40,
    cookTime: 20,
    facebook: "facebook.com/touslesjours",
    instagram: "@touslesjours",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await api.get("/settings");

      setSettings((prev) => ({
        ...prev,
        ...data,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error(err);
      alert("Тохиргоо ачаалахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { data } = await api.put("/settings", {
        bakeryName: settings.bakeryName,
        businessPhone: settings.businessPhone,
        openingHours: settings.openingHours,
        closingHours: settings.closingHours,
        deliveryFee: Number(settings.deliveryFee),
        enableDelivery: settings.enableDelivery,
        deliveryStartTime: settings.deliveryStartTime,
        deliveryEndTime: settings.deliveryEndTime,
        deliveryDuration: Number(settings.deliveryDuration),
        cookTime: Number(settings.cookTime),
        facebook: settings.facebook,
        instagram: settings.instagram,
      });

      setSettings((prev) => ({
        ...prev,
        ...data,
      }));

      alert("Тохиргоо database-д хадгалагдлаа.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Тохиргоо хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = () => {
    if (
      !settings.currentPassword ||
      !settings.newPassword ||
      !settings.confirmPassword
    ) {
      alert("Бүх нууц үгийн талбарыг бөглөнө үү.");
      return;
    }

    if (settings.newPassword !== settings.confirmPassword) {
      alert("Шинэ нууц үг таарахгүй байна.");
      return;
    }

    alert("Нууц үг солих backend-ийг дараа холбоно.");
  };

  if (loading) {
    return <p className="text-slate-600">Тохиргоо ачааллаж байна...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Тохиргоо</h1>
        <p className="mt-1 text-slate-500">
          Бизнесийн мэдээлэл, хүргэлт болон админ тохиргоо
        </p>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-slate-800">
          Бэйкэригийн мэдээлэл
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Бэйкэригийн нэр
            </label>
            <input
              value={settings.bakeryName}
              onChange={(e) => handleChange("bakeryName", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Утасны дугаар
            </label>
            <input
              value={settings.businessPhone}
              onChange={(e) => handleChange("businessPhone", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>
        </div>

        <h2 className="mb-5 mt-8 text-xl font-bold text-slate-800">
          Ажиллах цаг
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <TimeSpinner
            label="Нээх цаг"
            value={settings.openingHours}
            onChange={(value) => handleChange("openingHours", value)}
          />

          <TimeSpinner
            label="Хаах цаг"
            value={settings.closingHours}
            onChange={(value) => handleChange("closingHours", value)}
          />
        </div>

        <div className="mt-6">
          <SaveButton onClick={handleSave} loading={saving} />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-slate-800">
          Хүргэлтийн тохиргоо
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Хүргэлтийн төлбөр
            </label>
            <input
              type="number"
              value={settings.deliveryFee}
              onChange={(e) => handleChange("deliveryFee", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Хүргэлт идэвхтэй эсэх
            </label>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleChange("enableDelivery", !settings.enableDelivery)
                }
                className={`h-7 w-12 rounded-full p-1 transition ${
                  settings.enableDelivery ? "bg-[#0b5a35]" : "bg-slate-300"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white transition ${
                    settings.enableDelivery ? "translate-x-5" : ""
                  }`}
                />
              </button>

              <span className="text-slate-600">
                Хэрэглэгч зөвхөн хүргэлтээр захиалга өгнө
              </span>
            </div>
          </div>
        </div>

        <h2 className="mb-5 mt-8 text-xl font-bold text-slate-800">
          Хүргэлт ба гал тогооны цаг
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <TimeSpinner
            label="Хүргэлт эхлэх цаг"
            value={settings.deliveryStartTime}
            onChange={(value) => handleChange("deliveryStartTime", value)}
          />

          <TimeSpinner
            label="Хүргэлт дуусах цаг"
            value={settings.deliveryEndTime}
            onChange={(value) => handleChange("deliveryEndTime", value)}
          />
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">
            Захиалга авах сүүлийн цаг
          </p>
          <p className="mt-1 text-2xl font-bold text-[#0b5a35]">
            {subtractOneHour(settings.deliveryEndTime)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Хүргэлт дуусах цагаас автоматаар 1 цагийн өмнө тооцогдоно.
          </p>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Хүргэлтийн ойролцоо хугацаа /мин/
            </label>
            <input
              type="number"
              value={settings.deliveryDuration}
              onChange={(e) =>
                handleChange("deliveryDuration", e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Бэлтгэх / савлах хугацаа /мин/
            </label>
            <input
              type="number"
              value={settings.cookTime}
              onChange={(e) => handleChange("cookTime", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>
        </div>

        <p className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-[#0b5a35]">
          Хэрэглэгч {settings.deliveryStartTime} - {settings.deliveryEndTime}{" "}
          цагийн хооронд хүргэлтийн цаг сонгоно. Захиалгыг хамгийн орой{" "}
          {subtractOneHour(settings.deliveryEndTime)} хүртэл авна. Гал тогоо
          ойролцоогоор {settings.cookTime} минут бэлтгэх шаардлагатай.
        </p>

        <div className="mt-6">
          <SaveButton onClick={handleSave} loading={saving} />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-slate-800">
          Сошиал холбоос
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Facebook
            </label>
            <input
              value={settings.facebook}
              onChange={(e) => handleChange("facebook", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Instagram
            </label>
            <input
              value={settings.instagram}
              onChange={(e) => handleChange("instagram", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>
        </div>

        <div className="mt-6">
          <SaveButton onClick={handleSave} loading={saving} />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-slate-800">
          Нууц үг солих
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Одоогийн нууц үг
            </label>
            <input
              type="password"
              value={settings.currentPassword}
              onChange={(e) =>
                handleChange("currentPassword", e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Шинэ нууц үг
            </label>
            <input
              type="password"
              value={settings.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Шинэ нууц үг давтах
            </label>
            <input
              type="password"
              value={settings.confirmPassword}
              onChange={(e) =>
                handleChange("confirmPassword", e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>
        </div>

        <button
          onClick={handlePasswordChange}
          className="mt-6 rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white hover:bg-slate-900"
        >
          Нууц үг солих
        </button>
      </section>
    </div>
  );
};

export default Settings;