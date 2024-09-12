'use client'
import { East, Error, Warning, WarningRounded } from '@mui/icons-material'
import { Box, Button, Checkbox, Divider, Grid, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import Link from 'next/link'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../redux/features/authSlice'

function Register() {
    const [agree, setAgree] = useState(false);
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        enableReinitialize: true,
        onSubmit: values => {
            dispatch(registerUser({ email: values.email, password: values.password }))
        },
        validate: values => {
            let errors = {};

            if (!values.email) {
                errors.email = 'Email cannot be empty';
            }
            if (!values.password) {
                errors.password = 'Password cannot be empty';
            }
            if (!values.confirmPassword) {
                errors.confirmPassword = 'Confirm Password cannot be empty';
            }

            return errors;
        }
    }
    )
    return (
        <Grid
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            py={4}
        >
            <form onSubmit={formik.handleSubmit}>
                <Grid
                    display={"flex"}
                    justifyContent={"center"}
                    p={'50px'}
                    gap={2}
                    boxShadow={20}
                    borderRadius={2}
                    flexDirection={'column'}
                >
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                    >
                        <Typography variant='h3'>Welcome To TrustVote</Typography>
                        <Typography variant='h6' fontWeight={'light'} color={'#5A5A5A'}>
                            Create a new account
                        </Typography>
                    </Box>

                    <Divider />

                    <Grid
                        display={'flex'}
                        flexDirection={'column'}
                        gap={3}
                    >
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            gap={0.5}
                        >
                            <TextField
                                error={formik.errors.email}
                                name='email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                placeholder='youremail@example.com'
                                label='Email'
                            />
                            {formik.errors.email &&
                                <Typography variant='caption' color={'#d62f2f'}>
                                    <Error fontSize='small' /> {formik.errors.email}
                                </Typography>
                            }
                        </Box>
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            gap={0.5}
                        >
                            <TextField
                                error={formik.errors.password}
                                name='password'
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                type='password'
                                label='Password'
                            />
                            {formik.errors.password &&
                                <Typography variant='caption' color={'#d62f2f'}>
                                    <Error fontSize='small' /> {formik.errors.password}
                                </Typography>
                            }
                        </Box>
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            gap={0.5}
                        >
                            <TextField
                                error={formik.errors.confirmPassword}
                                name='confirmPassword'
                                type='password'
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                label='Confirm Password'
                            />
                            {formik.errors.confirmPassword &&
                                <Typography variant='caption' color={'#d62f2f'}>
                                    <Error fontSize='small' /> {formik.errors.confirmPassword}
                                </Typography>
                            }
                        </Box>
                    </Grid>

                    <Grid
                        display={'flex'}
                        alignItems={'center'}
                    >
                        <Checkbox onClick={() => setAgree(!agree)} />
                        <Typography variant='caption'>
                            I agree to TrustVote&aposs terms and conditions.
                        </Typography>

                    </Grid>
                    <Button
                        type='submit'
                        disabled={!(formik.isValid && formik.dirty && agree)}
                        variant='contained'
                    >
                        Create Account
                    </Button>

                    <Divider />

                    <Link
                        href={"/user/login"}
                        className="arrowBox"
                    >
                        <Box
                            width={"fit-content"}
                            display={"flex"}
                            justifyContent={"start"}
                            alignItems={"center"}
                            gap={"3px"}
                            sx={{ textDecoration: "none", cursor: "pointer", ":hover": { textDecoration: "underline" } }}
                        >
                            <Typography variant='caption' color={"#5A5A5A"}>Already a member?</Typography>
                            <Typography variant='caption' color={"secondary.main"} >Login</Typography>
                            <Box
                                className="rightArrow"
                                display={'flex'}
                                alignItems={'center'}
                                sx={{ "&.arrowBox:hover": { transform: "translate(10px)" }, transition: "all 0.3s ease" }}
                            >
                                <East color='secondary.main' fontSize='inherit' />
                            </Box>
                        </Box>
                    </Link>
                </Grid>
            </form>
        </Grid>
    )
}

export default Register