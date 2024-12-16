import {IClass} from "../../interface/class.ts";
import {IStudent} from "../../interface/student.ts";

export type TCreateClassReq = {
    name: string,
    capacity: number,
    course_id: number | null
}

export type TCreateClassRes = {
    id: number
}

export type TDelClassReq = {
    class_id: number
}

export type TGetClassListReq = {
    name: string
}

export type TGetClassListRes = {
    classList: IClass[]
}

export type TGetClassInfoReq = {
    class_id: number
}

export type TGetClassInfoRes = {
    studentList: IStudent[]
}

export type TAddStuReq = {
    name: string,
    campus_id: string,
    major: string,
    grade: string,
    class_id: number
}

export type TAddStuRes = {
    id: number
}

export type TDelStuReq = {
    stu_id: number,
    class_id: number
}

export type TModifyStuReq = {
    stu_id: number,
    course_id: number,
    daily_score: number,
    exam_score: number
}