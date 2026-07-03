import {
  FiShoppingBag,
  FiClock,
  FiCheck,
  FiDollarSign,
  FiBox,
  FiAlertTriangle,
} from "react-icons/fi";

const stats = [
  {
    title: "Өнөөдрийн захиалга",
    value: "42",
    note: "өчигдрөөс",
    change: "↗ 12%",
    icon: FiShoppingBag,
  },
  {
    title: "Хүлээгдэж буй захиалга",
    value: "8",
    note: "шалгах шаардлагатай",
    icon: FiClock,
  },
  {
    title: "Дууссан захиалга",
    value: "26",
    note: "цагтаа",
    change: "↗ 8%",
    icon: FiCheck,
  },
  {
    title: "Өнөөдрийн орлого",
    value: "₮3,284,000",
    note: "өчигдрөөс",
    change: "↗ 18%",
    icon: FiDollarSign,
  },
  {
    title: "Нийт бүтээгдэхүүн",
    value: "128",
    note: "12 ангилал",
    icon: FiBox,
  },
  {
    title: "Бараа дуусах дөхсөн",
    value: "5",
    note: "нөхөх шаардлагатай",
    icon: FiAlertTriangle,
  },
];

const orders = [
  ["#TLJ-1024", "София Лаурент", "+976 9911 2233", "Хүлээгдэж буй", "Pickup", "08:00", "₮36,000"],
  ["#TLJ-1025", "Маркус Чен", "+976 9911 4455", "Батлагдсан", "Delivery", "09:07", "₮72,000"],
  ["#TLJ-1026", "Амелия Росси", "+976 9911 6677", "Бэлтгэж буй", "Pickup", "10:14", "₮64,800"],
  ["#TLJ-1027", "Жонас Вебер", "+976 9911 8899", "Бэлэн", "Delivery", "11:21", "₮57,600"],
  ["#TLJ-1028", "Прия Пател", "+976 9911 1122", "Дууссан", "Pickup", "12:28", "₮50,400"],
];

const statusClass = {
  "Хүлээгдэж буй": "bg-yellow-100 text-yellow-700",
  Батлагдсан: "bg-blue-100 text-blue-700",
  "Бэлтгэж буй": "bg-purple-100 text-purple-700",
  Бэлэн: "bg-green-100 text-green-700",
  Дууссан: "bg-slate-100 text-slate-700",
};

const Dashboard = () => {
  return (
    <div className="p-8">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-start justify-between">
                <p className="text-sm text-slate-600">{stat.title}</p>
                <div className="grid h-11 w-11 place-items-center rounded-full bg-green-100 text-[#0b5a35]">
                  <Icon size={20} />
                </div>
              </div>

              <h2 className="text-3xl font-bold">{stat.value}</h2>

              <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                {stat.change && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-[#0b5a35]">
                    {stat.change}
                  </span>
                )}
                <span>{stat.note}</span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">Сүүлийн захиалгууд</h2>
            <p className="text-sm text-slate-500">
              Pickup болон delivery захиалгын сүүлийн үйл ажиллагаа
            </p>
          </div>

          <button className="text-sm font-semibold text-[#0b5a35]">
            Бүгдийг харах →
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Захиалгын дугаар</th>
              <th className="px-6 py-4">Захиалагч</th>
              <th className="px-6 py-4">Утас</th>
              <th className="px-6 py-4">Төлөв</th>
              <th className="px-6 py-4">Төрөл</th>
              <th className="px-6 py-4">Цаг</th>
              <th className="px-6 py-4 text-right">Нийт</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order[0]} className="border-t border-slate-100">
                <td className="px-6 py-5 font-semibold">{order[0]}</td>
                <td className="px-6 py-5">{order[1]}</td>
                <td className="px-6 py-5 text-slate-600">{order[2]}</td>
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusClass[order[3]]
                    }`}
                  >
                    {order[3]}
                  </span>
                </td>
                <td className="px-6 py-5 text-slate-600">{order[4]}</td>
                <td className="px-6 py-5 text-slate-600">{order[5]}</td>
                <td className="px-6 py-5 text-right font-bold">{order[6]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;