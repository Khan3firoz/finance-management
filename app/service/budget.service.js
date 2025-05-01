import { axios } from "./axios"

export const fetchBudgetList = async () => {
    return await axios.get(`/budget/getAll`)
}

export const fetchBudgetSummary = async (params) => {
    return await axios.get(`/budget/summary`, { params })
}

export const fetchAllBudgets = async () => {
    return await axios.get(`/budget/getAll`)
}

export const createBudget = async (budgetData) => {
    return await axios.post(`/budget/create`, budgetData)
}

export const updateBudget = async (id, budgetData) => {
    return await axios.put(`/budget/${id}`, budgetData)
}

export const deleteBudget = async (id) => {
    return await axios.delete(`/budget/${id}`)
}

