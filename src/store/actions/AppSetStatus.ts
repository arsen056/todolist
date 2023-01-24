import {StatusType} from "../../types";

export const AppSetStatusAC = (status: StatusType) => ({type: 'APP/SET-STATUS', status} as const)
