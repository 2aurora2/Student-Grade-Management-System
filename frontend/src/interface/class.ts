export interface IClass {
    id: number,
    name: string,
    capacity: number
}

export interface IClassRow extends IClass{
    course_name: string
}