import { useState } from "react";

const subtractOneHour = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  const newHour = (hour - 1 + 24) % 24;

  return `${String(newHour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}`;
};

const SaveButton = ({ onClick }) => (
  <div className="mt-6 flex justify-end">
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl bg-[#0b5a35] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#09492b]"
    >
      Өөрчлөлт хадгалах
    </button>
  </div>
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
      <label className="mb-2 block text-sm font-medium text-slate-600">
        {label}
      </label>

      <div className="rounded-2xl border border-slate-300 bg-white px-5 py-4 shadow-sm">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <button
            type="button"
            onClick={() => changeHour(1)}
            className="text-2xl font-bold text-slate-700 hover:text-[#0b5a35]"
          >
            ˄
          </button>

          <div />

          <button
            type="button"
            onClick={() => changeMinute(15)}
            className="text-2xl font-bold text-slate-700 hover:text-[#0b5a35]"
          >
            ˄
          </button>

          <div className="text-center text-4xl font-bold tracking-widest text-slate-900">
            {String(hour).padStart(2, "0")}
          </div>

          <div className="text-4xl font-bold text-slate-600">:</div>

          <div className="text-center text-4xl font-bold tracking-widest text-slate-900">
            {String(minute).padStart(2, "0")}
          </div>

          <button
            type="button"
            onClick={() => changeHour(-1)}
            className="text-2xl font-bold text-slate-700 hover:text-[#0b5a35]"
          >
            ˅
          </button>

          <div />

          <button
            type="button"
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

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    alert("Backend дараа: тохиргоог database-д хадгална.");
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

    alert("Backend дараа: нууц үг солих API холбоно.");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Тохиргоо</h1>
        <p className="mt-1 text-sm text-slate-500">
          Бизнесийн мэдээлэл, хүргэлт болон админ тохиргоо
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold">Бэйкэригийн мэдээлэл</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Бэйкэригийн нэр
              </label>
              <input
                value={settings.bakeryName}
                onChange={(e) => handleChange("bakeryName", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Утасны дугаар
              </label>
              <input
                value={settings.businessPhone}
                onChange={(e) => handleChange("businessPhone", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
              />
            </div>
          </div>

          <SaveButton onClick={handleSave} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold">Ажиллах цаг</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

          <SaveButton onClick={handleSave} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold">Хүргэлтийн тохиргоо</h2>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Хүргэлтийн төлбөр
            </label>
            <input
              type="number"
              value={settings.deliveryFee}
              onChange={(e) => handleChange("deliveryFee", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
            />
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Хүргэлт идэвхтэй эсэх</p>
                <p className="text-sm text-slate-500">
                  Хэрэглэгч зөвхөн хүргэлтээр захиалга өгнө
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleChange("enableDelivery", !settings.enableDelivery)
                }
                className={`h-7 w-12 rounded-full p-1 transition ${
                  settings.enableDelivery ? "bg-[#0b5a35]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition ${
                    settings.enableDelivery ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <SaveButton onClick={handleSave} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold">Хүргэлт ба гал тогооны цаг</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Захиалга авах сүүлийн цаг
              </label>

              <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-semibold text-slate-700">
                {subtractOneHour(settings.deliveryEndTime)}
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Хүргэлт дуусах цагаас автоматаар 1 цагийн өмнө тооцогдоно.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
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
              <label className="mb-2 block text-sm font-medium text-slate-600">
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

          <div className="mt-5 rounded-2xl bg-green-50 p-4 text-sm text-green-700">
            Хэрэглэгч <b>{settings.deliveryStartTime}</b> -{" "}
            <b>{settings.deliveryEndTime}</b> цагийн хооронд хүргэлтийн цаг
            сонгоно. Захиалгыг хамгийн орой{" "}
            <b>{subtractOneHour(settings.deliveryEndTime)}</b> хүртэл авна. Гал
            тогоо ойролцоогоор <b>{settings.cookTime} минут</b> бэлтгэх
            шаардлагатай.
          </div>

          <SaveButton onClick={handleSave} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold">Сошиал холбоос</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Facebook
              </label>
              <input
                value={settings.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Instagram
              </label>
              <input
                value={settings.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0b5a35]"
              />
            </div>
          </div>

          <SaveButton onClick={handleSave} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold">Нууц үг солих</h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
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
              <label className="mb-2 block text-sm font-medium text-slate-600">
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
              <label className="mb-2 block text-sm font-medium text-slate-600">
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

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handlePasswordChange}
                className="rounded-2xl bg-[#0b5a35] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#09492b]"
              >
                Нууц үг солих
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;