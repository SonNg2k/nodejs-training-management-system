import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import TraineerLayout from './components/TraineerLayout'
import AdminLayout from './components/AdminLayout'
import AssistantLayout from './components/AssistantLayout'

import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {
    render() {

        return (
            // <Router>
            //     <TraineerLayout pageFor='trainer'/>
            // </Router>
            <>
                <AssistantLayout />
                {/* <AlertBoard msg='Operation failed ❌' bkgColor='danger' /> */}
            </>
        )
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
