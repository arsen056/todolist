import {FilterType} from "./FilterType";
import {StatusType} from "./AppStatusType";

export type TodoListsType = TodoListStateType[];

export type TodoListStateType = TodoListResponseType & {filter: FilterType, entityStatus: StatusType}

export type TodoListResponseType = {
    addedDate: string
    id: string
    order: number
    title: string
}