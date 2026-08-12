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
 * Initialize a new Razorpay payment session for an order
 * @param {number|string} orderId - System Order ID
 * @returns {Promise<Object>} PaymentInitializeResponse object
 */
export const initializePayment = async (orderId) => {
  try {
    const response = await apiClient.post('/payments/initialize', { orderId })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Verify signature of completed payment callback (Razorpay/Mock)
 * @param {Object} paymentDetails - Verification payload
 * @returns {Promise<Object>} Verification status object
 */
export const verifyPayment = async (paymentDetails) => {
  try {
    const response = await apiClient.post('/payments/verify', paymentDetails)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
