import apiClient from './apiClient'

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.response?.data?.error || error.message || 'An unexpected error occurred'
}

export const submitInquiry = async (inquiryData) => {
  try {
    const response = await apiClient.post('/inquiries', inquiryData)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const getAllInquiriesAdmin = async () => {
  try {
    const response = await apiClient.get('/admin/inquiries')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const markInquiryAsReadAdmin = async (id) => {
  try {
    const response = await apiClient.put(`/admin/inquiries/${id}/read`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export default {
  submitInquiry,
  getAllInquiriesAdmin,
  markInquiryAsReadAdmin,
}
