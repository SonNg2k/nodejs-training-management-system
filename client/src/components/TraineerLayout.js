import React, { useState, useEffect } from 'react'
import axios from 'axios'

import TopMenu from './TopMenu'
import { ViewTable, UpsertModal, AlertBoard } from './myReusable'
import TraineerProfile from './forms/TraineerProfile'

function TraineerLayout({ role, logout }) {
    const [alertShow, displayAlert] = useState(false)
    const [show, setShow] = useState(false)
    const [profile, setProfile] = useState(initialProfile(role))
    const [tableData, setTableData] = useState([])

    const showModal = () => setShow(true)
    const closeModal = () => setShow(false)
    const showAlert = () => displayAlert(true)
    const closeAlert = () => displayAlert(false)

    // All info about a particular trainer/trainee is centralized here and distributed to children components
    useEffect(() => { // fetch initial data for trainer/trainee
        axios.get(`/${role}s`)
            .then(({ data }) => {
                const profileData = {
                    trainer: (({ name, email, phone, dob, type, working_place }) =>
                        ({ name, email, phone, dob, type, working_place }))(data),
                    trainee: (({ name, email, phone, dob, education, department }) =>
                        ({ name, email, phone, dob, education, department }))(data)
                }
                const tableData = {
                    trainer: data.assigned_sessions,
                    trainee: data.assigned_programs
                }
                setTableData(tableData[role])
                setProfile(profileData[role])
            })
    }, [alertShow])

    return (
        <>
            <TopMenu role="traine_" showModal={showModal} logout={logout} />
            <UpsertModal show={show} closeModal={closeModal} title={`Here is your ${role} profile`}>
                <TraineerProfile closeModal={closeModal} profile={profile} role={role} showAlert={showAlert} />
            </UpsertModal>
            <ViewTable tableData={tableData} role={role} />
            <AlertBoard closeAlert={closeAlert} alertShow={alertShow} msg='Profile is updated successfully, yay ✅'
                bkgColor='success' />
        </>
    )
}

export default TraineerLayout

function initialProfile(role) {
    const obj = {
        trainer: { name: "", email: "", phone: "", dob: null, type: "", working_place: "" },
        trainee: { name: "", email: "", phone: "", dob: null, education: "", department: "" }
    }
    return obj[role]
}
