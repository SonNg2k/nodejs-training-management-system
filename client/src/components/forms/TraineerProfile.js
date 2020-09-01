import React from 'react'

import Form from 'react-bootstrap/Form'
import { EditBtn } from '../myReusable'

import { UserBasicFields, TrainerUniqueFields, TraineeUniqueFields } from './reusableFields'
import { handleSubmit } from '../../helpers'

class TraineerProfile extends React.Component {
    state = this.props.profile // there is always a detailed profile passed from parent

    onInputChange = (e) => {
        if (!e) return
        if (e instanceof Date) return this.setState({ dob: e }) // the DatePicker passes the Date obj to 'e' parameter
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    render() {
        const { pageFor } = this.props
        const uniqueFields = {
            trainer: TrainerUniqueFields,
            trainee: TraineeUniqueFields
        }
        const UniqueFields = uniqueFields[pageFor]

        return (
            <Form noValidate validated={this.state.validated} onSubmit={(e) => handleSubmit(e, this)}>
                <UserBasicFields parentState={this.state} onInputChange={this.onInputChange} btnToShow='editBtn' />
                <UniqueFields parentState={this.state} onInputChange={this.onInputChange} />
                <EditBtn text={`Update your ${pageFor}  profile`} className="center" />
            </Form>
        )
    }
}
export default TraineerProfile
