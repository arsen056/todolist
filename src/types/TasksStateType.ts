import {TaskType} from "./TaskType";

export type TasksStateType = {
    [todoListID: string]: TaskType[];
}