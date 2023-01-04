import {combineReducers, createStore} from "redux";
import {tasksReducer} from "./reducers/tasksReducer";
import {todoListReducer} from "./reducers/todoListReducer";

const rootState = combineReducers({todoLists: todoListReducer, tasks: tasksReducer})

export type AppRootState = ReturnType<typeof rootState>

export const store = createStore(rootState);