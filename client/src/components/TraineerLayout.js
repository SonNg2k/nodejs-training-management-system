import React, { useState } from 'react'

import { UpsertModal } from './myReusable'
import TopMenu from './TopMenu'

import { ViewTable } from './myReusable'
import TraineerProfile from './forms/TraineerProfile'

function TraineerLayout({ pageFor }) {
    const [show, setShow] = useState(false)

    const showModal = () => setShow(true)
    const closeModal = () => setShow(false)

    // All info about a particular trainer/trainee is centralized here and distributed to children components
    const seedData = { // data from server
        trainer: {
            name: "Steve Jobs", email: "sadas@sad.com", phone: "129308", dob: new Date(), type: "internal",
            working_place: "FPT Ninh Kieu Dist",
            assigned_sessions: [
                { name: "State in React Components", desc: 'none' },
                { name: 'React Hooks', desc: 'none' }
            ]
        },
        trainee: {
            name: "Steve Balmer", email: "asdiue@sad.com", phone: "3457765", dob: new Date(),
            education: "Doctoral or Professional Degree", department: "IT",
            assigned_programs: [
                { name: "React + Redux", desc: 'none' },
                { name: 'Nodejs web dev', desc: 'none' }
            ]
        }
    }

    const profileData = {
        trainer: (({ name, email, phone, dob, type, working_place }) =>
            ({ name, email, phone, dob, type, working_place }))(seedData[pageFor]),
        trainee: (({ name, email, phone, dob, education, department }) =>
            ({ name, email, phone, dob, education, department }))(seedData[pageFor])
    }
    const profile = profileData[pageFor]

    const listData = {
        trainer: seedData.trainer.assigned_sessions,
        trainee: seedData.trainee.assigned_programs
    }
    const tableData = listData[pageFor]

    return (
        <>
            <TopMenu role="traine_" showModal={showModal} />
            <UpsertModal show={show} closeModal={closeModal} title={`Here is your ${pageFor} profile`}>
                <TraineerProfile closeModal={closeModal} profile={profile} pageFor={pageFor}/>
            </UpsertModal>
            <ViewTable tableData={tableData} pageFor={pageFor}/>
        </>
    )
}

export default TraineerLayout
