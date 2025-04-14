import storage from '@/utils/storage';
import Axios from 'axios';

const apiurl = process.env.NEXT_PUBLIC_SITE_URL;
function authRequestInterceptor(config) {
    config.headers = config.headers ?? {};
    const token = storage.getToken();
    if (token && token.accessToken) {
        config.headers.authorization = `Bearer ${token.accessToken}`;
    }
    config.headers.Accept = 'application/json';
    return config;
}
export const axios = Axios.create({
    baseURL: apiurl,
});
axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
    (response) => {
        return response?.data;
    },
    (error) => {
        console.log(error, "error==>")
        if (error && error?.response?.status === 401) {
            if (window && !window.location.origin.includes('/sign-in')) {
                console.log(error, "errorLogin")
                // storage.clearToken();
                // storage.signOut();
                // window.location.replace('/sign-in');
            }
        }
        let message = error.response?.data?.message ?? error.response?.data?.error?.message ?? error.message;
        if (error.response && error.response.data && error.response.data.error && error.response.data.error.errors) {
            message = error.response.data.error.errors.join(',');
        }
        // Handle Error

        return Promise.reject({
            statusCode: error.response?.status,
            message,
        });
    }
);


