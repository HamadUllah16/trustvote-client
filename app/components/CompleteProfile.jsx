'use client'
import { Box, Grid, TextField, Typography, Button, Divider, Stack, IconButton, MenuItem, Autocomplete } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import NationalityVerification from '@/app/components/NationalityVerification';
import { Add, Error, Upload } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../redux/features/userSlice';
import DateInputField from "./DateInputField";
import Loading from './Loading';
import { updateProfile } from '../redux/features/profileCompletionSlice';
import dayjs from 'dayjs';
import withAuth from '../utils/withAuth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import imageToBase64 from './Utils/imageToBase64';
import UserAddressConstituency from './UserAddressConstituency';
import checkChanged from './checkChanged';



function CompleteProfile() {
    const { userProfile, loading } = useSelector(state => state.user)
    const { isAuthenticated } = useSelector(state => state.auth)
    const [pfpPreview, setPfpPreview] = useState('');
    const router = useRouter();
    const ref = useRef();

    function handlePfpGrid(ref) {
        if (ref.current !== null) {
            ref.current.click();
        }
    }

    async function pfpHandler(event) {
        const file = event.target.files[0];
        const base64 = await imageToBase64(file)
        setPfpPreview(base64);
    }

    const dispatch = useDispatch();
    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(getUserProfile())
        }
    }, [dispatch])

    const formik = useFormik({
        initialValues: {
            firstName: userProfile.firstName ?? '',
            lastName: userProfile.lastName ?? '',
            email: userProfile?.email ?? '',
            phone: userProfile.phone ?? '',
            cnic: userProfile.cnic ?? '',
            date: userProfile.dateOfBirth ?? '',
            cnicFront: userProfile.cnicFront ?? '',
            cnicBack: userProfile.cnicBack ?? '',
            province: userProfile.province ?? '',
            constituency: userProfile.constituency ?? '',
            provincialConstituency: userProfile.provincialConstituency ?? ''
        },
        enableReinitialize: true,
        onSubmit: values => {
            console.log(values)
            const { date, ...otherValues } = values;
            const changed = checkChanged(formik, values)
            console.log(changed)
            const token = localStorage.getItem('x_auth_token')
            toast.promise(
                dispatch(updateProfile({
                    router,
                    profile: {
                        ...changed
                        // dateOfBirth: dayjs(date).format('YYYY-MM-DD')
                    },
                    token
                })).unwrap(), {
                loading: 'Updating profile',
                success: 'Profile updated',
                error: err => err?.message
            }
            )

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
            if (!values.province) {
                errors.province = 'Please select a province'
            }
            if (!values.constituency) {
                errors.constituency = 'Please select a constituency'
            }
            if (!values.provincialConstituency) {
                errors.provincialConstituency = 'Please select a provincial constituency'
            }
            if (!values.date) {
                errors.date = 'Date of Birth cannot be empty';
            } else {
                const today = new Date();
                const dob = new Date(values.date);
                const age = today.getFullYear() - dob.getFullYear();
                const monthDifference = today.getMonth() - dob.getMonth();
                const dayDifference = today.getDate() - dob.getDate();

                if (
                    age < 18 ||
                    (age === 18 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))
                ) {
                    errors.date = 'You must be at least 18 years old';
                }
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
                <Stack
                    justifyContent={"space-between"}
                    gap={3}
                    p={3}
                    minWidth={300}
                    bgcolor={'secondary.main'}
                    borderRadius={2}
                    border={'1px solid'}
                    borderColor={'secondary.200'}
                >

                    <Grid
                        display={'flex'}
                        flexDirection={'column'}
                        gap={2}
                    >
                        <Grid
                            display={'flex'}
                            gap={2}
                            flexDirection={'column'}
                        >
                            <Typography
                                variant='h4'
                                color={'primary.main'}
                                fontWeight={'bold'}
                            >
                                Complete your profile
                            </Typography>
                        </Grid>
                    </Grid>


                    <Stack direction={'row'}>
                        <Stack
                            border={'1px solid'}
                            bgcolor={'background.default'}
                            borderColor={'secondary.200'}
                            borderRadius={5}
                            height={100}
                            width={100}
                            justifyContent={'center'}
                            onClick={() => handlePfpGrid(ref)}

                        >
                            {pfpPreview === '' ?
                                <IconButton sx={{ width: '100%', height: '100%' }}>
                                    <Add sx={{ color: 'primary.main' }} />
                                </IconButton>
                                :

                                <Image
                                    width={100}
                                    height={100}
                                    src={pfpPreview}
                                    alt='a profile picture'
                                />

                            }
                        </Stack>
                        <input ref={ref} type='file' onClick={(event) => pfpHandler(event)} name='profile-pic' style={{ display: 'none' }} />
                    </Stack>

                    <Box
                        display={'flex'}
                        gap={2}
                        justifyContent={'space-between'}
                    >
                        <TextField
                            variant='filled'
                            fullWidth
                            label={'First Name'}
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            name='firstName'
                            error={formik.touched && formik.errors.firstName}
                            helperText={formik.touched && formik.errors.firstName}

                        />

                        <TextField
                            variant='filled'
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
                            variant='filled'
                            label={'Email'}
                            disabled
                            fullWidth
                            name='email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />

                        <TextField
                            variant='filled'
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
                            variant='filled'
                            fullWidth
                            name='cnic'
                            label={'CNIC Number'}
                            value={formik.values.cnic}
                            onChange={formik.handleChange}
                            error={formik.touched && formik.errors.cnic}
                            helperText={formik.touched && formik.errors.cnic}
                        />

                        <TextField
                            variant='filled'
                            fullWidth
                            label='Date of Birth'
                            type="date"
                            name="date"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            error={formik.touched.date && Boolean(formik.errors.date)}
                            onBlur={formik.handleBlur}
                            helperText={formik.touched.date && formik.errors.date}
                        />

                    </Grid>

                    <Divider sx={{ borderColor: 'secondary.200' }} />

                    <UserAddressConstituency formik={formik} />

                    <Divider sx={{ borderColor: 'secondary.200' }} />
                    <Grid
                        display={"flex"}
                        flexDirection={"column"}
                    >
                        <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={'center'}
                            gap={0.5}
                            width={"100%"}
                        >
                            <Typography variant='subtitle1' color={'primary.main'}>
                                Upload document snaps
                            </Typography>
                        </Box>
                    </Grid>

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
                </Stack>
            </form>
        </>
    )
}

export default withAuth(CompleteProfile);
