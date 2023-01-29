import * as React from 'react';
import {Formik, Field} from 'formik';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {AppDispatch, AppRootState} from "../../store";
import {authTC} from "./AuthReducer";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {AuthType} from "../../api/todoListApi";
import {FormLabel} from "@mui/material";
import {StatusType} from "../../types";


const theme = createTheme();

export const Auth = () => {

    const dispatch = AppDispatch()
    const isLogged = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn)
    const appStatus = useSelector<AppRootState, StatusType>(state => state.app.status)

    if (isLogged) {
        return <Navigate to={'/todo'}/>
    }

    return (
        <ThemeProvider theme={theme}>
            <Formik initialValues={{email: '', password: '', rememberMe: []}}
                    onSubmit={(values, {setSubmitting}) => {
                        const valuesToApi: AuthType = {...values, rememberMe: values.rememberMe.length ? !!values.rememberMe[0] : false}
                        dispatch(authTC(valuesToApi))
                        setSubmitting(false)
                    }}>

                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                  }) => (

                    <Container component="main" maxWidth="xs">
                        <form onSubmit={handleSubmit}>
                            <CssBaseline/>
                            <Box
                                sx={{
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <FormLabel>
                                    <p>Email: free@samuraijs.com</p>
                                    <p>Password: free</p>
                                </FormLabel>

                                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                                    <LockOutlinedIcon/>
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Sign in
                                </Typography>

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />
                              {errors.email}
                                <FormControlLabel
                                    control={<Field type="checkbox" name="rememberMe" value="rememberMe" color="primary"/>}
                                    label="Remember me"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{mt: 3, mb: 2}}
                                    disabled={appStatus === "loading"}
                                >
                                    Sign In
                                </Button>

                            </Box>
                        </form>
                    </Container>
                )}
            </Formik>
        </ThemeProvider>
    );
}