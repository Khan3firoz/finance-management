import { axios } from "./axios"

export const fetchBudgetList = async () => {
    return await axios.get(`/budget/getAll`)
}

export const monthlyBudgetSummary = async (params) => {
    return await axios.get(`/budget/monthly`)
}
