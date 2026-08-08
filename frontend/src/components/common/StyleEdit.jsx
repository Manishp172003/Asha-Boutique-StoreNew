import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const StyleEdit = ({ styleEditRef, onBookingOpen }) => {
  const navigate = useNavigate()
  return (
    <section ref={styleEditRef} className="min-h-screen py-20 px-5 lg:px-12 flex items-center">
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="style-text">
          <h2 className="font-serif text-4xl lg:text-6xl font-semibold text-[#2B1E1A] leading-tight mb-6">
            Style<br />Edit
          </h2>
          <p className="text-lg text-[#7A655D] mb-8 max-w-md">
            Three ways to wear the season—day markets, work hours, evening plans.
          </p>
          <Button 
            onClick={() => navigate('/lookbook')}
            className="bg-[#2B1E1A] hover:bg-[#3d2b25] text-white rounded-full px-8"
          >
            See the Looks
          </Button>

          {/* Lookbook Drop Card */}
          <div className="mt-12 bg-white rounded-[22px] p-6 shadow-lg max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <Star className="text-[#E46A53]" size={20} />
              <h3 className="font-serif text-lg font-semibold text-[#2B1E1A]">Lookbook Drop</h3>
            </div>
            <p className="text-sm text-[#7A655D]">New sets added every Friday.</p>
          </div>
        </div>

        {/* Right Image */}
        <div>
          <img 
            src="/images/style_edit.jpg" 
            alt="Style Edit" 
            className="style-image w-full h-[70vh] object-cover rounded-[22px]"
          />
        </div>
      </div>
    </section>
  )
}

export default StyleEdit
