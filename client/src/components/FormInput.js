import { render } from "@testing-library/react"
import React, { Component } from 'react'
import './FormCss.css'
import axios from "axios"
import { Redirect } from "react-router-dom"
// import { withRouter } from 'react-router-dom';
// import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom"
import { Router } from "react-router-dom";
import Profile from './Profile';


class Form extends Component{
    constructor(props) {
    super(props)

    this.state = {

        Password: "",
        Email: "",
        validated: false
            
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


       handleSubmit = async () => {
           console.log("validated "+ this.state.validated)
        // let history = useHistory();
        await axios.post('http://localhost:3003/user/validate',  {
            email: this.state.Email,
            password: this.state.Password,
            
            })
            .then( (response) => {
                console.log(response.data)
                if(response.data.success){
                    // window.location='/profile';
                    this.setState({validated: true})
                    console.log("validated "+ this.state.validated)
                    console.log(response)
                    // console.log("any");


                    // this.props.history.push("/profile");
                    // return <Link to ="/profile"></Link>
                    // this.history.push('/profile')
                }

                else{
                    alert(response.data.fail);
                    console.log(response)
                
                }
            

            }).catch(function(error){
                console.log(error)
            })
            

        console.log(
        {
        email: this.state.Email,
        password: this.state.Password,
        
        });
        this.setState({

        Password: "",
        Email: "",
        })        
    }

  

   
    render() {
        return (

    <div>

    { !this.state.validated ? (
    <form> 
    <h1>Registration</h1>

    
    <input type="email" value={this.state.Email} onChange={this.emailhandler} placeholder="Email"/> <br /> 
    <input type="password" value={this.state.Password} onChange={this.passwordhandler} placeholder="Password"/><br />
    
    

    {/*    
    <select onChange={this.genderhandler} defaultValue="Select your Gender">
    <input type="radio" value="Male" name="gender" onChange={this.genderhandler} /> Male
    <input type="radio" value="Female" name="gender"onChange={this.genderhandler} /> Female*/}





    {/*
    <select onChange={this.rolehandler} defaultValue="Role">
    <option defaultValue> Role </option>
    <option value ="Consultant">Consultant</option>
    <option value ="Paticipant">Paticipant</option>
    </select>
    <br />
    */}

    
    {/* <button>Submit</button> */}
    
   <Link onClick={this.handleSubmit}>submit </Link>

    <h4>If you already have an account <Link style={{color: 'blue'}} to ="/signin">Click here</Link></h4>
    


    
    </form>
    ): null}


    {this.state.validated ? <Profile email={this.state.Email} password={this.state.Password} /> : null}
    
    


</div>
        )

        }

}

export default Form;
// export default withRouter(Form);