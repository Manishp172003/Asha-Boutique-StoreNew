import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    // GSAP animation
    if (typeof window !== 'undefined' && window.gsap) {
      const gsap = window.gsap;
      
      const ctx = gsap.context(() => {
        gsap.fromTo('.notfound-404',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
        );
        
        gsap.fromTo('.notfound-icon',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.7, delay: 0.2, ease: 'power2.out' }
        );
        
        gsap.fromTo('.notfound-subtitle',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: 'power2.out' }
        );
        
        gsap.fromTo('.notfound-description',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.4, ease: 'power2.out' }
        );
        
        gsap.fromTo('.notfound-buttons',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: 'power2.out' }
        );
      }, containerRef);
      
      return () => ctx.revert();
    }
  }, []);

  return (
    <div ref={containerRef} className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-icon">
          <SearchX size={80} />
        </div>
        <h1 className="notfound-404">404</h1>
        <h2 className="notfound-subtitle">Oops!</h2>
        <p className="notfound-description">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="notfound-buttons">
          <Button 
            className="notfound-button primary" 
            onClick={() => navigate('/')}
          >
            Back Home
          </Button>
          <Button 
            className="notfound-button outline" 
            variant="outline"
            onClick={() => navigate('/shop')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
