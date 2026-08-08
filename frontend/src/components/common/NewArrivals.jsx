import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const NewArrivals = ({ newArrivalsRef, trendingRef, styleEditRef, onScrollToSection }) => {
  return (
    <section ref={newArrivalsRef} className="min-h-screen relative overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-2 h-screen">
        <div className="new-arrivals-left relative">
          <img
            src="/images/new_arrivals_left.jpg"
            alt="New Arrivals"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="new-arrivals-right relative">
          <img
            src="/images/new_arrivals_right.jpg"
            alt="New Arrivals"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Center Badge */}
      <div className="new-badge absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-[#E46A53] rounded-full flex items-center justify-center z-10">
        <span className="text-white font-serif text-xl md:text-2xl lg:text-3xl font-semibold">NEW</span>
      </div>

      {/* Content Overlay */}
      <div className="absolute top-6 left-4 md:top-16 md:left-12 z-10">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-6xl font-semibold text-white drop-shadow-lg">New Arrivals</h2>
      </div>
      <div className="absolute top-24 left-4 md:top-16 md:right-12 md:left-auto md:max-w-xs z-10">
        <p className="text-white text-xs md:text-sm lg:text-base drop-shadow-lg">
          Fresh silhouettes, soft fabrics, and details that feel handmade—because they are.
        </p>
      </div>
      <div className="absolute bottom-6 left-4 md:bottom-16 md:left-12 z-10">
        <Link to="/shop">
          <Button className="bg-white text-[#2B1E1A] hover:bg-[#F6F2EE] rounded-full px-4 md:px-6 text-sm">
            Shop New In
          </Button>
        </Link>
      </div>
      <div className="absolute bottom-8 right-6 lg:bottom-16 lg:right-12">
        <button 
          onClick={() => onScrollToSection(styleEditRef)}
          className="text-white flex items-center gap-2 hover:underline drop-shadow-lg"
        >
          View Lookbook <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}

export default NewArrivals
