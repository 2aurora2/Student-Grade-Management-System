export interface ICourse {
    id: number,
    name: string,
    credit: number,
    daily_ratio: number
}

export interface ICourseRow extends ICourse {
    class_cnt: number
}