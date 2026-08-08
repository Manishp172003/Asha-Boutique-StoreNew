import { useState, useRef, useEffect } from 'react';
import './LazyImage.css';

const LazyImage = ({ src, alt, className, loading = 'lazy', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(loading === 'eager');
  const [isInView, setIsInView] = useState(loading === 'eager');
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (loading === 'eager') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`lazy-image-wrapper ${className || ''}`}>
      {!isLoaded && <div className="lazy-image-placeholder" />}
      {hasError ? (
        <div className="lazy-image-fallback">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" className="fallback-svg">
            <rect width="100" height="120" fill="#F5F1EC" />
            <text x="50" y="55" dominantBaseline="middle" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="8" fill="#B08D7D" letterSpacing="0.05em">ASHA BOUTIQUE</text>
            <circle cx="50" cy="75" r="10" stroke="#B08D7D" strokeWidth="0.5" fill="none" />
            <path d="M 45 75 L 55 75 M 50 70 L 50 80" stroke="#B08D7D" strokeWidth="0.5" />
          </svg>
        </div>
      ) : (
        <img
          src={isInView ? src : undefined}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
