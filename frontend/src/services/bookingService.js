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
 * Get all bookings for the authenticated user
 * @returns {Promise<Array>} Array of BookingResponse objects
 */
export const getUserBookings = async () => {
  try {
    const response = await apiClient.get('/bookings')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Get booking by ID
 * @param {number|string} bookingId - Booking ID
 * @returns {Promise<Object>} BookingResponse object
 */
export const getBookingById = async (bookingId) => {
  try {
    // Since backend does not have specific GET /bookings/{id}, fetch all and filter
    const bookings = await getUserBookings()
    const booking = bookings.find(b => b.id === parseInt(bookingId))
    if (!booking) {
      throw new Error('Booking not found')
    }
    return booking
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Create a new booking appointment
 * @param {Object} bookingData - BookingRequest payload
 * @returns {Promise<Object>} Created BookingResponse object
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post('/bookings', {
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email,
      serviceType: bookingData.serviceType,
      preferredDate: bookingData.preferredDate,
      preferredTime: bookingData.preferredTime,
      notes: bookingData.notes
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Update booking status (Admin)
 * @param {number|string} bookingId - Booking ID
 * @param {string} status - New status (PENDING | CONFIRMED | COMPLETED | CANCELLED)
 * @returns {Promise<Object>} Updated BookingResponse object
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await apiClient.put(`/admin/bookings/${bookingId}/status`, { status })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Cancel a booking
 * @param {number|string} bookingId - Booking ID
 * @returns {Promise<Object>} Cancellation confirmation
 */
export const cancelBooking = async (bookingId) => {
  try {
    // Authenticated users or admins can cancel by setting status to CANCELLED
    return await updateBookingStatus(bookingId, 'CANCELLED')
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Get all bookings in system (Admin)
 * @returns {Promise<Array>} List of all BookingResponse objects
 */
export const getAllBookingsAdmin = async () => {
  try {
    const response = await apiClient.get('/admin/bookings')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export default {
  getUserBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  getAllBookingsAdmin,
}
