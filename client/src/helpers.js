import React from 'react'
import { TooltipText } from './components/myReusable'

export function rowCssStyle(markedAs) {
    if (markedAs === 'just added') return 'added-row-background'
    if (markedAs === 'just edited') return 'edited-row-background'
    if (!markedAs) return ''
}

export function handleSubmit (e, formContext) { // handle submit event triggered by any form
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
    // Translate Date object to friendly date string...
    if (rawData instanceof Date) return rawData.toDateString().slice(4)

    // Make schema-based columns names easier to read...
    if (rawData === 'dob') return "day of birth"
    if (rawData === 'working_place') return "working place"
    if (rawData === 'assigned_sessions') return "assigned training sessions"
    if (rawData === 'assigned_programs') return "assigned training programs"
    if (rawData === 'sessions') return 'sessions for the program'

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

export function objIsEmpty(obj) { // {a: null, b: '', c: []}
    if (!obj) return true
    return !Object.values(obj).some(x => {
        if (Array.isArray(x)) {
            if (x.length > 0) return true
            if (x.length === 0) return false
        }

        if (x !== null && x !== '') return true
        if (x === null || x === '') return false
    })
}

export function findThingToManage(urlPath) {
    // urlPath looks like this: /assistant-management, /trainer-management, etc.
    return urlPath.split("-")[0].split("/")[1]
}
