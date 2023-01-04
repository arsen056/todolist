export type AddTodoListAT = {
    type: 'ADD_TODOLIST'
    id: string
    title: string
}

export const addTodoListAC = (id: string, title: string): AddTodoListAT => ({type: 'ADD_TODOLIST', id, title} as const)