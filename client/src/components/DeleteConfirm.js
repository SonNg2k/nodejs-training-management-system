import React from 'react'
import Modal from 'react-bootstrap/Modal'
import { YesBtn, NoBtn } from './myReusable'

function DeleteConfirm({ confirmShow, closeDelConfirm, deleteRowInTable }) {

    return (
        <>
            <Modal show={confirmShow} onHide={closeDelConfirm}>
                <Modal.Header closeButton>
                    <Modal.Title> Are you sure you want to delete this item? </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="center-children">
                        <YesBtn text="Yup, of course" className="mr-2" onClick={deleteRowInTable} />
                        <NoBtn text="Nope, I changed my mind" onClick={closeDelConfirm}/>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
export default DeleteConfirm
