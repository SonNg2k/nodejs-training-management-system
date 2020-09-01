import React from 'react'

import DatePicker from 'react-datepicker'
import Form from 'react-bootstrap/Form'

import "react-datepicker/dist/react-datepicker.css";

export function UserBasicFields({ parentState, onInputChange, btnToShow }) {

    const { name, email, phone, dob } = parentState // extract only the info needed from the parent state
    let passHelperText = ""
    if (btnToShow === "editBtn") passHelperText = (
        <Form.Text className="text-muted">
            <span role="img" aria-label="alert emoji">🚨</span>
            Only enter here if you want to set a new password for the account. <br />
            Leave the field empty if you still want to use the current password
        </Form.Text>
    )

    return (
        <>
            <Form.Group controlId="formBasicname">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={name} required maxLength='70' type="text" placeholder="Enter name"
                    onChange={onInputChange} />
                <Form.Control.Feedback type="invalid"> Please enter your name! </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicemail">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" value={email} required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    type="email" placeholder="Enter email" onChange={onInputChange} />
                <Form.Control.Feedback type="invalid"> Please correct your email!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Set new password</Form.Label>
                <Form.Control name="password" type="password" required={(btnToShow === 'addBtn')} placeholder="Set new password..."
                    onChange={onInputChange} />
                <Form.Control.Feedback type="invalid"> Please enter your password</Form.Control.Feedback>
                {passHelperText}
            </Form.Group>
            <Form.Group controlId="formBasicphone">
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" value={phone} required pattern="\d*" type="text" maxLength='15' placeholder="Enter phone"
                    onChange={onInputChange} />
                <Form.Control.Feedback type="invalid"> Please correct your phone! </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label className="d-block" >Date of birth (DD/MM/YYYY)</Form.Label>
                <DatePicker className="form-control" dateFormat="dd/MM/yyyy" selected={dob}
                    minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 70))}
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                    onChange={onInputChange} required />
                <Form.Control.Feedback type="invalid"> Please pick a date </Form.Control.Feedback>
                <Form.Text className="text-muted">
                    <span role="img" aria-label="alert emoji">🚨</span>
                        You can type in your birth date in the requested format and the date picker will search that date for you
                </Form.Text>
            </Form.Group>
        </>
    )
}

// Fields that only the trainer has
export function TrainerUniqueFields({ parentState, onInputChange }) {
    const { type, working_place } = parentState
    return (
        <>
            <Form.Group>
                <Form.Label className="d-block">Working type </Form.Label>
                <Form.Check required name="type" value='external' inline label="External" type="radio" id={`inline-radio-1`}
                    checked={(type === 'external')} onChange={onInputChange} />
                <Form.Check required name="type" value='internal' inline label="Internal" type="radio" id={`inline-radio-2`}
                    checked={(type === 'internal')} onChange={onInputChange} />
                <Form.Control.Feedback type="invalid"> Please select your working type </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="workingPlace">
                <Form.Label>Your working Place</Form.Label>
                <Form.Control required name="working_place" value={working_place} as="select" onChange={onInputChange}>
                    <option value="">Please select a working place...</option>
                    <option>FPT Dist 1</option>
                    <option>FPT Dist 2</option>
                    <option>FPT Dist 7</option>
                    <option>FPT Ninh Kieu Dist</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid"> Please select your place of work </Form.Control.Feedback>
            </Form.Group>
        </>
    )
}

// Fields that only the trainee has
export function TraineeUniqueFields({ parentState, onInputChange }) {
    const { education, department } = parentState
    return (
        <>
            <Form.Group controlId="education">
                <Form.Label>Your education</Form.Label>
                <Form.Control name="education" as="select" value={education} onChange={onInputChange} required>
                    <option value="">Please select your education...</option>
                    <option>Less Than High School</option>
                    <option>High School Diploma or Equivalent</option>
                    <option>Some College, No Degree</option>
                    <option>Associate’s Degree</option>
                    <option>Bachelor’s Degree</option>
                    <option>Postsecondary Non-Degree Award</option>
                    <option>Master’s Degree</option>
                    <option>Doctoral or Professional Degree</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid"> Please declare your education level! </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="workingPlace">
                <Form.Label>Your department</Form.Label>
                <Form.Control name="department" as="select" value={department} onChange={onInputChange} required>
                    <option value="">Please select a department...</option>
                    <option>IT</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                    <option>Operations management</option>
                    <option>Human Resource</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid"> Please choose your current department! </Form.Control.Feedback>
            </Form.Group>
        </>
    )
}
