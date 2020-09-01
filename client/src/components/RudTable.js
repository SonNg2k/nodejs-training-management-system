import React from 'react'

import Table from 'react-bootstrap/Table'
import { EditBtn, DeleteBtn } from './myReusable'

import { friendlyData, rowCssStyle } from '../helpers'

function RudTable({ thingToManage, tableData, changeEditRowPos, showEditModal, changeDeleteRowPos, showDelConfirm }) {
    const keyListFor = { // The final purpose of keyListFor is to provide a list of column names even though there is no row
        assistant: ['name', 'email', 'phone', 'dob'],
        trainer: ['name', 'email', 'phone', 'dob', 'type', 'working_place', 'assigned_sessions'],
        trainee: ['name', 'email', 'phone', 'dob', 'education', 'department', 'assigned_programs'],
        category: ['name', 'desc'],
        program: ['name', 'desc', 'category', 'sessions']
    }
    const schemaKeys = keyListFor[thingToManage]

    const onEditBtnClick = (rowIndex) => { // The index of the row that holds the clicked edit button
        changeEditRowPos(rowIndex)
        showEditModal()
    }

    const onDeleteBtnClick = (rowIndex) => { // The index of the row that holds the clicked edit button
        changeDeleteRowPos(rowIndex)
        showDelConfirm()
    }

    const createCols = () => {
        return schemaKeys.map((schemaKey, index) =>
            <th key={schemaKey}>{`${(index === 0) ? thingToManage : ''} ${friendlyData(schemaKey)}`}</th>
        )
    }

    const createRows = () => {
        return tableData.map((rowData, rowIndex) =>
            <tr key={rowIndex} className={rowCssStyle(rowData.markedAs)} >
                <td>{rowIndex + 1}</td>
                {schemaKeys.map((schemaKey, colIndex) =>
                    <td key={`${rowIndex}-${colIndex}`}>{friendlyData(rowData[schemaKey], schemaKey)}</td>
                )}
                <td>
                    <EditBtn text="Edit" onClick={() => onEditBtnClick(rowIndex)} /> {' '}
                    <DeleteBtn text="Delete" onClick={() => onDeleteBtnClick(rowIndex)} />
                </td>
            </tr>
        )
    }

    let createdRows = createRows()
    createdRows = createdRows.isEmpty() ? "" : createdRows // If there is no row, assign it to nothing

    return (
        <Table bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    {createCols()}
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {/* There is no row if the tableData is empty [] */}
                {createdRows}
            </tbody>
        </Table>
    )
}

export default RudTable
