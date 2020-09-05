import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import { Homepage, NotFoundPage } from './myReusable'
import TopMenu from './TopMenu'
import CrudSection from './CrudSection'

function ManagerLayout({ role, logout }) {
    const routeHandlerFor = {
        admin: [
            <Route key="manage-assistants" path={'/assistant-management'} component={CrudSection} />,
            <Route key="manage-trainers" path={'/trainer-management'} component={CrudSection} />
        ],
        assistant: [
            <Route key="manage-trainers" path={'/trainer-management'} component={CrudSection} />,
            <Route key="manage-trainees" path={'/trainee-management'} component={CrudSection} />,
            <Route key="manage-categories" path={'/category-management'} component={CrudSection} />,
            <Route key="manage-programs" path={'/program-management'} component={CrudSection} />,
        ]
    }
    return (
        <>
            <Router>
                <TopMenu role={role} logout={logout} />
                <Switch>
                    <Route path='/homepage' component={Homepage} />
                    {routeHandlerFor[role]}
                </Switch>
            </Router>
        </>
    )
}

export default ManagerLayout
