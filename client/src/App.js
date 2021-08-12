
import './App.css';
import React, { Component } from 'react';
import Form from './components/FormInput';
/*import 'bootstrap/dist/css/bootstrap.min.css';*/
import SignIn from './components/SignIn';
import Profile from './components/Profile';
import {BrowserRouter as Router , Switch, Route} from 'react-router-dom';
import { useHistory } from "react-router-dom";
import Landing from './Pages/Landing';
import Header from './Pages/Header';
import Account from './Pages/Account';
import EditProfile from './Pages/EditProfile';
import Footer from './Pages/Footer';
import Help from './Pages/Help';
import ShowProfile from './Pages/ShowProfile';
import Booking from './Pages/booking';



//<div className="App">
//<Form />

//</div>

function App() {
  
  return (
    
    <Router>
      <div className="App">
      
      <Header />    
      <Switch> 
      <Route path='/linkedin' component={() => { 
      window.location.href = 'https://www.linkedin.com/school/kingfaisaluniversity'; 
      return null;
      }}/>

      <Route path='/twitter' component={() => { 
      window.location.href = 'https://twitter.com/KFUniversity'; 
      return null;
      }}/>
  
      
      <Route path="/" exact component={Landing} />
      <Route path="/registration" component={Form}/>
      <Route path="/signin" component={SignIn}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/account" component={Account}/>
      <Route path="/editprofile" component={EditProfile}/>
      <Route path="/showprofile" component={ShowProfile}/>
      <Route path="/booking" component={Booking}/>
      <Route path="/help" component={Help}/>
      </Switch> 

      <Footer />
      </div>
    </Router>
  );
}



export default App;
