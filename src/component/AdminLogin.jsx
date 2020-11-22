import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import './styles/styles.css'
import QRCode from 'qrcode';
import speakeasy from 'speakeasy';
import $ from "jquery"
import { login } from '../actions/auth'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/fcritlogo.png'


export class AdminLogin extends Component {

    state = {
        credentials: { username: '', password: '', otp: '' },
        error: { username: '', password: '' },
        user: '',
        isVerified: false,
        wrongOTP: false
    }

    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired
    }

    componentDidMount=()=>{
        $(".delete").click(function () {
            $(".modal").removeClass("is-active");
            $(".modal").addClass("not-active");
        })
        $(".modal-background").click(function () {
            $(".modal").removeClass("is-active");
            $(".modal").addClass("not-active");
        })
    }

    handlesubmit = e => {
        e.preventDefault()
        $('button').addClass('is-loading');
        console.log(this.state.credentials);
        this.props.login(this.state.credentials.username, this.state.credentials.password)
    }

    successfull = () => {
        toast.success("Success Notification !")
    }


    handlechange = e => {
        e.preventDefault();
        const cred = this.state.credentials;
        cred[e.target.name] = e.target.value;
        this.setState({
            credentials: cred,
        })
    }

    generateOTP = () => {
        const secret = speakeasy.generateSecret({
            name: 'FCRIT Examcell'
        })
        this.setState({
            OTP: secret
        })
        console.log(secret)
        console.log(secret.ascii)
        this.setState({
            ascii: secret.ascii
        })
        QRCode.toDataURL(secret.otpauth_url, function (err, data) {
            console.log(data)

        })

    }

    openPasswordModal = () => {
        $(".modal").addClass("is-active")
        $(".modal").removeClass("not-active");
    }

    passwordModal = () => {
        return (
            <div class="modal not-active" >
                <div class="modal-background"></div>
                <div class="modal-card" style={{ maxWidth: '400px' }}>
                    <header class="modal-card-head">
                        <p class="modal-card-title">Send reset password link</p>
                        <button class="delete" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body">
                        <div className="field ">
                            <div className="control has-icons-left ">
                                <input type="email"

                                    onChange={this.handlechange}
                                    name="email"
                                    className="input"
                                    autoComplete="on"
                                    placeholder="Enter your email id"
                                    value={this.state.credentials.email} />
                                <span className="icon is-left">
                                    <i className="material-icons-outlined is-small">vpn_key</i>
                                </span>

                            </div>

                        </div>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" onClick={this.sendLink}>Send Link</button>
                    </footer>
                </div>
            </div>
        )
    }

    sendLink = () => {
        $('button').addClass('is-loading');
        const email = this.state.credentials.email
        fetch(`http://192.168.29.101:8000/api/password_reset/`, {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "email": email
                }
            )
        }).then(res => res.json())
            .then(data => {
                this.setState({
                    msg: data
                })
                if (data.email) {
                    toast.error(`${data.email}`, {
                        autoClose: 6000,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    })
                    $('button').removeClass('is-loading');
                }
                else {
                    toast.success(`Sent successfully`, {
                        autoClose: 5000,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    })
                    this.setState({
                        credentials: { email: '' }
                    })
                    $('button').removeClass('is-loading');
                    $(".modal").addClass("not-active");
                    $(".modal").removeClass("is-active");
                }

            })
    }

    verify = () => {
        const verify = speakeasy.totp.verify({
            secret: 'BbL021*V{:{0G:2?C%5Xn20ywfVkh;tf',
            encoding: 'ascii',
            token: this.state.credentials.otp
        })
        if (verify === true) {
            this.setState({ isVerified: true, wrongOTP: false })
        }
        else {
            this.setState({ isVerified: false, wrongOTP: true })
        }
        console.log(verify)
        this.setState({ credentials: { username: '', password: '', otp: '' } })
    }





    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/admin_home" />;
        }
        const { error } = this.props;

        $('button').removeClass('is-loading');
        return (
            <div id="bgsvg">
                {this.passwordModal()}
                <div className="section" style={{ height: '100vh' }} >
                    <div className="container">

                        <div className="columns">
                            {!this.state.isVerified ? (
                                <div className="column">
                                    <div className="box mybox" style={{ boxShadow: '0 0 11px rgba(0,0,0,' }}>
                                        <div className="logo is-flex">
                                            <img src={logo} alt="" width="25px" className="mr-2" />
                                            <div className="title is-5 " >Examcell</div>
                                        </div>
                                        <br />
                                        <div className="title has-text-centered">Verify OTP</div>
                                        <div className="field ">
                                            <div className="control has-icons-left">
                                                <input type="number"
                                                    onChange={this.handlechange}
                                                    name="otp"
                                                    className="input "
                                                    autoComplete="off"
                                                    placeholder="Enter OTP"
                                                    value={this.state.credentials.otp} />
                                                <span className="icon is-small is-left">
                                                    <i className="material-icons">vpn_key</i>
                                                </span>

                                            </div>
                                        </div>
                                        <div className="help is-danger">
                                            {this.state.wrongOTP ? <span><i class="fas fa-exclamation-circle"></i>Wrong OTP</span> : null}
                                        </div>
                                        <button className="button is-success" onClick={this.verify}>Verify</button>
                                        <hr />
                                        <Link to="/login" style={{ color: '#48c774' }}>Back</Link>
                                        <button className="button" onClick={this.generateOTP}>OTP</button>
                                    </div>
                                </div>
                            ) : null}

                            {!this.state.isVerified ? (
                                <div className="column">

                                    <div className="box mybox" >

                                        <div className="logo is-flex">
                                            <img src={logo} alt="" width="25px" className="mr-2" />
                                            <div className="title is-5 " >Examcell</div>
                                        </div>
                                        <br />
                                        <div className="title has-text-centered" > Admin Login</div>
                                        <div className="field ">
                                            <div className="control has-icons-left">
                                                <input type="text"
                                                    onChange={this.handlechange}
                                                    name="username"
                                                    className="input "
                                                    autoComplete="off"
                                                    placeholder="Username"
                                                    value={this.state.credentials.username} />
                                                <span className="icon is-small is-left">
                                                    <i className="material-icons">person_pin</i>
                                                </span>
                                                <div className="help is-danger">
                                                    {error.msg.username ? <span><i class="fas fa-exclamation-circle"></i> {error.msg.username}</span> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="field ">
                                            <div className="control has-icons-left">
                                                <input type="password"
                                                    onChange={this.handlechange}
                                                    name="password"
                                                    className="input "
                                                    autoComplete="off"
                                                    placeholder="Password"
                                                    value={this.state.credentials.password} />
                                                <span className="icon is-small is-left">
                                                    <i className="material-icons is-small">vpn_key</i>
                                                </span>
                                                <div className="help is-danger">
                                                    {error.msg.password ? <span><i class="fas fa-exclamation-circle"></i> {error.msg.password}</span> : null}
                                                </div>

                                            </div>

                                        </div>

                                        <div className="submit">
                                            <p>Don't have an account? <Link to="/register" style={{ color: '#48c774' }}>Register</Link></p>
                                            <button className="  button  is-success " onClick={this.handlesubmit}>Login</button>
                                        </div>
                                        <Link onClick={this.openPasswordModal}>Forgot password?</Link>
                                        <hr />
                                        <Link to="/" style={{ color: '#48c774' }}>Home</Link>
                                    </div>
                                </div>

                            ) : null}


                        </div>
                    </div>



                </div>

            </div>
        )
    }
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.errors
});

export default connect(mapStateToProps, { login })(AdminLogin);
