export type AddTaskAT = {
    type: 'ADD-TASK'
    todoListID: string
    title: string
}

export const addTaskAC = (todoListID: string, title: string): AddTaskAT => ({type: 'ADD-TASK', todoListID, title} as const)