import { render } from "@testing-library/react"
import React, { Component } from 'react'
import './FormCss.css'
import axios from "axios"


class Profile extends Component{
    constructor(props) {
    super(props)

    this.state = {


        Email: props.email,
        Password: props.password,
        FirstName: "",
        LastName: "",
        Gender: "",
        ContactNumber: "",
        Major: "",
            
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

    genderhandler = (event) => {
        this.setState({
        Gender: event.target.value

    })

    }


    majorhandler = (event) => {
        this.setState({
        Major: event.target.value

    })

    }

    contactnumberhandler = (event) => {
        this.setState({
        ContactNumber: event.target.value

    })

    }

    handleSubmit = async (event) => {
        event.preventDefault()
        console.log(this.state)
        await axios.post('http://localhost:3003/user/signup',   {
            email: this.state.Email,
            password: this.state.Password,    
            profile: {
                firstName: this.state.FirstName,
                lastName: this.state.LastName,
                gender: this.state.Gender,
            }
            
            })
            .then(function (response){
                alert(response.data.success)
            }).catch(function(error){
                alert(error.response.data.fail)
            })
        

     
        return false;
    }

  

   
    render() {
        return (

    <div>


    <form> 
    <h1>Profile</h1>
    <input type="text" value={this.state.FirstName} onChange={this.Firsthandler} placeholder="First name"/>
    <input type="text" value={this.state.LastName} onChange={this.Lasthandler} placeholder="Last name"/><br />
    <input type="String" value={this.state.Major} onChange={this.majorhandler} placeholder="Major"/><br />
    <input type="tel" value={this.state.ContactNumber} onChange={this.contactnumberhandler} placeholder="Phone Number"/><br />

    {/*    
    <select onChange={this.genderhandler} defaultValue="Select your Gender">
    <input type="radio" value="Male" name="gender" onChange={this.genderhandler} /> Male
    <input type="radio" value="Female" name="gender"onChange={this.genderhandler} /> Female*/}



    <select onChange={this.genderhandler} defaultValue="Gender">
    <option defaultValue> Gender </option>
    <option value ="male">Male</option>
    <option value ="female">Female</option>
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


    
    

    <button onClick={this.handleSubmit}>Sign up</button> 

       

    </form>

</div>
        )

        }

}

export default Profile