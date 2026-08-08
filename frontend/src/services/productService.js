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
 * Get all products
 * @returns {Promise<Array>} Array of products matching ProductResponse DTO
 */
export const getProducts = async () => {
  try {
    const response = await apiClient.get('/products')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Get product by ID
 * @param {number|string} id - Product ID
 * @returns {Promise<Object>} Full ProductResponse DTO
 */
export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Get products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of products in category
 */
export const getProductsByCategory = async (category) => {
  try {
    if (category === 'All') {
      return getProducts()
    }
    let backendCategory = category;
    
    const response = await apiClient.get(`/products`, {
      params: { category: backendCategory.toUpperCase() }
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Search products
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching products
 */
export const searchProducts = async (query) => {
  try {
    const response = await apiClient.get('/products', {
      params: { search: query }
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Create product (Admin)
 * @param {Object} productData - Product request DTO
 * @returns {Promise<Object>} Created ProductResponse DTO
 */
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/admin/products', productData)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Update product (Admin)
 * @param {number|string} id - Product ID
 * @param {Object} productData - Product request DTO
 * @returns {Promise<Object>} Updated ProductResponse DTO
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await apiClient.put(`/admin/products/${id}`, productData)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Delete product (Admin)
 * @param {number|string} id - Product ID
 * @returns {Promise<void>}
 */
export const deleteProduct = async (id) => {
  try {
    await apiClient.delete(`/admin/products/${id}`)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Upload product images (Admin)
 * @param {FormData} formData - Contains files array
 * @returns {Promise<Array>} List of uploaded file URLs
 */
export const uploadProductImages = async (formData) => {
  try {
    const response = await apiClient.post('/admin/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export default {
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
}
