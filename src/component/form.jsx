import React, { Component } from 'react'
import Header from '../pages/Header'
import _ from 'lodash'
import Footer from './Footer'
import { connect } from 'react-redux'
import PropTypes from "prop-types"
import { HashLink as Link } from 'react-router-hash-link';
import { logout } from '../actions/auth';
import $ from "jquery";
import { Ripple } from '@progress/kendo-react-ripple';
import { toast } from 'react-toastify';
import { serverip } from '../actions/serverip'
import 'react-toastify/dist/ReactToastify.css';
import { Checkbox } from '@progress/kendo-react-inputs';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';


var myarray = []
let mysem = []
export class form extends Component {

    static propTypes = {
        logout: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,

    }


    constructor(props) {
        super(props);
        const { user } = this.props.auth
        const thisYear = (new Date()).getFullYear();
        this.state = {
            freezelink: '',
            finalcourse: '',
            data: '',
            internal: false,
            ktdata: '',
            profile: '',
            ktprofile: '',
            deletechoices: '',
            myelective: '',
            thisYear: thisYear,
            step: 1,
            isDropout: '',
            credentials: { revscheme: '', email: `${user.email}`, studentType: '', semester: '', branch: '', elective: '', studentname: `${user.first_name}`, surname: `${user.last_name}`, fathername: '', mothername: '', gender: '', address: '', year: `${thisYear}`, session: '', dob: new Date(), rollno: `${user.username}`, ktsemester: '', studentphone: null, parentphone: null },
            error: { studentname: '', surname: '', fathername: '', mothername: '', gender: '', address: '', year: '', session: '', rollno: '', dob: '', branch: '', semester: '', email: '', studentphone: null, parentphone: null },
        }


    }

    branches = ['Computer', 'Mechanical', 'Electrical', 'IT', 'Extc']
    semesters = [3, 4, 5, 6]

    successfull = () => {
        toast.success("Form submitted!", {
            autoClose: 3000,
            position: toast.POSITION.BOTTOM_RIGHT,
        })
    }
    unsuccessfull = () => {
        toast.error("Form submission failed! There may be some unmet requirements", {
            autoClose: 5000,
            position: toast.POSITION.BOTTOM_RIGHT,
        })
    }
    stopLoader = () => {
        $('.pageloader').removeClass('is-active')
    }

    jqccOnClick = () => {
        let choices = {}
        const { user } = this.props.auth
        var tableControl = document.getElementById('mytable');
        const branch = this.state.credentials.branch
        const semester = this.state.credentials.semester
        const internal = this.state.internal
        const ktsemester = this.state.credentials.ktsemester
        if (this.state.credentials.studentType == 'KT') {
            choices = $('input:checkbox:checked', tableControl).map(function () {
                return {
                    id: `${$(this).closest('tr').find('td:nth-child(1)').text()}${user.username}KT`,
                    branch: branch,
                    semester: ktsemester,
                    student: `${user.username}KT${ktsemester}`,
                    start_time: '00:00',
                    end_time: '00:00',
                    ktsubject: `${$(this).closest('tr').find('td:nth-child(2)').text()}${internal ? '(Internal)' : ''}`,
                    code: `${internal ? 'INT' : ''}${$(this).closest('tr').find('td:nth-child(1)').text()}`,
                    date: $(this).closest('tr').find('td:nth-child(3)').text(),
                    isKt: true,
                    isDropout: true
                }
            }).get();
            for (var i = 0; i < choices.length; i++) {
                //check if same subj code exists in selected subj list, if yes don't add
                if (myarray.some(item => item.code === choices[i].code)) {
                    toast.error(`Subject already added!`, {
                        autoClose: 2000,
                        position: toast.POSITION.TOP_CENTER,
                    })

                }
                else {                   //else add to selected list
                    myarray.push(choices[i])
                    mysem.push(choices[i].semester)
                }

            }
            mysem = _.uniq(mysem, true)
            console.log(myarray)
            this.setState({
                ktchoices: choices,
                mychoices: myarray,
                mysem: mysem
            })
        } else {
            choices = ($('input:checkbox:checked', tableControl)).map(function () {

                /*  arrayOfValues.push($(this).closest('tr').find('td:last').text()); */
                return {
                    branch: this.state.credentials.branch,
                    student: `${user.first_name}${user.last_name}${branch}${semester}${user.username}KT`,
                    ktsubject: $(this).closest('tr').find('td:nth-child(2)').text(),
                    code: $(this).closest('tr').find('td:nth-child(1)').text(),
                    date: $(this).closest('tr').find('td:nth-child(3)').text(),
                    isKt: true,
                }
            }).get();
            console.log(choices)

            for (var i = 0; i < choices.length; i++) {
                myarray.push(choices[i])
            }
            console.log(myarray)
            this.setState({
                ktchoices: choices
            })
        }
        $('input[type="checkbox"]:checked').prop('checked', false);
    }



    componentDidMount = () => {


        //get control status
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
            this.setState({ studentPortal: data.studentPortal })
        })

        //get student profile; contains all regular as well as kt data
        const { user } = this.props.auth;
        fetch(`${serverip}/student/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
        }).then(response => {
            console.log("ok");
            return response.json()
        })
            .then(data => {
                console.log(data)

                var regular = data.filter(x => x.studentType === 'Regular');
                if (!_.isEmpty(regular)) {
                    this.setState({ filled: true, profile: regular[0], isRegular: true })
                }

                //check if KT3 exists
                var kt3 = data.filter(x => x.id.includes("KT3"));
                if (!_.isEmpty(kt3)) {
                    this.setState({ kt3filled: true, kt3profile: kt3[0] })
                }

                //check if KT4 exists
                var kt4 = data.filter(x => x.id.includes("KT4"));
                if (!_.isEmpty(kt4)) {
                    this.setState({ kt4filled: true, kt4profile: kt4[0] })
                }

                //check if KT5 exists
                var kt5 = data.filter(x => x.id.includes("KT5"));
                if (!_.isEmpty(kt5)) {
                    this.setState({ kt5filled: true, kt5profile: kt5[0] })
                }

                //check if KT6 exists
                var kt6 = data.filter(x => x.id.includes("KT6"));
                if (!_.isEmpty(kt6)) {
                    this.setState({ kt6filled: true, kt6profile: kt6 })
                }


            })
            .catch(function (error) {
                console.log(error);
            });

    }

    handleInternalChange = async (e) => {
        this.setState({ internal: !this.state.internal });
        console.log(e.target.value)
    }


    handleChangeKT = async (e) => {
        const cred = this.state.credentials
        cred[e.target.name] = e.target.value;
        this.setState({
            credentials: cred,
        })
        const semester = this.state.credentials.ktsemester;
        const branch = this.state.credentials.branch;
        const scheme = this.state.credentials.revscheme;
        const api_call = await fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
        });
        const response = await api_call.json();
        console.log(response)
        let newdata = []
        response.map(i => {
            if (i.code.includes('INT')) {
                return
            }
            else {
                newdata.push(i)
            }
        })
        console.log(newdata)
        this.setState({
            ktdata: newdata,
            semester: this.state.credentials.ktsemester
        })

    }

    handleChange = async (e) => {
        const cred = this.state.credentials
        cred[e.target.name] = e.target.value;
        this.setState({
            credentials: cred,
            selectedElective: cred.elective,
        })

        console.log(cred)

        const semester = this.state.credentials.semester;
        const branch = this.state.credentials.branch;
        const scheme = this.state.credentials.revscheme;

        if (semester == 5 || semester == 6) {
            this.setState({ isElective: true })
        }
        else {
            this.setState({ isElective: false })
        }
        const api_call = await fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
        });
        const response = await api_call.json();
        this.setState({
            data: response,
            mockData: response
        })
        var nonelectives = this.state.data.filter(x => x.isElective === false);
        console.log(nonelectives);
        this.setState({
            nonelectives: nonelectives,
        })

        var electives = this.state.data.filter(x => x.isElective === true);
        console.log(electives);
        this.setState({
            electives: electives,
        })
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].course == this.state.selectedElective) {
                this.setState({
                    myelective: this.state.data[i],
                    finalcourse: nonelectives.concat(this.state.data[i])
                })

            }
        }

        if (this.state.credentials.studentType === 'Dropout') {
            this.setState({ isDropout: true })
        }
        else {
            this.setState({ isDropout: false })
        }


        console.log(this.state.data)
    }


    register = async (e) => {
        const branch = this.state.credentials.branch
        const semester = this.state.credentials.semester
        const { user } = this.props.auth;
        let form_data = new FormData();

        if (this.state.credentials.studentType === 'Regular') {
            form_data.append('studentType', 'Regular')
            form_data.append('semester', this.state.credentials.semester)
            form_data.append('rollno', user.username);
            form_data.append('id', `${user.username}`);
            form_data.append('elective', this.state.credentials.elective);
            form_data.append('email', this.state.credentials.email);
            form_data.append('studentphone', this.state.credentials.studentphone);
            form_data.append('parentphone', this.state.credentials.parentphone);
            form_data.append('studentname', user.first_name);
            form_data.append('surname', user.last_name);
            form_data.append('fathername', this.state.credentials.fathername);
            form_data.append('mothername', this.state.credentials.mothername);
            form_data.append('gender', this.state.credentials.gender);
            form_data.append('address', this.state.credentials.address);
            form_data.append('year', this.state.credentials.year);
            form_data.append('session', this.state.credentials.session);
            form_data.append('branch', this.state.credentials.branch);
            form_data.append('dob', this.state.credentials.dob);
            form_data.append('scheme', this.state.credentials.revscheme);
            form_data.append('ktsemester', this.state.credentials.ktsemester);
            e.preventDefault()
            fetch(`${serverip}/student/`, {
                method: 'POST',
                headers: {
                    /* 'Content-Type': 'multipart/form-data', */
                    'Authorization': `Token ${this.props.auth.token}`
                },
                body: form_data
            })
                .then(data => data.json())
                .then(
                    data => {
                        this.setState({
                            error: data,
                        })
                        if (this.state.error.msg) {
                            { this.successfull() }
                            /* setTimeout("location.href = '/form';", 2000) */
                        }
                        else if (this.state.credentials.studentType !== 'Dropout') {
                            { this.unsuccessfull() }
                        }
                    })
                .catch(error => console.log(error))

        }


        if (this.state.credentials.studentType === 'KT') {

            for (let i = 0; i < this.state.mysem.length; i++) {
                let ktform_data = new FormData();
                const semester = this.state.mysem[i]
                ktform_data.append('id', `${user.username}KT${semester}`)
                ktform_data.append('studentType', 'KT');
                ktform_data.append('elective', '');
                ktform_data.append('email', this.state.credentials.email);
                ktform_data.append('studentphone', this.state.credentials.studentphone);
                ktform_data.append('parentphone', this.state.credentials.parentphone);
                ktform_data.append('studentname', user.first_name);
                ktform_data.append('surname', user.last_name);
                ktform_data.append('fathername', this.state.credentials.fathername);
                ktform_data.append('mothername', this.state.credentials.mothername);
                ktform_data.append('gender', this.state.credentials.gender);
                ktform_data.append('address', this.state.credentials.address);
                ktform_data.append('year', this.state.credentials.year);
                ktform_data.append('session', this.state.credentials.session);
                ktform_data.append('rollno', `${user.username}`);
                ktform_data.append('branch', this.state.credentials.branch);
                ktform_data.append('semester', semester);
                ktform_data.append('dob', this.state.credentials.dob);
                ktform_data.append('scheme', this.state.credentials.revscheme);
                e.preventDefault()
                fetch(`${serverip}/student/`, {
                    method: 'POST',
                    headers: {
                        /* 'Content-Type': 'multipart/form-data', */
                        'Authorization': `Token ${this.props.auth.token}`
                    },
                    body: ktform_data
                })
                    .then(data => data.json())
                    .then(
                        data => {
                            this.setState({
                                error: data,
                            })
                            if (this.state.error.msg) {
                                { this.successfull() }
                                /* setTimeout("location.href = '/form';", 2000) */
                            }
                            else {
                                { this.unsuccessfull() }
                            }
                        })
                    .catch(error => console.log(error))
                    .then(() => {
                        console.log(this.state.mychoices.length)
                        for (var i = 0; i < this.state.mychoices.length; i++) {
                            fetch(`${serverip}/ktsubjects/`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Token ${this.props.auth.token}`
                                },
                                body: JSON.stringify(this.state.mychoices[i])
                            })
                                .then(data => data.json())
                                .then(() => (
                                    console.log('successfull')

                                ))
                                .catch(err => console.log(err))
                        }
                    })
            }

        }
    }

    renderBranchSemester = () => {
        if (this.state.credentials.studentType == 'Regular') {
            return (
                <div className="column box">
                    <div className="title">Current semester details</div>
                    <div className="field" style={{ maxWidth: '400px' }}>
                        <label htmlFor="d1" className="label">Branch:</label>
                        <div className="select">
                            <select onChange={this.handleChange} name="branch">
                                <option>Select Branch</option>
                                <option >Computer</option>
                                <option >Mechanical</option>
                                <option >Electrical</option>
                                <option >Extc</option>
                                <option>IT</option>
                            </select>
                        </div>
                    </div>
                    <div className="field" style={{ maxWidth: '400px' }}>
                        <label htmlFor="d1" className="label">Semester:</label>
                        <div className="select">
                            <select onChange={this.handleChange} name="semester">
                                <option>Select Semester</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                            </select>
                        </div>
                    </div>
                    <div className="field">
                        {this.state.credentials.semester == 5 || this.state.credentials.semester == 6 ?
                            <div className="field" style={{ maxWidth: '400px' }}>
                                <label htmlFor="d1" className="label">Elective:</label>
                                <div className="select">
                                    <select onChange={this.handleChange} name="elective">
                                        <option>Select Elective</option>
                                        {this.state.electives.map((item) => <option value={item.course}>{item.course}</option>)}
                                    </select>
                                </div>
                            </div> : null
                        }
                    </div>

                </div>
            )
        }
        else if (this.state.credentials.studentType === 'KT') {
            return (
                <div className="column box">
                    <div className="title">KT Branch Details</div>
                    <div className="field" style={{ maxWidth: '400px' }}>
                        <label htmlFor="d1" className="label">Branch:</label>
                        <div className="select">
                            <select onChange={this.handleChange} name="branch">
                                <option>Select Branch</option>
                                <option >Computer</option>
                                <option >Mechanical</option>
                                <option >Electrical</option>
                                <option >Extc</option>
                                <option>IT</option>
                            </select>
                        </div>
                    </div>
                    {/* <div className="field" style={{ maxWidth: '300px' }}>
                        <label htmlFor="d1" className="label">KT in Semester:</label>
                        <div className="select">
                            <select onChange={this.handleChangeKT} name="ktsemester">
                                <option>Select Semester</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                            </select>
                        </div>
                    </div> */}
                </div>
            )
        }
    }
    renderKtDetails = () => {
        if (this.state.credentials.studentType == 'KT') {
            return (<div style={{ marginTop: '20px' }}>

                <div className="title" style={{ color: 'white' }}>KT Semester Details</div>
                <div className="field ml-2" style={{ maxWidth: '300px' }}>
                    <label htmlFor="d1" style={{ color: 'white' }}>KT in Semester:</label>
                    <div className="select">
                        <select onChange={this.handleChangeKT} name="ktsemester">
                            <option>Select Semester</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                        </select>
                    </div>
                </div>
            </div>)
        }
    }
    removeOnClick = () => {
        let deletechoices = this.state.deletechoices;
        let choices = this.state.mychoices;
        if (deletechoices.length > 0) {
            for (var i = 0; i < choices.length; i++) {
                for (var j = 0; j < deletechoices.length; j++) {
                    if (choices[i].code == deletechoices[j].code) {
                        console.log(`${choices[i].ktsubject} deleted`)
                        let index = choices.findIndex(x => x.code === deletechoices[j].code)
                        choices.splice(index, 1)
                    }
                }
            }
        }
        else {
            const error = () => {
                toast.error(`Select Subjects!`, {
                    autoClose: 2000,
                    position: toast.POSITION.BOTTOM_RIGHT,
                })
            }
            { error() }
        }
        console.log(choices)
        this.setState({ choices, deletechoices: '' })
        $('input[type="checkbox"]:checked').prop('checked', false);
    }
    onDeleteChange = () => {
        let deletechoices = []
        const { user } = this.props.auth
        const arrayOfValues = []
        let finallist = []
        const branch = this.state.credentials.branch
        const semester = this.state.credentials.semester
        const ktsemester = this.state.credentials.ktsemester
        const choices = this.state.mychoices
        var tableControl = document.getElementById('deletetable');
        $('input:checkbox:checked', tableControl).map(function () {
            deletechoices = $('input:checkbox:checked', tableControl).map(function () {
                return {
                    code: $(this).closest('tr').find('td:nth-child(1)').text(),

                }
            }).get();
        })
        console.log(choices)
        console.log(deletechoices)
        this.setState({
            deletechoices: deletechoices
        })
    }
    renderKtSubjects = () => {
        if (this.state.credentials.studentType == 'KT') {
            return (

                <div className="columns is-gap-8">
                    <div className="column box" style={{ marginBottom: '10px' }}>
                        <div className="title">{`Subjects of ${this.state.credentials.branch} , Semester ${this.state.credentials.ktsemester}`}</div>
                        Internal <input type="checkbox" name="examtype" onChange={this.handleInternalChange} checked={this.state.internal} />
                        <p className="help" style={{ animation: 'none' }}>If subjects are not appearing try selecting the KT semester again</p>
                        <table id="mytable" width="100%" className="table">
                            <tbody>
                                <tr>
                                    <th>Code</th>
                                    <th>Subject</th>
                                    <th>Date</th>
                                </tr>
                                {this.state.ktdata ? (
                                    this.state.ktdata.map(x =>
                                        <tr>
                                            <td>{x.code}</td>
                                            <td width="50%">{x.course}</td>
                                            <td width="50%">{x.date}</td>
                                            <td><input id="cb1" type="checkbox" name="checker1" /></td>
                                        </tr>
                                    )
                                ) : null}
                            </tbody>
                        </table>
                        <button className="button is-success" onClick={this.jqccOnClick}>Add</button>
                    </div>
                    <div className="column box">
                        <div className="title">Selected KT Subjects </div>
                        <table id="deletetable " width="100%" onChange={this.onDeleteChange} className="table">
                            <tbody>
                                {this.state.ktchoices ? (
                                    this.state.mychoices.map(x =>
                                        <tr>
                                            <td >{x.code}</td>
                                            <td>{x.ktsubject}</td>
                                            <td>{x.date}</td>
                                            <td><input id="cb1" type="checkbox" name="checker1" /></td>
                                        </tr>
                                    )
                                ) : null}
                            </tbody>
                        </table>
                        <button className="button is-danger" onClick={this.removeOnClick}>Delete</button>
                    </div>
                </div>



            )
        }
    }
    renderSelectedCourses = () => {
        if (this.state.credentials.studentType == 'Regular') {
            return (
                <div>
                    <div className="columns">
                        <div className="column box " >
                            <div className="title">Your selected subjects</div>
                            <Grid
                                className='css'
                                editField="inEdit"
                                onRowClick={this.rowClick}
                                onItemChange={this.itemChange}
                                style={{ maxWidth: "600px", margin: '0 auto', marginTop: '20px' }}
                                data={this.state.isElective && this.state.finalcourse ? this.state.finalcourse.map((item) =>
                                    ({ ...item })
                                ) : this.state.data.map((item) =>
                                    ({ ...item })
                                )}
                            >
                                <Column field="code" title="Code" editable={false} />
                                <Column field="course" title="Course" editor="text" editable={false} />
                                <Column field="date" name='date' value={this.state.data.date} title="Date" editable={false} />
                            </Grid>
                        </div>
                    </div>
                </div>
            )
        }
        if (this.state.credentials.studentType === 'KT') {
            return (
                <div>

                    <div className="columns" style={{ backgroundColor: 'white', borderRadius: '5px', padding: '1em' }}>
                        <div className="column" >
                            <div className="title">KT subjects selected</div>
                            <Grid
                                className='kts'
                                editField="inEdit"
                                onRowClick={this.rowClick}
                                onItemChange={this.itemChange}
                                style={{ maxWidth: "600px", margin: '0 auto', marginTop: '20px', background: '#ff3a3af3' }}
                                data={this.state.mychoices}
                            >
                                <Column field="code" title="Code" width="100%" editable={false} />
                                <Column field="ktsubject" title="Course" editor="text" editable={false} />
                                <Column field="date" name='date' width="100%" value={this.state.data.date} title="Date" editable={false} editor='text' />
                            </Grid>
                        </div>
                    </div>
                </div>
            )
        }
    }

    openCity(evt, cityName) {
        const credentials = { ...this.state.credentials }
        credentials.revscheme = ''
        credentials.branch = ''
        credentials.semester = ''
        this.setState({ credentials })

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

    renderRegularForm = () => {
        const { user } = this.props.auth
        const minOffset = 0;
        const profile = this.state.profile;
        const ktprofile = this.state.kt3profile;
        const maxOffset = 2;
        const { thisYear } = this.state;
        const options = [];
        for (let i = minOffset; i <= maxOffset; i++) {
            const year = thisYear + i;
            options.push(<option value={year}>{year}</option>);
        }
        if (this.state.filled) {
            return (
                <div className="hero first">
                    {this.stopLoader()}
                    <div className="section" >
                        <div className="container form-filled">
                            <div id="status" className="title " style={{ color: 'white', display: 'flex', alignItems: 'center' }}>{profile && this.state.isRegular == true ? (<div>{`Current Exam Form filled`}<span class="material-icons has-text-white  ml-2"> done_all</span></div>) : null}</div>
                            <div className="notification is-light is-success">
                                <p>Hallticket can be downloaded once the admin has verified your form and generated seat number. Print hallticket tab will be activated later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    <div className="subtitle" style={{ color: 'white' }}>Complete the following 3 steps to submit your form</div><br />
                    <div className="title" style={{ color: 'white' }}><span className="tag is-success is-rounded is-large"> Step 1</span> Current Semester Details</div>
                    <div className="columns">
                        <div className="column box">
                            <div className="title"> Revision Scheme</div>
                            <Ripple>
                                <div className="field">
                                    <div className="control">
                                        <label className="k-radio-label" htmlFor="label2012"><input type="radio" onChange={this.handleChange} id="label2012" name="revscheme" value="2012" className="k-radio" />Revised A Scheme (2012)</label>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <label className="k-radio-label" htmlFor="label2016"><input type="radio" onChange={this.handleChange} id="label2016" name="revscheme" value="2016" className="k-radio" />Revision B Scheme (2016)</label>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <label className="k-radio-label" htmlFor="label2019"><input type="radio" onChange={this.handleChange} id="label2019" name="revscheme" value="2019" className="k-radio" />Revised C Scheme (2019)</label>
                                    </div>
                                </div>
                            </Ripple>
                        </div>
                        {this.state.credentials.revscheme ? (
                            <div className="column box">
                                <div className="title"> Filling form for</div>
                                <Ripple>
                                    <div className="field">
                                        <div className="control" >
                                            <label className="k-radio-label" htmlFor="c1"><input type="radio" onChange={this.handleChange} id="c1" name="studentType" value="Regular" className="k-radio" />Current Examination</label>
                                        </div>
                                    </div>
                                    {/* <div className="field">
                                        <div className="control">
                                            <label className="k-radio-label" htmlFor="c2"><input type="radio" onChange={this.handleChange} id="c2" name="studentType" value="KT" className="k-radio" />KT</label>
                                        </div>
                                    </div> */}

                                </Ripple>
                            </div>
                        ) : null}
                        {/* third column */}
                        {this.renderBranchSemester()}
                    </div>
                    <div>
                    </div>
                    {this.renderSelectedCourses()}
                    <div>

                        <hr />
                        <div className="hero" >
                            <section className="section" >
                                <div className="container"  >
                                    <div className="title has-text-white" ><span className="tag is-success is-rounded is-large"> Step 3</span> Student Details</div>
                                    <div className="content">
                                        <div className="box" style={{ maxWidth: "500px", margin: '0 auto' }}>
                                            <div className="container" style={{ maxWidth: "300px", paddingBottom: "1em" }}>
                                                {/* <div class="field" style={{ background: "", display: "flex", alignItems: "center"}}> */}
                                                <div className="field">
                                                    <label className="label">Year</label>
                                                    <div className="select">
                                                        <select onChange={this.handleChange} value={this.selectedYear} name="year">
                                                            {options}
                                                        </select>
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.year ? <span>{this.state.error.year}</span> : null}
                                                    </div>
                                                </div>
                                                <div className="field">
                                                    <div className="control">
                                                        <label className="k-radio-label" htmlFor="r1"><input type="radio" name="session" value="SH" onChange={this.handleChange} className="k-radio" /> SH</label>
                                                        <span style={{ marginRight: '10px' }}></span>
                                                        <label className="k-radio-label" htmlFor="r2"><input type="radio" id="r2" name="session" onChange={this.handleChange} value="FH" className="k-radio" /> FH</label><br />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.session ? <span>Select a choice</span> : null}
                                                    </div>
                                                </div>
                                                <div className="field">
                                                    <label class="label">Date Of Birth</label>
                                                    <div className="control">
                                                        <input id="my-element" className="input" type="date" onChange={this.handleChange} name="dob" />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.dob ? <span><i className="fas fa-exclamation-circle"></i>Enter a date</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <div className="field">
                                                    <label class="label">Roll Number</label>
                                                    <div className="control">
                                                        {user ? <input disabled className="input" type="number" value={user.username} onChange={this.handleChange} name="rollno" placeholder="Roll Number" /> :
                                                            <input className="input" type="number" value={this.state.credentials.rollno} onChange={this.handleChange} name="rollno" placeholder="Roll Number" />}
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.rollno ? <span><i className="fas fa-exclamation-circle"></i>{this.state.error.rollno}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>

                                                <div class="field">
                                                    <label class="label">Student Name</label>
                                                    <div class="control">
                                                        {user ? <input className="input" disabled autoComplete="off" type="text" onChange={this.handleChange} name="studentname" value={user.first_name} placeholder="Student Name" /> :
                                                            <input className="input" disabled autoComplete="off" type="text" onChange={this.handleChange} name="studentname" value={this.state.credentials.studentname} placeholder="Student Name" />}
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.studentname ? <span>{this.state.error.studentname}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <div class="field">
                                                    <label class="label">Student's Email address</label>
                                                    <div class="control">
                                                        <input class="input" type="text" disabled autoComplete="off" onChange={this.handleChange} name="email" value={user.email} placeholder="Email address" />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.email ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.email}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <div class="field">
                                                    <label class="label">Student's Phone number</label>
                                                    <div class="control">
                                                        <input class="input" type="text" autoComplete="off" onChange={this.handleChange} name="studentphone" value={this.state.credentials.studentphone} placeholder="Student's Phone number" />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.studentphone ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.studentphone}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <div class="field">
                                                    <label class="label">Father's Name</label>
                                                    <div class="control">
                                                        <input class="input" type="text" autoComplete="off" onChange={this.handleChange} name="fathername" value={this.state.credentials.fathername} placeholder="Fathers' name" />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.fathername ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.fathername}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <div class="field">
                                                    <label class="label">Mother's Name</label>
                                                    <div class="control">
                                                        <input class="input" type="text" autoComplete="off" onChange={this.handleChange} name="mothername" value={this.state.credentials.mothername} placeholder="Mothers' name" />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.mothername ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.mothername}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <div class="field">
                                                    <label class="label">Parent's Phone number</label>
                                                    <div class="control">
                                                        <input class="input" type="text" autoComplete="off" onChange={this.handleChange} name="parentphone" value={this.state.credentials.parentphone} placeholder="Parent's Phone number" />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.parentphone ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.parentphone}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <Ripple>
                                                    <div className="field">
                                                        <label class="label">Gender</label>
                                                        <div class="control">
                                                            <label className="radio"><input type="radio" onChange={this.handleChange} value="M" className="k-radio" name="gender" /> Male</label>
                                                            <label className="radio"><input type="radio" onChange={this.handleChange} value="F" className="k-radio" name="gender" /> Female</label>
                                                        </div>
                                                        <div className="help is-danger">
                                                            {this.state.error.gender ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.gender}</span> : null}
                                                        </div>
                                                    </div>
                                                </Ripple>
                                                <div class="field">
                                                    <label class="label">Address</label>
                                                    <div class="control">
                                                        <textarea class="textarea" autoComplete="off" value={this.state.credentials.address} name="address" onChange={this.handleChange} placeholder="Address"></textarea>
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.address ? <span>{this.state.error.address}</span> : null}
                                                    </div>
                                                </div>
                                                <div className="field is-grouped is-grouped-centered">
                                                    <button className="button is-success" onClick={this.register}>Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>


                    </div>
                </div>
            )
        }
    }

    renderKTForm = () => {
        const { user } = this.props.auth
        const minOffset = 0;
        const profile = this.state.profile;
        const ktprofile = this.state.kt3profile;
        const maxOffset = 2;
        const { thisYear } = this.state;
        const options = [];
        for (let i = minOffset; i <= maxOffset; i++) {
            const year = thisYear + i;
            options.push(<option value={year}>{year}</option>);
        }
        if (this.state.kt3filled || this.state.kt4filled || this.state.kt5filled || this.state.kt6filled) {
            return (
                <div className="hero first">
                    {this.stopLoader()}
                    <div className="section" >
                        <div className="container form-filled">
                            <div id="status" className="title " style={{ color: 'white', display: 'flex', alignItems: 'center' }}>{`KT Exam Form filled`}<span class="material-icons material-icons has-text-white  ml-2"> done_all</span></div>
                            <div className="notification is-light is-success">
                                <p>Hallticket can be downloaded once the admin has verified your form and generated seat number. Print hallticket tab will be activated later.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    <div className="subtitle" style={{ color: 'white' }}>Complete the following 3 steps to submit your form</div><br />
                    <div className="title" style={{ color: 'white' }}><span className="tag is-success is-rounded is-large"> Step 1</span> Current Semester Details</div>
                    <div className="columns">
                        <div className="column box">
                            <div className="title"> Revision Scheme</div>
                            <Ripple>
                                <div className="field">
                                    <div className="control">
                                        <label className="k-radio-label" htmlFor="label2012"><input type="radio" onChange={this.handleChange} id="label2012" name="revscheme" value="2012" className="k-radio" />Revised A Scheme (2012)</label>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <label className="k-radio-label" htmlFor="label2016"><input type="radio" onChange={this.handleChange} id="label2016" name="revscheme" value="2016" className="k-radio" />Revision B Scheme (2016)</label>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <label className="k-radio-label" htmlFor="label2019"><input type="radio" onChange={this.handleChange} id="label2019" name="revscheme" value="2019" className="k-radio" />Revised C Scheme (2019)</label>
                                    </div>
                                </div>
                            </Ripple>
                        </div>
                        {this.state.credentials.revscheme ? (
                            <div className="column box">
                                <div className="title"> Filling form for</div>
                                <Ripple>
                                    {/* <div className="field">
                                        <div className="control" >
                                            <label className="k-radio-label" htmlFor="c1"><input type="radio" onChange={this.handleChange} id="c1" name="studentType" value="Regular" className="k-radio" />Current Examination</label>
                                        </div>
                                    </div> */}
                                    <div className="field">
                                        <div className="control">
                                            <label className="k-radio-label" htmlFor="c2"><input type="radio" onChange={this.handleChange} id="c2" name="studentType" value="KT" className="k-radio" />KT</label>
                                        </div>
                                    </div>

                                </Ripple>
                            </div>
                        ) : null}
                        {/* third column */}
                        {this.renderBranchSemester()}
                    </div>
                    <div>
                    </div>
                    <span style={{ display: 'flex' }}><span className="tag is-success is-large is-rounded" style={{ marginRight: '10px' }}>Step 2 </span> </span>
                    {this.renderKtDetails()}
                    {this.renderKtSubjects()}
                    {this.renderSelectedCourses()}
                    <div>

                        <hr />
                        <div className="hero" >
                            <section className="section" >
                                <div className="container"  >
                                    <div className="title has-text-white" ><span className="tag is-success is-rounded is-large"> Step 3</span> Student Details</div>
                                    <div className="content">
                                        <div className="box" style={{ maxWidth: "500px", margin: '0 auto' }}>
                                            <div className="container" style={{ maxWidth: "300px", paddingBottom: "1em" }}>
                                                {/* <div class="field" style={{ background: "", display: "flex", alignItems: "center"}}> */}
                                                <div className="field">
                                                    <label className="label">Year</label>
                                                    <div className="select">
                                                        <select onChange={this.handleChange} value={this.selectedYear} name="year">
                                                            {options}
                                                        </select>
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.year ? <span>{this.state.error.year}</span> : null}
                                                    </div>
                                                </div>
                                                <div className="field">
                                                    <div className="control">
                                                        <label className="k-radio-label" htmlFor="r1"><input type="radio" name="session" value="SH" onChange={this.handleChange} className="k-radio" /> SH</label>
                                                        <span style={{ marginRight: '10px' }}></span>
                                                        <label className="k-radio-label" htmlFor="r2"><input type="radio" id="r2" name="session" onChange={this.handleChange} value="FH" className="k-radio" /> FH</label><br />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.session ? <span>Select a choice</span> : null}
                                                    </div>
                                                </div>
                                                <div className="field">
                                                    <label class="label">Date Of Birth</label>
                                                    <div className="control">
                                                        <input id="my-element" className="input" type="date" onChange={this.handleChange} name="dob" />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.dob ? <span><i className="fas fa-exclamation-circle"></i>Enter a date</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <div className="field">
                                                    <label class="label">Roll Number</label>
                                                    <div className="control">
                                                        {user ? <input disabled className="input" type="number" value={user.username} onChange={this.handleChange} name="rollno" placeholder="Roll Number" /> :
                                                            <input className="input" type="number" value={this.state.credentials.rollno} onChange={this.handleChange} name="rollno" placeholder="Roll Number" />}
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.rollno ? <span><i className="fas fa-exclamation-circle"></i>{this.state.error.rollno}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>

                                                <div class="field">
                                                    <label class="label">Student Name</label>
                                                    <div class="control">
                                                        {user ? <input className="input" disabled autoComplete="off" type="text" onChange={this.handleChange} name="studentname" value={user.first_name} placeholder="Student Name" /> :
                                                            <input className="input" disabled autoComplete="off" type="text" onChange={this.handleChange} name="studentname" value={this.state.credentials.studentname} placeholder="Student Name" />}
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.studentname ? <span>{this.state.error.studentname}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <div class="field">
                                                    <label class="label">Student's Email address</label>
                                                    <div class="control">
                                                        <input class="input" type="text" disabled autoComplete="off" onChange={this.handleChange} name="email" value={user.email} placeholder="Email address" />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.email ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.email}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <div class="field">
                                                    <label class="label">Student's Phone number</label>
                                                    <div class="control">
                                                        <input class="input" type="text" autoComplete="off" onChange={this.handleChange} name="studentphone" value={this.state.credentials.studentphone} placeholder="Student's Phone number" />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.studentphone ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.studentphone}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <div class="field">
                                                    <label class="label">Father's Name</label>
                                                    <div class="control">
                                                        <input class="input" type="text" autoComplete="off" onChange={this.handleChange} name="fathername" value={this.state.credentials.fathername} placeholder="Fathers' name" />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.fathername ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.fathername}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <div class="field">
                                                    <label class="label">Mother's Name</label>
                                                    <div class="control">
                                                        <input class="input" type="text" autoComplete="off" onChange={this.handleChange} name="mothername" value={this.state.credentials.mothername} placeholder="Mothers' name" />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.mothername ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.mothername}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <div class="field">
                                                    <label class="label">Parent's Phone number</label>
                                                    <div class="control">
                                                        <input class="input" type="text" autoComplete="off" onChange={this.handleChange} name="parentphone" value={this.state.credentials.parentphone} placeholder="Parent's Phone number" />
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.parentphone ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.parentphone}</span> : null}
                                                    </div>
                                                    {/* <p class="help is-success">This username is available</p> */}
                                                </div>
                                                <Ripple>
                                                    <div className="field">
                                                        <label class="label">Gender</label>
                                                        <div class="control">
                                                            <label className="radio"><input type="radio" onChange={this.handleChange} value="M" className="k-radio" name="gender" /> Male</label>
                                                            <label className="radio"><input type="radio" onChange={this.handleChange} value="F" className="k-radio" name="gender" /> Female</label>
                                                        </div>
                                                        <div className="help is-danger">
                                                            {this.state.error.gender ? <span><i className="fas fa-exclamation-circle"></i> {this.state.error.gender}</span> : null}
                                                        </div>
                                                    </div>
                                                </Ripple>
                                                <div class="field">
                                                    <label class="label">Address</label>
                                                    <div class="control">
                                                        <textarea class="textarea" autoComplete="off" value={this.state.credentials.address} name="address" onChange={this.handleChange} placeholder="Address"></textarea>
                                                    </div>
                                                    <div className="help is-danger">
                                                        {this.state.error.address ? <span>{this.state.error.address}</span> : null}
                                                    </div>
                                                </div>
                                                <div className="field is-grouped is-grouped-centered">
                                                    <button className="button is-success" onClick={this.register}>Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        if (!this.state.studentPortal) {
            return (

                <div className="title has-text-white">Form filling has been stopped by admin.</div>

            )
        }

        return (
            <div >
                <Header />
                 <div class="pageloader is-active"><span class="title" style={{ fontSize: '2em' }}></span></div>
                <div className="hero first">
                    <div className="section" >
                        <div className="container" style={{ width: '50%' }}>
                            <div className="hallticket-tabs" style={{ marginTop: '20px', marginBottom: '0px' }}>
                                <a href="javascript:void(0)" onClick={(event) => { this.openCity(event, 'regularform') }}>
                                    <div className="w3-third tablink w3-bottombar w3-padding is-active"><button className="has-text-white">Regular Form</button></div>
                                </a>
                                <a href="javascript:void(0)" onClick={(event) => { this.openCity(event, 'ktform') }}>
                                    <div className="w3-third tablink w3-bottombar  w3-padding"><button className="has-text-white">KT Form</button></div>
                                </a>
                            </div>
                        </div>
                        <div className=" w3-container city mt-6" id="regularform" style={{ display: 'block' }}>
                            {this.renderRegularForm()}
                        </div>

                        <div className=" w3-container city mt-6" id="ktform" style={{ display: 'none' }}>
                            {this.renderKTForm()}
                        </div>

                    </div>
                </div>
            </div >
        );
    }
    itemChange = (event) => {
        const inEditID = event.dataItem.code;
        const data = this.state.data.map(item =>
            item.code === inEditID ? { ...item, [event.field]: event.value } : item
        );
        this.setState({ data });
    };
}
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, { logout })(form)