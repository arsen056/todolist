import {UpdateTaskDomainModelType} from "api/todoListApi";

export type UpdateTaskAT = {
    type: 'UPDATE_TASK'
    todoListID: string
    taskID: string
    model: UpdateTaskDomainModelType
}

export const updateTaskAC = (todoListID: string, taskID: string, model: UpdateTaskDomainModelType): UpdateTaskAT => ({type: "UPDATE_TASK", todoListID, taskID, model})
