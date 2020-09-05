import React from 'react'
import Form from 'react-bootstrap/Form'

import InpGroupList from '../InpGroupList'

import { handleSubmit, fetchCategories } from '../../helpers'

class ProgramUpsert extends React.Component {
    state = this.props.editRowData || initialState()
    // may be null if the user hasn't selected any row to edit or hit the create btn

    componentDidMount() {
        fetchCategories()
            .then(({ data: categories }) => {
                let categoryOptions = categories.map((category) =>
                    <option key={category._id} value={category._id} data-value={JSON.stringify(category)}>{category.name}
                    </option>)
                this.setState({ categoryOptions: categoryOptions })
            })
    }

    onInputChange = (e) => {
        if (!e) return
        const { name, value } = e.target
        // Because the category is an object, we set its value differently
        if (name === 'category') return this.setState({ category: JSON.parse(e.target.selectedOptions[0].dataset.value) })
        this.setState({ [name]: value })
    }

    updateSessions = (newSessions) => this.setState({ sessions: newSessions })

    render() {
        const { submitBtn } = this.props
        const { validated, name, desc, category, sessions, categoryOptions } = this.state

        return (
            <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, this)}>
                <Form.Group controlId="formBasicname">
                    <Form.Label>Program name</Form.Label>
                    <Form.Control type="text" name="name" value={name} required maxLength='70' placeholder="Enter the program name..."
                        onChange={this.onInputChange} />
                    <Form.Control.Feedback type="invalid"> Program must have a name! </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicDesc">
                    <Form.Label>Description for the program</Form.Label>
                    <Form.Control type="text" name="desc" value={desc} required maxLength='70' placeholder="Enter the description..."
                        onChange={this.onInputChange} />
                    <Form.Control.Feedback type="invalid"> Please give some description! </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formCategory">
                    <Form.Label>Which category does this program belong to?</Form.Label>
                    <Form.Control required name="category" value={category && category._id} as="select"
                        onChange={this.onInputChange}>
                        <option value="">Please select the category for the program...</option>
                        {categoryOptions}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid"> Please select a category </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Create session(s) for this program </Form.Label>
                    <InpGroupList updateParentList={this.updateSessions} parentList={sessions} />
                </Form.Group>
                {submitBtn}
            </Form>
        )
    }
}

function initialState() {
    const initial = { name: "", desc: "", category: {}, sessions: [] }
    return initial
}

export default ProgramUpsert
