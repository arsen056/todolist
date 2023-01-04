export type DeleteTaskAT = {
    type: 'DELETE_TASK'
    todoListID: string
    taskID: string
}

export const deleteTaskAC = (todoListID: string, taskID: string): DeleteTaskAT => ({type: 'DELETE_TASK', todoListID, taskID})