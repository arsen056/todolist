import {AppStatusType, StatusType} from "types";
import {AppThunk} from "../index";
import {AuthAPI} from "api/todoListApi";
import {setLoggedInAC} from "features/Auth/AuthReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: AppStatusType = {
    initialized: false,
    status: "idle",
    error: null
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        AppSetStatusAC: (state, action: PayloadAction<{status: StatusType}>) => {
            state.status = action.payload.status
        },
        appSetErrorAC: (state, action: PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error
        },
        setInitializedAC: (state, action: PayloadAction<{initialized: boolean}>) => {
            state.initialized = action.payload.initialized
        }
    }
})

export const initializedAppTC = ():AppThunk => async dispatch => {
    try {
        const res = await AuthAPI.me();
        dispatch(setInitializedAC({initialized: true}))
        if (res.data.resultCode === 0) {
            dispatch(setLoggedInAC(true))
            return
        }
    } catch (error: any) {
        dispatch(appSetErrorAC(error.message))
    }
}

export const logOutTC = ():AppThunk => async dispatch => {
    try {
        const res = await AuthAPI.logOut();
        dispatch(setInitializedAC({initialized: true}))
        if (res.data.resultCode === 0) {
            dispatch(setLoggedInAC(false))
            return
        }
        dispatch(appSetErrorAC({error: res.data.messages[0]}))
    } catch (error: any) {
        dispatch(appSetErrorAC(error.message))
    }
}

export type AppActionType = ReturnType<typeof AppSetStatusAC> | ReturnType<typeof appSetErrorAC> | ReturnType<typeof setInitializedAC>

export const {AppSetStatusAC, appSetErrorAC ,setInitializedAC} = appSlice.actions
export const appReducer = appSlice.reducer