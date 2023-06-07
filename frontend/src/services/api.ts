import axios from 'axios';


const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL

});


 //api.defaults.headers.common['Authorization'] = `bearer ${localStorage.getItem('token')}`;
api.interceptors.request.use(
    (config) => {
        // Modify the request config to include the authorization header
        const token = localStorage.getItem('token'); // Replace with your actual authorization token
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        //return Promise.reject(error);
    }
);
export default api;