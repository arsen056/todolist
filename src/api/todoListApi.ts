import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '4d6d9926-0e7a-48ea-8269-ba2c86428db6',
    },
})

export const todoListAPI = {
    getTodolists() {
        return instance.get<TodoListResponseType[]>('todo-lists')
    },

    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodoListResponseType }>>('todo-lists', {title})
            .then((res) => res.data)
    },

    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`)
    },

    updateTodolist(id: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${id}`, {title})
            .then((res) => res.data)
    },

    getTasks(id: string) {
        return instance.get<getTasksTypeResponse>(`todo-lists/${id}/tasks`)
    },

    addTask(todoListID: string, title: string) {
        return instance.post<ResponseType<{ item: TaskTypeResponse }>>(`todo-lists/${todoListID}/tasks`, {title})
            .then((res) => res.data)
    },

    updateTask(todoListID: string, taskID: string, task: UpdateTaskModelType) {
        return instance.put<ResponseType<TaskTypeResponse>>(`/todo-lists/${todoListID}/tasks/${taskID}`, task)
            .then((res) => res.data)
    },

    deleteTask(todoListID: string, taskID: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todoListID}/tasks/${taskID}`)
            .then((res) => res.data)
    }
}

export type AuthType = {
    email: string
    password: string
    rememberMe?: boolean
}
export const AuthAPI = {
    auth(Auth: AuthType) {
        return instance.post<ResponseType<{ userId: number }>>('auth/login', Auth)
    },
    me() {
        return instance.get<ResponseType<{id: string, email: string, login: string}>>('auth/me')
    }
}

export type TodoListResponseType = {
    addedDate: string
    id: string
    order: number
    title: string
}

type ResponseType<T = {}> = {
    data: T
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
}

type getTasksTypeResponse = {
    error: string
    items: TaskTypeResponse[]
    totalCount: number
}

export type TaskTypeResponse = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: TodoTaskPriority
    startDate: string
    status: TaskStatuses
    title: string
    todoListId: string
}

export type UpdateTaskModelType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}

export type UpdateTaskDomainModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TodoTaskPriority {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

