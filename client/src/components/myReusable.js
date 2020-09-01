
// This file used to export really small individual components. For big components, there is separate file for each of them, not here.
import React from 'react'

import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'

import { handleSubmit } from '../helpers'

// named export
export function NotFoundPage() {
    return 'Hello from 404 Page'
}

export function Homepage() {
    return ''
}

export function AlertBoard({ closeAlert, alertShow, msg, bkgColor}) {
    return (
        <Alert show={alertShow} onClose={closeAlert} variant={bkgColor} className='center' dismissible>
            <p> {msg} </p>
        </Alert>
    )
}

export class CategoryUpsert extends React.Component {
    state = this.props.editRowData || { name: '', desc: '' }
    // may be null if the user hasn't selected any row to edit or hit the create btn

    onInputChange = (e) => {
        if (!e) return
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    render() {
        const { submitBtn } = this.props
        const { validated, name, desc } = this.state

        return (
            <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, this)}>
                <Form.Group controlId="formBasicname">
                    <Form.Label>Category name</Form.Label>
                    <Form.Control type="text" name="name" value={name} required maxLength='70' placeholder="Enter the program name..."
                        onChange={this.onInputChange} />
                    <Form.Control.Feedback type="invalid"> Category must have a name! </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicDesc">
                    <Form.Label>Description for this category</Form.Label>
                    <Form.Control type="text" name="desc" value={desc} required maxLength='100' placeholder="Enter the description..."
                        onChange={this.onInputChange} />
                    <Form.Control.Feedback type="invalid"> Please give some description! </Form.Control.Feedback>
                </Form.Group>
                {submitBtn}
            </Form>
        )
    }
}

// The table below is used to render a list of sessions/programs. Each item in the list is an object with the 'name' and 'desc' keys
export function ViewTable({ tableData, pageFor }) {
    const obj = {
        trainer: 'session',
        trainee: 'program'
    }
    return (
        <div className="container mt-5">
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>The {obj[pageFor]} assigned to you</th>
                        <th>{obj[pageFor]} description</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((rowData, rowIndex) => {
                        return (
                            <tr key={rowIndex} >
                                <td>{rowIndex + 1}</td>
                                <td>{rowData.name}</td>
                                <td>{rowData.desc}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}

// You can ignore everything below
export function UpsertModal({ size, show, closeModal, title, children }) {
    return (
        <>
            <Modal size={size} show={show} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title> {title} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
            </Modal>
        </>
    )
}

export function EditBtn({ text, className, onClick }) {
    return <Button type='submit' variant="success" className={className} onClick={onClick} >{text} <i className="fas fa-edit"></i></Button>
}

export function AddBtn({ text, className, onClick }) {
    return <Button type='submit' variant="warning" className={className} onClick={onClick} > {text} <i className="fas fa-plus"></i></Button>
}

export function AddBtnLink({ text, className, onClick }) {
    return <Button variant="link" className={className} onClick={onClick} > {text} <i className="fas fa-plus"></i></Button>
}

export function DeleteBtn({ text, className, onClick }) {
    return <Button variant="danger" className={className} onClick={onClick}>{text} <i className="fas fa-trash-alt"></i></Button>
}

export function YesBtn({ text, className, onClick }) {
    return <Button variant="success" className={className} onClick={onClick}>{text} <i className="fas fa-check"></i></Button>
}

export function NoBtn({ text, className, onClick }) {
    return <Button variant="danger" className={className} onClick={onClick}>{text} <i className="fas fa-times"></i></Button>
}

export function TooltipText({ hiddenText }) {
    return (
        <OverlayTrigger key='bottom' placement='right' overlay=
            {<Tooltip id='tooltip-bottom' className='new-line'> {hiddenText}</Tooltip>}>
            <Button variant="link">Hover me to see more info!</Button>
        </OverlayTrigger>
    )
}
