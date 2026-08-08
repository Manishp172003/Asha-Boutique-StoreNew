import "./Sidebar.css";

const categories = [
  "All",
  "Dresses",
  "Tops",
  "Tailoring",
  "Accessories",
  "Sale"
];

const Sidebar = ({ selectedCategory, setSelectedCategory, maxPrice, setMaxPrice, onClearFilters }) => {
  return (
    <aside className="shop-sidebar">

      {/* Categories */}
      <div className="sidebar-section">
        <h3>Categories</h3>

        <ul className="category-list">
          {categories.map((category) => (
            <li key={category}>
              <button 
                className={selectedCategory === category ? "active" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'All' ? 'All Items' : category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div className="sidebar-section">
        <h3>Price Range</h3>

        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />

        <p className="price-text">
          ₹0 — ₹{maxPrice.toLocaleString('en-IN')}
        </p>
      </div>

      <button className="clear-filter" onClick={onClearFilters}>
        Clear Filters
      </button>

    </aside>
  );
};

export default Sidebar;