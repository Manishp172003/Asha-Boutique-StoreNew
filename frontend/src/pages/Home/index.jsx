import { useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { animateHeroSection, initializeScrollAnimations, cleanupAnimations, refreshScrollTrigger } from '../../animations/gsapAnimations'
import { toast } from 'sonner'
import { useApp } from '../../context/AppContext'

// Layout Components
import Navigation from '../../components/layout/Navigation'
import Footer from '../../components/layout/Footer'

// Section Components
import Hero from '../../components/common/Hero'
import NewArrivals from '../../components/common/NewArrivals'
import CuratedCollection from '../../components/common/CuratedCollection'
import Atelier from '../../components/common/Atelier'
import Trending from '../../components/product/Trending'
import StyleEdit from '../../components/common/StyleEdit'
import Testimonials from '../../components/common/Testimonials'
import Visit from '../../components/common/Visit'

// Dialog Components
import BookingDialog from '../../components/forms/BookingDialog'
import ProductPreviewDialog from '../../components/product/ProductPreviewDialog'
import CartDialog from '../../components/cart/CartDialog'

const Home = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    user,
    cart,
    filter,
    filteredProducts,
    orders,
    mobileMenuOpen,
    bookingOpen,
    productPreview,
    cartOpen,
    testimonials,
    setFilter,
    setCartOpen,
    setBookingOpen,
    setProductPreview,
    setMobileMenuOpen,
    handleLogout,
    handleBookingSubmit,
    addToCart,
    buyNow,
    updateQuantity,
    removeFromCart,
    getUserOrders,
  } = useApp()
  const mainRef = useRef(null)
  const heroRef = useRef(null)
  const newArrivalsRef = useRef(null)
  const curatedRef = useRef(null)
  const atelierRef = useRef(null)
  const trendingRef = useRef(null)
  const styleEditRef = useRef(null)

  // Initialize animations
  useEffect(() => {
    const heroContext = animateHeroSection(heroRef)
    const scrollContexts = initializeScrollAnimations({
      heroRef,
      newArrivalsRef,
      curatedRef,
      atelierRef,
      trendingRef,
      styleEditRef
    })
    return () => {
      cleanupAnimations(heroContext)
      cleanupAnimations(scrollContexts)
    }
  }, [])

  // Handle section scroll from navigation state
  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = location.state.scrollTo
      // Small delay to ensure page has rendered
      setTimeout(() => {
        section.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location.state])

  // Refresh ScrollTrigger when products load or user changes to prevent delayed triggers
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshScrollTrigger();
    }, 600);
    return () => clearTimeout(timer);
  }, [filteredProducts, user]);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const cartTotal = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)

  return (
    <div ref={mainRef} className="min-h-screen bg-[#F6F2EE] overflow-x-hidden">
      <Navigation
        user={user}
        cart={cart}
        onCartOpen={() => setCartOpen(true)}
        onLogout={handleLogout}
        onBookingOpen={() => setBookingOpen(true)}
        onScrollToSection={scrollToSection}
        trendingRef={trendingRef}
        styleEditRef={styleEditRef}
        atelierRef={atelierRef}
        heroRef={heroRef}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <Hero
        heroRef={heroRef}
        styleEditRef={styleEditRef}
        onBookingOpen={() => setBookingOpen(true)}
        onScrollToSection={scrollToSection}
      />

      <NewArrivals
        newArrivalsRef={newArrivalsRef}
        trendingRef={trendingRef}
        styleEditRef={styleEditRef}
        onScrollToSection={scrollToSection}
      />

      <CuratedCollection
        curatedRef={curatedRef}
        trendingRef={trendingRef}
        onScrollToSection={scrollToSection}
      />

      <Atelier
        atelierRef={atelierRef}
        onBookingOpen={() => setBookingOpen(true)}
      />

      <Trending
        trendingRef={trendingRef}
        filter={filter}
        filteredProducts={filteredProducts}
        onFilterChange={setFilter}
        onProductPreview={setProductPreview}
      />

      <StyleEdit
        styleEditRef={styleEditRef}
        onBookingOpen={() => setBookingOpen(true)}
      />

      <Testimonials testimonials={testimonials} />

      <Visit onBookingOpen={() => setBookingOpen(true)} />

      <Footer
        onScrollToSection={scrollToSection}
        trendingRef={trendingRef}
        styleEditRef={styleEditRef}
        atelierRef={atelierRef}
        heroRef={heroRef}
        onBookingOpen={() => setBookingOpen(true)}
      />

      {/* Dialogs */}
      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        onSubmit={handleBookingSubmit}
        user={user}
      />

      <ProductPreviewDialog
        open={!!productPreview}
        onOpenChange={(open) => !open && setProductPreview(null)}
        product={productPreview}
        onAddToCart={addToCart}
        onBuyNow={buyNow}
        trendingRef={trendingRef}
      />

      <CartDialog
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        cartTotal={cartTotal}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onCheckout={() => navigate('/checkout')}
        onScrollToSection={scrollToSection}
        trendingRef={trendingRef}
      />
    </div>
  )
}

export default Home
