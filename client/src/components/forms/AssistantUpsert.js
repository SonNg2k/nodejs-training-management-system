import React from 'react'
import Form from 'react-bootstrap/Form'

import { UserBasicFields } from './reusableFields'

import { handleSubmit } from '../../helpers'

class AssistantUpsert extends React.Component {
    state = this.props.editRowData || initialState()
    // may be null if the user hasn't selected any row to edit or hit the create btn

    onInputChange = (e) => {
        if (!e) return
        if (e instanceof Date) return this.setState({ dob: e }) // the DatePicker passes Date obj to 'e' parameter
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    render() {
        const { submitBtn, btnToShow } = this.props

        return (
            <Form noValidate validated={this.state.validated} onSubmit={(e) => handleSubmit(e, this)}>
                <UserBasicFields btnToShow={btnToShow} parentState={this.state} onInputChange={this.onInputChange} />
                {submitBtn}
            </Form>
        )
    }
}

function initialState() {
    const initial = { name: "", email: "", phone: "", dob: null }
    return initial
}

export default AssistantUpsert
