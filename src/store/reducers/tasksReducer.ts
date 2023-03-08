import {v1} from "uuid";
import {TasksStateType} from "types";
import {
  TaskStatuses, TaskTypeResponse,
  todoListAPI,
  TodoTaskPriority, UpdateTaskDomainModelType,
} from "api/todoListApi";
import {AppRootState, AppThunk} from "../index";
import {appSetErrorAC, AppSetStatusAC} from "store/reducers/appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodoListAC, removeTodoListAC, setEntityStatusAC, setTodoListAC} from "store/reducers/todoListReducer";

const initialState: TasksStateType = {}

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
  },
  extraReducers: (builder) => {
    builder.addCase(addTodoListAC, (state, action) => {
      state[action.payload.id] = []
    });
    builder.addCase(removeTodoListAC, (state, action) => {
      delete state[action.payload]
    });
    builder.addCase(setTodoListAC, (state, action) => {
      action.payload.forEach((tl) => state[tl.id] = [])
    });
  }
}))

export const fetchTasksTC = (id: string): AppThunk => async dispatch => {
  dispatch(setEntityStatusAC({todoListID: id, status: 'loading'}))
  dispatch(AppSetStatusAC({status: 'loading'}))
  const res = await todoListAPI.getTasks(id)
  dispatch(setTasksAC({todoListID: id, tasks: res.data.items}))
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
    dispatch(addTaskAC({todoListID: res.data.item.todoListId, title: res.data.item.title}))
  } catch (error: any) {
    dispatch(appSetErrorAC(error.message))
  } finally {
    dispatch(AppSetStatusAC({status: 'succeeded'}))
    dispatch(setEntityStatusAC({todoListID, status: 'idle'}))
  }
}

export const deleteTaskTC = (todoListID: string, taskID: string): AppThunk => async dispatch => {
  dispatch(AppSetStatusAC({status: 'loading'}))
  try {
    await todoListAPI.deleteTask(todoListID, taskID)
    dispatch(deleteTaskAC({todoListID, taskID}))
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
      dispatch(updateTaskAC({todoListID, taskID, task: modelTaskAPI}))
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

export const {addTaskAC, deleteTaskAC, updateTaskAC, setTasksAC} = slice.actions
export const tasksReducer = slice.reducer