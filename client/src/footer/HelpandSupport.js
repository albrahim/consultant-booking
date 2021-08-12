import React from 'react';
import { Link } from 'react-router-dom';


function HelpandSuport(){
    return (
        <div>
            <h4>This site for booking appointments with professional consultants you can book now!!</h4>
            <h3>You can click here, register a new email and join us</h3>
            
        

        <Link to='/registration'><button className="button-join">Join us</button></Link>
        </div>
    );
}

export default HelpandSuport;
