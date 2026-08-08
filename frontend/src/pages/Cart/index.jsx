import "./Cart.css";
import { useRef, useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { animateCartPage, cleanupAnimations } from "../../animations/gsapAnimations";
import { CartSkeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";
import { ShoppingBag } from "lucide-react";

import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

import CartBreadcrumb from "./components/CartBreadcrumb/CartBreadcrumb";
import CartTable from "./components/CartTable/CartTable";
import OrderSummary from "./components/OrderSummary/OrderSummary";
import RecommendedProducts from "./components/RecommendedProducts/RecommendedProducts";
import Newsletter from "../Shop/components/Newsletter/Newsletter";

const Cart = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { cart, user, mobileMenuOpen, setCartOpen, setBookingOpen, setMobileMenuOpen, handleLogout } = useApp();

    const cartItemsRef = useRef(null);
    const orderSummaryRef = useRef(null);
    const recommendedRef = useRef(null);

    const handleCartOpen = () => {
        setCartOpen(true);
    };

    const handleBookingOpen = () => {
        setBookingOpen(true);
    };

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Simulate API loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    // Initialize animations after data loads
    useEffect(() => {
        if (!isLoading) {
            const contexts = animateCartPage({
                cartItemsRef,
                orderSummaryRef,
                recommendedRef
            });
            return () => cleanupAnimations(contexts);
        }
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className="cart-page">
                <Navigation
                    user={user}
                    cart={cart}
                    onCartOpen={() => setCartOpen(true)}
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
                <CartSkeleton />
                <Footer
                    onScrollToSection={() => {}}
                    trendingRef={null}
                    styleEditRef={null}
                    atelierRef={null}
                    heroRef={null}
                />
            </div>
        );
    }

    const cartTotal = cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (

        <div className="cart-page">

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

            <CartBreadcrumb />

            {cart.length === 0 ? (
                <EmptyState
                    icon={ShoppingBag}
                    title="Your Shopping Bag is Empty"
                    description="Add handcrafted boutique pieces to begin your journey."
                    buttonText="Explore Collection"
                    buttonRoute="/shop"
                />
            ) : (
                <section className="cart-container">

                    <div ref={cartItemsRef}>
                        <CartTable cartItems={cart} />
                    </div>

                    <div ref={orderSummaryRef}>
                        <OrderSummary cartTotal={cartTotal} cartCount={cartCount} />
                    </div>

                </section>
            )}

            {cart.length > 0 && (
                <div ref={recommendedRef}>
                    <RecommendedProducts />
                </div>
            )}

            <Newsletter />

            <Footer
                onScrollToSection={() => {}}
                trendingRef={null}
                styleEditRef={null}
                atelierRef={null}
                heroRef={null}
                onBookingOpen={handleBookingOpen}
            />

        </div>

    );

};

export default Cart;