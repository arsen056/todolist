import {v1} from "uuid";
import {TasksStateType} from "../../types/TasksStateType";
import {todoListID_1, todoListID_2, todoListID_3, todoListID_4} from "./todoListReducer";
import {AddTaskAT, ChangeStatusAT, ChangeTaskTitleAT, RemoveTodoListAT, AddTodoListAT, DeleteTaskAT} from "../actions";

const initialState: TasksStateType = {
    [todoListID_1]: [
        {id: v1(), title: 'HTML & CSS', completed: true},
        {id: v1(), title: 'JS & TS', completed: true},
        {id: v1(), title: 'React', completed: false},
        {id: v1(), title: 'Git', completed: false},
        {id: v1(), title: 'Webpack', completed: false},
    ],
    [todoListID_2]: [
        {id: v1(), title: 'Cola', completed: true},
        {id: v1(), title: 'Sprite', completed: true},
        {id: v1(), title: 'Pepsi', completed: false},
        {id: v1(), title: 'Water', completed: false},
    ],
    [todoListID_3]: [
        {id: v1(), title: 'Cola', completed: true},
        {id: v1(), title: 'Sprite', completed: true},
        {id: v1(), title: 'Pepsi', completed: false},
        {id: v1(), title: 'Water', completed: false},
    ],
    [todoListID_4]: [
        {id: v1(), title: 'Cola', completed: true},
        {id: v1(), title: 'Sprite', completed: true},
        {id: v1(), title: 'Pepsi', completed: false},
        {id: v1(), title: 'Water', completed: false},
    ]
}

type ActionType = DeleteTaskAT | AddTaskAT | ChangeStatusAT | ChangeTaskTitleAT | RemoveTodoListAT | AddTodoListAT

export const tasksReducer = (state= initialState, action: ActionType):TasksStateType => {
    switch (action.type) {
        case 'DELETE_TASK':
            return {...state, [action.todoListID]: state[action.todoListID].filter(t => t.id !== action.taskID)}
        case 'ADD-TASK':
            const newTask = {id: v1(), title: action.title, completed: false}
            return { ...state, [action.todoListID]: [newTask, ...state[action.todoListID]] }
        case 'CHANGE_STATUS' :
            return {...state, [action.todoListID]: state[action.todoListID].map(t => t.id === action.taskID ? {...t, completed: action.status} : t)}
        case 'CHANGE_TASK_TITLE':
            return {...state, [action.todoListID]: state[action.todoListID].map(t => t.id === action.taskID ? {...t, title: action.title} : t)}
        case 'REMOVE_TODOLIST':
            delete state[action.todoListID]
            return state
        case 'ADD_TODOLIST':
            return {...state, [action.id]: []}
        default:
            return state
    }
}