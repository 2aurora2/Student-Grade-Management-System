import {
    TAddStuReq, TAddStuRes,
    TCreateClassReq,
    TCreateClassRes,
    TDelClassReq, TDelStuReq,
    TGetClassInfoReq, TGetClassInfoRes,
    TGetClassListReq,
    TGetClassListRes, TModifyStuReq
} from "./type.ts";
import service from "../../utils/http/service.ts";
import {ResponseResult} from "../type.ts";
import {urlEncode} from "../../utils/CommonUtils.ts";

const createClass = (data: TCreateClassReq) => {
    return service.post<ResponseResult<TCreateClassRes>>('/class/create', data);
}

const delClass = (data: TDelClassReq) => {
    return service.post<ResponseResult<null>>('/class/delete', data);
}

const getClassList = (data: TGetClassListReq) => {
    return service.get<ResponseResult<TGetClassListRes>>('/class/get' + urlEncode(data));
}

const getClassInfo = (data: TGetClassInfoReq) => {
    return service.get<ResponseResult<TGetClassInfoRes>>('/class/get/info' + urlEncode(data));
}

const addStu = (data: TAddStuReq) => {
    return service.post<ResponseResult<TAddStuRes>>('/student/add', data);
}

const delStu = (data: TDelStuReq) => {
    return service.post<ResponseResult<null>>('/student/delete', data);
}

const modifyStu = (data: TModifyStuReq) => {
    return service.post<ResponseResult<null>>('/student/mark', data);
}

export default {
    createClass,    // 创建班级
    delClass,       // 删除班级
    getClassList,   // 获取班级列表
    getClassInfo,   // 获取班级信息
    addStu,         // 为班级新增学生
    delStu,         // 删除班级某个id的学生
    modifyStu,      // 修改学生成绩
}