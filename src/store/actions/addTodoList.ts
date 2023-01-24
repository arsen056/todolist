import {TodoListResponseType} from "../../api/todoListApi";

export type AddTodoListAT = {
    type: 'ADD_TODOLIST'
    todoList: TodoListResponseType

}

export const addTodoListAC = (todoList: TodoListResponseType): AddTodoListAT => ({type: 'ADD_TODOLIST', todoList} as const)