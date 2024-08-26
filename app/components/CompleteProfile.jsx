'use client'
import { Box, Grid, TextField, Typography, Button, Divider } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import NationalityVerification from '@/app/components/NationalityVerification';
import { Error } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../redux/features/userSlice';
import DateInputField from "./DateInputField";
import Loading from './Loading';
import { updateProfile } from '../redux/features/profileCompletionSlice';
import dayjs from 'dayjs';
import withAuth from '../utils/withAuth';

function CompleteProfile() {
    const { userProfile, loading } = useSelector(state => state.user)

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserProfile())
    }, [dispatch])

    const formik = useFormik({
        initialValues: {
            firstName: userProfile.firstName || '',
            lastName: userProfile.lastName || '',
            email: userProfile?.email || '',
            phone: userProfile.phone || '',
            cnic: userProfile.cnic || '',
            date: userProfile.dateOfBirth || '',
            cnicFront: userProfile.cnicFront || '',
            cnicBack: userProfile.cnicBack || ''
        },
        enableReinitialize: true,
        onSubmit: values => {
            console.log(values)
            const { date, ...otherValues } = values;
            dispatch(updateProfile({
                ...otherValues,
                dateOfBirth: dayjs(date).format('YYYY-MM-DD')
            }))
        },
        validate: values => {
            const errors = {};

            // Validate first name
            if (!values.firstName) {
                errors.firstName = 'First Name is required';
            } else if (values.firstName.length < 2) {
                errors.firstName = 'First Name must be at least 2 characters';
            }

            // Validate last name
            if (!values.lastName) {
                errors.lastName = 'Last Name is required';
            } else if (values.lastName.length < 2) {
                errors.lastName = 'Last Name must be at least 2 characters';
            }

            // Validate email
            if (!values.email) {
                errors.email = 'Email is required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            // Validate phone
            if (!values.phone) {
                errors.phone = 'Phone number is required';
            } else if (!/^\d{10,15}$/i.test(values.phone)) {
                errors.phone = 'Phone number must be between 10 and 15 digits';
            }

            // Validate CNIC front
            if (!values.cnicFront) {
                errors.cnicFront = 'Front side of CNIC is required';
            }

            // Validate CNIC back
            if (!values.cnicBack) {
                errors.cnicBack = 'Back side of CNIC is required';
            }
            if (!values.cnic) {
                errors.cnic = 'CNIC Number cannot be empty.'
            }
            if (!/^\d{5}-\d{7}-\d{1}$/.test(values.cnic)) {
                errors.cnic = 'Invalid CNIC Number'
            }
            if (!values.date) {
                errors.date = 'Date of Birth cannot be empty'
            }

            const today = new Date()
            const dob = new Date(values.date)
            const age = today.getFullYear() - dob.getFullYear();
            const monthDifference = today.getMonth() - dob.getMonth();
            const dayDifference = today.getDate() - dob.getDate();

            if (age < 18 || (age === 18 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
                errors.date = 'You must be at least 18 years old';
            }

            return errors;
        }
    })
    return (
        <>
            {loading &&
                <Loading />
            }
            <form onSubmit={formik.handleSubmit}>
                <Grid
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                    gap={3}
                    borderRadius={5}
                    p={3}
                    width={"fit-content"}
                    sx={{
                        backgroundColor: "white",
                        border: "1px solid #DBDBDB"
                    }}
                >
                    <Grid
                        display={'flex'}
                        flexDirection={'column'}
                        gap={2}
                    >
                        <Grid
                            display={'flex'}
                            gap={2}
                            // alignItems={'end'}
                            flexDirection={'column'}
                        >
                            <Typography
                                variant='h6'
                                border={'1px solid black'}
                                p={1}
                                textAlign={'center'}
                            >
                                TRUSTxVOTE
                            </Typography>

                            <Typography
                                variant='h6'
                            >
                                Complete your profile
                            </Typography>
                        </Grid>

                        <Divider />

                    </Grid>

                    <Box
                        display={'flex'}
                        gap={2}
                        justifyContent={'space-between'}
                    >
                        <TextField
                            fullWidth
                            label={'First Name'}
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            name='firstName'
                            error={formik.touched && formik.errors.firstName}
                            helperText={formik.touched && formik.errors.firstName}

                        />

                        <TextField
                            fullWidth
                            label={'Last Name'}
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            name='lastName'
                            error={formik.touched && formik.errors.lastName}
                            helperText={formik.touched && formik.errors.lastName}
                        />
                    </Box>

                    <Divider />

                    <Box
                        display={'flex'}
                        gap={2}
                        justifyContent={'space-between'}
                    >

                        <TextField
                            label={'Email'}
                            disabled
                            fullWidth
                            name='email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />

                        <TextField
                            label={'Phone'}
                            type='tel'
                            fullWidth
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            name='phone'
                            error={formik.touched && formik.errors.phone}
                            helperText={formik.touched && formik.errors.phone}
                        />
                    </Box>
                    <Divider />
                    <Grid
                        display={'flex'}
                        gap={2}
                    >
                        <TextField
                            name='cnic'
                            label={'CNIC Number'}
                            value={formik.values.cnic}
                            onChange={formik.handleChange}
                            error={formik.touched && formik.errors.cnic}
                            helperText={formik.touched && formik.errors.cnic}
                        />

                        <DateInputField label={'Date of Birth'} formik={formik} />

                    </Grid>

                    <Divider />
                    <Grid
                        display={"flex"}
                        gap={2}
                        flexDirection={"column"}
                        borderBottom={"1px solid #DBDBDB"}
                        pb={3}
                    >
                        <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={'center'}
                            gap={0.5}
                            width={"100%"}
                        >
                            <Typography>
                                Upload document snaps
                            </Typography>
                        </Box>

                        <NationalityVerification formik={formik} />

                        {formik.errors.cnicFront &&
                            <Typography
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5
                                }}
                                variant='body2'
                                color={"error"}>
                                <Error fontSize="small" /> {formik.errors.cnicFront}
                            </Typography>
                        }
                        {formik.errors.cnicBack &&
                            <Typography
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5
                                }}
                                variant='body2'
                                color={"error"}>
                                <Error fontSize="small" /> {formik.errors.cnicBack}
                            </Typography>
                        }
                    </Grid>
                    <Grid
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        gap={1}
                    >
                        <Box
                            display={"flex"}
                            gap={0.5}
                            flexDirection={"column"}
                        >
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!(formik.dirty && formik.isValid)}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}

export default withAuth(CompleteProfile);