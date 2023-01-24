import React, {ChangeEvent, FC, memo} from 'react';
import {EditableSpan} from "../EditableSpan/EditableSpan";
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from "@mui/material";
import styled from "styled-components";
import {updateTaskTC, deleteTaskTC} from "../../store/reducers/tasksReducer";
import {AppDispatch} from "../../store";

type TaskPropsType = {
    todoListID: string
    taskID: string
    title: string
    completed: number
}

export const Task:FC<TaskPropsType> = memo(({todoListID, taskID, title, completed}) => {
    const dispatch = AppDispatch();

    const deleteTask = () => {
        dispatch(deleteTaskTC(todoListID, taskID))
    }

    const changeTaskTitle = (title: string) => {
        dispatch(updateTaskTC(todoListID, taskID, {title}))
    }

    const changeStatus = (status: number) => {
        dispatch(updateTaskTC(todoListID, taskID, {status}))
    }

    const changeStatusTask = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? 2 : 0
        changeStatus(status)
    }

    const isChecked = completed === 2;

    const changeStatusHandler = (e: any) => {
        if (e.target.id === 'task') {

            changeStatus(isChecked ? 0 : 2)
        }
    }

    return (
        <li>
            <TaskWrapper id={'task'} onClick={changeStatusHandler}>
                <div className={isChecked ? 'completed' : ''}>
                <IconButton onClick={deleteTask}>
                    <DeleteIcon/>
                </IconButton>
                <input type="checkbox" checked={isChecked} onChange={changeStatusTask}/>
                <EditableSpan title={title} changeTitle={changeTaskTitle}/>
                </div>
            </TaskWrapper>

        </li>
    );
});

const TaskWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #C4C4C4FF;
  }
  
  .completed {
    opacity: 0.5;
    text-decoration: line-through;
  }
`