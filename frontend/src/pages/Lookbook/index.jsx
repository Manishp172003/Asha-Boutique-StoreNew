import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Heart, MessageCircle, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { animateLookbookPage, cleanupAnimations } from '../../animations/gsapAnimations';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import LazyImage from '../../components/common/LazyImage';
import BookingDialog from '../../components/forms/BookingDialog';
import CartDialog from '../../components/cart/CartDialog';
import './Lookbook.css';

const Lookbook = () => {
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

  const [activeSpread, setActiveSpread] = useState(0);
  const [phoneSlide, setPhoneSlide] = useState(0);
  const [carouselSlide, setCarouselSlide] = useState(0);
  const [activeIssue, setActiveIssue] = useState(0);

  const carouselSlides = [
    '/images/lookbook-hero1.png',
    '/images/lookbook-hero2.png',
    '/images/lookbook-hero3.png',
    '/images/lookbook-hero4.png'
  ];

  const editorialIssues = [
    {
      id: 1,
      issueNumber: '01',
      title: 'Issue No. 01',
      image: '/images/issueN1.png',
      featuredLook: 'Winter Edit \'24',
      featuredDesc: 'Crafted for Timeless Elegance',
      description: 'An interactive catalog featuring seasonal styling, fine tailoring details, and organic fabric textures. Use the pagination controls below to explore.',
      season: 'AUTUMN / WINTER \'24'
    },
    {
      id: 2,
      issueNumber: '02',
      title: 'Issue No. 02',
      image: '/images/issueN2.png',
      featuredLook: 'Spring Capsule \'25',
      featuredDesc: 'Effortless Linen Essentials',
      description: 'Celebrating soft shapes, raw edges, and pure organic linen co-ords. Designed for lightweight, sustainable daily luxury.',
      season: 'SPRING / SUMMER \'25'
    },
    {
      id: 3,
      issueNumber: '03',
      title: 'Issue No. 03',
      image: '/images/issueN3.png',
      featuredLook: 'Atelier Tailoring \'25',
      featuredDesc: 'Canvas Interfacing & Peak Labels',
      description: 'Modern interpretation of classical tailoring. Handmade double-vent details crafted item-by-item in our personal boutique workspace.',
      season: 'MONSOON / FESTIVE \'25'
    }
  ];

  const nextIssue = () => {
    setActiveIssue((prev) => (prev + 1) % editorialIssues.length);
  };
  const prevIssue = () => {
    setActiveIssue((prev) => (prev - 1 + editorialIssues.length) % editorialIssues.length);
  };
  const handleScrollToMagazine = () => {
    magazineRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCartOpen = () => setCartOpen(true);
  const handleBookingOpen = () => setBookingOpen(true);
  const handleMobileMenuToggle = () => setMobileMenuOpen(!mobileMenuOpen);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const carouselHeroRef = useRef(null);
  const heroRef = useRef(null);
  const magazineRef = useRef(null);
  const collageContainerRef = useRef(null);
  const collageLeftTopRef = useRef(null);
  const collageLeftBottomRef = useRef(null);
  const collageRightRef = useRef(null);
  const collagePhoneRef = useRef(null);
  const instaRef = useRef(null);
  const ctaRef = useRef(null);

  // Phone mockup slides data matching user assets
  const phoneSlides = [
    {
      id: 1,
      image: '/images/lookbook_phone_1.png',
      brand: 'Asha Boutique',
      tag: 'Autumn/Winter Collection'
    },
    {
      id: 2,
      image: '/images/lookbook_phone_2.png',
      brand: 'Asha Boutique',
      tag: 'Slow Craft Editorial'
    }
  ];

  // Auto cycle carousel background slide images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  // Auto swipe phone mockup slideshow screens every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPhoneSlide((prev) => (prev + 1) % phoneSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [phoneSlides.length]);

  // Initialize GSAP scroll animations
  useEffect(() => {
    const contexts = animateLookbookPage({
      carouselHeroRef,
      heroRef,
      magazineRef,
      collageContainerRef,
      collageLeftTopRef,
      collageLeftBottomRef,
      collageRightRef,
      collagePhoneRef,
      instaRef,
      ctaRef
    });
    return () => cleanupAnimations(contexts);
  }, []);

  // Magazine spreads data
  const spreads = [
    {
      id: 1,
      leftTitle: 'Linen Essentials',
      leftSubtitle: 'Summer Capsule',
      leftPageNum: 'PAGE 01',
      leftDesc: 'Embrace warm breeze and effortless dressing. Designed around soft shapes, raw edges, and pure organic linen co-ords in natural beige and ivory.',
      leftImage: '/images/curated_collection.jpg',
      rightTitle: 'Summer Edit',
      rightSubtitle: 'Silhouette Study',
      rightPageNum: 'PAGE 02',
      rightDesc: 'The oversized linen shirt matches with lightweight linen trousers. Lightweight, sustainable luxury designed to layer beautifully.',
      rightImage: '/images/new_arrivals_left.jpg',
      product: {
        id: 9,
        name: 'Oversized Linen Shirt',
        price: '₹2,499',
        image: '/images/product9.png'
      }
    },
    {
      id: 2,
      leftTitle: 'Modern Tailoring',
      leftSubtitle: 'Autumn / Winter',
      leftPageNum: 'PAGE 03',
      leftDesc: 'Sharp double-breasted outlines, clean structured shoulders, and neutral wool trousers. A modern interpretation of workplace tailoring.',
      leftImage: '/images/atelier_tailoring.jpg',
      rightTitle: 'Atelier Craft',
      rightSubtitle: 'Structure Study',
      rightPageNum: 'PAGE 04',
      rightDesc: 'Handmade double-vent detail, canvas interfacing, and peak labels. Crafted item-by-item in our personal boutique workspace.',
      rightImage: '/images/product10.png',
      product: {
        id: 10,
        name: 'Structured Atelier Blazer',
        price: '₹4,899',
        image: '/images/product10.png'
      }
    },
    {
      id: 3,
      leftTitle: 'Fluid Silhouettes',
      leftSubtitle: 'Signature Series',
      leftPageNum: 'PAGE 05',
      leftDesc: 'Lustrous blended slip dresses and light knit vests. Fluid slip cuts that drape cleanly over the body, styled for warm evenings.',
      leftImage: '/images/style_edit.jpg',
      rightTitle: 'Bespoke Slips',
      rightSubtitle: 'Drape Study',
      rightPageNum: 'PAGE 06',
      rightDesc: 'Finished with delicate adjustable straps and double-rolled raw hems. A clean luxury separate meant to last through years.',
      rightImage: '/images/product14.png',
      product: {
        id: 14,
        name: 'Linen Midi Slip Dress',
        price: '₹3,299',
        image: '/images/product14.png'
      }
    }
  ];

  // Instagram gallery mock data
  const instagramPosts = [
    {
      id: 1,
      image: '/images/product9.png',
      likes: '342',
      comments: '18',
      caption: 'Sun-drenched linen shirts for slow Sundays. ☕✨ #ashaboutique #slowfashion'
    },
    {
      id: 2,
      image: '/images/product10.png',
      likes: '512',
      comments: '24',
      caption: 'Bespoke tailoring in progress. Detail is everything. 🧵📏 #modernatelier #classicstyle'
    },
    {
      id: 3,
      image: '/images/product11.png',
      likes: '289',
      comments: '12',
      caption: 'Neutrals that inspire. Our linen sets are back in stock. 🕊️ #capsulewardrobe #minimalist'
    },
    {
      id: 4,
      image: '/images/product12.png',
      likes: '603',
      comments: '31',
      caption: 'Transitioning seasons with effortless cotton blazers. 🍂 #autumnstyling #dailylooks'
    },
    {
      id: 5,
      image: '/images/product13.png',
      likes: '422',
      comments: '15',
      caption: 'Breathable linen co-ords for weekend getaways. 🌿 #resortwear #linenedit'
    },
    {
      id: 6,
      image: '/images/product14.png',
      likes: '318',
      comments: '9',
      caption: 'Fine textures and raw materials. Discover our Linen Collection. 🌾 #organicstyle'
    },
    {
      id: 7,
      image: '/images/product5.jpg',
      likes: '488',
      comments: '22',
      caption: 'Tailored trousers that hang perfectly. Designed to last. ✂️ #sustainableluxury'
    },
    {
      id: 8,
      image: '/images/product7.jpg',
      likes: '556',
      comments: '27',
      caption: 'Dressed up or down. The ultimate summer slip dress. 🌸 #neutraltones #minimalfashion'
    }
  ];

  // Duplicate posts list for infinite seamless marquee loop
  const duplicatedPosts = [...instagramPosts, ...instagramPosts];

  const nextSpread = () => {
    setActiveSpread((prev) => (prev + 1) % spreads.length);
  };

  const prevSpread = () => {
    setActiveSpread((prev) => (prev - 1 + spreads.length) % spreads.length);
  };

  // Auto flip magazine pages every 8 seconds for dynamic motion
  useEffect(() => {
    const timer = setInterval(() => {
      nextSpread();
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = spreads[activeSpread];

  return (
    <>
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

      <main className="lookbook-page">
        {/* Lookbook Full-Screen Carousel Hero */}
        <section ref={carouselHeroRef} className="lookbook-carousel-hero">
          {/* Background Slides */}
          <div className="lookbook-carousel-hero__slides">
            {carouselSlides.map((slide, idx) => (
              <div 
                key={idx}
                className={`lookbook-carousel-hero__slide ${
                  carouselSlide === idx ? 'lookbook-carousel-hero__slide--active' : ''
                }`}
              >
                <img 
                  src={slide} 
                  alt={`Lookbook slide ${idx + 1}`} 
                  className="lookbook-carousel-hero__slide-image"
                />
              </div>
            ))}
          </div>

          {/* Dark Overlay */}
          <div className="lookbook-carousel-hero__overlay"></div>

          {/* Centered Typography Overlays */}
          <div className="lookbook-carousel-hero__content">
            <h1 className="lookbook-carousel-hero__title">
              Welcome to explore our look book
            </h1>
            <p className="lookbook-carousel-hero__subtitle">
              A curation of quiet luxury, slow craft, and timeless silhouettes.
            </p>
          </div>

          {/* Scroll Down Prompter */}
          <div className="lookbook-carousel-hero__scroll-indicator">
            <span className="lookbook-carousel-hero__scroll-dot"></span>
          </div>
        </section>

        {/* Section Divider */}
        <div className="lookbook-section-divider">
          <div className="divider-line"></div>
          <span className="divider-label">INTERACTIVE EDITORIAL SPREADS</span>
          <div className="divider-line"></div>
        </div>

        {/* Magazine Spreads Book Section */}
        <section ref={magazineRef} className="magazine-container">
          <div className="magazine">
            {/* Left page fold shadow (spine) */}
            <div className="magazine-spine"></div>

            {/* LEFT PAGE */}
            <div className="magazine-page magazine-page--left">
              <div className="magazine-header">
                <span>ASHA BOUTIQUE</span>
                <span>{current.leftSubtitle}</span>
              </div>
              
              <div key={`left-content-${activeSpread}`} className="magazine-content">
                <h2 className="magazine-editorial-title">{current.leftTitle}</h2>
                <p className="magazine-editorial-desc">{current.leftDesc}</p>
                <div className="magazine-image-wrapper" style={{ height: '240px' }}>
                  <LazyImage
                    src={current.leftImage}
                    alt={current.leftTitle}
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="magazine-footer">
                <span>{current.leftPageNum}</span>
                <span>EDITORIAL</span>
              </div>
            </div>

            {/* RIGHT PAGE */}
            <div className="magazine-page magazine-page--right">
              <div className="magazine-header">
                <span>{current.rightSubtitle}</span>
                <span>{current.leftSubtitle}</span>
              </div>

              <div key={`right-content-${activeSpread}`} className="magazine-content">
                <div className="magazine-image-wrapper mb-6" style={{ height: '180px' }}>
                  <LazyImage
                    src={current.rightImage}
                    alt={current.rightTitle}
                    loading="lazy"
                  />
                </div>
                <h3 className="text-sm font-semibold tracking-wider uppercase text-[#E46A53] mb-3">Featured Outfits</h3>
                <div className="magazine-product-card">
                  <img
                    src={current.product.image}
                    alt={current.product.name}
                    className="magazine-product-img"
                  />
                  <div className="magazine-product-info">
                    <h4>{current.product.name}</h4>
                    <p className="price">{current.product.price}</p>
                    <button
                      className="shop-btn"
                      onClick={() => navigate('/shop')}
                    >
                      Shop Piece
                    </button>
                  </div>
                </div>
              </div>

              <div className="magazine-footer">
                <span>STUDIO STUDY</span>
                <span>{current.rightPageNum}</span>
              </div>
            </div>
          </div>

          {/* Magazine controls */}
          <div className="magazine-controls">
            <button className="magazine-nav-btn" onClick={prevSpread} aria-label="Previous page">
              <ChevronLeft size={20} />
            </button>
            <div className="magazine-dots">
              {spreads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSpread(index)}
                  className={`magazine-dot ${index === activeSpread ? 'active' : ''}`}
                  aria-label={`Go to spread ${index + 1}`}
                />
              ))}
            </div>
            <button className="magazine-nav-btn" onClick={nextSpread} aria-label="Next page">
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* Lookbook Editorial Section (Split Grid Mockup Layout) */}
        <section ref={heroRef} className="lookbook-editorial-section">
          <div className="editorial-split-container">
            {/* LEFT IMAGE COLUMN */}
            <div className="editorial-left-col">
              <div className="editorial-image-container">
                {editorialIssues.map((issue, idx) => (
                  <img 
                    key={issue.id}
                    src={issue.image} 
                    alt={issue.featuredLook} 
                    className={`editorial-hero-image ${activeIssue === idx ? 'editorial-hero-image--active' : ''}`}
                  />
                ))}
                <div className="editorial-image-overlay"></div>
                {editorialIssues.map((issue, idx) => (
                  <div 
                    key={issue.id}
                    className={`editorial-left-content ${activeIssue === idx ? 'editorial-left-content--active' : ''}`}
                  >
                    <span className="editorial-featured-label">FEATURED LOOK</span>
                    <h3 className="editorial-featured-title">{issue.featuredLook}</h3>
                    <p className="editorial-featured-desc">{issue.featuredDesc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT DETAILS COLUMN */}
            <div className="editorial-right-col">
              {/* Leaf shadow background pattern */}
              <div className="editorial-leaf-shadow"></div>

              <div className="editorial-content-box">
                <span className="editorial-tag">LOOKBOOK</span>
                
                <div className="editorial-slides-wrapper">
                  {editorialIssues.map((issue, idx) => (
                    <div 
                      key={issue.id} 
                      className={`editorial-text-slide ${activeIssue === idx ? 'editorial-text-slide--active' : ''}`}
                    >
                      <h2 className="editorial-title">{issue.title}</h2>
                      
                      <hr className="editorial-divider" />
                      
                      <p className="editorial-desc">{issue.description}</p>
                      
                      <hr className="editorial-divider" />
                      
                      <span className="editorial-season">{issue.season}</span>
                    </div>
                  ))}
                </div>
                
                <button className="editorial-explore-btn" onClick={handleScrollToMagazine}>
                  EXPLORE THE ISSUE
                </button>
              </div>

              {/* Bottom controls */}
              <div className="editorial-controls">
                <button className="control-arrow" onClick={prevIssue}>
                  <ChevronLeft size={20} />
                </button>
                <div className="control-dots">
                  {editorialIssues.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`control-dot ${activeIssue === idx ? 'control-dot--active' : ''}`}
                      onClick={() => setActiveIssue(idx)}
                    ></span>
                  ))}
                </div>
                <button className="control-arrow" onClick={nextIssue}>
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Right vertical tracker */}
              <div className="editorial-vertical-tracker">
                <span className="tracker-num">01</span>
                <div className="tracker-line">
                  <div 
                    className="tracker-progress" 
                    style={{ height: `${((activeIssue + 1) / editorialIssues.length) * 100}%` }}
                  ></div>
                </div>
                <span className="tracker-num">0{editorialIssues.length}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Collage Section matching design mockup */}
        <section ref={collageContainerRef} className="lookbook-collage-section">
          <div className="collage-container">
            {/* Header */}
            <div className="collage-header">
              <h2>Autumn/Winter '24</h2>
              <button onClick={() => navigate('/shop')} className="view-all-link">
                <span>View All Looks</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Collage Grid */}
            <div className="collage-grid">
              {/* Left Column Stack */}
              <div className="collage-left-stack">
                <div ref={collageLeftTopRef} className="collage-img-wrapper img-top">
                  <LazyImage
                    src="/images/lookbook_collage_1.png"
                    alt="Autumn Winter Folded Clothes"
                    loading="lazy"
                  />
                </div>
                <div ref={collageLeftBottomRef} className="collage-img-wrapper img-bottom">
                  <LazyImage
                    src="/images/lookbook_collage_2.png"
                    alt="Leather Bags workshop"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Center Column - Interactive Phone Mockup */}
              <div ref={collagePhoneRef} className="collage-center-phone">
                <div className="phone-mockup">
                  <div className="phone-screen">
                    <div className="phone-header">
                      <span>Lookbook - Asha Boutique</span>
                      <span className="text-xs font-semibold">• • •</span>
                    </div>

                    <div className="phone-content" onClick={() => setPhoneSlide((prev) => (prev + 1) % phoneSlides.length)}>
                      <div className="phone-slide-track">
                        {phoneSlides.map((slide, index) => (
                          <div
                            key={slide.id}
                            className={`phone-slide ${index === phoneSlide ? 'active' : ''}`}
                          >
                            <img src={slide.image} alt={slide.tag} />
                            <div className="phone-slide-overlay">
                              <span className="phone-tag">{slide.tag}</span>
                              <h4 className="phone-brand">{slide.brand}</h4>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Navigation Dots */}
                      <div className="phone-nav-dots">
                        {phoneSlides.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhoneSlide(index);
                            }}
                            className={`phone-nav-dot ${index === phoneSlide ? 'active' : ''}`}
                            aria-label={`Go to phone slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Navigation bar icons at bottom */}
                    <div className="phone-footer">
                      <span className="phone-footer-icon" onClick={() => navigate('/')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      </span>
                      <span className="phone-footer-icon" onClick={() => navigate('/shop')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      </span>
                      <span className="phone-footer-icon" onClick={() => navigate('/shop')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                      </span>
                      <span className="phone-footer-icon" onClick={() => navigate('/wishlist')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                      </span>
                      <span className="phone-footer-icon" onClick={() => navigate(user ? '/dashboard' : '/login')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Stack */}
              <div className="collage-right-stack">
                <div ref={collageRightRef} className="collage-img-wrapper img-right">
                  <LazyImage
                    src="/images/lookbook_collage_3.png"
                    alt="Autumn Winter Styling Model"
                    loading="lazy"
                  />
                </div>

                {/* Spotlight frosted glass card */}
                <div className="spotlight-card">
                  <span className="spotlight-tag">ARTISAN SPOTLIGHT</span>
                  <h3>Crafting with Intention</h3>
                  <p>
                    Every thread tells a story of craftsmanship. Our seasonal lookbooks ensure that the
                    journey from raw wool and organic fibers to finished designs is fully custom, and
                    tailored to bring signature comfort to your winter wardrobe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instagram Loop Scrolling Section */}
        <section ref={instaRef} className="insta-section">
          <div className="insta-header">
            <h2 className="insta-header__title">Shop Our Instagram</h2>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="insta-header__handle"
            >
              <span className="flex items-center justify-center gap-1.5">
                <Instagram size={18} />
                @ashaboutique.store
              </span>
            </a>
          </div>

          {/* Infinite horizontal marquee scroller */}
          <div className="insta-marquee-container">
            <div className="insta-marquee-track">
              {duplicatedPosts.map((post, index) => (
                <div key={`${post.id}-${index}`} className="insta-item group">
                  <LazyImage
                    src={post.image}
                    alt={post.caption}
                    className="insta-item__image"
                    loading="lazy"
                  />
                  <div className="insta-item__overlay">
                    <div className="insta-item__icon">
                      <Instagram size={24} />
                    </div>
                    <div className="insta-item__stats">
                      <span className="insta-item__stat">
                        <Heart size={16} fill="white" />
                        {post.likes}
                      </span>
                      <span className="insta-item__stat">
                        <MessageCircle size={16} fill="white" />
                        {post.comments}
                      </span>
                    </div>
                    <p className="insta-item__caption">{post.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Shop Section */}
        <section ref={ctaRef} className="lookbook-cta">
          <h2 className="lookbook-cta__title">Curate Your Custom Capsule</h2>
          <p className="lookbook-cta__text">
            All pieces featured in our seasonal issues and style grids are hand-crafted and available in limited quantities.
          </p>
          <button className="lookbook-cta__btn" onClick={() => navigate('/shop')}>
            Browse Full Collection
          </button>
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

      {/* Dialogs */}
      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        onSubmit={handleBookingSubmit}
        user={user}
      />

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
    </>
  );
};

export default Lookbook;
