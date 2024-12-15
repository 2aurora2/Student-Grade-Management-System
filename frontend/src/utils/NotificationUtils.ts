import {ElNotification} from "element-plus";

export const ErrorNotice = (msg: string, dur: number = 1500) => {
    ElNotification({
        title: '提示',
        message: msg,
        type: 'error',
        duration: dur
    })
}

export const SuccessNotice = (msg: string, dur: number = 1500) => {
    ElNotification({
        title: '提示',
        message: msg,
        type: 'success',
        duration: dur
    })
}

export const WarnNotice = (msg: string, dur: number = 1500) => {
    ElNotification({
        title: '提示',
        message: msg,
        type: 'warning',
        duration: dur
    })
}