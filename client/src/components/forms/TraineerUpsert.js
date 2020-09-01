import React from 'react'

import Form from 'react-bootstrap/Form'

import { UserBasicFields, TrainerUniqueFields, TraineeUniqueFields } from './reusableFields'
import MultiSelector from '../MultiSelector'

import { handleSubmit } from '../../helpers'

class TraineerUpsert extends React.Component {
    state = this.props.editRowData || initialState(this.props.thingToManage)
    // may be null if the user hasn't selected any row to edit or hit the create btn

    onInputChange = (e) => {
        if (!e) return
        if (e instanceof Date) return this.setState({ dob: e }) // the DatePicker passes Date obj to 'e' parameter
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    updateList = (newList) => this.setState({ [getListToUpdate(this.props.thingToManage)]: newList })

    render() {
        const { submitBtn, btnToShow, thingToManage } = this.props

        const uniqueFields = {
            trainer: TrainerUniqueFields,
            trainee: TraineeUniqueFields
        }
        const UniqueFields = uniqueFields[thingToManage]

        const chosenItems = {
            trainer: this.state.assigned_sessions,
            trainee: this.state.assigned_programs
        }

        const itemsBelongTo = {
            trainer: 'sessionList',
            trainee: 'programList'
        }

        const assignLabel = {
            trainer: 'session(s)',
            trainee: 'program(s)'
        }

        return (
            <Form noValidate validated={this.state.validated} onSubmit={(e) => handleSubmit(e, this)}>
                <UserBasicFields btnToShow={btnToShow} parentState={this.state} onInputChange={this.onInputChange} />
                <UniqueFields parentState={this.state} onInputChange={this.onInputChange} />
                <Form.Group>
                    <Form.Label>Assign training {assignLabel[thingToManage]}</Form.Label>
                    <MultiSelector updateListOfParent={this.updateList} chosenItems={chosenItems[thingToManage]}
                        itemsBelongTo={itemsBelongTo[thingToManage]} />
                </Form.Group>
                {submitBtn}
            </Form>
        )
    }
}

function getListToUpdate(thingToManage) {
    const listToUpdate = {
        trainer: 'assigned_sessions',
        trainee: 'assigned_programs'
    }
    return listToUpdate[thingToManage]
}

function initialState(thingToManage) {
    const initialData = {
        trainer: { name: "", email: "", phone: "", dob: null, type: "", working_place: "", assigned_sessions: [] },
        trainee: { name: "", email: "", phone: "", dob: null, education: "", department: "", assigned_programs: [] }
    }
    return initialData[thingToManage]
}
export default TraineerUpsert
