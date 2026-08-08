import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Hero = ({ heroRef, styleEditRef, onBookingOpen, onScrollToSection }) => {
  return (
    <section ref={heroRef} className="min-h-screen relative pt-20 px-5 lg:px-12 flex items-center">
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <div className="order-2 lg:order-1">
          <h1 className="hero-headline font-serif text-5xl lg:text-7xl font-semibold text-[#2B1E1A] leading-tight mb-6">
            Stitched<br />for you
          </h1>
          <p className="hero-subheadline text-lg text-[#7A655D] mb-8 max-w-md">
            Boutique tailoring & curated looks—made to fit your life.
          </p>
          <div className="hero-cta flex flex-wrap gap-4 mb-12">
            <Button 
              onClick={onBookingOpen}
              className="bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full px-8 py-6 text-base"
            >
              Book Appointment
            </Button>
            <button 
              onClick={() => onScrollToSection(styleEditRef)}
              className="flex items-center gap-2 text-[#2B1E1A] hover:text-[#E46A53] transition-colors"
            >
              Explore the Lookbook <ArrowRight size={18} />
            </button>
          </div>
          
          {/* Featured Card */}
          <div className="hero-card bg-white rounded-[22px] p-3 md:p-4 shadow-lg max-w-xs">
            <img
              src="/images/hero_featured.jpg"
              alt="Featured"
              className="w-full h-24 md:h-32 object-cover rounded-[14px] mb-2 md:mb-3"
            />
            <h3 className="font-serif text-sm md:text-lg font-semibold text-[#2B1E1A]">Featured: The Linen Set</h3>
            <p className="text-xs md:text-sm text-[#7A655D]">Tailored in-house. Ready in 7 days.</p>
          </div>
        </div>

        {/* Right Image */}
        <div className="order-1 lg:order-2">
          <img 
            src="/images/hero_featured.jpg" 
            alt="Hero" 
            className="hero-image w-full h-[60vh] lg:h-[80vh] object-cover rounded-[22px]"
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-4 md:bottom-8 md:left-6 flex items-center gap-2 text-[#7A655D] text-xs md:text-sm hidden md:flex">
        <span>Scroll</span>
        <ChevronDown size={14} className="animate-bounce md:size-16" />
      </div>

      {/* Now Open Badge */}
      <div className="absolute bottom-6 right-4 md:bottom-8 md:right-6 bg-white rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-md flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span className="text-xs md:text-sm text-[#2B1E1A]">Now open</span>
      </div>
    </section>
  )
}

export default Hero
