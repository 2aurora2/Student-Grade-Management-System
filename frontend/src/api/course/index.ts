import {TCreateCourseReq, TCreateCourseRes, TDelCourseReq} from "./type.ts";
import service from "../../utils/http/service.ts";
import {ResponseResult} from "../type.ts";

const createCourse = (data: TCreateCourseReq) => {
    return service.post<ResponseResult<TCreateCourseRes>>('/course/create', data);
}

const delCourse = (data: TDelCourseReq) => {
    return service.post<ResponseResult<null>>('/course/delete', data);
}

export default {
    createCourse, // 新增课程
    delCourse,  // 删除课程
}