import * as React from 'react';
import {Formik, Field} from 'formik';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {AppDispatch, AppRootState} from "../../store";
import {authTC} from "./AuthReducer";
import {useSelector} from "react-redux";
import {Navigate, useNavigate} from "react-router-dom";
import {AuthType} from "../../api/todoListApi";
import {FormLabel} from "@mui/material";

type ErrorType = {
    email?: string
}

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export const Auth = () => {

    const dispatch = AppDispatch()
    const isLogged = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn)

    if (isLogged) {
        return <Navigate to={'/todolist'}/>
    }

    return (
        <ThemeProvider theme={theme}>
            <Formik initialValues={{email: '', password: '', rememberMe: []}}
                    validate={values => {
                        const errors: ErrorType = {};
                        if (!values.email) {
                            errors.email = 'Required';
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                            errors.email = 'Invalid email address';
                        }
                        return errors;
                    }}

                    onSubmit={(values, {setSubmitting}) => {
                        const valuesToApi = {...values, rememberMe: values.rememberMe.length ? !!values.rememberMe[0] : false}
                        console.log(valuesToApi)
                        dispatch(authTC(valuesToApi))
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
                                <FormControlLabel
                                    control={<Field type="checkbox" name="rememberMe" value="rememberMe" color="primary"/>}
                                    label="Remember me"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{mt: 3, mb: 2}}
                                    disabled={isSubmitting}
                                >
                                    Sign In
                                </Button>

                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="#" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Copyright sx={{mt: 8, mb: 4}}/>
                        </form>
                    </Container>
                )}

            </Formik>
        </ThemeProvider>
    );
}