import { axios } from "./axios"

export const createCategory = async (payload) => {
    return await axios.post('/categories/create',payload)
}

export const fetchCategory = async () => {
    return await axios.get(`/categories/getAll`)
}
