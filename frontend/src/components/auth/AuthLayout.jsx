import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import LazyImage from '../common/LazyImage';

const AuthLayout = ({ children, imageSrc = "/images/curated_collection.jpg", imageAlt = "Asha Boutique", reverse = false }) => {
  const pageRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isDesktop = window.innerWidth > 1024;
      
      if (isDesktop) {
        if (reverse) {
          // Register: image (left ref, right visually) slides from left.
          // Form (right ref, left visually) slides from right.
          gsap.from(leftRef.current, {
            x: -650,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
          });
          gsap.from(rightRef.current, {
            x: 650,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
          });
        } else {
          // Login: image slides from right, form slides from left.
          gsap.from(leftRef.current, {
            x: 650,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
          });
          gsap.from(rightRef.current, {
            x: -650,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
          });
        }
      } else {
        // Mobile / Tablet: fade slide up
        gsap.from(rightRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, [reverse]);

  return (
    <section ref={pageRef} className={`auth-page ${reverse ? "auth-page--reverse" : ""}`}>
      {/* Left Side */}
      <div ref={leftRef} className="auth-left">
        <LazyImage
          src={imageSrc}
          alt={imageAlt}
          className="auth-image"
          loading="eager"
        />
      </div>

      {/* Right Side */}
      <div ref={rightRef} className="auth-right">
        {children}
      </div>
    </section>
  );
};

export default AuthLayout;

