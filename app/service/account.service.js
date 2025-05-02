import { axios } from "./axios"
import dayjs from 'dayjs';
import { cache } from "@/app/lib/cache";

const formatDate = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY');
};
export const fetchAccountStatsSummary = async () => {
    return await axios.get('/account/transaction/summary')
}

export const createAccount = async (payload) => {
    return await axios.post('/account/create', payload)
}
export const updateAccount = async (id, payload) => {
    try {
        const response = await axios.put(`/account/${id}`, payload);

        // Clear all relevant caches
        cache.remove('finance_accounts');
        cache.remove('finance_summary');
        cache.remove('finance_income_expense');

        return response;
    } catch (error) {
        console.error('Error updating account:', error);
        throw error;
    }
}
export const deleteAccount = async (id) => {
    return await axios.delete(`/account/${id}`)
}

export const fetchAccountList = async () => {
    return await axios.get(`/account/get`)
}

export const createTransaction = async (payload) => {
    return await axios.post('/account/transaction', payload)
}

export const createTransfer = async (payload) => {
    return await axios.post('/account/transfer', payload)
}

// export const fetchAllTransaction = async (type, startDate, endDate) => {
//     return await axios.get(`/account/transaction?${type ? `transactionType=${type}` : ''}&startDate=${startDate}&endDate=${endDate}`)
// }
export const fetchAllTransaction = async (type, startDate, endDate) => {
    const transactionTypeParam = type && type !== "all" ? `transactionType=${type}&` : '';
    return await axios.get(
        `/account/transaction?${transactionTypeParam}startDate=${startDate}&endDate=${endDate}`
    );
};

export const fetchIncomeExpense = async ({ filterType, date, month, year }) => {
    let queryParams;
    if (filterType === 'yearly') {
        queryParams = `filterType=${filterType}&year=${year}`;
    } else if (filterType === 'monthly') {
        queryParams = `filterType=${filterType}&month=${month}&year=${year}`;
    } else if (filterType === 'daily') {
        // for daily filter
        const formattedDate = formatDate(date);
        queryParams = `filterType=${filterType}&date=${formattedDate}`;
    }
    return await axios.get(`/account/transaction/incomeExpenseSummary?${queryParams}`);
}

