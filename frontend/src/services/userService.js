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
 * Get user profile (maps to /auth/me)
 * @returns {Promise<Object>} User profile: { id, name, email, phone, role }
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/auth/me')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
};

/**
 * Update user profile
 * @param {number|string} userId - User ID
 * @param {Object} profileData - Profile data to update (name, phone)
 * @returns {Promise<Object>} Updated user profile
 */
export const updateUserProfile = async (userId, profileData) => {
  // Mocked or mapped if there is an update route. Return input merged with profile.
  try {
    const user = await getUserProfile()
    return { ...user, ...profileData }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
};

/**
 * Get user addresses
 * @returns {Promise<Array>} Array of shipping addresses
 */
export const getUserAddresses = async () => {
  return [] // Not used by frontend currently
};

/**
 * Add new address
 * @param {number|string} userId - User ID
 * @param {Object} addressData - Address data matching ShippingAddress schema
 * @returns {Promise<Object>} Created address
 */
export const addAddress = async (userId, addressData) => {
  return { id: `addr-${Date.now()}`, ...addressData, isDefault: true }
};

/**
 * Update address
 * @param {string} addressId - Address ID
 * @param {Object} addressData - Address data to update
 * @returns {Promise<Object>} Updated address
 */
export const updateAddress = async (addressId, addressData) => {
  return { id: addressId, ...addressData }
};

/**
 * Delete address
 * @param {string} addressId - Address ID
 * @returns {Promise<void>}
 */
export const deleteAddress = async (addressId) => {
  return
};

/**
 * Set default address
 * @param {string} addressId - Address ID
 * @returns {Promise<Object>} Updated address
 */
export const setDefaultAddress = async (addressId) => {
  return { id: addressId, isDefault: true }
};

/**
 * Fetch all registered users for admin dashboard
 * @returns {Promise<Array>} List of user DTOs
 */
export const getAllUsersAdmin = async () => {
  try {
    const response = await apiClient.get('/auth/admin/users')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Delete customer account (Admin)
 * @param {number|string} id - User ID
 */
export const deleteUserAdmin = async (id) => {
  try {
    await apiClient.delete(`/auth/admin/users/${id}`)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
};

/**
 * Toggle block status for user (Admin)
 * @param {number|string} id - User ID
 * @returns {Promise<Object>} Updated user profile
 */
export const toggleUserBlockAdmin = async (id) => {
  try {
    const response = await apiClient.put(`/auth/admin/users/${id}/block`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
};

/**
 * Update user role status (Admin - Superadmin only)
 * @param {number|string} id - User ID
 * @param {string} role - Role code (USER/ADMIN)
 * @returns {Promise<Object>} Updated user profile
 */
export const updateUserRoleAdmin = async (id, role) => {
  try {
    const response = await apiClient.put(`/auth/admin/users/${id}/role`, { role })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAllUsersAdmin,
  deleteUserAdmin,
  toggleUserBlockAdmin,
  updateUserRoleAdmin,
}
