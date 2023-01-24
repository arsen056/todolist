import {TodoListStateType, TodoListsType} from "../../types/TodoListStateType";
import {
    RemoveTodoListAT,
    AddTodoListAT,
    ChangeFilterAT,
    SetTodoListAT,
    setTodoListAC,
    removeTodoListAC, addTodoListAC, AppSetStatusAC, SetEntityStatusAT
} from "../actions";
import {todoListAPI} from "../../api/todoListApi";
import {changeTodoListTitleAC, ChangeTodoListTitleAT} from "../actions/changeTodoListTitle";
import {AppThunk} from "../index";
import {setEntityStatusAC} from "../actions/setEntityStatus";

const initialState: TodoListsType = []

export type TodoListActionType = ChangeFilterAT | RemoveTodoListAT | AddTodoListAT | SetTodoListAT | ChangeTodoListTitleAT | SetEntityStatusAT

export const todoListReducer = (state=initialState, action:TodoListActionType): TodoListsType => {
    switch (action.type) {
        case 'REMOVE_TODOLIST':
            return state.filter(tl => tl.id !== action.todoListID)
        case 'CHANGE_FILTER':
            return state.map(tl => tl.id === action.todoListID ? {...tl, filter: action.filter} : tl)
        case 'ADD_TODOLIST':
            const newTodoList: TodoListStateType = {...action.todoList ,filter: 'all', entityStatus: 'idle'}
            return [newTodoList, ...state]
        case 'CHANGE_TODOLIST_TITLE':
            return state.map(tl => tl.id === action.todoListID ? {...tl, title: action.title} : tl)
        case 'SET_TODOLIST':
            return action.todoList.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case 'SET_ENTITY_STATUS':
            return state.map(tl => tl.id === action.todoListID ? {...tl, entityStatus: action.status} : tl)
        default:
            return state
    }
}

export const fetchTodoListsTC = (): AppThunk => async dispatch => {
    dispatch(AppSetStatusAC('loading'))
    const res = await todoListAPI.getTodolists()
    dispatch(setTodoListAC(res.data))
    dispatch(AppSetStatusAC('succeeded'))
}

export const addTodoListTC = (title: string):AppThunk => async dispatch => {
    dispatch(AppSetStatusAC('loading'))
    const res = await todoListAPI.createTodolist(title)
    dispatch(addTodoListAC(res.data.item))
    dispatch(AppSetStatusAC('succeeded'))
}

export const removeTodoListTC = (todoListID: string): AppThunk => async dispatch => {
    dispatch(setEntityStatusAC(todoListID, 'loading'))
    dispatch(AppSetStatusAC('loading'))
    await todoListAPI.deleteTodolist(todoListID)
    dispatch(removeTodoListAC(todoListID))
    dispatch(AppSetStatusAC('succeeded'))
}

export const changeTodoListTitleTC = (todoListID: string, title: string): AppThunk => async dispatch => {
    dispatch(setEntityStatusAC(todoListID, 'loading'))
    await todoListAPI.updateTodolist(todoListID, title)
    dispatch(changeTodoListTitleAC(todoListID, title))
    dispatch(setEntityStatusAC(todoListID, 'idle'))
}