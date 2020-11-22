import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/fcritlogo.png'

export class Register extends Component {

    state = {
        credentials: { username: '', password: '', password2: '', email: '', first_name: '', },
        error: { username: '', password: '', password2: '', email: '', first_name:''},
        user: '',
        visible:false
    }

    successfull = () => {
        toast.success("You are registered! 😊", {
            autoClose: 3000,
            position: toast.POSITION.BOTTOM_RIGHT,
        })
    }
    unsuccessfull = () => {
        toast.error("Registration failed! 😞", {
            autoClose: 3000,
            position: toast.POSITION.BOTTOM_RIGHT,
        })
    }

    toggle=()=> {
        this.setState({visible:!this.state.visible})
        var x = document.getElementById("myInput");
        var y = document.getElementById("myInput2");
        if (x.type &&y.type === "password") {
          x.type = "text";
          y.type = "text";
        } else {
          x.type = "password";
          y.type = "password";
        }
      }
   
    notify = () => this.toastId = toast("Loading...", { autoClose: false ,position:toast.POSITION.BOTTOM_RIGHT});
    success= () => toast.update(this.toastId, { render:"Registered!",type: toast.TYPE.SUCCESS, autoClose: 3000 });
    failed= () => toast.update(this.toastId, { render:"Registration failed!",type: toast.TYPE.ERROR, autoClose: 3000 });

    register = async (e) => {
        e.preventDefault()
        {this.notify()}
        fetch(' http://192.168.29.101:8000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.credentials)
        })
            .then(data => data.json())
            .then(
                data => {
                    this.setState({
                        error: data,
                    })
                    if (this.state.error.token) {
                        { this.success() }
                        setTimeout("location.href = '/login';",1000);
                    }
                    else {
                        { this.failed() }
                    }
                }
            ).catch(error => console.log(error))
           
           
        

    }

    handlechange = e => {
        e.preventDefault();
        const cred = this.state.credentials;
        cred[e.target.name] = e.target.value;
        this.setState({
            credentials: cred,
        })
    }


    render() {
        return (
            <div>
                <div className="section" id="bgsvg">
                    <div className="container">
                        <div className="box mybox" style={{ maxWidth: '400px' }}>
                            <div className="logo is-flex">
                            <img src={logo} alt="" width="25px" className="mr-2" />
                                        <div className="title is-5 " >Examcell</div>
                            </div>
                            <br />
                            <div className="title has-text-centered">Student Registration</div>
                            <div className="field">
                                <div className="control has-icons-left">
                                    <input type="number"
                                        onChange={this.handlechange}
                                        name="username"
                                        pattern="[0-9]"
                                        className="input"
                                        autoComplete="off"
                                        placeholder="Roll number"
                                        value={this.state.credentials.username} />
                                    <span className="icon is-small is-left">
                                        <i className="material-icons is-small">person</i>
                                    </span>
                                    <div className="help is-danger">
                                        {this.state.error.username ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.username}</span> : null}
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <div className="control has-icons-left">
                                    <input type="text is-primary"
                                        onChange={this.handlechange}
                                        name="first_name"
                                        placeholder="Fullname ( As in marksheet )"
                                        className="input "
                                        autoComplete="off"
                                        value={this.state.credentials.first_name} />
                                    <span className="icon is-small is-left">
                                        <i className="material-icons is-small">person</i>
                                    </span>
                                    <div className="help is-danger">
                                        {this.state.error.first_name ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.first_name}</span> : null}
                                    </div>
                                </div>
                            </div>

                            {/* <div className="field">
                                <div className="control has-icons-left">
                                    <input type="text is-primary"
                                        onChange={this.handlechange}
                                        name="last_name"
                                        placeholder="Last name"
                                        className="input "
                                        autoComplete="off"
                                        value={this.state.credentials.last_name} />
                                    <span className="icon is-small is-left">
                                        <i className="material-icons is-small">person</i>
                                    </span>
                                    <div className="help is-danger">
                                        {this.state.error.last_name ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.last_name}</span> : null}
                                    </div>
                                </div>
                            </div> */}

                            <div className="field">
                                <div className="control has-icons-left">

                                    <input type="email"
                                        onChange={this.handlechange}
                                        name="email"
                                        placeholder="Email"
                                        autoSave="off"
                                        id="myInput"
                                        autoComplete="off"
                                        className="input"
                                        value={this.state.credentials.email} />
                                    <span className="icon is-small is-left">
                                    <i class="material-icons">mail_outline</i>
                                    </span>
                                </div>
                            </div>

                            <div className="field">
                                <div className="control has-icons-left">

                                    <input type="password"
                                        onChange={this.handlechange}
                                        name="password"
                                        placeholder="Password"
                                        id="myInput"
                                        autoSave="off"
                                        autoComplete="off"
                                        className="input"
                                        value={this.state.credentials.password} />
                                    <span className="icon is-small is-left">
                                        <i className="material-icons is-small">vpn_key</i>
                                    </span>
                                    {this.state.error.password ? (<div className="help is-danger">
                                     <span><i className="fas fa-exclamation-circle"></i> {this.state.error.password}</span>
                                    </div>):(<p className="help" style={{animation:'none'}}>Password should be atleast 8 characters long and alphanumeric</p>)}
                                    
                                </div>
                            </div>

                            <div className="field ">
                                <div className="control has-icons-left">

                                    <input type="password"
                                        onChange={this.handlechange}
                                        name="password2"
                                        placeholder="Confirm Password"
                                        id="myInput2"
                                        className="input"
                                        autoComplete="off"
                                        
                                        value={this.state.credentials.password2} />
                                    <span className="icon is-small is-left">
                                        <i className="material-icons is-small">vpn_key</i>
                                    </span>
                                    <div className="help is-danger">
                                        {this.state.error.password2 ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.password2}</span> : null}
                                    </div>
                                </div>
                                <span style={{fontSize:'12px',display:'flex',alignItems:'center',marginTop:'10px'}}><i className="material-icons-outlined" style={{cursor:'pointer',color:'grey'}} onClick={this.toggle}>{this.state.visible?`visibility`:`visibility_off`}</i>{this.state.visible?`Hide password`:`Show password`}</span>
                            </div>

                            <div className="submit">
                                <p>Already have an account? <Link to='/login' style={{ color: '#34a85c' }}>Login</Link></p>
                                <button onClick={this.register} className="button is-success is-grouped is-grouped-centered" >Register</button>
                            </div>
                            <hr />
                            <Link to="/" style={{ color: '#48c774' }}>Home</Link>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}

export default Register
