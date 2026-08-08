import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const PageTransition = ({ children }) => {
  const containerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Fade out
    gsap.to(container, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        // Fade in
        gsap.to(container, {
          opacity: 1,
          duration: 0.15,
          ease: 'power2.out'
        });
      }
    });
  }, [location.pathname]);

  return (
    <div ref={containerRef} style={{ opacity: 1 }}>
      {children}
    </div>
  );
};

export default PageTransition;
