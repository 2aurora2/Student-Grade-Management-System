import axiosInstance from "./instance.js";

const get = (url: string) => {
    return axiosInstance.get(url);
}

const post = (url: string, data?: Object) => {
    return axiosInstance.post(url, data);
}

export default {
    get,
    post
}