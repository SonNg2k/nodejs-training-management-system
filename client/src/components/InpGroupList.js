import React from 'react'

import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

import { AddBtnLink, DeleteBtn } from './myReusable'

function InpGroupList({ updateParentList, parentList }) {

    const addItem = (item) => {
        parentList.push(item)
        updateParentList(parentList)
    }

    const editItem = (index, key, value) => {
        parentList[index][key] = value
        updateParentList(parentList)
    }

    const deleteItem = (index) => {
        parentList.splice(index, 1)
        updateParentList(parentList)
    }
    return (
        <>
            <AddBtnLink text="Click here to create session" className="ml-1 mb-2 text-secondary"
                onClick={() => addItem({ name: '', desc: '' })} />
            {parentList.map((listItem, index) => (
                <InputGroup key={index} className="mb-3">
                    <FormControl type="text" name='name' value={listItem.name} placeholder="Session name..." required
                        onChange={({ target }) => editItem(index, target.name, target.value)} />
                    <FormControl type="text" name='desc' value={listItem.desc} placeholder="short description..." required
                        onChange={({ target }) => editItem(index, target.name, target.value)} />
                    <InputGroup.Append>
                        <DeleteBtn onClick={() => deleteItem(index)} />
                    </InputGroup.Append>
                </InputGroup>
            ))}
        </>
    )
}

export default InpGroupList
