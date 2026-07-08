const CategorySidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="mb-5 text-lg font-bold text-[#0B5A35]">
        Ангилал
      </h2>

      <div className="space-y-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`w-full rounded-xl px-4 py-3 text-left font-medium transition ${
            selectedCategory === "all"
              ? "bg-[#0B5A35] text-white"
              : "hover:bg-gray-100"
          }`}
        >
          Бүгд
        </button>

        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setSelectedCategory(category._id)}
            className={`w-full rounded-xl px-4 py-3 text-left font-medium transition ${
              selectedCategory === category._id
                ? "bg-[#0B5A35] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;