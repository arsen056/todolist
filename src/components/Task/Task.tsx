import React, {ChangeEvent, FC, memo} from 'react';
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {deleteTaskAC, changeTaskTitleAC, changeStatusAC} from "../../store/actions";
import {useDispatch} from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from "@mui/material";
import styled from "styled-components";

type TaskPropsType = {
    todoListID: string
    taskID: string
    title: string
    completed: boolean
}

export const Task:FC<TaskPropsType> = memo(({todoListID, taskID, title, completed}) => {
    const dispatch = useDispatch();

    const deleteTask = () => {
        dispatch(deleteTaskAC(todoListID, taskID))
    }

    const changeTaskTitle = (title: string) => dispatch(changeTaskTitleAC(todoListID, taskID, title))

    const changeStatus = (status: boolean) => dispatch(changeStatusAC(todoListID, taskID, status))

    const changeStatusTask = (e: ChangeEvent<HTMLInputElement>) => {
        changeStatus(e.currentTarget.checked)
    }

    const changeStatusHandler = (e: any) => {
        if (e.target.id === 'task') changeStatus(!completed)
    }

    return (
        <li>
            <TaskWrapper id={'task'} onClick={changeStatusHandler}>
                <div className={completed ? 'completed' : ''}>
                <IconButton onClick={deleteTask}>
                    <DeleteIcon/>
                </IconButton>
                <input type="checkbox" checked={completed} onChange={changeStatusTask}/>
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