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
 * Retrieve user's cart
 * @returns {Promise<Object>} CartResponse DTO
 */
export const getCart = async () => {
  try {
    const response = await apiClient.get('/cart')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Add an item to the cart
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @param {string} size - Selected size (default: 'S')
 * @returns {Promise<Object>} Updated CartResponse DTO
 */
export const addToCart = async (productId, quantity = 1, size = 'S') => {
  try {
    const response = await apiClient.post('/cart/items', { productId, quantity, size })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Update a cart item's quantity
 * @param {number} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated CartResponse DTO
 */
export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    const response = await apiClient.put(`/cart/items/${itemId}`, null, {
      params: { quantity }
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Remove an item from the cart
 * @param {number} itemId - Cart item ID
 * @returns {Promise<Object>} Updated CartResponse DTO
 */
export const removeFromCart = async (itemId) => {
  try {
    const response = await apiClient.delete(`/cart/items/${itemId}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Clear user's cart
 * @returns {Promise<void>}
 */
export const clearCart = async () => {
  try {
    await apiClient.delete('/cart')
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export default {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
}
