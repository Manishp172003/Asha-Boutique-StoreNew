import "./SearchSort.css";
import { Search, SlidersHorizontal } from "lucide-react";

const SearchSort = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  startIndex,
  endIndex,
  totalProducts
}) => {
  return (
    <section className="search-sort">
      <div className="search-sort-container">

        {/* Left */}
        <div className="product-count">
          Showing <strong>{totalProducts > 0 ? startIndex + 1 : 0}–{endIndex}</strong> of <strong>{totalProducts}</strong> products
        </div>

        {/* Right */}
        <div className="search-actions">

          {/* Search Box */}
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="sort-box">
            <SlidersHorizontal size={18} />

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Name A-Z</option>
            </select>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SearchSort;