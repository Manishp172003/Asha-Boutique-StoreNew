import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import LazyImage from '../common/LazyImage'

const Trending = ({ trendingRef, filter, filteredProducts, onFilterChange, onProductPreview }) => {
  const navigate = useNavigate()

  const handleViewAllProducts = () => {
    navigate('/shop')
  }
  return (
    <section ref={trendingRef} className="py-20 px-5 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-[#2B1E1A]">Trending Now</h2>
          <div className="flex flex-wrap gap-2">
            {['All', 'Tops', 'Dresses', 'Tailoring', 'Accessories'].map((cat) => (
              <button
                key={cat}
                onClick={() => onFilterChange(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  filter === cat 
                    ? 'bg-[#2B1E1A] text-white' 
                    : 'bg-white text-[#2B1E1A] hover:bg-[#E9E3DD]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="trending-card group cursor-pointer"
              onClick={() => onProductPreview(product)}
              role="button"
              tabIndex={0}
              aria-label={`View ${product.name} details`}
            >
              <div className="relative aspect-[3/4] rounded-[22px] overflow-hidden mb-4 bg-[#E9E3DD]">
                <LazyImage 
                  src={product.image} 
                  alt={product.name}
                  loading="lazy"
                />
                <Button
                  onClick={(event) => {
                    event.stopPropagation()
                    onProductPreview(product)
                  }}
                  aria-label={`Preview ${product.name}`}
                  className="absolute bottom-4 right-4 bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Eye size={20} />
                </Button>
              </div>
              <h3 className="font-medium text-[#2B1E1A] mb-1">{product.name}</h3>
              <p className="text-[#7A655D]">₹{product.price?.toLocaleString('en-IN') || product.price}</p>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleViewAllProducts}
            className="text-[#2B1E1A] hover:text-[#E46A53] transition-colors font-medium"
          >
            View all products
          </button>
        </div>
      </div>
    </section>
  )
}

export default Trending
