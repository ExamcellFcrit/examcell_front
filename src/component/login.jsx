import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import emailjs from 'emailjs-com';
import { init } from 'emailjs-com';
import Footer from './Footer';
import './styles/styles.css'
import {serverip} from "../actions/serverip"
import $ from "jquery"
import { login } from '../actions/auth'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/fcritlogo.png'
import pdf from '../assets/Form filling instructions for KT Exam.pdf'
import regularpdf from '../assets/Form filling instructions for Regular Exam.pdf'


export class Login extends Component {

    state = {
        credentials: { username: '', password: '',email:'' },
        error: { username: '', password: '' },
        user: '',
        visible: false
    }

    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired
    }

    sendLink=()=>{
        $('button').addClass('is-loading');
        const email=this.state.credentials.email
        fetch(`${serverip}/api/password_reset/`,{
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "email":email
                }
            )
        }).then(res=>res.json())
        .then(data=>{
            this.setState({
                msg:data
            })
            if(data.email){
                toast.error(`${data.email}`, {
                    autoClose: 6000,
                    position: toast.POSITION.BOTTOM_RIGHT,
                })
                $('button').removeClass('is-loading');
            }
            else{
                toast.success(`Sent successfully`, {
                    autoClose: 5000,
                    position: toast.POSITION.BOTTOM_RIGHT,
                })
                this.setState({
                    credentials:{email:''}
                })
                $('button').removeClass('is-loading');
                $(".modal").addClass("not-active");
                $(".modal").removeClass("is-active");
            }
            
        })
    }

    componentDidMount = () => {
        $(".delete").click(function () {
            $(".modal").removeClass("is-active");
            $(".modal").addClass("not-active");
        })
        $(".modal-background").click(function () {
            $(".modal").removeClass("is-active");
            $(".modal").addClass("not-active");
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
                <div class="modal-card" style={{maxWidth:'400px'}}>
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

    handlesubmit = e => {
        $('button').addClass('is-loading');
        console.log(this.state.credentials);
        this.props.login(this.state.credentials.username, this.state.credentials.password);
    }


    fetchByPincode=async()=> {
        var today = new Date();
init("user_cUHmZeSZjubuIgz1MZU1o");

var dd = today.getDate();
var d2=today.getDate()+1;
var d3=today.getDate()+2;
var d4=today.getDate()+3;
var d5=today.getDate()+4;
var d6=today.getDate()+5;
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 
const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
var pincodes = ["400706","400614"];
var dateArr = [`${d2}-${mm}-${yyyy}`,`${d3}-${mm}-${yyyy}`,`${d4}-${mm}-${yyyy}`,`${d5}-${mm}-${yyyy}`,`${d6}-${mm}-${yyyy}`];
var trialCounter = 1;
        today = dd+'-'+mm+'-'+yyyy;
        console.log(today);  
        console.log(d2)
          console.log("Check: ", trialCounter++);
          var i,j,a,c,s,url;
          for (i=0;i < pincodes.length; i++) {
            for (j=0; j < dateArr.length; j++) {
              url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin?pincode="+pincodes[i]+"&date="+dateArr[j];
              await sleepNow(10000);
              //a = httpGet(url);
              a=fetch(url,{
                headers:{
                  "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJkNDU5NGZhZS1mYjQ4LTQ4OTItYjhkMi03OGFmMzZmMjk2ZmIiLCJ1c2VyX2lkIjoiZDQ1OTRmYWUtZmI0OC00ODkyLWI4ZDItNzhhZjM2ZjI5NmZiIiwidXNlcl90eXBlIjoiQkVORUZJQ0lBUlkiLCJtb2JpbGVfbnVtYmVyIjo4NDU0OTc5OTcxLCJiZW5lZmljaWFyeV9yZWZlcmVuY2VfaWQiOjIzODAzNTEzMTQ5MDEwLCJzZWNyZXRfa2V5IjoiYjVjYWIxNjctNzk3Ny00ZGYxLTgwMjctYTYzYWExNDRmMDRlIiwidWEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvOTAuMC40NDMwLjkzIFNhZmFyaS81MzcuMzYgRWRnLzkwLjAuODE4LjU2IiwiZGF0ZV9tb2RpZmllZCI6IjIwMjEtMDUtMTJUMDQ6NDg6MDAuODU5WiIsImlhdCI6MTYyMDc5NDg4MCwiZXhwIjoxNjIwNzk1NzgwfQ.zV5Kkhd7-imI9QQ6ZSFippvgIjy-6IfDWNb1RqkPALY"
                }
              })
          
              try {
                a = JSON.parse(a)
              } catch(e) {
                continue;
              }
              for (c in a.centers) {
              for (s in a.centers[c].sessions) {
                    if (a.centers[c].sessions[s].min_age_limit < 45 && a.centers[c].sessions[s].available_capacity > 0) {
                      console.log("Trying Booking for", a.centers[c].pincode, a.centers[c].name, a.centers[c].sessions[s].available_capacity);
                      var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
                      audio.play();
                      var beneficiaries="23803513149010";
                      var data = {
                        center_id: a.centers[c].center_id,
                        session_id: a.centers[c].sessions[s].session_id,
                        dose: 1,
                        slot: a.centers[c].sessions[s].slots[0],
                        beneficiaries: beneficiaries
                        }
                        console.log(data.beneficiaries)
                        //upload(data,  a.centers[c].pincode, a.centers[c].name, a.centers[c].sessions[s].available_capacity);
                      emailjs.send("service_fotbzbn","template_js730qn",{
                        to_mail:'rutvikokate2610@gmail.com',
                        msg: `${a.centers[c].pincode}, ${a.centers[c].name}, ${a.centers[c].sessions[s].available_capacity}`,
                        });
                    }
                    else{
                      console.log("Not available")
                    }
                }
              }
            }
          }
          await sleepNow(20000);
          this.fetchByPincode();
      }


    toggle = () => {
        this.setState({ visible: !this.state.visible })
        var x = document.getElementById("myInput");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
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

    render() {
        //this.fetchByPincode()
        if (this.props.isAuthenticated) {
            return <Redirect to="/home" />;
        }
        
        const { error } = this.props;
        function openCity(evt, cityName) {
            var i, x, tablinks;
            x = document.getElementsByClassName("city");
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablink");
            for (i = 0; i < x.length; i++) {
                tablinks[i].className = tablinks[i].className.replace("is-active", "");
            }
            document.getElementById(cityName).style.display = "block";
            evt.currentTarget.firstElementChild.className += " is-active";
        }

        $('button').removeClass('is-loading');
        return (
            <div >
                {this.passwordModal()}

                <div className="section"  >
                    <div className="container is-widescreen">
                        <div className="columns">
                            <div className="column is-half is-offset-one-quarter">

                                <div className="box mybox" style={{ boxShadow: '0 0 11px rgba(0,0,0,' }}  >
                                    <div className="logo is-flex">
                                        <img src={logo} alt="" width="25px" className="mr-2" />
                                        <div className="title is-5 " >Examcell</div>
                                    </div>
                                    <br />
                                    <div className="title has-text-centered">Student Login</div>

                                    

                                    

                                    <div className="field ">
                                        <div className="control has-icons-left">
                                            <input type="number"
                                                onChange={this.handlechange}
                                                name="username"
                                                className="input "
                                                autoComplete="off"
                                                style={{ border: `1px solid ${error.msg.username ? `#e62626` : `#dbdbdb`}` }}
                                                placeholder="Roll number"
                                                value={this.state.credentials.username} />
                                            <span className="icon is-left">
                                                <i className="material-icons-outlined">account_circle</i>
                                            </span>
                                            <div className="help is-danger">
                                                {error.msg.username ? <span><i class="fas fa-exclamation-circle"></i> {error.msg.username}</span> : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field ">
                                        <div className="control has-icons-left ">
                                            <input type="password"
                                                onChange={this.handlechange}
                                                name="password"
                                                id="myInput"
                                                className="input"
                                                autoComplete="off"
                                                style={{ border: `1px solid ${error.msg.password ? `#e62626` : `#dbdbdb`}` }}
                                                placeholder="Password"
                                                value={this.state.credentials.password} />
                                            <span className="icon is-left">
                                                <i className="material-icons-outlined is-small">vpn_key</i>
                                            </span>

                                            <div className="help is-danger">
                                                {error.msg.password ? <span><i class="fas fa-exclamation-circle"></i> {error.msg.password}</span> : null}
                                            </div>

                                        </div>
                                        <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', marginTop: '10px' }}><i className="material-icons-outlined" style={{ cursor: 'pointer', color: 'grey' }} onClick={this.toggle}>{this.state.visible ? `visibility_off`:`visibility` }</i>{this.state.visible ? `Hide password` : `Show password`}</span>
                                        {/* <input type="checkbox" onClick={this.toggle}/> <label style={{fontSize:'14px'}}>Show password</label> */}

                                    </div>

                                    <div className="submit">
                                       {/*  <p>Don't have an account? <Link to="/register" >Register</Link></p> */}
                                        <button className="button is-success "  onClick={this.handlesubmit}>Login</button>
                                    </div>
                                 
                                    <Link onClick={this.openPasswordModal} style={{ color: '#48c774' }}>Forgot password?</Link>
                                   {/*  <hr /> */}
                                    {/* <Link to="/" style={{ color: '#48c774' }}>Home</Link> */}
                                    {/* <Link to="/admin_login" style={{ color: '#48c774' }}>Admin Login</Link> */}

                                </div>
                            </div>

                            <div className="column">
                                <div className="title has-text-white">References</div>
                                <li> <a href={regularpdf} target="_blank" className="has-text-white">How to fill Regular Exam Form</a></li>
                                <li> <a href={pdf} target="_blank" className="has-text-white">How to fill KT Exam Form</a></li>
                               
                                
                            </div>
                        </div>
                    </div>

               

                </div>
                <Footer/>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.errors
});

export default connect(mapStateToProps, { login })(Login);
