import {v1} from "uuid";
import {TodoListStateType, TodoListType} from "../../types/TodoListStateType";
import {RemoveTodoListAT, AddTodoListAT, ChangeFilterAT} from "../actions";

export const todoListID_1 = v1()
export const todoListID_2 = v1()
export const todoListID_3 = v1()
export const todoListID_4 = v1()

const initialState: TodoListStateType = [
    {id: todoListID_1, title: "Todolist 1", filter: "all"},
    {id: todoListID_2, title: "drinks", filter: "all"},
    {id: todoListID_3, title: "drinks", filter: "all"},
    {id: todoListID_4, title: "drinks", filter: "all"},
]

type ActionType = ChangeFilterAT | RemoveTodoListAT | AddTodoListAT

export const todoListReducer = (state=initialState, action:ActionType): TodoListStateType => {
    switch (action.type) {
        case 'REMOVE_TODOLIST':
            return state.filter(tl => tl.id !== action.todoListID)
        case 'CHANGE_FILTER':
            return state.map(tl => tl.id === action.todoListID ? {...tl, filter: action.filter} : tl)
        case 'ADD_TODOLIST':
            const newTodoList:TodoListType = {id: action.id, title: action.title, filter: 'all'}
            return [newTodoList, ...state]
        default:
            return state
    }
}