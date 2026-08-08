import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Scissors, HelpCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { animateAtelierPage, cleanupAnimations } from '../../animations/gsapAnimations';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import LazyImage from '../../components/common/LazyImage';
import BookingDialog from '../../components/forms/BookingDialog';
import CartDialog from '../../components/cart/CartDialog';
import './Atelier.css';

const AtelierPage = () => {
  const navigate = useNavigate();
  const {
    user,
    cart,
    mobileMenuOpen,
    bookingOpen,
    cartOpen,
    setCartOpen,
    setBookingOpen,
    setMobileMenuOpen,
    handleLogout,
    handleBookingSubmit,
    updateQuantity,
    removeFromCart,
  } = useApp();

  const [selectedService, setSelectedService] = useState('');

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const heroRef = useRef(null);
  const narrativeRef = useRef(null);
  const servicesRef = useRef(null);
  const pillarsRef = useRef(null);

  useEffect(() => {
    const contexts = animateAtelierPage({
      heroRef,
      narrativeRef,
      servicesRef,
      pillarsRef
    });
    return () => cleanupAnimations(contexts);
  }, []);

  const handleBookService = (service) => {
    setSelectedService(service);
    setBookingOpen(true);
  };

  const handleCartOpen = () => setCartOpen(true);
  const handleBookingOpen = () => {
    setSelectedService('');
    setBookingOpen(true);
  };
  const handleMobileMenuToggle = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="atelier-story-page">
      <Navigation
        user={user}
        cart={cart}
        onCartOpen={handleCartOpen}
        onLogout={handleLogout}
        onBookingOpen={handleBookingOpen}
        onScrollToSection={() => {}}
        trendingRef={null}
        styleEditRef={null}
        atelierRef={null}
        heroRef={null}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
      />

      <main className="atelier-story-content">
        {/* Hero Philosophy */}
        <section ref={heroRef} className="atelier-story-hero">
          <span className="atelier-story-hero__tag">The Atelier Story</span>
          <h1 className="atelier-story-hero__title">Woven with Intention. Stitched with Care.</h1>
          <p className="atelier-story-hero__desc">
            A quiet space in the city dedicated to slow fashion, natural fibers, and bespoke fits that honor the body.
          </p>
        </section>

        {/* Narrative Split Column Layout */}
        <section ref={narrativeRef} className="atelier-story-narrative">
          <div className="atelier-story-narrative__grid">
            <div className="atelier-story-narrative__image-wrapper">
              <LazyImage
                src="/images/atelier_tailoring.jpg"
                alt="Slow craft tailoring details"
                className="atelier-story-narrative__image"
              />
            </div>
            <div className="atelier-story-narrative__content">
              <h2 className="atelier-story-narrative__heading">The Heritage of Slow Fashion</h2>
              <p className="atelier-story-narrative__text">
                At Asha Boutique, we reject the noise of fast trends. We believe clothing should be a relationship—crafted carefully, altered to fit, and worn for a lifetime. 
              </p>
              <p className="atelier-story-narrative__text">
                Every silhouette starts as a pencil sketch, which is translated to patterns designed to minimize textile scrap waste. We partner directly with artisan weavers in local cooperatives to source handloom cottons, mulberry silks, and breathable organic linens.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Services Showcase */}
        <section ref={servicesRef} className="atelier-story-services">
          <h2 className="atelier-story-services__heading">Atelier Consultation Services</h2>
          <div className="atelier-story-services__grid">
            
            {/* Bridal Consult */}
            <div className="atelier-story-service-card">
              <div>
                <div className="atelier-story-service-card__icon">
                  <Sparkles size={24} />
                </div>
                <h3 className="atelier-story-service-card__title">Bridal & Occasion</h3>
                <p className="atelier-story-service-card__desc">
                  Enjoy custom measurements, drape selections, and heritage blouse styling slots configured for wedding caps and festive collections.
                </p>
              </div>
              <button 
                onClick={() => handleBookService('Bridal Consult')}
                className="atelier-story-service-card__btn"
              >
                <span>Book Bridal Consult</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Silk Fitting */}
            <div className="atelier-story-service-card">
              <div>
                <div className="atelier-story-service-card__icon">
                  <Scissors size={24} />
                </div>
                <h3 className="atelier-story-service-card__title">Silk Fitting & Alterations</h3>
                <p className="atelier-story-service-card__desc">
                  Restructure heirloom silk blouses, size panels, adjust sleeve lengths, and fit your favorite handloom silhouettes to your body.
                </p>
              </div>
              <button 
                onClick={() => handleBookService('Silk Fitting')}
                className="atelier-story-service-card__btn"
              >
                <span>Book Silk Fitting</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Fabric Selection */}
            <div className="atelier-story-service-card">
              <div>
                <div className="atelier-story-service-card__icon">
                  <Calendar size={24} />
                </div>
                <h3 className="atelier-story-service-card__title">Fabric Selection & Style</h3>
                <p className="atelier-story-service-card__desc">
                  Audit wild silk threads, coordinate organic colors, and plan custom capsule coordinates designed by Asha.
                </p>
              </div>
              <button 
                onClick={() => handleBookService('Fabric Selection')}
                className="atelier-story-service-card__btn"
              >
                <span>Book Style Consult</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </section>

        {/* Pillars Section */}
        <section ref={pillarsRef} className="atelier-story-pillars">
          <div className="atelier-story-pillars__container">
            <div className="atelier-story-pillars__grid">
              
              <div className="atelier-story-pillar-card">
                <span className="atelier-story-pillar-card__num">01</span>
                <h4 className="atelier-story-pillar-card__title">Natural Materials</h4>
                <p className="atelier-story-pillar-card__desc">
                  We use organic cotton, linen, silk, and tagua nut buttons. Every trim is selected to biodegrade harmoniously.
                </p>
              </div>

              <div className="atelier-story-pillar-card">
                <span className="atelier-story-pillar-card__num">02</span>
                <h4 className="atelier-story-pillar-card__title">Zero-Waste Mindset</h4>
                <p className="atelier-story-pillar-card__desc">
                  We design garment patterns carefully to map close to the margins, saving scraps to weave small accessories.
                </p>
              </div>

              <div className="atelier-story-pillar-card">
                <span className="atelier-story-pillar-card__num">03</span>
                <h4 className="atelier-story-pillar-card__title">Made to Adjust</h4>
                <p className="atelier-story-pillar-card__desc">
                  Our silhouettes feature generous inside seams, making body weight fluctuation adjustments simple and non-destructive.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer
        onScrollToSection={() => {}}
        trendingRef={null}
        styleEditRef={null}
        atelierRef={null}
        heroRef={null}
        onBookingOpen={handleBookingOpen}
      />

      {/* Booking Dialog Modal */}
      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        onSubmit={handleBookingSubmit}
        user={user}
        initialServiceType={selectedService}
      />

      {/* Cart Dialog Modal */}
      <CartDialog
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        cartTotal={cartTotal}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onCheckout={() => navigate('/checkout')}
        onScrollToSection={() => {}}
        trendingRef={null}
      />
    </div>
  );
};

export default AtelierPage;
