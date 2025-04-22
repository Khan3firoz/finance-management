import { axios } from "./axios"

export const createCategory = async (payload) => {
    return await axios.post('/categories/create', payload)
}

export const updateCategory = async (id, payload) => {
    return await axios.put(`/categories/${id}`, payload)
}

export const deleteCategory = async (id) => {
    return await axios.delete(`/categories/${id}`)
}

export const fetchCategory = async () => {
    return await axios.get(`/categories/getAll`)
}
