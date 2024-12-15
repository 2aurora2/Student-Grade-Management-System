import {ICourse} from "../../interface/course.ts";

export type TCreateCourseReq = {
    name: string,
    credit: number,
    daily_ratio: number
}

export type TCreateCourseRes = {
    id: number
}

export type TDelCourseReq = {
    course_id: number
}

export type TGetCourseReq = {
    name: string | null
}

export type TGetCourseRes = {
    courseList: ICourse[]
}