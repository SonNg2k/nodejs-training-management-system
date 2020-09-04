import React from 'react'
import { TooltipText } from './components/myReusable'
import axios from 'axios'

export function rowCssStyle(markedAs) {
    if (markedAs === 'just added') return 'added-row-background'
    if (markedAs === 'just edited') return 'edited-row-background'
    if (!markedAs) return ''
}

export function handleSubmit(e, formContext) { // handle submit event triggered by any form
    const form = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();

    formContext.setState({ validated: true })
    const { btnToShow, addDataToTable, editRowInTable } = formContext.props
    if (form.checkValidity()) {
        if (btnToShow === 'addBtn') addDataToTable(formContext.state)
        if (btnToShow === 'editBtn') editRowInTable(formContext.state)
    }
}

export function friendlyData(rawData, notation) { // used to make friendly column names and table cell data
    if (!rawData) return ''
    if (Array.isArray(rawData) && rawData.length === 0) return ''

    // Make schema-based columns names easier to read...
    if (rawData === 'dob') return "day of birth"
    if (rawData === 'working_place') return "working place"
    if (rawData === 'assigned_sessions') return "assigned training sessions"
    if (rawData === 'assigned_programs') return "assigned training programs"
    if (rawData === 'sessions') return 'sessions for the program'

    if (notation === 'dob') return rawData = new Date(rawData).toDateString().slice(4)
    if (notation === 'category') return rawData.name
    // Create tooltip if raw data is an array of objects
    // rawData must be a list of sessions/programs (each one represented as an object)
    if (['assigned_sessions', 'assigned_programs', 'sessions'].includes(notation)) {
        let list = ''
        rawData.map((item, index) => {
            list += `⟶ ${index + 1}) ${item.name}`
            list += ' \n'
        })
        return <TooltipText hiddenText={list} />
    }
    return rawData
}

export function findThingToManage(urlPath) {
    // urlPath looks like this: /assistant-management, /trainer-management, etc.
    return urlPath.split("-")[0].split("/")[1]
}

const urlToExchangeData = {
    assistant: '/assistants',
    trainer: '/trainers',
    trainee: '/trainees',
    category: '/categories',
    program: '/programs'
}

export function addDataToTable(rowData, crudContext) {
    const thingToManage = findThingToManage(crudContext.props.match.path)
    const { tableData } = crudContext.state

    axios.post(urlToExchangeData[thingToManage], rowData)
        .then(({ data: { _id } }) => {
            let cloneData = tableData
            rowData.markedAs = "just added"
            rowData._id = _id
            cloneData.unshift(rowData)
            crudContext.setState({ tableData: cloneData, show: false, alertShow: true })
        })
}

export function editRowInTable(newRowData, crudContext) {
    const thingToManage = findThingToManage(crudContext.props.match.path)
    const { tableData, editRowPos } = crudContext.state
    const _id = tableData[editRowPos]._id

    axios.put(urlToExchangeData[thingToManage] + `/${_id}`, newRowData)
        .then(() => {
            let cloneData = tableData
            newRowData.markedAs = "just edited"
            cloneData[editRowPos] = newRowData
            crudContext.setState({ tableData: cloneData, show: false, alertShow: true })
        })
}

export function deleteRowInTable(crudContext) {
    let cloneData = crudContext.state.tableData
    cloneData.splice(crudContext.state.deleteRowPos, 1)
    crudContext.setState({ tableData: cloneData, confirmShow: false, alertShow: true })
}

export async function fetchData(currentPath) {
    // current path can be one of the following: /assistant-management, /trainer-management, etc.
    const thingToManage = findThingToManage(currentPath)

    return await axios.get(urlToExchangeData[thingToManage])
}

export async function fetchListOf(list) {
    const urlToFetchList = {
        sessionList: '/sessions',
        programList: '/programs'
    }
    return await axios.get(urlToFetchList[list])
}

export async function fetchCategories() { // return a list of category HTML options
    return await axios.get('/categories')
}
