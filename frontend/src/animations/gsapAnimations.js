import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Hero section animations
export const animateHeroSection = (heroRef) => {
  const ctx = gsap.context(() => {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
      gsap.fromTo(heroImage,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
      )
    }

    const heroHeadline = document.querySelector('.hero-headline');
    if (heroHeadline) {
      gsap.fromTo(heroHeadline,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
      )
    }

    const heroSubheadline = document.querySelector('.hero-subheadline');
    if (heroSubheadline) {
      gsap.fromTo(heroSubheadline,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power2.out' }
      )
    }

    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
      gsap.fromTo(heroCta,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power2.out' }
      )
    }

    const heroCard = document.querySelector('.hero-card');
    if (heroCard) {
      gsap.fromTo(heroCard,
        { opacity: 0, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.6, ease: 'power2.out' }
      )
    }
  }, heroRef)

  return ctx
}

// New Arrivals section animations
export const animateNewArrivals = (newArrivalsRef) => {
  const ctx = gsap.context(() => {
    const leftImage = document.querySelector('.new-arrivals-left');
    if (leftImage && newArrivalsRef?.current) {
      gsap.fromTo(leftImage,
        { x: '-60vw' },
        {
          x: 0,
          scrollTrigger: {
            trigger: newArrivalsRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1
          }
        }
      )
    }

    const rightImage = document.querySelector('.new-arrivals-right');
    if (rightImage && newArrivalsRef?.current) {
      gsap.fromTo(rightImage,
        { x: '60vw' },
        {
          x: 0,
          scrollTrigger: {
            trigger: newArrivalsRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1
          }
        }
      )
    }

    const badge = document.querySelector('.new-badge');
    if (badge && newArrivalsRef?.current) {
      gsap.fromTo(badge,
        { scale: 0.2, rotate: -12, opacity: 0 },
        {
          scale: 1, rotate: 0, opacity: 1,
          scrollTrigger: {
            trigger: newArrivalsRef.current,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1
          }
        }
      )
    }
  }, newArrivalsRef)

  return ctx
}

// Curated Collection section animations
export const animateCuratedCollection = (curatedRef) => {
  const ctx = gsap.context(() => {
    const curatedImage = document.querySelector('.curated-image');
    if (curatedImage && curatedRef?.current) {
      gsap.fromTo(curatedImage,
        { x: '60vw', opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: curatedRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
          }
        }
      )
    }

    const curatedText = document.querySelector('.curated-text');
    if (curatedText && curatedRef?.current) {
      gsap.fromTo(curatedText,
        { x: '-40vw', opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: curatedRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
          }
        }
      )
    }
  }, curatedRef)

  return ctx
}

// Atelier section animations
export const animateAtelier = (atelierRef) => {
  const ctx = gsap.context(() => {
    const atelierImage = document.querySelector('.atelier-image');
    if (atelierImage && atelierRef?.current) {
      gsap.fromTo(atelierImage,
        { x: '-70vw' },
        {
          x: 0,
          scrollTrigger: {
            trigger: atelierRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
          }
        }
      )
    }

    const atelierText = document.querySelector('.atelier-text');
    if (atelierText && atelierRef?.current) {
      gsap.fromTo(atelierText,
        { x: '50vw', opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: atelierRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
          }
        }
      )
    }
  }, atelierRef)

  return ctx
}

// Trending section animations
export const animateTrending = (trendingRef) => {
  const ctx = gsap.context(() => {
    const trendingCards = document.querySelectorAll('.trending-card');
    if (trendingCards.length > 0 && trendingRef?.current) {
      gsap.fromTo(trendingCards,
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.08,
          scrollTrigger: {
            trigger: trendingRef.current,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1
          }
        }
      )
    }
  }, trendingRef)

  return ctx
}

// Style Edit section animations
export const animateStyleEdit = (styleEditRef) => {
  const ctx = gsap.context(() => {
    const styleImage = document.querySelector('.style-image');
    if (styleImage && styleEditRef?.current) {
      gsap.fromTo(styleImage,
        { x: '60vw', opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: styleEditRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
          }
        }
      )
    }

    const styleText = document.querySelector('.style-text');
    if (styleText && styleEditRef?.current) {
      gsap.fromTo(styleText,
        { x: '-40vw', opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: styleEditRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
          }
        }
      )
    }
  }, styleEditRef)

  return ctx
}

// Initialize all scroll animations
export const initializeScrollAnimations = (refs) => {
  const contexts = []
  
  if (refs.newArrivalsRef) {
    contexts.push(animateNewArrivals(refs.newArrivalsRef))
  }
  
  if (refs.curatedRef) {
    contexts.push(animateCuratedCollection(refs.curatedRef))
  }
  
  if (refs.atelierRef) {
    contexts.push(animateAtelier(refs.atelierRef))
  }
  
  if (refs.trendingRef) {
    contexts.push(animateTrending(refs.trendingRef))
  }
  
  if (refs.styleEditRef) {
    contexts.push(animateStyleEdit(refs.styleEditRef))
  }
  
  return contexts
}

// Cleanup function for all animations
export const cleanupAnimations = (contexts) => {
  if (!contexts) return;

  const list = Array.isArray(contexts) ? contexts : [contexts];

  list.forEach(ctx => {
    if (ctx && typeof ctx.revert === 'function') {
      ctx.revert();
    }
  });
}

// ===== REUSABLE GSAP UTILITY FUNCTIONS =====

// Fade in animation for elements
export const fadeIn = (selector, ref, options = {}) => {
  const ctx = gsap.context(() => {
    const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
    if (elements.length > 0 && ref?.current) {
      gsap.fromTo(elements,
        { opacity: 0, y: options.y || 20 },
        {
          opacity: 1,
          y: 0,
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.ease || 'power2.out',
          scrollTrigger: options.scrollTrigger ? {
            trigger: ref.current,
            start: options.scrollTrigger.start || 'top 80%',
            end: options.scrollTrigger.end || 'top 40%',
            scrub: options.scrollTrigger.scrub || 1
          } : undefined
        }
      )
    }
  }, ref)
  return ctx
}

// Stagger animation for lists/cards
export const staggerFadeIn = (selector, ref, options = {}) => {
  const ctx = gsap.context(() => {
    const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
    if (elements.length > 0 && ref?.current) {
      gsap.fromTo(elements,
        { opacity: 0, y: options.y || 30, scale: options.scale || 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: options.stagger || 0.1,
          duration: options.duration || 0.7,
          ease: options.ease || 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: options.start || 'top 85%',
            end: options.end || 'top 40%',
            scrub: options.scrub || 1
          }
        }
      )
    }
  }, ref)
  return ctx
}

// Slide from left animation
export const slideFromLeft = (selector, ref, options = {}) => {
  const ctx = gsap.context(() => {
    const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
    if (elements.length > 0 && ref?.current) {
      gsap.fromTo(elements,
        { x: options.x || '-40vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: options.start || 'top 80%',
            end: options.end || 'top 30%',
            scrub: options.scrub || 1
          }
        }
      )
    }
  }, ref)
  return ctx
}

// Slide from right animation
export const slideFromRight = (selector, ref, options = {}) => {
  const ctx = gsap.context(() => {
    const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
    if (elements.length > 0 && ref?.current) {
      gsap.fromTo(elements,
        { x: options.x || '40vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: options.start || 'top 80%',
            end: options.end || 'top 30%',
            scrub: options.scrub || 1
          }
        }
      )
    }
  }, ref)
  return ctx
}

// Scale animation
export const scaleIn = (selector, ref, options = {}) => {
  const ctx = gsap.context(() => {
    const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
    if (elements.length > 0 && ref?.current) {
      gsap.fromTo(elements,
        { scale: options.fromScale || 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: options.duration || 0.6,
          ease: options.ease || 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: options.start || 'top 80%',
            end: options.end || 'top 40%',
            scrub: options.scrub || 1
          }
        }
      )
    }
  }, ref)
  return ctx
}

// Shop page animations
export const animateShopPage = (refs) => {
  const contexts = []

  if (refs.heroRef && refs.heroRef.current) {
    const hero = refs.heroRef.current;
    
    // Parallax Scroll for background image
    const parallaxBg = gsap.fromTo(".shop-hero img",
      { yPercent: 0, scale: 1 },
      {
        yPercent: 12,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      }
    );
    
    // Parallax Scroll/fade for content overlay
    const parallaxContent = gsap.fromTo(".shop-hero-overlay",
      { y: 0, opacity: 1 },
      {
        y: -100,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // Entrance Load Animations for Title & Subtitle
    const entranceTitle = gsap.fromTo(".shop-hero-title",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.1, ease: "power3.out" }
    );
    const entranceSubtitle = gsap.fromTo(".shop-hero-subtitle",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.3, ease: "power3.out" }
    );

    contexts.push({ revert: () => {
      parallaxBg.scrollTrigger?.kill();
      parallaxBg.kill();
      parallaxContent.scrollTrigger?.kill();
      parallaxContent.kill();
      entranceTitle.kill();
      entranceSubtitle.kill();
    }});
  }

  if (refs.containerRef) {
    contexts.push(slideFromLeft('.shop-sidebar', refs.containerRef, { x: '-30vw' }))
  }

  if (refs.productGridRef) {
    contexts.push(staggerFadeIn('.product-card', refs.productGridRef, {
      y: 40,
      stagger: 0.08,
      start: 'top 85%'
    }))
  }

  if (refs.paginationRef) {
    contexts.push(fadeIn('.pagination', refs.paginationRef, { y: 20 }))
  }

  if (refs.newsletterRef) {
    contexts.push(scaleIn('.newsletter', refs.newsletterRef, { fromScale: 0.9 }))
  }

  return contexts
}

// Product page animations
export const animateProductPage = (refs) => {
  const contexts = []
  
  if (refs.galleryRef) {
    contexts.push(slideFromLeft('.product-gallery', refs.galleryRef, { x: '-20vw' }))
  }
  
  if (refs.infoRef) {
    contexts.push(slideFromRight('.product-info', refs.infoRef, { x: '20vw' }))
  }
  
  if (refs.tabsRef) {
    contexts.push(fadeIn('.description-tabs', refs.tabsRef))
  }
  
  if (refs.relatedRef) {
    contexts.push(staggerFadeIn('.related-product-card', refs.relatedRef, { stagger: 0.1 }))
  }
  
  if (refs.recentlyRef) {
    contexts.push(staggerFadeIn('.recently-viewed-card', refs.recentlyRef, { stagger: 0.1 }))
  }
  
  return contexts
}

// Cart page animations
export const animateCartPage = (refs) => {
  const contexts = []
  
  if (refs.cartItemsRef) {
    contexts.push(staggerFadeIn('.cart-item', refs.cartItemsRef, { 
      y: 20, 
      stagger: 0.1,
      start: 'top 90%'
    }))
  }
  
  if (refs.orderSummaryRef) {
    contexts.push(fadeIn('.order-summary', refs.orderSummaryRef, { y: 30 }))
  }
  
  if (refs.recommendedRef) {
    contexts.push(staggerFadeIn('.recommended-product-card', refs.recommendedRef, { stagger: 0.1 }))
  }
  
  return contexts
}

// Checkout page animations
export const animateCheckoutPage = (refs) => {
  const contexts = []
  
  if (refs.formRef) {
    contexts.push(fadeIn('.checkout-form', refs.formRef, { y: 30 }))
  }
  
  if (refs.summaryRef) {
    contexts.push(fadeIn('.checkout-summary', refs.summaryRef, { y: 30, delay: 0.2 }))
  }
  
  return contexts
}

// Wishlist page animations
export const animateWishlistPage = (refs) => {
  const contexts = []
  
  if (refs.wishlistRef) {
    contexts.push(staggerFadeIn('.wishlist-card', refs.wishlistRef, { 
      y: 40, 
      stagger: 0.1 
    }))
  }
  
  return contexts
}

// Orders page animations
export const animateOrdersPage = (refs) => {
  const contexts = []
  
  if (refs.ordersRef) {
    contexts.push(staggerFadeIn('.order-card', refs.ordersRef, { 
      y: 30, 
      stagger: 0.12 
    }))
  }
  
  return contexts
}

// Order Details page animations
export const animateOrderDetailsPage = (refs) => {
  const contexts = []
  
  if (refs.breadcrumbRef) {
    contexts.push(fadeIn('.order-breadcrumb', refs.breadcrumbRef, { y: 10 }))
  }
  
  if (refs.detailsRef) {
    contexts.push(fadeIn('.order-details-section', refs.detailsRef, { y: 20 }))
  }
  
  if (refs.timelineRef) {
    contexts.push(staggerFadeIn('.timeline-item', refs.timelineRef, { 
      y: 20, 
      stagger: 0.15 
    }))
  }
  
  return contexts
}

// Profile page animations
export const animateProfilePage = (refs) => {
  const contexts = []
  
  if (refs.sidebarRef) {
    contexts.push(slideFromLeft('.account-sidebar', refs.sidebarRef, { x: '-20vw' }))
  }
  
  if (refs.contentRef) {
    contexts.push(staggerFadeIn('.profile-card', refs.contentRef, { 
      y: 30, 
      stagger: 0.1 
    }))
  }
  
  return contexts
}

// Addresses page animations
export const animateAddressesPage = (refs) => {
  const contexts = []
  
  if (refs.sidebarRef) {
    contexts.push(slideFromLeft('.account-sidebar', refs.sidebarRef, { x: '-20vw' }))
  }
  
  if (refs.headerRef) {
    contexts.push(fadeIn('.address-header', refs.headerRef, { y: 20 }))
  }
  
  if (refs.addressListRef) {
    contexts.push(staggerFadeIn('.address-card', refs.addressListRef, { 
      y: 30, 
      stagger: 0.1 
    }))
  }
  
  return contexts
}

// Refresh ScrollTrigger positions
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
}

// Lookbook page entrance animations
export const animateLookbookPage = (refs) => {
  const contexts = []

  if (refs.carouselHeroRef && refs.carouselHeroRef.current) {
    const hero = refs.carouselHeroRef.current;
    
    // 3D Parallax ScrollTrigger for background slide images
    gsap.fromTo(".lookbook-carousel-hero__slide-image",
      { yPercent: 0, scale: 1 },
      {
        yPercent: 12,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // 3D Lift ScrollTrigger for title overlays
    gsap.fromTo(".lookbook-carousel-hero__content",
      { y: 0, opacity: 1 },
      {
        y: -100,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // Entrance Load Animations
    gsap.fromTo(".lookbook-carousel-hero__title",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.1, ease: "power3.out" }
    );

    gsap.fromTo(".lookbook-carousel-hero__subtitle",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.3, ease: "power3.out" }
    );

    gsap.fromTo(".lookbook-carousel-hero__scroll-indicator",
      { opacity: 0 },
      { opacity: 1, duration: 1.2, delay: 0.8, ease: "power2.out" }
    );
  }

  if (refs.heroRef) {
    contexts.push(fadeIn('.lookbook-editorial-section', refs.heroRef, { y: 30, duration: 1.2 }))
  }

  if (refs.magazineRef) {
    contexts.push(fadeIn('.magazine', refs.magazineRef, { y: 40, duration: 1.2, delay: 0.2 }))
    contexts.push(fadeIn('.magazine-controls', refs.magazineRef, { y: 15, duration: 0.8, delay: 0.4 }))
  }

  if (refs.collageContainerRef && refs.collageContainerRef.current) {
    // Parallax left top image: moves slightly slower (moves down)
    const imgTop = refs.collageLeftTopRef?.current;
    if (imgTop) {
      gsap.fromTo(imgTop, 
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: refs.collageContainerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }

    // Parallax left bottom image: moves slightly faster (moves up)
    const imgBottom = refs.collageLeftBottomRef?.current;
    if (imgBottom) {
      gsap.fromTo(imgBottom,
        { yPercent: 6 },
        {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: refs.collageContainerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }

    // Parallax right image: moves slightly slower (moves down)
    const imgRight = refs.collageRightRef?.current;
    if (imgRight) {
      gsap.fromTo(imgRight,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: refs.collageContainerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }

    // Entrance fade-in for phone mockup
    const phone = refs.collagePhoneRef?.current;
    if (phone) {
      gsap.fromTo(phone,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: refs.collageContainerRef.current,
            start: "top 95%",
            toggleActions: "play none none none"
          }
        }
      );
    }
 
    // Fade-in header and cards
    contexts.push(fadeIn('.collage-header', refs.collageContainerRef, { y: 20, duration: 1, start: 'top 95%' }));
    contexts.push(fadeIn('.spotlight-card', refs.collageContainerRef, { y: 25, duration: 1.2, delay: 0.2, start: 'top 95%' }));
  }

  if (refs.instaRef) {
    contexts.push(fadeIn('.insta-header', refs.instaRef, { y: 20, duration: 1 }))
    contexts.push(fadeIn('.insta-marquee-container', refs.instaRef, { y: 30, duration: 1.2, delay: 0.1 }))
  }

  if (refs.ctaRef) {
    contexts.push(scaleIn('.lookbook-cta', refs.ctaRef, { fromScale: 0.95 }))
  }

  // Refresh ScrollTrigger positions after all layout items settle
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);

  return contexts
}

// Atelier story page entrance animations
export const animateAtelierPage = (refs) => {
  const contexts = []

  if (refs.heroRef) {
    contexts.push(fadeIn('.atelier-story-hero', refs.heroRef, { y: 30, duration: 1.2 }))
  }

  if (refs.narrativeRef) {
    contexts.push(slideFromLeft('.atelier-story-narrative__image', refs.narrativeRef, { x: '-20vw', duration: 1.2 }))
    contexts.push(fadeIn('.atelier-story-narrative__content', refs.narrativeRef, { y: 25, duration: 1.2, delay: 0.15 }))
  }

  if (refs.servicesRef) {
    contexts.push(staggerFadeIn('.atelier-story-service-card', refs.servicesRef, { y: 30, stagger: 0.1, start: 'top 85%' }))
  }

  if (refs.pillarsRef) {
    contexts.push(staggerFadeIn('.atelier-story-pillar-card', refs.pillarsRef, { y: 20, stagger: 0.1, start: 'top 85%' }))
  }

  return contexts
}
