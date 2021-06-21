
import React, { Component } from 'react'
import './SignCss.css'



class SignIn extends Component{
    constructor(props) {
    super(props)

    this.state = {

        Email: "",
        Password: "",        
        
    }
    this.handleSubmit=this.handleSubmit.bind(this)

    }


    passwordhandler = (event) => {
        this.setState({
        Password: event.target.value

    })

    }


    emailhandler = (event) => {
        this.setState({
        Email: event.target.value

    })

    }  



    handleSubmit = (event) => {
        alert(`${this.state.Email} Registered Successfully `)
        console.log({
        email: this.state.Email,
        password: this.state.Password
        });
        this.setState({
            Email: "",
            Password: "",
        })
     event.preventDefault()
        
    }

  

   
    render() {
        return (

    <div>


    <form onSubmit={this.handleSubmit}> 
    <h1>Sign in</h1>
    <input type="email" value={this.state.Email} onChange={this.emailhandler} placeholder="Email"/> <br />
    <input type="password" value={this.state.Password} onChange={this.passwordhandler} placeholder="Password"/><br />
        <input type="submit" value="Submit" />

    </form>
</div>
        )
        }

}

export default SignIn