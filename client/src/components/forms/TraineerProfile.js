import React from 'react'
import axios from 'axios'

import Form from 'react-bootstrap/Form'
import { EditBtn } from '../myReusable'

import { UserBasicFields, TrainerUniqueFields, TraineeUniqueFields } from './reusableFields'

class TraineerProfile extends React.Component {
    state = this.props.profile // there is always a profile passed from parent

    onInputChange = (e) => {
        if (!e) return
        if (e instanceof Date) return this.setState({ dob: e }) // the DatePicker passes the Date obj to 'e' parameter
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onFormSubmit = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();
        this.setState({ validated: true })

        const { showAlert, closeModal, role } = this.props
        if (form.checkValidity())
            axios.put(`/${role}s`, this.state)
                .then(() => {
                    closeModal()
                    showAlert()
                })
    }

    render() {
        const { role } = this.props
        const uniqueFields = {
            trainer: TrainerUniqueFields,
            trainee: TraineeUniqueFields
        }
        const UniqueFields = uniqueFields[role]

        return (
            <Form noValidate validated={this.state.validated} onSubmit={this.onFormSubmit}>
                <UserBasicFields parentState={this.state} onInputChange={this.onInputChange} btnToShow='editBtn' />
                <UniqueFields parentState={this.state} onInputChange={this.onInputChange} />
                <EditBtn text={`Update your ${role}  profile`} className="center" />
            </Form>
        )
    }
}
export default TraineerProfile
