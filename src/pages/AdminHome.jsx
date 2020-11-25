import React, { Component } from 'react';
import Header from './Header'
import { connect } from 'react-redux'
import qrcode from '../assets/qrcode.png';
import Footer from '../component/Footer'
import {serverip} from '../actions/serverip'
import $ from "jquery"
import PropTypes from "prop-types"
import { Link, Redirect } from 'react-router-dom'
import ReactTooltip from 'react-tooltip';
import { Switch } from '@progress/kendo-react-inputs'
import Timetable from '../component/Timetable'
import { logout } from '../actions/auth'

export class AdminHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filled: '',
            notice_msg: '',
            notice: '',
            freezelink: false,
            showtimetable: null,
            profile: '',
            data: [],
            credentials: { branch: '', semester: '', revscheme: null },
            sort: [
                { field: 'code', dir: 'asc' }
            ]
        }
    }

    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired
    }

    componentDidMount = () => {

        const { user } = this.props.auth

        

        //get halltkt switch status
        fetch(`${serverip}/controls/freezelink/`, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            }
        }).then(res => {
            console.log(res)
            return res.json()
        }).then(data => {
            console.log(data.freezelink)
            this.setState({ freezelink: data.freezelink, showtimetable: data.showtimetable })
        })

        

        //Get notice
        fetch(`${serverip}/notice/`, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            }
        }).then(res => res.json())
            .then(data => this.setState({ notice: data }))
    }

    handleTimeTableLinkChange = async (e) => {
        this.setState({ showtimetable: !this.state.showtimetable });
        console.log(e.target.value);
        fetch(`${serverip}/controls/freezelink/`, {
            method: "Put",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
            body: JSON.stringify({ showtimetable: `${!this.state.showtimetable}`, id: 'freezelink' })
        })
    }

    handleLinkChange = async (e) => {
        this.setState({ freezelink: !this.state.freezelink });
        console.log(e.target.value);
        fetch(`${serverip}/controls/freezelink/`, {
            method: "Put",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
            body: JSON.stringify({ freezelink: `${!this.state.freezelink}`, id: 'freezelink' })
        })
    }

    handlechange = e => {
        e.preventDefault();
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    sendNotice = () => {
        fetch(`${serverip}/notice/`, {
            method: "Post",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
            body: JSON.stringify({ notice: this.state.notice_msg })
        }).then(() => {
            { this.getNotice() }
        })
    }

    getNotice = () => {
        fetch(`${serverip}/notice/`, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            }
        }).then(res => res.json())
            .then(data => this.setState({ notice: data }))
    }

    jqccOnClick = () => {
        var tableControl = document.getElementById('mytable');
        let choices = {}
        choices = $('input:checkbox:checked', tableControl).map(function () {
            return {
                id: $(this).closest('tr').find('td:nth-child(1)').text(),
                notice: $(this).closest('tr').find('td:nth-child(2)').text(),
            }
        }).get();
        console.log(choices.length)
        for (var i = 0; i < choices.length; i++) {
            fetch(`${serverip}/notice/${choices[i].id}/`, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.props.auth.token}`
                },
            })
                .then(() => {
                    { this.getNotice() }
                })
        }
        $('input[type="checkbox"]:checked').prop('checked', false);
    }


    render() {
        console.log(this.props.auth.user.username)
        if (this.props.auth.user.username !== 'admin') {
            return <Redirect to="/" />
        }

        return (
            <div>
                <Header />

                <div className="columns">
                    <div className="column">
                        <div className="hero first">
                            <div className="section">
                                <div className="container">
                                    <div className="title has-text-white" style={{ fontSize: '3em' }}>Admin Panel</div>
                                    <marquee loop="infinite" behaviour="scroll" id="maq" scrollamount="15" scrolldelay="0">
                                        {this.state.notice.length > 0 ? this.state.notice.map((i, index) => {
                                            return <span style={{ margin: '0 1em' }} className="tag is-medium is-danger is-light "><span className="tag is-small is-danger mr-2">{index + 1}</span> {i.notice}</span>
                                        }) : <p>No notice from admin yet. Keep a watch in future.</p>}
                                    </marquee>

                                    <div className="box">
                                        <div className="title">Controls</div>
                                    <div className="field">
                                        <span style={{ marginRight: '10px' }}>Hallticket download Link: </span><Switch onChange={this.handleLinkChange} checked={this.state.freezelink} />
                                    </div>
                                    <div className="field">
                                        <span style={{ marginRight: '10px' }} >Time table visibility: </span><Switch onChange={this.handleTimeTableLinkChange} checked={this.state.showtimetable} />
                                    </div>
                                    </div>
                                    
                                    <div className="box">
                                        <div className="title">Create Notice</div>
                                        <div className="field ">
                                            <input type="text" className="input" name="notice_msg" onChange={this.handlechange} placeholder="Create new notice"/>
                                            <button className="button is-small is-success" onClick={this.sendNotice}>Create</button>
                                        </div>
                                        <div className="field ">
                                            <p>Present notices:</p>
                                            <table id="mytable" className="table" width="100%">
                                                <tr>
                                                    <th>Uid</th>
                                                    <th>Notice</th>
                                                    <th></th>
                                                </tr>
                                                {this.state.notice ? this.state.notice.map((i) => {
                                                    return <tr>
                                                        <td>{i.id}</td>
                                                        <td>{i.notice}</td>
                                                        <td><input id="cb1" type="checkbox" name="checker1" /></td>
                                                    </tr>
                                                }) : null}
                                            </table>
                                            <button className="button is-danger is-small" onClick={this.jqccOnClick}>Delete</button>
                                        </div>
                                    </div>

                                    <div className="box ">
                                        <div className="title">Security</div>

                                        <img src={qrcode} alt="" />
                                        <br />
                                        <button className="button is-success">Create new secret key</button>
                                    </div>


                                    
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="column">
                        <section className="hero first  " >
                            <div className="section">
                                <div className="container">
                                    <div className="title has-text-white" style={{ fontSize: '3em' }}>Time Table</div>
                                    <Timetable profile={this.state.profile} data={this.state.data} />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(AdminHome);
