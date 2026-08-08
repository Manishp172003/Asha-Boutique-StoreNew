import api from './api'

/**
 * Test JWT authentication by calling protected endpoint
 * @returns {Promise} - Response from test endpoint
 */
export const testAuth = async () => {
  try {
    const response = await api.get('/test')
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Authentication failed')
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export default {
  testAuth,
}
