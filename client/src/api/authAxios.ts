import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AuthService from '../services/AuthService.ts';


const createAxiosInstance = (
    baseURL: string,
): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        withCredentials:true
    });

    instance.interceptors.request.use(
        async (config) => {

            const token = localStorage.getItem("access_token")
            if (token) {
                config["headers"]['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401) {
                await AuthService.refresh();
                const token = localStorage.getItem("access_token")
                const retryOriginalRequest = new Promise<AxiosResponse>((resolve) => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    resolve(axios(originalRequest));
                });

                return retryOriginalRequest;
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export default createAxiosInstance;
