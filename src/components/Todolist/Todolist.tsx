import React, {FC, memo, useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "../../store";
import {TaskType, FilterType, TodoListType} from "../../types";
import {Task} from "../Task/Task";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {addTaskAC, changeFilterAC, removeTodoListAC} from "../../store/actions";
import {Paper, Button, Box, Typography, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import {selectTasks} from "../../store/selectors";

export type TodoListPropsType = {
    todoList: TodoListType
}

export const Todolist:FC<TodoListPropsType> = memo(({todoList}) => {
    const {id, title, filter} = todoList;

    const tasks = useSelector<AppRootState, TaskType[]>(selectTasks(id))
    const dispatch = useDispatch();

    let filteredTasks = tasks;
    if (filter === 'completed') filteredTasks = tasks.filter(t => t.completed)
    if (filter === 'active') filteredTasks = tasks.filter(t => !t.completed)

    const tasksMap = tasks.length ? filteredTasks.map(t => {
        return (
            <Paper sx={{
                margin:'1rem',
                backgroundColor:'#F1F3F4'
            }}>
                <Task
                key={t.id}
                todoListID={id}
                taskID={t.id}
                title={t.title}
                completed={t.completed}
                />
            </Paper>
        )
    }) : 'Enter your tasks!'

    const changeFilter = (filter: FilterType) => dispatch(changeFilterAC(id, filter))
    const removeTodoList = () => dispatch(removeTodoListAC(id))

    const addTask = useCallback((title: string) => dispatch(addTaskAC(id, title)),[dispatch])

    return (
        <TodoListContainer>
            <div>
                <Typography component={'h2'} sx={{
                    fontSize: 20,
                    fontWeight: 600,
                    padding: '0.5rem'
                }}>{title}</Typography>
                <IconButton
                    aria-label="Delete"
                    onClick={removeTodoList}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0
                }}>
                    <CloseIcon/>
                </IconButton>
            </div>
            <AddItemForm addItem={addTask} label={'Enter your task'} />
            <Box component={'ul'} sx={{
                height:300,
                overflowY: "scroll",
            }}>
                {tasksMap}
            </Box>
            <ButtonsWrapper>
                <Button variant={filter === 'all' ? "contained" : 'outlined'} onClick={() => changeFilter('all')} disabled={!tasks.length}>All</Button>
                <Button variant={filter === 'active' ? "contained" : 'outlined'} onClick={() => changeFilter('active')} disabled={!tasks.length}>Active</Button>
                <Button variant={filter === 'completed' ? "contained" : 'outlined'} onClick={() => changeFilter('completed')} disabled={!tasks.length}>Completed</Button>
            </ButtonsWrapper>
        </TodoListContainer>
    );
});

const ButtonsWrapper = styled.div`
  display: flex;
  column-gap: 1rem;
  justify-content: center;
  padding: 10px 0;
`

const TodoListContainer = styled.div`
  position: relative;
`