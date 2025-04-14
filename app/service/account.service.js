import { axios } from "./axios"
import dayjs from 'dayjs';

const formatDate = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY');
};

export const createAccount = async (payload) => {
    return await axios.post('/account/create', payload)
}
export const updateAccount = async (payload) => {
    return await axios.post('/account/create', payload)
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

export const fetchAllTransaction = async (type) => {
    return await axios.get(`/account/transaction?${type ? `transactionType=${type}` : ''}`)
}

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

