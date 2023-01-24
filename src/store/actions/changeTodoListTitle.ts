export type ChangeTodoListTitleAT = {
    type: 'CHANGE_TODOLIST_TITLE',
    todoListID: string,
    title: string
}

export const changeTodoListTitleAC = (todoListID: string, title: string) => ({type: 'CHANGE_TODOLIST_TITLE', todoListID, title} as const)