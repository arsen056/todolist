import {v1} from "uuid";
import {TasksStateType} from "types";
import {
    AddTaskAT,
    RemoveTodoListAT,
    AddTodoListAT,
    DeleteTaskAT,
    SetTodoListAT, addTaskAC, deleteTaskAC, updateTaskAC, UpdateTaskAT,
} from "../actions";
import {
    TaskStatuses,
    todoListAPI,
    TodoTaskPriority, UpdateTaskDomainModelType,
} from "api/todoListApi";
import {setTasksAC, SetTasksAT} from "../actions/setTasks";
import {AppRootState, AppThunk} from "../index";
import {setEntityStatusAC} from "../actions/setEntityStatus";
import {appSetErrorAC, AppSetStatusAC} from "store/reducers/appReducer";


const initialState: TasksStateType = {}

export type TasksActionType = DeleteTaskAT | AddTaskAT | UpdateTaskAT | RemoveTodoListAT | AddTodoListAT | SetTodoListAT | SetTasksAT

export const tasksReducer = (state= initialState, action: TasksActionType):TasksStateType => {
    switch (action.type) {
        case 'DELETE_TASK':
            return {...state, [action.todoListID]: state[action.todoListID].filter(t => t.id !== action.taskID)}
        case 'ADD-TASK':
            const newTask = {
                id: v1(),
                title: action.title,
                status: TaskStatuses.New,
                order: 0, addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TodoTaskPriority.Low,
                todoListId: action.todoListID,
                completed: false
            }
            return { ...state, [action.todoListID]: [newTask, ...state[action.todoListID]] }
        case 'UPDATE_TASK':
            return {...state, [action.todoListID]: state[action.todoListID].map(t => t.id === action.taskID ? {...t, ...action.model} : t)}
        case 'REMOVE_TODOLIST':
            delete state[action.todoListID]
            return state
        case 'ADD_TODOLIST':
            return {...state, [action.todoList.id]: []}
        case 'SET_TODOLIST':
            const copyState = {...state}
            action.todoList.forEach(tl => copyState[tl.id] = [] )
            return copyState
        case 'SET_TASKS':
            return {...state, [action.todoListID]: action.tasks}
        default:
            return state
    }
}

export const fetchTasksTC = (id: string): AppThunk => async dispatch => {
    dispatch(setEntityStatusAC(id, 'loading'))
    dispatch(AppSetStatusAC({status: 'loading'}))
    const res = await todoListAPI.getTasks(id)
    dispatch(setTasksAC(id, res.data.items))
    dispatch(AppSetStatusAC({status: 'succeeded'}))
    dispatch(setEntityStatusAC(id, 'idle'))
}

export const addTaskTC = (todoListID: string, title: string): AppThunk => async dispatch => {
    dispatch(AppSetStatusAC({status: 'loading'}))
    dispatch(setEntityStatusAC(todoListID, 'loading'))

    try {
        const res = await todoListAPI.addTask(todoListID, title)

        if (res.resultCode === 1) {
            dispatch(appSetErrorAC({error: res.messages[0]}))
            dispatch(AppSetStatusAC({status: 'succeeded'}))
            return
        }
        dispatch(addTaskAC(res.data.item.todoListId, res.data.item.title))
    } catch (error: any) {
        dispatch(appSetErrorAC(error.message))
    } finally {
        dispatch(AppSetStatusAC({status: 'succeeded'}))
        dispatch(setEntityStatusAC(todoListID, 'idle'))
    }
}

export const deleteTaskTC = (todoListID: string, title: string): AppThunk => async dispatch => {
    dispatch(AppSetStatusAC({status: 'loading'}))
    try {
        await todoListAPI.deleteTask(todoListID, title)
        dispatch(deleteTaskAC(todoListID, title))
    } catch (error: any) {
        dispatch(appSetErrorAC(error.message))
    } finally {
        dispatch(AppSetStatusAC({status: 'succeeded'}))
        dispatch(setEntityStatusAC(todoListID, 'idle'))
    }
}

export const updateTaskTC = (todoListID: string, taskID: string, model: UpdateTaskDomainModelType): AppThunk => async (dispatch, getState: () => AppRootState) => {
    dispatch(AppSetStatusAC({status: 'loading'}))
    dispatch(setEntityStatusAC(todoListID, 'loading'))
    const task = getState().tasks[todoListID].find(t => t.id === taskID)

    if (!task) return

    const modelTaskAPI = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...model
    }

    try {
        const res = await todoListAPI.updateTask(todoListID, taskID, modelTaskAPI)
        if (res.resultCode === 0) {
            dispatch(updateTaskAC(todoListID, taskID, modelTaskAPI))
            return
        }
        dispatch(appSetErrorAC({error: res.messages[0]}))
    } catch (error: any) {
        dispatch(appSetErrorAC(error.message))
    } finally {
        dispatch(setEntityStatusAC(todoListID, 'idle'))
        dispatch(AppSetStatusAC({status: 'succeeded'}))
    }


}