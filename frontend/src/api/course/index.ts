import {TCreateCourseReq, TCreateCourseRes, TDelCourseReq, TGetCourseReq, TGetCourseRes} from "./type.ts";
import service from "../../utils/http/service.ts";
import {ResponseResult} from "../type.ts";
import {urlEncode} from "../../utils/CommonUtils.ts";

const createCourse = (data: TCreateCourseReq) => {
    return service.post<ResponseResult<TCreateCourseRes>>('/course/create', data);
}

const delCourse = (data: TDelCourseReq) => {
    return service.post<ResponseResult<null>>('/course/delete', data);
}

const getCourse = (data: TGetCourseReq) => {
    return service.get<ResponseResult<TGetCourseRes>>('/course/get' + urlEncode(data));
}

export default {
    createCourse, // 新增课程
    delCourse,  // 删除课程
    getCourse,  // 获取全部课程
}