import {AppRootState} from "../index";

export const selectTasks = (todoListID: string) => (state: AppRootState) => state.tasks[todoListID]