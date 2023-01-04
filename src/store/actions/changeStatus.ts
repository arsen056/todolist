export type ChangeStatusAT = {
    type: 'CHANGE_STATUS'
    todoListID: string
    taskID: string
    status: boolean
}

export const changeStatusAC = (todoListID: string, taskID: string, status: boolean): ChangeStatusAT => ({type: "CHANGE_STATUS", todoListID, taskID, status} as const)