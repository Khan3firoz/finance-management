import { axios } from "./axios"

export const fetchBudgetList = async () => {
    return await axios.get(`/budget/getAll`)
}

export const fetchBudgetSummary = async (params) => {
    return await axios.get(`/budget/summary`, { params })
}
