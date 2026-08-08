import apiClient from './apiClient'

/**
 * Helper to extract clean error message
 */
const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  return error.message || 'An unexpected error occurred'
}

/**
 * Get all orders for the authenticated user
 * @returns {Promise<Array>} Array of OrderResponse objects
 */
export const getUserOrders = async () => {
  try {
    const response = await apiClient.get('/orders')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Get order by ID
 * @param {number|string} orderId - Order ID
 * @returns {Promise<Object>} OrderResponse object
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Create a new order (Checkout)
 * @param {Object} orderData - Order payload containing shipping address details
 * @returns {Promise<Object>} Created OrderResponse object
 */
export const createOrder = async (orderData) => {
  try {
    // Backend creates order from current user database cart items
    const response = await apiClient.post('/orders', {
      shippingAddress: orderData.shippingAddress
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Update order status (Admin)
 * @param {number|string} orderId - Order ID
 * @param {string} status - New status (PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED)
 * @returns {Promise<Object>} Updated OrderResponse object
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await apiClient.put(`/admin/orders/${orderId}/status`, { status })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Update order payment status (Admin)
 * @param {number|string} orderId - Order ID
 * @param {string} paymentStatus - New payment status (PENDING | PAID | FAILED | REFUNDED)
 * @param {string} [paymentId] - Optional transaction identifier
 * @returns {Promise<Object>} Updated OrderResponse object
 */
export const updateOrderPaymentStatus = async (orderId, paymentStatus, paymentId = null) => {
  try {
    const response = await apiClient.put(`/admin/orders/${orderId}/payment`, {
      paymentStatus,
      paymentId
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Fetch all orders in the system (Admin)
 * @returns {Promise<Array>} List of all OrderResponse objects
 */
export const getAllOrdersAdmin = async () => {
  try {
    const response = await apiClient.get('/admin/orders')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export default {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrderPaymentStatus,
  getAllOrdersAdmin,
}
