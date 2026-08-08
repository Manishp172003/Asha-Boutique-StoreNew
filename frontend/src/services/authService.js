import apiClient from './apiClient'

// Token storage keys
const TOKEN_KEY = 'token'
const USER_KEY = 'user'

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
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} AuthResponse: { token, user: { id, name, email, phone, role } }
 */
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password })
    const { token, user } = response.data

    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))

    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @param {string} [phone] - User phone (optional)
 * @returns {Promise<Object>} AuthResponse: { token, user: { id, name, email, phone, role } }
 */
export const register = async (email, password, name, phone = null) => {
  try {
    const response = await apiClient.post('/auth/register', { email, password, name, phone })
    const { token, user } = response.data

    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))

    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Logout user - Clear token and user data from localStorage
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * Get JWT token from localStorage
 * @returns {string|null} - JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Get current authenticated user object
 * @returns {Object|null} User DTO { id, name, email, phone, role } or null
 */
export const getCurrentUser = () => {
  const token = getToken()
  if (!token) return null

  const userStr = localStorage.getItem(USER_KEY)
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

/**
 * Get user email from current user session
 * @returns {string|null} - User email or null
 */
export const getUserEmail = () => {
  const user = getCurrentUser()
  return user ? user.email : null
}

/**
 * Get user name from current user session
 * @returns {string|null} - User name or null
 */
export const getUserName = () => {
  const user = getCurrentUser()
  return user ? user.name : null
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if token exists
 */
export const isAuthenticated = () => {
  const token = getToken()
  return !!token
}

export const loginWithGoogle = async (idToken) => {
  try {
    const response = await apiClient.post('/auth/google', { idToken })
    const { token, user } = response.data

    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))

    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Update user profile details
 * @param {Object} userData - User DTO { name, phone }
 * @returns {Promise<Object>} Updated user DTO
 */
export const updateProfile = async (userData) => {
  try {
    const response = await apiClient.put('/auth/profile', userData)
    const user = response.data

    localStorage.setItem(USER_KEY, JSON.stringify(user))

    return user
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export default {
  login,
  register,
  logout,
  getToken,
  getUserEmail,
  getUserName,
  isAuthenticated,
  getCurrentUser,
  loginWithGoogle,
  updateProfile,
}
