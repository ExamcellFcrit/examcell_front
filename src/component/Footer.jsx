import React, { Component } from 'react';
import { HashLink as Link } from 'react-router-hash-link';

export class Footer extends Component {
  render() {
    return (
      <div  className="mb-0">
       {/*  <hr style={{width:'75%',margin:'0 auto',height:'0.5px'}}/> */}
        <div className="section" style={{padding:'1.5em'}}>
            <div className="container" style={{fontSize:'12px',textAlign:'center',color:'white'}}>
                <p style={{fontSize:'14px'}}>Developed and Maintained by Department of Computer Engineering</p>
                <span><Link to="/developers" className="has-text-light"><u>Developers</u></Link> • <a className="has-text-light" href="https://www.fcrit.ac.in/"><u>College Site</u></a></span>
            </div>
        </div>
      </div>
    );
  }
}

export default Footer;
