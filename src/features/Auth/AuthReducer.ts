import {AppThunk} from "store";
import {AuthAPI, AuthType} from "api/todoListApi";
import {appSetErrorAC, AppSetStatusAC} from "store/reducers/appReducer";

type InitialStateType = {
    isLoggedIn: boolean
    isSubmitting: boolean
}

const initState: InitialStateType = {
    isLoggedIn: false,
    isSubmitting: false
}

export const authReducer = (state = initState, action: AuthActionType) => {
    switch (action.type) {
        case 'auth/SET_LOGGED_IN':
            return {...state, isLoggedIn: action.value};
        case "auth/SET_IS_SUBMITTING":
            return {...state, isSubmitting: action.value}
        default:
            return state
    }
}

export type AuthActionType = ReturnType<typeof setLoggedInAC> | ReturnType<typeof setIsSubmitting>

export const authTC = (AuthObj: AuthType):AppThunk => async dispatch => {
    try {
        dispatch(AppSetStatusAC({status: 'loading'}));
        const res = await AuthAPI.auth(AuthObj)

        if (res.data.resultCode === 0) {
            dispatch(setLoggedInAC(true))
            return
        }
        dispatch(appSetErrorAC({error: res.data.messages[0]}))
    } catch (error: any) {
        dispatch(appSetErrorAC(error.message))
    } finally {
        dispatch(AppSetStatusAC({status: 'idle'}));
    }
}

export const setLoggedInAC = (value: boolean) => ({type: 'auth/SET_LOGGED_IN', value} as const)
export const setIsSubmitting = (value: boolean) => ({type: 'auth/SET_IS_SUBMITTING', value} as const)