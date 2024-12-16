import {TCreateClassReq, TCreateClassRes, TDelClassReq} from "./type.ts";
import service from "../../utils/http/service.ts";
import {ResponseResult} from "../type.ts";

const createClass = (data: TCreateClassReq) => {
    return service.post<ResponseResult<TCreateClassRes>>('/class/create', data);
}

const delClass = (data: TDelClassReq) => {
    return service.post<ResponseResult<null>>('/class/delete', data);
}

export default {
    createClass,    // 创建班级
    delClass,       // 删除班级
}