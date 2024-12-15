import axiosInstance from "./instance.js";
import {AxiosResponse} from "axios";

const get = <T = any>(url: string): Promise<AxiosResponse<T>> => {
    return axiosInstance.get<T>(url);
};

const post = <T = any>(url: string, data?: Object): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, data);
};

export default {
    get,
    post
}