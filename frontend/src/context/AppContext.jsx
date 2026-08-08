import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { login, logout, getCurrentUser, updateProfile as authUpdateProfile } from '../services/authService'
import { testAuth } from '../services/testService'
import productService from '../services/productService'
import testimonialService from '../services/testimonialService'
import cartService from '../services/cartService'
import orderService from '../services/orderService'
import bookingService from '../services/bookingService'
import { validateCouponCode } from '../services/couponService'

// Fallback Mock Product Data (rendered on backend lag or offline state)
const products = [
  { id: 1, name: 'Pleat-Front Blouse', price: 2400, imageUrl: '/images/product9.png', category: 'Tops', rating: 4.7, isNew: true, isSale: false },
  { id: 2, name: 'Tiered Midi Dress', price: 3800, imageUrl: '/images/product10.png', category: 'Dresses', rating: 4.8, isNew: true, isSale: false },
  { id: 3, name: 'Tailored Trousers', price: 2900, imageUrl: '/images/product11.png', category: 'Tailoring', rating: 4.6, isNew: false, isSale: true },
  { id: 4, name: 'Cropped Linen Jacket', price: 3200, imageUrl: '/images/product12.png', category: 'Tops', rating: 4.9, isNew: true, isSale: false },
  { id: 5, name: 'Handloom Kurta Set', price: 4100, imageUrl: '/images/product13.png', category: 'Dresses', rating: 4.8, isNew: false, isSale: true },
  { id: 6, name: 'Silk Scarf', price: 1200, imageUrl: '/images/product14.png', category: 'Accessories', rating: 4.5, isNew: true, isSale: false },
  { id: 7, name: 'Embroidered Tote', price: 1800, imageUrl: '/images/product7.jpg', category: 'Accessories', rating: 4.7, isNew: false, isSale: false },
  { id: 8, name: 'Block-Print Dupatta', price: 1500, imageUrl: '/images/product8.jpg', category: 'Accessories', rating: 4.6, isNew: true, isSale: false },
]

const productDetails = {
  1: { description: 'A refined blouse with soft pleat detailing, tailored for easy movement and a polished everyday shape.', fabric: 'Cotton-silk blend', fit: 'Relaxed shoulder with a neat waist', careInstructions: 'Gentle hand wash or dry clean', deliveryInfo: 'Ready to ship in 2-3 days', stockQuantity: 20 },
  2: { description: 'A graceful midi dress with tiered movement, finished with a flattering neckline and fluid drape.', fabric: 'Soft rayon voile', fit: 'Easy fit with a defined waist', careInstructions: 'Cold wash separately', deliveryInfo: 'Ready to ship in 3-4 days', stockQuantity: 16 },
  3: { description: 'Structured trousers finished for everyday comfort, with a clean front and ankle-skimming length.', fabric: 'Cotton twill', fit: 'High-rise straight fit', careInstructions: 'Machine wash mild', deliveryInfo: 'Ready to ship in 4-5 days', stockQuantity: 18 },
  4: { description: 'A light cropped jacket in breathable linen, ideal for layering over dresses, kurtas, and camisoles.', fabric: 'Washed linen', fit: 'Boxy cropped fit', careInstructions: 'Dry clean recommended', deliveryInfo: 'Ready to ship in 3-4 days', stockQuantity: 14 },
  5: { description: 'A handloom kurta set with boutique finishing, balanced for festive days and relaxed evenings.', fabric: 'Handloom cotton', fit: 'Straight kurta with easy trousers', careInstructions: 'Hand wash in cold water', deliveryInfo: 'Ready to ship in 5-7 days', stockQuantity: 12 },
  6: { description: 'A soft silk scarf for effortless layering, adding a quiet accent to workwear and occasion looks.', fabric: 'Silk blend', fit: 'One size', careInstructions: 'Dry clean only', deliveryInfo: 'Ready to ship in 1-2 days', stockQuantity: 25 },
  7: { description: 'A carry-all tote with embroidered detailing, sized for daily errands, books, and boutique finds.', fabric: 'Canvas with thread embroidery', fit: 'Spacious interior pocket', careInstructions: 'Spot clean gently', deliveryInfo: 'Ready to ship in 2-3 days', stockQuantity: 22 },
  8: { description: 'A block-print dupatta with a light drape, made to pair with classic kurtas and simple dresses.', fabric: 'Mul cotton', fit: 'Full-length drape', careInstructions: 'Cold wash separately', deliveryInfo: 'Ready to ship in 2-3 days', stockQuantity: 24 },
}

const mockProductCatalog = products.map((product) => {
  const imageUrl = product.imageUrl || product.image || '/images/product1.jpg';
  return {
    ...product,
    imageUrl,
    image: imageUrl,
    ...productDetails[product.id],
  };
})

const mockTestimonials = [
  { id: 1, quote: "They altered my mother's saree blouse in a day. Perfect fit.", name: 'Priya D.', avatarUrl: '/images/avatar1.jpg', isVerified: true },
  { id: 2, quote: "I walked in nervous about tailoring. Walked out with three outfits planned.", name: 'Ananya R.', avatarUrl: '/images/avatar2.jpg', isVerified: true },
  { id: 3, quote: "The details are thoughtful—pockets that sit right, hems that hold.", name: 'Meera S.', avatarUrl: '/images/avatar3.jpg', isVerified: true }
]

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  // Dialog States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [productPreview, setProductPreview] = useState(null)
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)

  // Catalog and testimonials state loaded dynamically
  const [productCatalog, setProductCatalog] = useState(mockProductCatalog)
  const [testimonials, setTestimonials] = useState(mockTestimonials)

  // User State
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [testLoading, setTestLoading] = useState(false)

  // Cart State
  const [cart, setCart] = useState([])
  const [filter, setFilter] = useState('All')

  // Wishlist State
  const [wishlist, setWishlist] = useState([])

  // Orders State
  const [orders, setOrders] = useState([])
  const [currentOrder, setCurrentOrder] = useState(null)

  // Addresses State
  const [addresses, setAddresses] = useState([])

  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponDiscount, setCouponDiscount] = useState(0)

  // Validate and apply coupon code
  const applyCouponCode = async (code) => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    try {
      const coupon = await validateCouponCode(code, subtotal);
      setAppliedCoupon(coupon);
      if (coupon.discountType === 'PERCENTAGE') {
        setCouponDiscount(subtotal * (coupon.discountValue / 100.0));
      } else {
        setCouponDiscount(coupon.discountValue);
      }
      toast.success(`Coupon code ${coupon.code} applied!`);
      return coupon;
    } catch (err) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      throw err;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    toast.success('Coupon removed');
  };

  // Automatically recalculate or drop coupon on cart changes
  useEffect(() => {
    if (appliedCoupon && cart.length > 0) {
      const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      if (subtotal < appliedCoupon.minAmount) {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        toast.warning(`Coupon ${appliedCoupon.code} removed because order total is below ₹${Math.round(appliedCoupon.minAmount)}`);
      } else {
        // Recalculate discount
        if (appliedCoupon.discountType === 'PERCENTAGE') {
          setCouponDiscount(subtotal * (appliedCoupon.discountValue / 100.0));
        } else {
          setCouponDiscount(appliedCoupon.discountValue);
        }
      }
    } else if (cart.length === 0) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }
  }, [cart, appliedCoupon]);

  // Load products and testimonials from backend
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await productService.getProducts()
        if (data && data.length > 0) {
          const normalizedData = data.map(p => {
            const img = p.imageUrl || p.image || '/images/product1.jpg';
            return {
              ...p,
              imageUrl: img,
              image: img
            };
          });
          setProductCatalog(normalizedData);
        }
      } catch (err) {
        console.error("Failed to load products from database: ", err)
      }
    }

    const fetchTestimonials = async () => {
      try {
        const data = await testimonialService.getTestimonials()
        if (data && data.length > 0) {
          setTestimonials(data)
        }
      } catch (err) {
        console.error("Failed to load testimonials from database: ", err)
      }
    }

    fetchCatalog()
    fetchTestimonials()
  }, [])

  // Initialize user session
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setAuthLoading(false)
  }, [])

  // Sync cart with backend database when logged in
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        try {
          const backendCart = await cartService.getCart()
          const mappedCart = backendCart.items.map(item => ({
            id: item.product.id,
            itemId: item.id,
            name: item.product.name,
            price: item.product.price,
            imageUrl: item.product.imageUrl || item.product.image || '/images/product1.jpg',
            image: item.product.image || item.product.imageUrl || '/images/product1.jpg',
            category: item.product.category,
            quantity: item.quantity,
            size: item.size || 'S',
            fabric: item.product.fabric,
            fit: item.product.fit,
            careInstructions: item.product.careInstructions,
            deliveryInfo: item.product.deliveryInfo
          }))
          setCart(mappedCart)
        } catch (err) {
          console.error("Cart sync failed: ", err)
        }
      } else {
        setCart([])
      }
    }
    syncCart()
  }, [user])

  // Sync orders with backend when history modal opens or user logs in
  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const userOrders = await orderService.getUserOrders()
          setOrders(userOrders)
        } catch (err) {
          console.error("Orders load failed: ", err)
        }
      } else {
        setOrders([])
      }
    }
    fetchOrders()
  }, [user, orderHistoryOpen])

  // Initialize addresses from localStorage
  useEffect(() => {
    const savedAddresses = localStorage.getItem('addresses')
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses))
    }
  }, [])

  // Filter products catalog
  const filteredProducts = filter === 'All' 
    ? productCatalog 
    : productCatalog.filter(p => p.category.toUpperCase() === filter.toUpperCase())

  // Cart actions synced to backend REST endpoints
  const addToCart = async (product, size = 'S') => {
    if (!user) {
      toast.error('Please sign in to add items to your cart')
      return
    }
    try {
      const backendCart = await cartService.addToCart(product.id, 1, size)
      const mappedCart = backendCart.items.map(item => ({
        id: item.product.id,
        itemId: item.id,
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.imageUrl || item.product.image || '/images/product1.jpg',
        image: item.product.image || item.product.imageUrl || '/images/product1.jpg',
        category: item.product.category,
        quantity: item.quantity,
        size: item.size || 'S',
        fabric: item.product.fabric,
        fit: item.product.fit,
        careInstructions: item.product.careInstructions,
        deliveryInfo: item.product.deliveryInfo
      }))
      setCart(mappedCart)
      toast.success(`${product.name} (Size: ${size}) added to cart`)
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart')
    }
  }

  const removeFromCart = async (productId) => {
    if (!user) return
    const cartItem = cart.find(item => item.id === productId)
    if (!cartItem) return
    try {
      const backendCart = await cartService.removeFromCart(cartItem.itemId)
      const mappedCart = backendCart.items.map(item => ({
        id: item.product.id,
        itemId: item.id,
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.imageUrl || item.product.image || '/images/product1.jpg',
        image: item.product.image || item.product.imageUrl || '/images/product1.jpg',
        category: item.product.category,
        quantity: item.quantity
      }))
      setCart(mappedCart)
      toast.success('Item removed from cart')
    } catch (err) {
      toast.error(err.message || 'Failed to remove item')
    }
  }

  const updateQuantity = async (productId, delta) => {
    if (!user) return
    const cartItem = cart.find(item => item.id === productId)
    if (!cartItem) return
    const newQuantity = cartItem.quantity + delta
    if (newQuantity < 1) {
      await removeFromCart(productId)
      return
    }
    try {
      const backendCart = await cartService.updateCartItemQuantity(cartItem.itemId, newQuantity)
      const mappedCart = backendCart.items.map(item => ({
        id: item.product.id,
        itemId: item.id,
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.imageUrl || item.product.image || '/images/product1.jpg',
        image: item.product.image || item.product.imageUrl || '/images/product1.jpg',
        category: item.product.category,
        quantity: item.quantity
      }))
      setCart(mappedCart)
    } catch (err) {
      toast.error(err.message || 'Failed to update quantity')
    }
  }

  // Wishlist functions (client-side only as specified)
  const addToWishlist = (product) => {
    setWishlist(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev
      }
      return [...prev, { ...product }]
    })
    toast.success(`${product.name} added to wishlist`)
  }

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId))
    toast.success('Item removed from wishlist')
  }

  const isWishlisted = (productId) => {
    return wishlist.some(item => item.id === productId)
  }

  const buyNow = async (product) => {
    if (!user) {
      toast.error('Please sign in to buy items')
      return
    }
    try {
      await cartService.clearCart()
      await addToCart(product)
      setCartOpen(true)
      setProductPreview(null)
    } catch (err) {
      toast.error(err.message || 'Failed to process Buy Now')
    }
  }

  // Checkout order placement via Spring Boot API
  const placeOrder = async (shippingAddress, paymentMethod) => {
    try {
      const formattedAddress = [
        shippingAddress.fullName || shippingAddress.name,
        shippingAddress.phone ? `Phone: ${shippingAddress.phone}` : '',
        shippingAddress.addressLine || shippingAddress.address,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.zipCode || shippingAddress.zip,
        shippingAddress.country || 'India'
      ].filter(Boolean).join(', ');

      const order = await orderService.createOrder({
        shippingAddress: formattedAddress,
        couponCode: appliedCoupon ? appliedCoupon.code : null
      })
      
      // Update local context orders
      setOrders(prev => [order, ...prev])
      setCurrentOrder(order)
      setCart([])
      setCartOpen(false)
      setAppliedCoupon(null)
      setCouponDiscount(0)
      toast.success(`Order #${order.orderNumber || order.id} placed successfully!`)
    } catch (err) {
      toast.error(err.message || 'Failed to place order')
    }
  }

  const getUserOrders = () => {
    return orders
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(order => order.id === updatedOrder.id ? updatedOrder : order))
      toast.success(`Order status updated to ${newStatus}`)
    } catch (err) {
      toast.error(err.message || 'Failed to update order status')
    }
  }

  // Authentication logout context wrapper
  const handleLogout = () => {
    logout()
    setUser(null)
    setCart([])
    setOrders([])
    toast.success('Logged out successfully')
  }

  const updateUserProfile = async (userData) => {
    try {
      const updatedUser = await authUpdateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw new Error(err.message || 'Failed to update profile');
    }
  }

  const handleTestAuth = async () => {
    if (!user) {
      toast.error('Please login first to test authentication')
      return
    }

    setTestLoading(true)
    try {
      const response = await testAuth()
      toast.success(response.message || 'JWT Authentication Working Successfully!')
    } catch (error) {
      toast.error(error.message || 'Authentication test failed')
    } finally {
      setTestLoading(false)
    }
  }

  // Tailoring Consultation Appointment request
  const handleBookingSubmit = async (formData) => {
    if (formData && typeof formData.preventDefault === 'function') {
      formData.preventDefault()
      toast.success('Appointment request submitted! We will contact you soon.')
      setBookingOpen(false)
      return
    }

    try {
      let preferredDateStr = formData.preferredDate
      if (formData.preferredDate instanceof Date) {
        preferredDateStr = formData.preferredDate.toISOString().split('T')[0]
      }

      await bookingService.createBooking({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceType: formData.serviceType,
        preferredDate: preferredDateStr,
        preferredTime: formData.preferredTime,
        notes: formData.notes
      })
      toast.success('Appointment request submitted! We will contact you soon.')
      setBookingOpen(false)
    } catch (err) {
      toast.error(err.message || 'Failed to submit appointment request')
    }
  }

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  // Local Address book functions
  const addAddress = (addressData) => {
    const newAddress = {
      id: Date.now().toString(),
      ...addressData,
      isDefault: addresses.length === 0
    }
    const updatedAddresses = [...addresses, newAddress]
    setAddresses(updatedAddresses)
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses))
    toast.success('Address added successfully')
  }

  const updateAddress = (addressId, addressData) => {
    const updatedAddresses = addresses.map(addr => {
      if (addr.id === addressId) {
        return { ...addr, ...addressData }
      }
      return addr
    })
    setAddresses(updatedAddresses)
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses))
    toast.success('Address updated successfully')
  }

  const deleteAddress = (addressId) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId)
    const deletedAddress = addresses.find(addr => addr.id === addressId)
    if (deletedAddress?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true
    }
    setAddresses(updatedAddresses)
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses))
    toast.success('Address deleted successfully')
  }

  const setDefaultAddress = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }))
    setAddresses(updatedAddresses)
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses))
    toast.success('Default address updated')
  }

  const getDefaultAddress = () => {
    return addresses.find(addr => addr.isDefault) || addresses[0] || null
  }

  const value = {
    productCatalog,
    testimonials,
    filteredProducts,
    
    mobileMenuOpen,
    cartOpen,
    productPreview,
    orderHistoryOpen,
    bookingOpen,
    
    user,
    authLoading,
    testLoading,
    
    cart,
    filter,

    wishlist,

    orders,
    currentOrder,
    
    appliedCoupon,
    couponDiscount,
    applyCouponCode,
    removeCoupon,
    
    addresses,
    
    setMobileMenuOpen,
    setCartOpen,
    setProductPreview,
    setOrderHistoryOpen,
    setBookingOpen,
    setUser,
    setFilter,
    
    addToCart,
    removeFromCart,
    updateQuantity,
    buyNow,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    placeOrder,
    getUserOrders,
    updateOrderStatus,
    handleLogout,
    updateUserProfile,
    handleTestAuth,
    handleBookingSubmit,
    scrollToSection,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
