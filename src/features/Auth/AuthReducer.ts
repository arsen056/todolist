import {AppThunk} from "../../store";
import {AuthAPI, AuthType} from "../../api/todoListApi";
import {appSetErrorAC} from "../../store/actions";


type InitialStateType = {
    isLoggedIn: boolean
}

const initState: InitialStateType = {
    isLoggedIn: false
}

export const authReducer = (state = initState, action: AuthActionType) => {
    switch (action.type) {
        case 'auth/SET_LOGGED_IN':
            return {...state, isLoggedIn: action.value};
        default:
            return state
    }
}

export type AuthActionType = ReturnType<typeof setLoggedInAC>

export const authTC = (AuthObj: AuthType):AppThunk => async dispatch => {
    try {
        const res = await AuthAPI.auth(AuthObj)

        if (res.data.resultCode === 0) {
            dispatch(setLoggedInAC(true))
            return
        }
        dispatch(appSetErrorAC(res.data.messages[0]))
    } catch (error: any) {
        dispatch(appSetErrorAC(error.message))
    }
}

export const setLoggedInAC = (value: boolean) => ({type: 'auth/SET_LOGGED_IN', value} as const)