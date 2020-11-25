import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from "prop-types"
import { Link } from 'react-router-dom'
import { serverip } from '../actions/serverip'
import { logout } from '../actions/auth'
import { toast } from 'react-toastify';

export class changePassword extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
    }
    state = {
        credentials: { old_password: '', new_password: '' },
        error: { old_password: '', new_password: '' },
        user: '',
        visible: false
    }

    componentDidMount = async (e) => {
        const { user } = this.props.auth
        console.log(user.username)
        fetch(`${serverip}/student/${user ? `${user.username}/` : null}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            }
        })
            .then(res => {
                return res.json()
            })
            .then(data => {
                this.setState({
                    profile: data
                })
            })
            .catch(err => console.log(err))
    }

    successChange = () => {
        const { user }= this.props.auth
        if (this.state.msg && this.state.msg.code == 200) {
            toast.success(`Changed Updated!`, {
                autoClose: 2000,
                position: toast.POSITION.BOTTOM_RIGHT,
            })
            fetch(`${serverip}/student/${user ? `${user.username}/` : null}`, {
                method:'patch',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.props.auth.token}`
                },
                body: JSON.stringify(
                    {
                        "changedPassword":true,
                    }
                )
            })
            /*  setTimeout(()=>{
                 window.location.href="/"
             },2000) */
        }

    }


    toggle = () => {
        this.setState({ visible: !this.state.visible })
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

    changePass = () => {
        let oldpass = this.state.credentials.old_password
        let newpass = this.state.credentials.new_password

        fetch(`${serverip}/api/change-password/`, {
            method: 'Put',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${this.props.auth.token}` },
            body: JSON.stringify(
                {
                    "old_password": `${oldpass}`,
                    "new_password": `${newpass}`,
                }
            )
        }).then(res => {
            return res.json()
        }).then(data => {
            this.setState({
                msg: data
            })
            console.log(data.old_password)
        })

    }

    render() {
        const msg = this.state.msg;

        return (
            <div>
                <div className="section" style={{ height: '100vh' }} id="bgsvg" >
                    <div className="container is-widescreen">
                        <div className="columns">
                            <div className="column is-half is-offset-one-quarter">

                                <div className="box mybox" style={{ boxShadow: '0 0 11px rgba(0,0,0,' }}  >
                                    <div className="title has-text-centered">Change Password</div>
                                    <div className="field ">
                                        <div className="control has-icons-left ">
                                            <input type="password"
                                                onChange={this.handlechange}
                                                name="old_password"
                                                id="myInput"
                                                className="input"
                                                autoComplete="off"
                                                style={{ border: `1px solid ${msg && msg.old_password ? `#e62626` : `#dbdbdb`}` }}
                                                placeholder="Old Password"
                                                value={this.state.credentials.password} />
                                            <span className="icon is-left">
                                                <i className="material-icons-outlined is-small">vpn_key</i>
                                            </span>
                                            <div className="help is-danger">
                                                {msg && msg.old_password ? <span><i class="fas fa-exclamation-circle"></i> {msg.old_password}</span> : null}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="field ">
                                        <div className="control has-icons-left ">
                                            <input type="password"
                                                onChange={this.handlechange}
                                                name="new_password"
                                                id="myInput2"
                                                className="input"
                                                autoComplete="off"
                                                style={{ border: `1px solid ${msg && msg.new_password ? `#e62626` : `#dbdbdb`}` }}
                                                placeholder="New Password"
                                                value={this.state.credentials.password} />
                                            <span className="icon is-left">
                                                <i className="material-icons-outlined is-small">vpn_key</i>
                                            </span>
                                            <div className="help is-danger">
                                                {msg && msg.new_password ? <span><i class="fas fa-exclamation-circle"></i> {msg.new_password}</span> : null}
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', marginTop: '10px' }}><i className="material-icons-outlined" style={{ cursor: 'pointer', color: 'grey' }} onClick={this.toggle}>{this.state.visible ? `visibility` : `visibility_off`}</i>{this.state.visible ? `Hide password` : `Show password`}</span>
                                    </div>

                                    <button className="button success" onClick={this.changePass}>Change</button> <hr />
                                    <Link to="/" style={{ color: '#48c774' }}>Go back</Link>
                                </div>
                            </div>

                        </div>
                    </div>

                    {this.successChange()}

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});


export default connect(mapStateToProps, { logout })(changePassword);
