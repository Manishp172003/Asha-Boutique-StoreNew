import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const Atelier = ({ atelierRef, onBookingOpen }) => {
  return (
    <section ref={atelierRef} className="min-h-screen py-20 px-5 lg:px-12 flex items-center bg-[#E9E3DD]">
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Image */}
        <div>
          <img 
            src="/images/atelier_tailoring.jpg" 
            alt="Asha Atelier" 
            className="atelier-image w-full h-[70vh] object-cover rounded-[22px]"
          />
        </div>

        {/* Right Content */}
        <div className="atelier-text">
          <span className="text-xs font-mono uppercase tracking-[0.14em] text-[#7A655D] mb-4 block">
            Asha Atelier
          </span>
          <h2 className="font-serif text-4xl lg:text-6xl font-semibold text-[#2B1E1A] leading-tight mb-6">
            Fit is<br />everything.
          </h2>
          <p className="text-lg text-[#7A655D] mb-8 max-w-md">
            Alterations, custom sizing, and made-to-measure details—book a session and we'll shape it to you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={onBookingOpen}
              className="bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full px-8"
            >
              <Calendar className="mr-2" size={18} />
              Book Appointment
            </Button>
            <Link to="/atelier" className="text-[#2B1E1A] hover:text-[#E46A53] transition-colors flex items-center text-sm font-semibold">
              See Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Atelier
