import React, { Component } from 'react'
import GenerateTicket from './generateticket'
import Header from '../pages/Header'
import 'ag-grid-community/dist/styles/ag-grid.css';
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from "prop-types"
import { logout } from '../actions/auth'
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import Edit from './edit2'
import Hallticket from './generateSeatNo'
import Verification from './Verification'


export class AdminPanel extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,

    }


    editField = "inEdit";
    CommandCell;
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            credentials: { branch: '', semester: '', revscheme: null },

        };
    }

    showlog = () => {
        console.log(this.state.data)
        console.log(this.state.credentials)
        console.log(this.state.editID)
        console.log(this.getIndex(this.state.editID))
    }



    addRecord = () => {
        const { data } = this.state;
        const newRecord = { code: data.length + 1 };

        this.setState({
            data: [newRecord, ...data],
            editID: newRecord.code
        });
    };



    render() {
        const { data } = this.state;

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
        const { user } = this.props.auth;
        return (

            <div>
                {user && user.username === 'admin' ? (
                    <div>
                        <Header />
                        <div className="hero first" style={{borderBottom:'1px solid #efefef'}} >
                            <div className="section-small" style={{background:'transparent'}}>
                                <div className="container">
                                    <div className="tab">

                                        <a href="javascript:void(0)" onClick={(event) => { openCity(event, 'edit') }}>
                                            <div className="w3-third tablink w3-bottombar w3-hover-light-grey w3-padding is-active">Timetable</div>
                                        </a>
                                        <a href="javascript:void(0)" onClick={(event) => { openCity(event, 'generate') }}>
                                            <div className="w3-third tablink w3-bottombar w3-hover-light-grey w3-padding">Generate seat numbers</div>
                                        </a>
                                        <a href="javascript:void(0)" onClick={(event) => { openCity(event, 'verification') }}>
                                            <div className="w3-third tablink w3-bottombar w3-hover-light-grey w3-padding">Verification</div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="edit" className="w3-container city" style={{ display: 'block' }}>
                            <Edit />
                        </div>

                        <div id="generate" className="w3-container city" style={{ display: 'none' }}>
                            <Hallticket />
                        </div>
                        <div id="verification" className="w3-container city" style={{ display: 'none' }}>
                            <Verification />
                        </div>
                    </div>
                ) : (
                    <div>
                    <Header/>
                        <div className="hero first">
                            <div className="section">
                                <div className="title" style={{fontSize:'3em'}}>Not accessible by students.</div>
                                <Link to="/" style={{color:'#48c774'}}>Home</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
    generateId = data => data.reduce((acc, current) => Math.max(acc, current.code), 0) + 1;

    removeItem(data, item) {
        let index = data.findIndex(p => p === item || item.code && p.code === item.code);
        if (index >= 0) {
            data.splice(index, 1);
        }
    }
}
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(AdminPanel);
