import React from 'react'

import RudTable from './RudTable'
import DeleteConfirm from './DeleteConfirm'

import { AddBtn, EditBtn, UpsertModal, CategoryUpsert, AlertBoard } from './myReusable'

// Import forms to display within the UpsertModal
import AssistantUpsert from './forms/AssistantUpsert'
import TraineerUpsert from './forms/TraineerUpsert'
import ProgramUpsert from './forms/ProgramUpsert'

import { findThingToManage, fetchData, addDataToTable, editRowInTable, deleteRowInTable } from '../helpers'

class CrudSection extends React.Component {
    state = {
        show: false,
        alertShow: false,
        btnToShow: "",
        editRowPos: null,
        confirmShow: false,
        deleteRowPos: null,
        tableData: []
    }

    componentDidMount() {
        fetchData(this.props.match.path)
            .then(({ data: tableData }) => this.setState({ tableData: tableData }))
    }

    closeAlert = () => this.setState({ alertShow: false })

    closeModal = () => this.setState({ show: false })

    showAddModal = () => this.setState({ show: true, btnToShow: "addBtn", editRowPos: null })
    showEditModal = () => this.setState({ show: true, btnToShow: "editBtn" })

    showDelConfirm = () => this.setState({ confirmShow: true })
    closeDelConfirm = () => this.setState({ confirmShow: false })

    changeEditRowPos = (rowID) => this.setState({ editRowPos: rowID })
    changeDeleteRowPos = (rowID) => this.setState({ deleteRowPos: rowID })

    render() {
        // Extract data from state
        const { show, alertShow, btnToShow, editRowPos, confirmShow, tableData } = this.state

        // Declare static variables...
        const thingToManage = findThingToManage(this.props.match.path)

        // Dynamic title for the modal
        const modalTitle = {
            addBtn: `Fill in the form below to add new ${thingToManage}`,
            editBtn: `Change the field(s) below to update the ${thingToManage}`
        }

        // Dynamic form inside the modal
        const innerForm = {
            assistant: AssistantUpsert,
            trainer: TraineerUpsert,
            trainee: TraineerUpsert,
            program: ProgramUpsert,
            category: CategoryUpsert
        }
        const InnerForm = innerForm[thingToManage]

        // Dynamic button ('addBtn' or 'editBtn') for the form
        const btnType = {
            addBtn: <AddBtn text={`Add new ${thingToManage}`} className="center" />,
            editBtn: <EditBtn text={`Update the ${thingToManage} info`} className="center" />
        }
        const submitBtn = btnType[btnToShow]

        const modalSize = (thingToManage === 'program') ? 'xl' : ''

        // Pass data of the table row that the user want to edit to the inner form
        const editRowData = (editRowPos === null) ? null : tableData[editRowPos]

        return (
            <div className="container-fluid">
                <AlertBoard closeAlert={this.closeAlert} alertShow={alertShow} msg='Operation completed successfully, yay ✅'
                    bkgColor='success' />

                <AddBtn text={`Add new ${thingToManage}`} className="my-4 right-aligned" onClick={this.showAddModal} />

                <RudTable thingToManage={thingToManage} tableData={tableData} showEditModal={this.showEditModal}
                    changeEditRowPos={this.changeEditRowPos} changeDeleteRowPos={this.changeDeleteRowPos}
                    showDelConfirm={this.showDelConfirm} />

                <UpsertModal size={modalSize} show={show} title={modalTitle[btnToShow]} closeModal={this.closeModal}>
                    <InnerForm submitBtn={submitBtn} btnToShow={btnToShow} editRowData={editRowData} thingToManage={thingToManage}
                        closeModal={this.closeModal}
                        addDataToTable={(rowData) => addDataToTable(rowData, this)}
                        editRowInTable={(rowData) => editRowInTable(rowData, this)} />
                </UpsertModal>

                <DeleteConfirm confirmShow={confirmShow} closeDelConfirm={this.closeDelConfirm}
                    deleteRowInTable={() => deleteRowInTable(this)} />
            </div>
        )
    }
}

export default CrudSection
