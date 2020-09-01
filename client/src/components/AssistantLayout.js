import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import {Homepage} from './myReusable'
import TopMenu from './TopMenu'
import CrudSection from './CrudSection'

class AssistantLayout extends React.Component {
    render() {
        return (
            <>
                <Router>
                    <TopMenu role="assistant" />
                    <Switch>
                        <Route path='/homepage' component={Homepage} />
                        <Route key="manage-trainers" path={'/trainer-management'} component={CrudSection} />
                        <Route key="manage-trainees" path={'/trainee-management'} component={CrudSection} />
                        <Route key="manage-categories" path={'/category-management'} component={CrudSection} />
                        <Route key="manage-programs" path={'/program-management'} component={CrudSection} />
                    </Switch>
                </Router>
            </>
        )
    }
}

export default AssistantLayout
