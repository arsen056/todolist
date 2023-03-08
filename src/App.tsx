import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {AppDispatch, AppRootState} from "store";
import {selectStatus} from "store/selectors/";
import {Header} from "components/Header/Header";
import {LinearProgress} from "@mui/material";
import {StatusType} from "types";
import {CustomizedSnackbars} from "components/SnackBar/CustomizedSnackbars";
import {Auth} from 'features/Auth/Auth'
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import {Todolists} from "components/Todolist/Todolists";
import {Progress} from "components/Progress/Progress";
import {initializedAppTC} from "store/reducers/appReducer";

function App() {
  const status = useSelector<AppRootState, StatusType>(selectStatus)
  const dispatch = AppDispatch();

  const isInit = useSelector<AppRootState, boolean>(state => state.app.initialized)

  useEffect(() => {
    dispatch(initializedAppTC())
  }, [])

  if (!isInit) {
    return <div>
      <Progress/>
    </div>
  }

  return (
    <>
      <HashRouter>
        <Header/>
        {status === 'loading' && <LinearProgress/>}
        <CustomizedSnackbars/>
        <Routes>
          <Route path='/' element={<Auth/>}/>
          <Route path='/todo' element={<Todolists/>}/>
          <Route path='/404' element={<h1>Page not found</h1>}/>
          <Route path='/*' element={<Navigate to='/404'/>}/>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
