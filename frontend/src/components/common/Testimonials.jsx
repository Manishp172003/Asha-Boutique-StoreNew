import { useState, useEffect } from 'react';
import { Star, PenLine } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SubmitReviewDialog from '../forms/SubmitReviewDialog';
import { toast } from 'sonner';

const Testimonials = ({ testimonials = [] }) => {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const { user } = useApp();

  const handleWriteReviewClick = () => {
    if (!user) {
      toast.error("Please log in to submit a review!");
      return;
    }
    setReviewOpen(true);
  };

  useEffect(() => {
    if (testimonials.length <= 3) return;

    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setStartIndex((prev) => (prev + 3) % testimonials.length);
        setIsFading(false);
      }, 500); // 500ms fade transition
    }, 6000); // Cycle every 6 seconds

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const visibleTestimonials = (() => {
    if (testimonials.length <= 3) return testimonials;
    const items = [];
    for (let i = 0; i < 3; i++) {
      const idx = (startIndex + i) % testimonials.length;
      items.push(testimonials[idx]);
    }
    return items;
  })();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, idx) => {
      const filled = idx < rating;
      return (
        <Star 
          key={idx} 
          size={12} 
          className={filled ? "fill-[#E46A53] text-[#E46A53]" : "text-gray-300"} 
        />
      );
    });
  };

  return (
    <section className="py-20 px-5 lg:px-12 bg-[#E9E3DD]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-[#2B1E1A] mb-2">Client Love</h2>
            <p className="text-sm text-[#7A655D]">Honest words from our mindful community.</p>
          </div>
          <button 
            onClick={handleWriteReviewClick}
            className="flex items-center gap-2 bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full py-2.5 px-6 font-serif text-sm font-semibold transition-colors cursor-pointer outline-none"
          >
            <PenLine size={14} />
            <span>Write a Review</span>
          </button>
        </div>
        
        <div className={`grid md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out transform ${
          isFading ? 'opacity-0 scale-98 translate-y-1' : 'opacity-100 scale-100 translate-y-0'
        }`}>
          {visibleTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-[22px] p-6 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.avatarUrl || testimonial.avatar || '/images/avatar1.jpg'} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => { e.target.src = '/images/avatar1.jpg'; }}
                  />
                  <div>
                    <p className="font-medium text-[#2B1E1A]">{testimonial.name}</p>
                    <div className="flex gap-1">
                      {renderStars(testimonial.rating || 5)}
                    </div>
                  </div>
                </div>
                <p className="text-[#7A655D] italic">"{testimonial.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Dialog Modal */}
      <SubmitReviewDialog 
        open={reviewOpen} 
        onOpenChange={setReviewOpen} 
        user={user} 
      />
    </section>
  );
};

export default Testimonials;
