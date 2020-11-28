import React, { Component } from 'react';
import Header from '../pages/Header';
import ReactDOM from 'react-dom';
import './styles/styles.css'
import dp from '../assets/dp.jpg'
import {serverip} from '../actions/serverip'
import { logout } from '../actions/auth'
import CsvParse from '@vtex/react-csv-parse'
import CSVReader from 'react-csv-reader'
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { connect } from 'react-redux'
import ReactFileReader from 'react-file-reader';
import $ from "jquery"
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import DuplicateHalltkt from './DuplicateHalltkt'

export class verification extends Component {

    static propTypes = {
        logout: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            image:'',
            ktstudentsubj: '',
            csvdata: [],
            credentials: { branch: '', semester: '', starting_seatno: undefined },
            profile: 'null'
        };
    }

    handleChange = async (e) => {

        const cred = this.state.credentials
        cred[e.target.name] = e.target.value;
        this.setState({
            credentials: cred,

        })

        console.log(cred)
        const api_call = await fetch(`${serverip}/student/?branch=${this.state.credentials.branch}&semester=${this.state.credentials.semester[0]}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            }
        });
        const response = await api_call.json();
        response.sort((a, b) => parseInt(a.rollno) - parseInt(b.rollno));
        this.setState({
            data: response
        })


    }

    exportPDFWithComponent = () => {
        this.pdfExportComponent.save()
    }

    duplicate = () => {
        const data = this.state.profile
        const user = this.props.auth
        let gender = data.gender
        if (gender == 'F') {
            gender = "Female"
        } else {
            gender = "Male"
        }
        let examsem = data.semester;
        if (examsem == 3 || examsem == 4) {
            examsem = 'Second Year Engineering'
        }
        else {
            examsem = 'Third Year Engineering'
        }
        let session = this.state.data.session;
        if (session == 'FH') {
            session = 'First Half';
        }
        else {
            session = 'Second Half'
        }
        return (
            <div style={{ position: "absolute", left: "-1000000px", top: 0 }}>
                <PDFExport
                    scale={0.5}
                    forcePageBreak=".page-break"
                    paperSize="A4"
                    margin="2cm"
                    fileName={user ? `Duplicate Hallticket:${data.studentname} ${data.surname}:Sem${data.semester}:(${data.session} ${data.year})` : null}
                    ref={(component) => this.pdfExportComponent = component}
                >
                    <DuplicateHalltkt
                        user={user}
                        data={this.state.profile}
                        examsem={examsem}
                        session={session}
                        courses={this.state.onlycourses}
                        studentelective={this.state.studentelective}
                        ktstudentsubj={this.state.ktstudentsubj}
                        exportPDFWithComponent={this.props.exportPDFWithComponent}
                    />
                </PDFExport>
            </div>
        )
    }

    ktStringRemover=(str)=>{
        var patt=new RegExp("KT");
        if(patt.test(String(str))){
            return String(str).slice(0,-3)
                
        }
        else{
            return str
        }
    }

    modalProfile = () => {
        const data = this.state.profile
        const user = this.props.auth
        let gender = data.gender
        if (gender == 'F') {
            gender = "Female"
        } else {
            gender = "Male"
        }
        var patt=new RegExp("KT");
        const studentImage=this.state.image

        return (
            <div>
                {data ? (<div>
                    <div class="modal not-active " style={{ zIndex: '100',display:'flex !important',height:'100%',margin:'auto' }}>
                    <div class="modal-background " onClick={this.closeProfile}></div>
                    <div class="modal-card profileModal">
                        <header class="modal-card-head">
                            <p class="modal-card-title">{data.studentname} {data.rollno}</p>

                            <button className="delete" aria-label="close" onClick={this.closeProfile}></button>
                        </header>
                        <section class="modal-card-body">
                            <div className="title">Academic Details</div>
                            <article className="media" style={{ marginRight: '20px' }}>
                                <div className="media-content">
                                    <table>
                                        <tr><th>Branch:</th><td>{data.branch}</td> </tr>
                                        <tr><th>Semester:</th><td>{data.semester}</td> </tr>
                                        <tr><th>Scheme:</th><td>{data.scheme}</td> </tr>
                                        <tr><th>Session:</th><td>{data.session}</td> </tr>
                                        <tr><th>Exam Type:</th><td>{data.studentType}</td> </tr>
                                        <tr><th>Seat no:</th><td>{data.seatNo}</td> </tr>
                                        <tr><th>Year of Exam:</th><td>{data.year}</td> </tr>
                                    </table>
                                    <br />
                                    {this.state.profile && this.state.ktstudentsubj && this.state.profile.studentType === 'KT' ? (<div>
                                        <p>{`KT subjects (Semester ${this.state.profile.semester})`}:</p>
                                        {this.state.ktstudentsubj.map(x => (
                                            <li key={x.id} style={{ listStyle: 'circle' }} >{x.course} on  {x.date}</li>
                                        ))}
                                    </div>) : null}
                                </div>
                                <div className="media-right">
                                    <figure className="image is-150x150">
                                        <img className="is-rounded" style={{ width: "150px", height: '150px', display: 'block', margin: 'auto', marginBottom: '10px' }} src={studentImage.image} alt="" />
                                    </figure>
                                </div>
                            </article>

                            <hr />
                            <div className="title">Personal Details</div>
                            <table>
                                <tr><th>Name:</th><td>{data.studentname} </td></tr>
                                <tr><th>Father's name:</th><td>{data.fathername} </td></tr>
                                <tr><th>Mother's Name:</th><td>{data.mothername} </td></tr>
                                <tr><th>Gender:</th><td>{gender} </td></tr>
                                <tr><th>Date of Birth:</th><td>{data.dob} </td></tr>
                                <tr><th>Address:</th><td>{data.address}</td></tr>
                                <tr><th>Student phone no:</th><td>{data.studentphone} </td></tr>
                                <tr><th>Parent phone no:</th><td>{data.parentphone} </td></tr>
                                <tr><th>Student Email:</th><td>{data.email}</td></tr>
                               
                            </table>
                            {this.duplicate()}
                        </section>
                        <footer class="modal-card-foot">
                            <button class="button is-success" onClick={this.verifyProfile}>Verify Form</button>
                            <button class="button is-danger" onClick={this.rejectProfile}>Reject Form</button>
                            <button class="button" onClick={this.exportPDFWithComponent}>Download Duplicate Hallticket</button>
                        </footer>
                    </div>
                </div>
                </div>) : null}

            </div>
        )
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


    openProfile = () => {
        const { user } = this.props.auth
        $(".modal").addClass("is-active")
        $(".modal").removeClass("not-active");
        let id = localStorage.getItem('test')
        this.setState({
            profileid: id
        })

        //get student image
        fetch(`${serverip}/api/image/${id}/`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
        }).then(res=>res.json())
        .then(data=>{
            this.setState({image:data})
        })

        //get student profile
        fetch(`${serverip}/student/${id}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
        }).then(res => { return res.json() })
            .then(data => { this.setState({ profile: data }) })
            .then(() => {
                const scheme = this.state.profile.scheme;
                const branch = this.state.profile.branch;
                const semester = this.state.profile.semester;
                fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${this.props.auth.token}`
                    },
                }).then(data => data.json())
                    .then(res => {
                        this.setState({ courses: res })
                        let ktcodes = []
                        console.log(Object.keys(this.state.profile).length)
                        if (Object.keys(this.state.profile).length > 1) {
                            for (let i = 0; i < this.state.profile.ktsubjects.length; i++) {
                                ktcodes.push(this.state.profile.ktsubjects[i].code)
                            }
                        }
                        console.log(ktcodes)
                        let ktstudent = []
                        for (let i = 0; i < ktcodes.length; i++) {
                            for (let j = 0; j < this.state.courses.length; j++) {
                                if (ktcodes[i] == this.state.courses[j].code) {
                                    ktstudent.push(this.state.courses[j])
                                    this.setState({ ktstudentsubj: ktstudent })
                                }
                            }
                        }
                        let onlyelectives = []
                        let onlycourses = []
                        const myelective = this.state.profile.elective;
                        console.log(myelective)
                        for (let i = 0; i < this.state.courses.length; i++) {
                            if (this.state.courses[i].isElective == true) {
                                onlyelectives.push(this.state.courses[i])
                            }
                            else {
                                onlycourses.push(this.state.courses[i])
                            }
                        }
                        this.setState({ onlycourses: onlycourses, onlyelectives: onlyelectives })
                        console.log(onlycourses)
                        console.log(onlyelectives)
                        for (let i = 0; i < this.state.onlyelectives.length; i++) {
                            console.log(this.state.onlyelectives[i].course)
                            if (this.state.onlyelectives[i].course === myelective) {
                                console.log("match")
                                this.setState({
                                    studentelective: this.state.onlyelectives[i]
                                })
                            }
                        }
                    })
            })


    }

    closeProfile = () => {
        $(".modal").removeClass("is-active");
        $(".modal").addClass("not-active");
        localStorage.removeItem('test')
    }

    verifyProfile = async () => {
        let id = localStorage.getItem('test')
        fetch(`${serverip}/student/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
            body: JSON.stringify({ "verified": true })
        }).then(() => {
            fetch(`${serverip}/student/?branch=${this.state.credentials.branch}&semester=${this.state.credentials.semester[0]}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.props.auth.token}`
                },
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    this.setState({ data: data })
                })
        })


        $(".modal").removeClass("is-active");
    }

    rejectProfile = async () => {
        let id = localStorage.getItem('test')
        fetch(`${serverip}/student/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
            body: JSON.stringify({ "verified": false })
        }).then(() => {
            fetch(`${serverip}/student/?branch=${this.state.credentials.branch}&semester=${this.state.credentials.semester[0]}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.props.auth.token}`
                },
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    this.setState({ data: data })
                })
        })

        $(".modal").removeClass("is-active");
    }
    render() {

        $(document).ready(function () {
            $(".use-address").click(function () {
                var id = $(this).closest("tr").find(".nr").text();
                localStorage.setItem('test', id);
            });
        });

        const filledno=this.state.data.length
        return (
            <div >
                {this.modalProfile()}
                <div className="columns">
                    <div className="column is-one-fifth">
                        <div className="section-small"  >
                            <div className="field" >
                                <label className="has-text-white">Branch</label>
                                <div className="select">
                                    <select name="branch" onChange={this.handleChange}>
                                        <option>Select Branch</option>
                                        <option>Computer</option>
                                        <option >Mechanical</option>
                                        <option >Electrical</option>
                                        <option >Extc</option>
                                        <option >IT</option>
                                    </select>
                                </div>
                            </div>


                            <div className="field" >
                                <label className="has-text-white">Semester</label>
                                <div className="select is-hoverable" >
                                    <select name="semester" onChange={this.handleChange}>
                                        <option>Select Semester</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="hero">
                            <div className="section-small">
                                <div className="container"><div className="title has-text-white">Verify Forms</div><p className="has-text-white">Filled:{filledno}</p></div>
                            </div>
                        </div>
                        {this.state.credentials.branch && this.state.credentials.semester ?
                            <div>

                                <table id="thisTable" width="100%" className="table" >
                                    <tbody>
                                        <td><b>Roll no.</b></td>
                                        <td><b>Name</b></td>
                                        <td><b>Profile</b></td>
                                        <td><b>Status</b></td>

                                        {this.state.data.map(x =>
                                            <tr>
                                                <td className="nr">{x.rollno}</td>
                                                <td contenteditable="true">{x.studentname}</td>
                                                <td style={{ padding: '0' }}> <button className="use-address" onClick={this.openProfile} style={{ background: 'none', margin: '0', height: '35px', cursor: 'pointer', color: '#48c774', fontWeight: 'bold', border: 'none' }}>Open Profile</button></td>
                                                {x.verified ? <td style={{ background: '#34a85c', color: 'white' }}>Verified</td> : <td style={{ background: '#ff4242', color: 'white' }}>Not verified</td>}
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                               
                            </div>
                            : <div className="hero">
                                <div className="title has-text-centered">-</div>
                            </div>}

                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(verification);