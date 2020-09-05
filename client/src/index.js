import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import axios from 'axios'

import LoginForm from './LoginForm'
import ManagerLayout from './components/ManagerLayout'
import TraineerLayout from './components/TraineerLayout'

import 'bootstrap/dist/css/bootstrap.min.css';

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        config.headers.authorization = `Bearer ${token}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

class App extends React.Component {
    render() {
        return <LoginControl />
    }
}

class LoginControl extends React.Component {
    state = { isLoggedIn: false, role: '' }

    loginWithRole = (role) => this.setState({ isLoggedIn: true, role: role })

    logout = () => {
        localStorage.removeItem('token')
        this.setState({ isLoggedIn: false, role: '' })
    }

    render() {
        const { isLoggedIn, role } = this.state
        const layoutFor = {
            admin: ManagerLayout,
            assistant: ManagerLayout,
            trainer: TraineerLayout,
            trainee: TraineerLayout
        }
        const Layout = layoutFor[role]

        return (
            <>
                {!isLoggedIn && <LoginForm loginWithRole={this.loginWithRole} />}
                {isLoggedIn && <Layout role={role} logout={this.logout} />}
            </>
        )
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
