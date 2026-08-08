import apiClient from './apiClient'

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.response?.data?.error || error.message || 'An unexpected error occurred'
}

export const getAllNotificationsAdmin = async () => {
  try {
    const response = await apiClient.get('/admin/notifications')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const markNotificationAsReadAdmin = async (id) => {
  try {
    const response = await apiClient.put(`/admin/notifications/${id}/read`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const markAllNotificationsAsReadAdmin = async () => {
  try {
    await apiClient.put('/admin/notifications/read-all')
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export default {
  getAllNotificationsAdmin,
  markNotificationAsReadAdmin,
  markAllNotificationsAsReadAdmin,
}
