import { createBrowserRouter } from 'react-router-dom'
import ScrollToTop from '../components/layout/ScrollToTop'
import BackToTop from '../components/layout/BackToTop'
import PageTransition from '../components/layout/PageTransition'
import Home from '../pages/Home'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Shop from '../pages/Shop'
import Lookbook from '../pages/Lookbook'
import AtelierPage from '../pages/Atelier'
import Product from '../pages/Product'
import Cart from '../pages/Cart'
import Wishlist from '../pages/Wishlist'
import Profile from '../pages/Profile'
import Addresses from '../pages/Addresses'
import Orders from '../pages/Orders'
import OrderDetails from '../pages/OrderDetails'
import Checkout from '../pages/Checkout'
import OrderSuccess from '../pages/OrderSuccess'
import NotFound from '../pages/NotFound'
import ResetPassword from '../pages/ResetPassword'
// Admin Pages
import AdminLogin from '../pages/admin/Login'
import AdminRoute from '../components/auth/AdminRoute'
import AdminOverview from '../pages/admin/Overview'
import AdminProducts from '../pages/admin/Products'
import AdminOrders from '../pages/admin/Orders'
import AdminAppointments from '../pages/admin/Appointments'
import AdminCustomers from '../pages/admin/Customers'
import AdminAnalytics from '../pages/admin/Analytics'
import AdminSettings from '../pages/admin/Settings'
import AdminHelp from '../pages/admin/Help'
import AdminReviews from '../pages/admin/Reviews'
import AdminCoupons from '../pages/admin/Coupons'

const Layout = ({ children }) => {
  return (
    <>
      <ScrollToTop />
      <PageTransition>
        {children}
      </PageTransition>
      <BackToTop />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
  },
  {
    path: '/register',
    element: <Layout><Register /></Layout>,
  },
  {
    path: '/login',
    element: <Layout><Login /></Layout>,
  },
  {
    path: '/reset-password',
    element: <Layout><ResetPassword /></Layout>,
  },
  {
    path: '/dashboard',
    element: <Layout><Dashboard /></Layout>,
  },
  {
    path: '/shop',
    element: <Layout><Shop /></Layout>,
  },
  {
    path: '/lookbook',
    element: <Layout><Lookbook /></Layout>,
  },
  {
    path: '/atelier',
    element: <Layout><AtelierPage /></Layout>,
  },
  {
    path: '/product/:id',
    element: <Layout><Product /></Layout>,
  },
  {
    path: '/cart',
    element: <Layout><Cart /></Layout>,
  },
  {
    path: '/wishlist',
    element: <Layout><Wishlist /></Layout>,
  },
  {
    path: '/profile',
    element: <Layout><Profile /></Layout>,
  },
  {
    path: '/profile/addresses',
    element: <Layout><Addresses /></Layout>,
  },
  {
    path: '/orders',
    element: <Layout><Orders /></Layout>,
  },
  {
    path: '/orders/:id',
    element: <Layout><OrderDetails /></Layout>,
  },
  {
    path: '/checkout',
    element: <Layout><Checkout /></Layout>,
  },
  {
    path: '/order-success',
    element: <Layout><OrderSuccess /></Layout>,
  },
  // Admin Routes
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminRoute><AdminOverview /></AdminRoute>,
  },
  {
    path: '/admin/products',
    element: <AdminRoute><AdminProducts /></AdminRoute>,
  },
  {
    path: '/admin/orders',
    element: <AdminRoute><AdminOrders /></AdminRoute>,
  },
  {
    path: '/admin/appointments',
    element: <AdminRoute><AdminAppointments /></AdminRoute>,
  },
  {
    path: '/admin/customers',
    element: <AdminRoute><AdminCustomers /></AdminRoute>,
  },
  {
    path: '/admin/analytics',
    element: <AdminRoute><AdminAnalytics /></AdminRoute>,
  },
  {
    path: '/admin/settings',
    element: <AdminRoute><AdminSettings /></AdminRoute>,
  },
  {
    path: '/admin/help',
    element: <AdminRoute><AdminHelp /></AdminRoute>,
  },
  {
    path: '/admin/reviews',
    element: <AdminRoute><AdminReviews /></AdminRoute>,
  },
  {
    path: '/admin/coupons',
    element: <AdminRoute><AdminCoupons /></AdminRoute>,
  },
  {
    path: '*',
    element: <Layout><NotFound /></Layout>,
  },
])

export default router
