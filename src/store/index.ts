import {combineReducers} from "redux";
import {TasksActionType, tasksReducer} from "./reducers/tasksReducer";
import {TodoListActionType, todoListReducer} from "./reducers/todoListReducer";
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {useDispatch} from "react-redux";
import {AppActionType, appReducer} from "./reducers/appReducer";
import {AuthActionType, authReducer} from "../features/Auth/AuthReducer";
import {configureStore} from "@reduxjs/toolkit";

const rootState = combineReducers({todoLists: todoListReducer, tasks: tasksReducer, app: appReducer, auth: authReducer})

export type AppRootState = ReturnType<typeof rootState>

export const store = configureStore({
  reducer: rootState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
})

export type AppDispatchType = ThunkDispatch<AppRootState, any, AppRootActionType>

export const AppDispatch = () => useDispatch<AppDispatchType>()
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, AppRootActionType>
type AppRootActionType = AppActionType | TasksActionType | TodoListActionType | AuthActionType
