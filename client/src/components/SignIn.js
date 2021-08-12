
import React, { Component } from 'react'
import './SignCss.css'
import axios from "axios"
import { Link } from "react-router-dom"


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



    handleSubmit = async (event) => {
    
     axios.post('http://localhost:3003/user/login', 
         {
            email: this.state.Email,
            password: this.state.Password,
            })
        .then(function (response){
            alert(response.data.success)
            
            sessionStorage.setItem('token', response.data.token);
            window.location.href = '/';
        }).catch(function(error){
            alert(error.response.data.fail)
        })


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
    <button onSubmit={this.handleSubmit}>Sign in</button> 


        <h4>If you do not have an account <Link style={{color: 'red' }} to ="/registration">Click here</Link></h4>
    </form>
</div>
        )
        }

}

export default SignIn