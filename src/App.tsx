import React from 'react';
import './App.css';
import {Todolist} from "./components/Todolist/Todolist";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./store";
import {TodoListStateType} from "./types/TodoListStateType";
import {selectTodoLists} from "./store/selectors/";
import Header from "./components/Header/Header";
import {Paper, Container, Grid} from "@mui/material";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {addTodoListAC} from "./store/actions/addTodoList";
import {v1} from "uuid";

function App() {

  const todoLists = useSelector<AppRootState, TodoListStateType>(selectTodoLists)
  const dispatch = useDispatch();

  const addTodoList = (title: string) => dispatch(addTodoListAC(v1(), title))

  const todoListMap = todoLists.length ? todoLists.map(t => {
      return (
          <Grid item xs={12} md={4}>
              <Paper elevation={5} sx={{
                  width: 350,
                  padding: '1rem'
          }}>
              <Todolist key={t.id} todoList={t}/>
            </Paper>
          </Grid>
      )
  }) : <div>Add your first Todolist!</div>

  return (
      <>
        <Header/>

        <Container sx={{padding: '1.5rem 0'}}>
            <AddItemForm addItem={addTodoList} label={'Enter todo list title'}/>
            <Grid container spacing={2}>
                {todoListMap}
            </Grid>
        </Container>
      </>

  );
}

export default App;
