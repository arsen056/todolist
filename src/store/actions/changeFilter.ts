import {FilterType} from "../../types/FilterType";

export type ChangeFilterAT = {
    type: 'CHANGE_FILTER',
    todoListID: string
    filter: FilterType
}

export const changeFilterAC = (todoListID: string, filter: FilterType):ChangeFilterAT => ({type:'CHANGE_FILTER', todoListID, filter} as const)