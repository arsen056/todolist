import React, {FC, memo, useCallback, useEffect} from 'react';
import {useSelector} from "react-redux";
import {AppDispatch, AppRootState} from "../../store";
import {FilterType} from "../../types";
import {Task} from "../Task/Task";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {changeFilterAC} from "../../store/actions";
import {Box, Button, IconButton, Paper, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import {selectTasks} from "../../store/selectors";
import {TaskStatuses, TaskTypeResponse} from "../../api/todoListApi";
import {TodoListStateType} from "../../types/TodoListStateType";
import {addTaskTC, fetchTasksTC} from "../../store/reducers/tasksReducer";
import {changeTodoListTitleTC, removeTodoListTC} from "../../store/reducers/todoListReducer";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import {Progress} from "../Progress/Progress";

export type TodoListPropsType = {
    todoList: TodoListStateType
}

export const Todolist:FC<TodoListPropsType> = memo(({todoList}) => {
    const dispatch = AppDispatch();

    const {id, title, filter, entityStatus} = todoList;

    useEffect(() => {
        dispatch(fetchTasksTC(id))
    },[])

    const tasks = useSelector<AppRootState, TaskTypeResponse[]>(selectTasks(id))

    let filteredTasks = tasks;
    if (filter === 'completed') filteredTasks = tasks.filter(t => t.status === TaskStatuses.Completed)
    if (filter === 'active') filteredTasks = tasks.filter(t => t.status === TaskStatuses.New)

    const tasksMap = tasks.length ? filteredTasks.map(t => {
        return (
            <Paper key={t.id} sx={{
                margin:'1rem',
                backgroundColor:'#F1F3F4'
            }}>
                <Task
                    key={t.id}
                    todoListID={id}
                    taskID={t.id}
                    title={t.title}
                    completed={t.status}
                />
            </Paper>
        )
    }) : 'Enter your tasks!'

    const changeFilter = (filter: FilterType) => dispatch(changeFilterAC(id, filter))
    const removeTodoList = () => dispatch(removeTodoListTC(id))

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(id, title))
    },[dispatch])

    const changeTodoListTitle = (title: string) => {
        dispatch(changeTodoListTitleTC(id, title))
    }

    return (
        <TodoListContainer>
            {entityStatus === 'loading' ? <FakeOverlay/> : null}
            <div>
                <Typography component={'h2'} sx={{
                    fontSize: 20,
                    fontWeight: 600,
                    padding: '0.5rem'
                }}>
                    <EditableSpan title={title} changeTitle={changeTodoListTitle}/>
                </Typography>
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
                position: 'relative',
                height:300,
                overflowY: "scroll",
            }}>
                {tasksMap}
                {entityStatus === 'loading' ? <Progress/> : null}
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
  padding: 1rem;
`

const FakeOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(250 250 250 / 0.4);
  z-index: 10;
`