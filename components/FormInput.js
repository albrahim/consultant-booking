import { render } from "@testing-library/react"
import React, { Component } from 'react'
import './FormCss.css'
import axios from "axios"


class Form extends Component{
    constructor(props) {
    super(props)

    this.state = {

        FirstName: "",
        LastName: "",
        Password: "",
        Email: "",
        Gender: "",
        ContactNumber: "",
            
    }

    this.handleSubmit=this.handleSubmit.bind(this)

    }

    Firsthandler = (event) => {
        this.setState({
        FirstName: event.target.value

    })

    }

    Lasthandler = (event) => {
        this.setState({
        LastName: event.target.value

    })

    }

    passwordhandler = (event) => {
        this.setState({
        Password: event.target.value

    })

    }

    genderhandler = (event) => {
        this.setState({
        Gender: event.target.value

    })

    }

    emailhandler = (event) => {
        this.setState({
        Email: event.target.value

    })

    }  

    rolehandler = (event) => {
        this.setState({
        Role: event.target.value

    })

    }

    contactnumberhandler = (event) => {
        this.setState({
        ContactNumber: event.target.value

    })

    }

    handleSubmit = async (event) => {
        
        axios.post('/signup',   {
            firstName: this.state.FirstName,
            lastName: this.state.LastName,
            gender: this.state.Gender,
            email: this.state.Email,
            password: this.state.Password,
            
            })
        alert(`${this.state.FirstName} ${this.state.LastName}  Registered Successfully `)
        console.log(
        {
        firstName: this.state.FirstName,
        lastName: this.state.LastName,
        gender: this.state.Gender,
        email: this.state.Email,
        password: this.state.Password,
        
        });
        this.setState({
            FirstName: "",
            LastName: "",
            Password: "",
            Email: "",
            Gender: "",
            ContactNumber: "",

  
        })
     event.preventDefault()
        
    }

  

   
    render() {
        return (

    <div>


    <form onSubmit={this.handleSubmit}> 
    <h1>Registration</h1>
    <input type="text" value={this.state.FirstName} onChange={this.Firsthandler} placeholder="First name"/>
    <input type="text" value={this.state.LastName} onChange={this.Lasthandler} placeholder="Last name"/><br />
    <input type="password" value={this.state.Password} onChange={this.passwordhandler} placeholder="Password"/><br />
    <input type="email" value={this.state.Email} onChange={this.emailhandler} placeholder="Email"/> <br /> 
    <input type="tel" value={this.state.ContactNumber} onChange={this.contactnumberhandler} placeholder="Phone Number"/><br />

    {/*    
    <select onChange={this.genderhandler} defaultValue="Select your Gender">
    <input type="radio" value="Male" name="gender" onChange={this.genderhandler} /> Male
    <input type="radio" value="Female" name="gender"onChange={this.genderhandler} /> Female*/}


    <select onChange={this.genderhandler} defaultValue="Gender">
    <option defaultValue> Gender </option>
    <option value ="Male">Male</option>
    <option value ="Female">Female</option>
    </select>

    <br />
    {/*
    <select onChange={this.rolehandler} defaultValue="Role">
    <option defaultValue> Role </option>
    <option value ="Consultant">Consultant</option>
    <option value ="Paticipant">Paticipant</option>
    </select>
    <br />
    */}


        <input type="submit" value="Submit" />

       

    </form>

</div>
        )

        }

}

export default Form