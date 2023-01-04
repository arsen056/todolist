import {FilterType} from "./FilterType";

export type TodoListStateType = TodoListType[];

export type TodoListType = {
    id: string
    title: string
    filter: FilterType
}