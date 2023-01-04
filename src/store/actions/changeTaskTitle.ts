export type ChangeTaskTitleAT = {
    type: 'CHANGE_TASK_TITLE'
    todoListID: string
    taskID: string
    title: string
}

export const changeTaskTitleAC = (todoListID: string, taskID: string, title: string): ChangeTaskTitleAT => ({type: "CHANGE_TASK_TITLE", todoListID, taskID, title})
