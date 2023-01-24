import {StatusType} from "../../types";

export const setEntityStatusAC = (todoListID: string, status: StatusType) => ({type: 'SET_ENTITY_STATUS', todoListID, status} as const)

export type SetEntityStatusAT = ReturnType<typeof setEntityStatusAC>