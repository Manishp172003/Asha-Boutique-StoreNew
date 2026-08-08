import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import gsap from 'gsap';
import './BackToTop.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 500;

      if (shouldShow && !isVisible) {
        setIsVisible(true);
        gsap.to(buttonRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else if (!shouldShow && isVisible) {
        setIsVisible(false);
        gsap.to(buttonRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    if (buttonRef.current) {
      buttonRef.current.addEventListener('click', scrollToTop);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('click', scrollToTop);
      }
    };
  }, [isVisible]);

  return (
    <button
      ref={buttonRef}
      className="back-to-top"
      aria-label="Back to top"
      style={{ opacity: 0, scale: 0.8 }}
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default BackToTop;
