import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from "prop-types"
import {serverip} from '../actions/serverip'
import $ from "jquery"
import { Link } from 'react-router-dom'
import logo from '../assets/fcritlogo.png'
import { logout } from '../actions/auth'
import { toast } from 'react-toastify';

export class resetPassword extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
    }
    state = {
        credentials: { password: '', password2: '' }
    }

    toggle=()=> {
        this.setState({visible:!this.state.visible})
        var x = document.getElementById("myInput");
        var y = document.getElementById("myInput2");
        if (x.type === "password") {
          x.type = "text";
          y.type = "text";
        } else {
          x.type = "password";
          y.type = "password";
        }
      }

   
    handlechange = e => {
        e.preventDefault();
        const cred = this.state.credentials;
        cred[e.target.name] = e.target.value;
        this.setState({
            credentials: cred,
        })

    }

    componentDidMount = () => {
        var url_string = window.location.href
        console.log(url_string)
        var url = new URL(url_string);
        var token = url.searchParams.get("token");
        this.setState({
            token: token
        })
        if (token === null) {
            alert("Unauthorized access.")
            setTimeout(()=>{
                window.location.href="/"
            },2000)
        }
    }

    resetPass = () => {
    
        if (this.state.credentials.password === this.state.credentials.password2) {
            fetch(`${serverip}/api/password_reset/confirm/`, {
                method: 'Post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        "token": this.state.token,
                        "password": this.state.credentials.password,
                    }
                )
            }).then(res => {
                return res.json()
            }).then(data => {
                this.setState({
                    msg: data
                })
                if (data.status == 'OK') {
                    toast.success(`Updated successfully!`, {
                        autoClose: 2000,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    })
                    setTimeout(() => {
                        window.location.href = "/"
                    }, 2000)
                }
                else if (data.status == 'notfound') {
                    toast.error(`You are using an expired link. Please initiate a new reset password request`, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose:false
                    })

                }
            })
        }
        else{
            this.setState({
                msg:"Passwords don't match"
            })
            toast.error(`Passwords don't match!`, {
                autoClose: 2000,
                position: toast.POSITION.BOTTOM_RIGHT,
            })
        }


    }
    render() {
        const msg=this.state.msg
        return (
            <div>
                <div className="section" style={{ height: '100vh' }} id="bgsvg" >
                    <div className="container is-widescreen">
                        <div className="columns">
                            <div className="column is-half is-offset-one-quarter">

                                <div className="box mybox" style={{ boxShadow: '0 0 11px rgba(0,0,0,' }}  >
                                <div className="logo is-flex">
                                        <img src={logo} alt="" width="25px" className="mr-2" />
                                        <div className="title is-5 " >Examcell</div>
                                    </div>
                                    <br />
                                    <div className="title has-text-centered">Reset Password</div>
                                    <div className="field ">
                                        <div className="control has-icons-left ">
                                            <input type="password"
                                                onChange={this.handlechange}
                                                name="password"
                                                id="myInput"
                                                className="input"
                                                style={{border:`1px solid ${msg && msg.password?`#e62626`:`#dbdbdb`}`}}
                                                autoComplete="off"
                                                placeholder=" Password"
                                                value={this.state.credentials.password} />
                                            <span className="icon is-left">
                                                <i className="material-icons-outlined is-small">vpn_key</i>
                                            </span>
                                            <div className="help is-danger">
                                            {msg && msg.password ? <span><i class="fas fa-exclamation-circle"></i> {msg.password[0]}</span> : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field ">
                                        <div className="control has-icons-left ">
                                            <input type="password"
                                                onChange={this.handlechange}
                                                name="password2"
                                                id="myInput2"
                                                className="input"
                                                autoComplete="off"
                                                placeholder="Confirm Password"
                                                value={this.state.credentials.password2} />
                                            <span className="icon is-left">
                                                <i className="material-icons-outlined is-small">vpn_key</i>
                                            </span>

                                        </div>
                                        <span style={{fontSize:'12px',display:'flex',alignItems:'center',marginTop:'10px'}}><i className="material-icons-outlined" style={{cursor:'pointer',color:'grey'}} onClick={this.toggle}>{this.state.visible?`visibility`:`visibility_off`}</i>{this.state.visible?`Hide password`:`Show password`}</span>
                                    </div>

                                   <div className="submit">
                                   <button className="button is-success" onClick={this.resetPass}>Reset</button>
                                   </div>
                                    <hr/>
                                    <Link to="/login">Login</Link>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, { logout })(resetPassword)
