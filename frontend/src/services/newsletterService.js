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
 * Subscribe to the community newsletter
 * @param {string} email - Email address
 * @returns {Promise<Object>} Subscriber details
 */
export const subscribeToNewsletter = async (email) => {
  try {
    const response = await apiClient.post('/newsletter/subscribe', { email })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Fetch all subscribers (Admin)
 * @returns {Promise<Array>} List of subscribers
 */
export const getAllSubscribersAdmin = async () => {
  try {
    const response = await apiClient.get('/admin/newsletter')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
