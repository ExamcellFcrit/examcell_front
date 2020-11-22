import React, { Component } from 'react';
import { HashLink as Link } from 'react-router-hash-link';

export class Footer extends Component {
  render() {
    return (
      <div style={{backgroundImage:'linear-gradient(to top,#0a0a0a,transparent)'}} className="mb-0">
        <div className="section" style={{padding:'1.5em'}}>
            <div className="container" style={{fontSize:'12px',textAlign:'center',color:'white'}}>
                <p style={{fontSize:'14px'}}>Developed and Maintained by Department of Computer Engineering</p>
                <span><Link to="/developers" className="has-text-success">Developers</Link> • <Link className="has-text-success">Contact Examcell</Link> •  <a className="has-text-success" href="https://www.fcrit.ac.in/">College Site</a></span>
            </div>
        </div>
      </div>
    );
  }
}

export default Footer;
