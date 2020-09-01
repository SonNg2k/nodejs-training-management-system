import React from 'react'
import axios from 'axios'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

class LoginForm extends React.Component {
    state = { email: "", password: "" }

    onInputChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onFormSubmit = (e) => {
        e.preventDefault()
        console.log(this.state)
    }

    render() {
        const { email, password } = this.state
        return (
            <Container>
                <Form onSubmit={this.onFormSubmit} className="mt-5 mx-auto" style={{width: "300px"}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required name="email" type="email" placeholder="Enter email" onChange={this.onInputChange} />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                    </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required name="password" type="password" placeholder="Password" onChange={this.onInputChange} />
                    </Form.Group>
                    <Button variant="warning" type="submit" style={{marginLeft: "40%"}}>
                        Login
                </Button>
                </Form>
            </Container>
        )
    }
}

export default LoginForm
