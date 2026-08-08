import { Scissors } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const CuratedCollection = ({ curatedRef, trendingRef, onScrollToSection }) => {
  return (
    <section ref={curatedRef} className="min-h-screen py-20 px-5 lg:px-12 flex items-center">
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="curated-text">
          <h2 className="font-serif text-4xl lg:text-6xl font-semibold text-[#2B1E1A] leading-tight mb-6">
            Curated<br />Collection
          </h2>
          <p className="text-lg text-[#7A655D] mb-8 max-w-md">
            A tight edit of pieces that layer easily, move comfortably, and photograph beautifully.
          </p>
          <Link to="/shop">
            <Button className="bg-[#2B1E1A] hover:bg-[#3d2b25] text-white rounded-full px-8">
              Explore Collection
            </Button>
          </Link>

          {/* Tailoring Notes Card */}
          <div className="mt-12 bg-white rounded-[22px] p-6 shadow-lg max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <Scissors className="text-[#E46A53]" size={20} />
              <h3 className="font-serif text-lg font-semibold text-[#2B1E1A]">Tailoring Notes</h3>
            </div>
            <p className="text-sm text-[#7A655D]">Adjustments included for 30 days.</p>
          </div>
        </div>

        {/* Right Image */}
        <div>
          <img 
            src="/images/curated_collection.jpg" 
            alt="Curated Collection" 
            className="curated-image w-full h-[70vh] object-cover rounded-[22px]"
          />
        </div>
      </div>
    </section>
  )
}

export default CuratedCollection
