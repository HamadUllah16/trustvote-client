'use client'
import { Divider, IconButton, Stack, Table, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Add } from '@mui/icons-material';
import AddPoliticalParty from '@/app/components/AdminComponents/AddPoliticalParty';
import RenderPoliticalParties from '@/app/components/AdminComponents/RenderPoliticalParties';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import UserSidebar from '@/app/components/UserComponents/UserSidebar';
import MainWrapper from '@/app/components/MainWrapper';
import RenderTableHead from '@/app/components/RenderTableHead';
import RenderTableData from '@/app/components/RenderTableData';
import { allPoliticalParties } from '@/app/redux/features/profileCompletionSlice';
import PageHeader from '@/app/components/PageHeader';
import withAuth from '@/app/utils/withAuth';

function AllPoliticalPartiesPage() {
    const [showAddPartyModal, setShowAddPartyModel] = useState(false);
    const { allParties, loading } = useSelector((state: RootState) => state.profileCompletion);
    const { userProfile } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(allPoliticalParties())
    }, [])
    return (
        <MainWrapper>

            <UserSidebar />

            <PageHeader
                title='Political Parties'
                subtitle={null}
                action={null}
            >
                <RenderTableHead
                    labels={['#', 'Name', 'Abbreviation', 'Symbol']}
                >
                    <RenderPoliticalParties />

                </RenderTableHead>

            </PageHeader>

        </MainWrapper>
    )
}

export default withAuth(AllPoliticalPartiesPage);