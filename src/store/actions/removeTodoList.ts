export type RemoveTodoListAT = {
    type: 'REMOVE_TODOLIST'
    todoListID: string
}

export const removeTodoListAC = (todoListID: string):RemoveTodoListAT => ({type: 'REMOVE_TODOLIST', todoListID} as const)