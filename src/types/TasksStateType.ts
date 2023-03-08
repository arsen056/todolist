import {TaskTypeResponse} from "api/todoListApi";

export type TasksStateType = {
    [todoListID: string]: TaskTypeResponse[];
}