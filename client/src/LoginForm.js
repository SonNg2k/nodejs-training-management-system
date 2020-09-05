import React from 'react'
import axios from 'axios'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

class LoginForm extends React.Component {
    state = { email: "", password: "", loginFailed: false }

    onInputChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onFormSubmit = (e) => {
        e.preventDefault()
        axios.post('/', this.state)
            .then(({ data: { role, token } }) => {
                localStorage.setItem('token', token)
                this.props.loginWithRole(role)
            })
            .catch(() => this.setState({ loginFailed: true }))
    }

    render() {
        const { email, password, loginFailed } = this.state
        return (
            <Container>
                <Form onSubmit={this.onFormSubmit} className="mt-5 mx-auto" style={{ width: "300px" }}>
                    {loginFailed && <h5 className='text-danger'> 🚨Wrong username or password, please check again!</h5>}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required name="email" value={email} type="email" onChange={this.onInputChange}
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                    </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required name="password" value={password} type="password" onChange={this.onInputChange} />
                    </Form.Group>
                    <Button variant="warning" type="submit" style={{ marginLeft: "40%" }}>Login</Button>
                </Form>
            </Container>
        )
    }
}

export default LoginForm
