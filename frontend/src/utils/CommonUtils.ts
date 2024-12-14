/**
 * @desc 检查某个对象的属性值中是否有为空字符串或者null，有则返回true，无则返回false
 * @return boolean
 * @author 2aurora2
 * @time 2024/7/14
 * @param obj
 */
export const checkEmptyProperty = (obj: { [key: string]: number | string | null | boolean }) => {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; ++i) {
        if (obj[keys[i]] === '' || obj[keys[i]] === null)
            return true;
    }
    return false;
}

/**
 * @desc 把obj对象进行urlEncode
 * @return urlEncodeResult
 * @author 2aurora2
 * @time 2024/8/8
 * @param obj
 */
export const urlEncode = (obj: { [key: string]: number | string | null | boolean }) => {
    const keys = Object.keys(obj);
    let urlEncodeResult = '?';
    let pre = false;
    for (let i = 0; i < keys.length; ++i) {
        if (obj[keys[i]] !== null) {
            if (pre) urlEncodeResult += '&' + keys[i] + '=' + obj[keys[i]];
            else {
                urlEncodeResult += keys[i] + '=' + obj[keys[i]];
                pre = true;
            }
        }
    }
    return urlEncodeResult;
}

/**
 * 防抖函数
 * @param fn 待防抖的函数
 * @param delay 防抖时间，单位ms
 * @returns 已防抖的函数
 */
export function debounce(fn: Function, delay: number) {
    let timer: number | null = null;

    return function (...args: any[]) {
        // @ts-ignore
        const context = this;
        if (timer) clearTimeout(timer);
        timer = window.setTimeout(function () {
            fn.apply(context, args);
        }, delay)
    }
}

/**
 * 节流函数
 * @param fn 待节流的函数
 * @param delay 节流时间，单位ms
 * @returns 已节流的函数
 */
export function throttle(fn: Function, delay: number) {
    let timer: number | null = null;
    return function (...args: any[]) {
        // @ts-ignore
        const context = this;
        if (!timer) {
            timer = window.setTimeout(function () {
                fn.apply(context, args);
                timer = null;
            }, delay)
        }
    }
}