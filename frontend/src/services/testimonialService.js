import apiClient from './apiClient'

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.response?.data?.error || error.message || 'An unexpected error occurred'
}

// Public endpoints
export const getTestimonials = async () => {
  try {
    const response = await apiClient.get('/testimonials')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const submitTestimonial = async (testimonialData) => {
  try {
    const response = await apiClient.post('/testimonials', testimonialData)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// Admin endpoints
export const getAllTestimonialsAdmin = async () => {
  try {
    const response = await apiClient.get('/admin/testimonials')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const approveTestimonialAdmin = async (id, approve) => {
  try {
    const response = await apiClient.put(`/admin/testimonials/${id}/approve?approve=${approve}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const deleteTestimonialAdmin = async (id) => {
  try {
    await apiClient.delete(`/admin/testimonials/${id}`)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export default {
  getTestimonials,
  submitTestimonial,
  getAllTestimonialsAdmin,
  approveTestimonialAdmin,
  deleteTestimonialAdmin,
}
