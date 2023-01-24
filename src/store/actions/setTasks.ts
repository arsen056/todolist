import {TaskTypeResponse} from "../../api/todoListApi";

export type SetTasksAT = {
    type: 'SET_TASKS'
    todoListID: string
    tasks: TaskTypeResponse[]
}

export const setTasksAC = (todoListID: string, tasks: TaskTypeResponse[]):SetTasksAT => ({type: 'SET_TASKS', todoListID, tasks})