import {v1} from "uuid";
import {TasksStateType} from "types";
import {addTaskAC, deleteTaskAC, updateTaskAC} from "../actions";
import {
  TaskStatuses, TaskTypeResponse,
  todoListAPI,
  TodoTaskPriority, UpdateTaskDomainModelType,
} from "api/todoListApi";
import {setTasksAC} from "../actions/setTasks";
import {AppRootState, AppThunk} from "../index";
import {appSetErrorAC, AppSetStatusAC} from "store/reducers/appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodoListAC, removeTodoListAC, setEntityStatusAC, setTodoListAC} from "store/reducers/todoListReducer";


const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: any): TasksStateType => {
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
      return {...state, [action.todoListID]: [newTask, ...state[action.todoListID]]}
    case 'UPDATE_TASK':
      return {
        ...state,
        [action.todoListID]: state[action.todoListID].map(t => t.id === action.taskID ? {...t, ...action.model} : t)
      }
    case removeTodoListAC.type:
      delete state[action.payload.todoListID]
      return state
    case addTodoListAC.type:
      return {...state, [action.payload.id]: []}
    case setTodoListAC.type:
      const copyState = {...state}
      action.payload.forEach((tl: any) => copyState[tl.id] = [])
      return copyState
    case 'SET_TASKS':
      return {...state, [action.todoListID]: action.tasks}
    default:
      return state
  }
}

const slice = createSlice(({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksAC: (state, action: PayloadAction<{ tasks: TaskTypeResponse[], todoListID: string }>) => {
      state[action.payload.todoListID] = action.payload.tasks
    },
    addTaskAC: (state, action: PayloadAction<{ title: string, todoListID: string }>) => {
      const newTask = {
        id: v1(),
        title: action.payload.title,
        status: TaskStatuses.New,
        order: 0, addedDate: '',
        deadline: '',
        startDate: '',
        description: '',
        priority: TodoTaskPriority.Low,
        todoListId: action.payload.todoListID,
        completed: false
      }
      state[action.payload.todoListID].unshift(newTask)
    },
    deleteTaskAC: (state, action: PayloadAction<{ taskID: string, todoListID: string }>) => {
      const taskID = action.payload.taskID
      const tasks = state[action.payload.todoListID]
      const index = tasks.findIndex((task) => task.id === taskID)

      if (index > -1) {
        tasks.splice(index, 1)
      }
    },
    updateTaskAC: (state, action: PayloadAction<{ taskID: string, todoListID: string, task: UpdateTaskDomainModelType }>) => {
      const taskID = action.payload.taskID
      const tasks = state[action.payload.todoListID]
      const index = tasks.findIndex((task) => task.id === taskID)

      if (index > -1) {
        tasks[index] = {...tasks[index], ...action.payload.task}
      }
    }
  }
}))

export const fetchTasksTC = (id: string): AppThunk => async dispatch => {
  dispatch(setEntityStatusAC({todoListID: id, status: 'loading'}))
  dispatch(AppSetStatusAC({status: 'loading'}))
  const res = await todoListAPI.getTasks(id)
  dispatch(setTasksAC(id, res.data.items))
  dispatch(AppSetStatusAC({status: 'succeeded'}))
  dispatch(setEntityStatusAC({todoListID: id, status: 'idle'}))
}

export const addTaskTC = (todoListID: string, title: string): AppThunk => async dispatch => {
  dispatch(AppSetStatusAC({status: 'loading'}))
  dispatch(setEntityStatusAC({todoListID, status: 'loading'}))

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
    dispatch(setEntityStatusAC({todoListID, status: 'idle'}))
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
    dispatch(setEntityStatusAC({todoListID, status: 'idle'}))
  }
}

export const updateTaskTC = (todoListID: string, taskID: string, model: UpdateTaskDomainModelType): AppThunk => async (dispatch, getState: () => AppRootState) => {
  dispatch(AppSetStatusAC({status: 'loading'}))
  dispatch(setEntityStatusAC({todoListID, status: 'loading'}))
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
    dispatch(setEntityStatusAC({todoListID, status: 'idle'}))
    dispatch(AppSetStatusAC({status: 'succeeded'}))
  }
}