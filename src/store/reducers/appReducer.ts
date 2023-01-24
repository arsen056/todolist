import {AppStatusType} from "../../types";
import {appSetErrorAC, AppSetStatusAC, setInitializedAC} from "../actions";
import {AppThunk} from "../index";
import {AuthAPI} from "../../api/todoListApi";
import {setLoggedInAC} from "../../features/Auth/AuthReducer";

const initialState: AppStatusType = {
    initialized: false,
    status: "idle",
    error: null
}

export const appReducer = (state = initialState, action: AppActionType) => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET_INITIALIZED':
            return {...state, initialized: action.value}
        default:
            return {...state}
    }
}

export const initializedAppTC = ():AppThunk => async dispatch => {
    try {
        const res = await AuthAPI.me();
        dispatch(setInitializedAC(true))
        if (res.data.resultCode === 0) {
            dispatch(setLoggedInAC(true))
            return
        }
        dispatch(appSetErrorAC(res.data.messages[0]))
    } catch (error: any) {
        dispatch(appSetErrorAC(error.message))
    }
}

export const logOutTC = ():AppThunk => async dispatch => {
    try {
        const res = await AuthAPI.logOut();
        dispatch(setInitializedAC(true))
        if (res.data.resultCode === 0) {
            dispatch(setLoggedInAC(false))
            return
        }
        dispatch(appSetErrorAC(res.data.messages[0]))
    } catch (error: any) {
        dispatch(appSetErrorAC(error.message))
    }
}

export type AppActionType = ReturnType<typeof AppSetStatusAC> | ReturnType<typeof appSetErrorAC> | ReturnType<typeof setInitializedAC>