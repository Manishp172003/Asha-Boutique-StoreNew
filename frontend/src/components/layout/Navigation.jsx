import { ShoppingBag, User, LogOut, Menu, X, Heart, Search } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useApp } from '../../context/AppContext'
import { useState } from 'react'
import { products } from '../../data/products'

const Navigation = ({
  user,
  cart,
  onCartOpen,
  onLogout,
  onBookingOpen,
  onScrollToSection,
  trendingRef,
  styleEditRef,
  atelierRef,
  heroRef,
  mobileMenuOpen,
  onMobileMenuToggle,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist = [] } = useApp();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on query
  const searchResults = searchQuery.trim().length > 0 
    ? (products || []).filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Show top 5 suggestions
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSearch(false);
    setSearchQuery('');
  };

  const handleScrollToSection = (section) => {
    if (mobileMenuOpen) {
      onMobileMenuToggle();
    }
    if (location.pathname === '/') {
      // Already on Home page, use direct scroll
      onScrollToSection(section);
    } else {
      // Navigate to Home with section state
      navigate('/', { state: { scrollTo: section } });
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleUserIconClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleMobileUserIconClick = () => {
    if (user) {
      navigate('/dashboard');
      onMobileMenuToggle();
    } else {
      navigate('/login');
      onMobileMenuToggle();
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-2 md:px-6 md:py-4 flex items-center justify-between bg-[#F6F2EE]/80 backdrop-blur-md w-full overflow-x-hidden">
        <Link to="/" className="flex items-center gap-2.5 flex-1 justify-start min-w-0">
          <img src="/images/logo.png" alt="Asha Boutique Logo" className="h-8 w-8 md:h-10 md:w-10 object-contain rounded-full" />
          <span className="font-serif text-sm md:text-xl font-semibold text-[#2B1E1A] truncate">Asha Boutique Store</span>
        </Link>
        
        {/* Desktop Nav - Middle Menu links */}
        <div className="hidden md:flex items-center justify-center gap-8 flex-1">
          <button 
            onClick={() => handleScrollToSection(heroRef)} 
            className={`text-sm transition-colors relative py-1.5 ${
              location.pathname === '/' ? 'text-[#E46A53] font-semibold' : 'text-[#2B1E1A] hover:text-[#E46A53]'
            }`}
          >
            Home
            {location.pathname === '/' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#E46A53] rounded-full"></span>
            )}
          </button>
          <Link 
            to="/shop" 
            className={`text-sm transition-colors relative py-1.5 ${
              location.pathname.startsWith('/shop') || location.pathname.startsWith('/product') ? 'text-[#E46A53] font-semibold' : 'text-[#2B1E1A] hover:text-[#E46A53]'
            }`}
          >
            Shop
            {(location.pathname.startsWith('/shop') || location.pathname.startsWith('/product')) && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#E46A53] rounded-full"></span>
            )}
          </Link>
          <Link 
            to="/lookbook" 
            className={`text-sm transition-colors relative py-1.5 ${
              location.pathname.startsWith('/lookbook') ? 'text-[#E46A53] font-semibold' : 'text-[#2B1E1A] hover:text-[#E46A53]'
            }`}
          >
            Lookbook
            {location.pathname.startsWith('/lookbook') && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#E46A53] rounded-full"></span>
            )}
          </Link>
          <Link 
            to="/atelier" 
            className={`text-sm transition-colors relative py-1.5 ${
              location.pathname.startsWith('/atelier') ? 'text-[#E46A53] font-semibold' : 'text-[#2B1E1A] hover:text-[#E46A53]'
            }`}
          >
            Atelier
            {location.pathname.startsWith('/atelier') && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#E46A53] rounded-full"></span>
            )}
          </Link>
        </div>

        {/* Desktop Nav - Right Actions */}
        <div className="hidden md:flex items-center gap-6 justify-end flex-1">
          {user ? (
            <>
              {/* Search Icon */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`text-[#2B1E1A] hover:text-[#E46A53] transition-colors ${showSearch ? 'text-[#E46A53]' : ''}`}
                title="Search Products"
              >
                <Search size={22} />
              </button>

              {/* Wishlist Icon */}
              <button
                onClick={() => navigate('/wishlist')}
                className="relative text-[#2B1E1A] hover:text-[#E46A53] transition-colors"
                title="Wishlist"
              >
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E46A53] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <button
                onClick={handleCartClick}
                className="relative text-[#2B1E1A] hover:text-[#E46A53] transition-colors"
                title="Shopping Cart"
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E46A53] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User/Login */}
              <button
                onClick={handleUserIconClick}
                className="text-[#2B1E1A] hover:text-[#E46A53] transition-colors"
                title="My Account"
              >
                <User size={22} />
              </button>

              <Button
                onClick={onBookingOpen}
                className="bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full px-5 h-9 text-xs font-semibold"
              >
                Book Appointment
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full px-6 h-9 text-xs font-semibold"
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2.5 flex-shrink-0">
          {user ? (
            <>
              {/* Search Icon Mobile */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`text-[#2B1E1A] hover:text-[#E46A53] transition-colors flex-shrink-0 ${showSearch ? 'text-[#E46A53]' : ''}`}
                title="Search Products"
              >
                <Search size={18} />
              </button>

              {/* Wishlist Icon Mobile */}
              <button
                onClick={() => navigate('/wishlist')}
                className="relative text-[#2B1E1A] hover:text-[#E46A53] transition-colors flex-shrink-0"
                title="Wishlist"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E46A53] text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Icon Mobile */}
              <button
                onClick={handleCartClick}
                className="relative text-[#2B1E1A] hover:text-[#E46A53] transition-colors flex-shrink-0"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E46A53] text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User/Login Mobile */}
              <button
                onClick={handleMobileUserIconClick}
                className="text-[#2B1E1A] hover:text-[#E46A53] transition-colors flex-shrink-0"
                title="My Account"
              >
                <User size={18} />
              </button>
            </>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full px-4 h-8 text-[11px] font-semibold"
            >
              Login
            </Button>
          )}

          <button
            className="text-[#2B1E1A] flex-shrink-0"
            onClick={onMobileMenuToggle}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Dynamic Search Dropdown Overlay */}
      {showSearch && (
        <div className="fixed top-[52px] md:top-[76px] left-0 right-0 bg-[#F6F2EE]/95 backdrop-blur-md border-b border-[#2B1E1A]/10 shadow-lg z-40 animate-in fade-in slide-in-from-top duration-300">
          <div className="max-w-3xl mx-auto px-5 py-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 bg-white border border-[#2B1E1A]/15 rounded-full px-5 py-2.5 transition-all focus-within:border-[#2B1E1A]/40 focus-within:shadow-sm">
              <Search size={20} className="text-[#2B1E1A]/50 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products (e.g., dress, scarf, tote, linen)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none text-[#2B1E1A] placeholder:text-[#2B1E1A]/40 text-sm w-full"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#2B1E1A]/40 hover:text-[#2B1E1A]"
                >
                  <X size={16} />
                </button>
              )}
            </form>

            {/* Suggestions Panel */}
            {searchQuery.trim().length > 0 && (
              <div className="mt-4 bg-white border border-[#2B1E1A]/10 rounded-2xl overflow-hidden shadow-xl max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div>
                    <div className="p-3 border-b border-[#2B1E1A]/5 bg-[#F6F2EE]/30 text-xs font-semibold tracking-wider text-[#2B1E1A]/60 uppercase">
                      Suggested Products
                    </div>
                    <div className="divide-y divide-[#2B1E1A]/5">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSuggestionClick(product.id)}
                          className="flex items-center gap-4 p-3 hover:bg-[#F6F2EE]/40 cursor-pointer transition-colors"
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-[#F6F2EE]"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-[#2B1E1A] truncate">{product.name}</h4>
                            <p className="text-xs text-[#E46A53] font-semibold mt-0.5">
                              ₹ {product.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-3 bg-[#F6F2EE]/20 hover:bg-[#F6F2EE]/50 text-xs font-semibold text-[#E46A53] transition-colors border-t border-[#2B1E1A]/5 block"
                    >
                      View All Results for "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center text-sm text-[#2B1E1A]/50">
                    No products found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F6F2EE] pt-16 px-5 md:hidden">
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => handleScrollToSection(heroRef)} 
              className={`text-lg transition-colors relative py-1 ${
                location.pathname === '/' ? 'text-[#E46A53] font-semibold' : 'text-[#2B1E1A]'
              }`}
            >
              Home
            </button>
            <Link 
              to="/shop" 
              onClick={onMobileMenuToggle} 
              className={`text-lg transition-colors relative py-1 ${
                location.pathname.startsWith('/shop') || location.pathname.startsWith('/product') ? 'text-[#E46A53] font-semibold' : 'text-[#2B1E1A]'
              }`}
            >
              Shop
            </Link>
            <Link 
              to="/lookbook" 
              onClick={onMobileMenuToggle} 
              className={`text-lg transition-colors relative py-1 ${
                location.pathname.startsWith('/lookbook') ? 'text-[#E46A53] font-semibold' : 'text-[#2B1E1A]'
              }`}
            >
              Lookbook
            </Link>
            <Link 
              to="/atelier" 
              onClick={onMobileMenuToggle} 
              className={`text-lg transition-colors relative py-1 ${
                location.pathname.startsWith('/atelier') ? 'text-[#E46A53] font-semibold' : 'text-[#2B1E1A]'
              }`}
            >
              Atelier
            </Link>
            
            {user ? (
              <>
                <button
                  onClick={() => {
                    onLogout()
                    onMobileMenuToggle()
                  }}
                  className="text-lg text-[#E46A53]"
                >
                  Logout
                </button>
                <Button
                  onClick={() => {
                    onBookingOpen()
                    onMobileMenuToggle()
                  }}
                  className="bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full w-full"
                >
                  Book Appointment
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  navigate('/login')
                  onMobileMenuToggle()
                }}
                className="bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full w-full"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Navigation
