import React from 'react';
import {AppBar, Button, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {useSelector} from "react-redux";
import {AppDispatch, AppRootState} from "../../store";
import {logOutTC} from "../../store/reducers/appReducer";

export const Header = () => {

    const dispatch = AppDispatch();
    const isLogged = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn)

    const logOutHandler = () => {
        dispatch(logOutTC());
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    TodoList
                </Typography>
                {isLogged ? <Button color="inherit" onClick={logOutHandler}>Log out</Button> : <Button color="inherit">Login</Button>}

            </Toolbar>
        </AppBar>
    );
};