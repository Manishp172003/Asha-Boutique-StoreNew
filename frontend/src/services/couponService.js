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
 * Validate coupon code against subtotal
 * @param {string} code - Coupon code
 * @param {number} total - Subtotal
 * @returns {Promise<Object>} Coupon object details
 */
export const validateCouponCode = async (code, total) => {
  try {
    const response = await apiClient.get(`/coupons/validate?code=${code}&total=${total}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Get all active and inactive coupons (Admin)
 * @returns {Promise<Array>} Array of Coupon objects
 */
export const getAllCouponsAdmin = async () => {
  try {
    const response = await apiClient.get('/admin/coupons')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Create a new coupon (Admin)
 * @param {Object} couponData - Coupon data payload
 * @returns {Promise<Object>} Created Coupon object
 */
export const createCouponAdmin = async (couponData) => {
  try {
    const response = await apiClient.post('/admin/coupons', couponData)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const deleteCouponAdmin = async (couponId) => {
  try {
    const response = await apiClient.delete(`/admin/coupons/${couponId}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Retrieve public active coupon suggestions
 * @returns {Promise<Array>} List of active Coupon objects
 */
export const getActiveCoupons = async () => {
  try {
    const response = await apiClient.get('/coupons/active')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
