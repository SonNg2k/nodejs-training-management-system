import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import {Homepage} from './myReusable'
import TopMenu from './TopMenu'
import CrudSection from './CrudSection'

class AdminLayout extends React.Component {
    render() {
        return (
            <>
                <Router>
                    <TopMenu role="admin" />
                    <Switch>
                        <Route path='/homepage' component={Homepage} />
                        <Route key="manage-assistants" path={'/assistant-management'} component={CrudSection} />
                        <Route key="manage-trainers" path={'/trainer-management'} component={CrudSection} />
                        {/* https://stackoverflow.com/questions/49001001/
                        using-same-component-for-different-route-path-in-react-router-v4 */}
                    </Switch>
                </Router>
            </>
        )
    }
}

export default AdminLayout
