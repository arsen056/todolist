import {Container, Grid, Paper} from "@mui/material";
import {Todolist} from "./Todolist";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {AppDispatch, AppRootState} from "../../store";
import {TodoListsType} from "../../types/TodoListStateType";
import {selectTodoLists} from "../../store/selectors";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {addTodoListTC, fetchTodoListsTC} from "../../store/reducers/todoListReducer";
import {AddItemForm} from "../AddItemForm/AddItemForm";

export const Todolists = () => {

    const todoLists = useSelector<AppRootState, TodoListsType>(selectTodoLists)
    const isLogged = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn)

    const dispatch = AppDispatch();

    useEffect(() => {
        if (!isLogged) {
            return
        }
        dispatch(fetchTodoListsTC())
    }, [])


    const addTodoList = (title: string) => dispatch(addTodoListTC(title))

    const todoListMap = todoLists.length ? todoLists.map(t => {
        return (
            <Grid key={t.id} item xs={12} md={4}>
                <Paper elevation={5} sx={{
                    width: 350,
                }}>
                    <Todolist key={t.id} todoList={t}/>
                </Paper>
            </Grid>
        )
    }) : <div>Add your first Todolist!</div>

    if (!isLogged) {
        return <Navigate to={'/auth'}/>
    }

    return (
        <Container sx={{padding: '1.5rem 0'}}>
            <AddItemForm addItem={addTodoList} label={'Enter todo list title'}/>
            <Grid container spacing={2}>
                {todoListMap}
            </Grid>
        </Container>
    );
};