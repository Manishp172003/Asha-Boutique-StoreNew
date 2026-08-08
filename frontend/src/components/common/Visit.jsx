import { MapPin, Clock, Phone, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Visit = ({ onBookingOpen }) => {
  return (
    <section className="py-20 px-5 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Info */}
          <div>
            <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-[#2B1E1A] mb-8">
              Visit the Boutique
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#E46A53] mt-1" size={20} />
                <div>
                  <p className="font-medium text-[#2B1E1A]">Address</p>
                  <p className="text-[#7A655D]">Plot no_25, Date Lay Out,Jaitala Road, Nagpur</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="text-[#E46A53] mt-1" size={20} />
                <div>
                  <p className="font-medium text-[#2B1E1A]">Hours</p>
                  <p className="text-[#7A655D]">Mon–Sat: 11am – 8pm | Sun: 12pm – 6pm</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="text-[#E46A53] mt-1" size={20} />
                <div>
                  <p className="font-medium text-[#2B1E1A]">Phone</p>
                  <p className="text-[#7A655D]">+91 97 6790 7469</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button 
                onClick={onBookingOpen}
                className="bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full"
              >
                <Calendar className="mr-2" size={18} />
                Book appointment
              </Button>
            </div>
          </div>

          {/* Map with Directions Button */}
          <div className="relative w-full h-[50vh] rounded-[22px] overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.123456789!2d79.028926!3d21.109289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDA3JzI2LjIiTiA3OcKwMDcnMjMuOSJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Asha Boutique Store Location"
            />
            <Button
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=21.109289,79.028926', '_blank')}
              className="absolute bottom-4 right-4 bg-white text-[#2B1E1A] hover:bg-[#F6F2EE] rounded-full shadow-lg px-6"
            >
              <MapPin className="mr-2" size={18} />
              Get directions
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Visit
