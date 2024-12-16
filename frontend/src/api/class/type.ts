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