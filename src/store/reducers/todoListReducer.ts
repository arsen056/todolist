import {TodoListStateType, TodoListsType} from "types/TodoListStateType";
import {todoListAPI, TodoListResponseType} from "api/todoListApi";

import {AppSetStatusAC} from "store/reducers/appReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FilterType, StatusType} from "types";

const initialState: TodoListsType = []

const slice = createSlice({
  name: 'todoList',
  initialState,
  reducers: {
    removeTodoListAC: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((tl) => tl.id === action.payload)
      if (index !== -1) state.splice(index, 1)
    },
    changeFilterAC: (state, action: PayloadAction<{ todoListID: string, filter: FilterType }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.todoListID)
      if (index !== -1) state[index].filter = action.payload.filter
    },
    addTodoListAC: (state, action: PayloadAction<TodoListResponseType>) => {
      const newTodoList: TodoListStateType = {...action.payload, filter: 'all', entityStatus: 'idle'}
      state.unshift(newTodoList)
    },
    changeTodoListTitleAC: (state, action: PayloadAction<{ todoListID: string, title: string }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.todoListID)
      if (index !== -1) state[index].title = action.payload.title
    },
    setTodoListAC: (state, action: PayloadAction<TodoListResponseType[]>) => {
      return action.payload.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
    },
    setEntityStatusAC: (state, action: PayloadAction<{ todoListID: string, status: StatusType }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.todoListID)
      if (index !== -1) state[index].entityStatus = action.payload.status
    }
  }
})

export const fetchTodoListsTC = createAsyncThunk('fetchTodoLists',
  async (_, {dispatch}) => {
    dispatch(AppSetStatusAC({status: 'loading'}))
    const res = await todoListAPI.getTodolists()
    dispatch(setTodoListAC(res.data))
    dispatch(AppSetStatusAC({status: 'succeeded'}))
  }
)

export const addTodoListTC = createAsyncThunk('addTodoList', async (title: string, {dispatch}) => {
  dispatch(AppSetStatusAC({status: 'loading'}))
  const res = await todoListAPI.createTodolist(title)
  dispatch(addTodoListAC(res.data.item))
  dispatch(AppSetStatusAC({status: 'succeeded'}))
})

export const removeTodoListTC = createAsyncThunk(
  'removeTodoList',
  async (todoListID: string, {dispatch}) => {
  dispatch(setEntityStatusAC({todoListID: todoListID, status: 'loading'}))
  dispatch(AppSetStatusAC({status: 'loading'}))
  await todoListAPI.deleteTodolist(todoListID)
  dispatch(removeTodoListAC(todoListID))
  dispatch(AppSetStatusAC({status: 'succeeded'}))
}
)
export const changeTodoListTitleTC = createAsyncThunk(
  'changeTodoListTitle',
  async (params: {todoListID: string, title: string}, {dispatch}) => {
  dispatch(setEntityStatusAC({todoListID: params.todoListID, status: 'loading'}))
  await todoListAPI.updateTodolist(params.todoListID, params.title)
  dispatch(changeTodoListTitleAC({todoListID: params.todoListID, title: params.title}))
  dispatch(setEntityStatusAC({todoListID: params.todoListID, status: 'idle'}))
})

export const {
  removeTodoListAC,
  changeTodoListTitleAC,
  addTodoListAC,
  setTodoListAC,
  changeFilterAC,
  setEntityStatusAC
} = slice.actions

export const todoListReducer = slice.reducer