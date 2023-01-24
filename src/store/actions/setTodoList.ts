import {TodoListResponseType} from "../../types/TodoListStateType";

export type SetTodoListAT = {
    type: 'SET_TODOLIST'
    todoList: TodoListResponseType[]
}

export const setTodoListAC = (todoList: TodoListResponseType[]): SetTodoListAT => ({type: 'SET_TODOLIST', todoList})