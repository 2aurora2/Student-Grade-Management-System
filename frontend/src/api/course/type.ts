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

export type TQueryCourseReq = {

}

export type TQueryCourseRes = {

}