import React, { Component } from 'react'
import ExamNotice from './ExamNotice';
import fcritlogo from '../assets/fcritlogo.png'
import dp from '../assets/dp.jpg'
import { logout } from '../actions/auth'
import sign from '../assets/sign.png'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import {serverip} from '../actions/serverip'
import { PDFExport } from "@progress/kendo-react-pdf";
import download from '../assets/download.png'
export class KtSubTab extends Component {

    static propTypes = {
        logout: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
    }


    constructor(props) {
        super(props);
        this.state = {
            kt3branch: this.props.kt3data.branch, kt3sem: this.props.kt3data.semester, kt3scheme: this.props.kt3data.scheme
        }
    }

    sortByCode(code){return function(a,b){
        if(a[code]>b[code])
            return 1;
        else if(a[code]<b[code])
            return -1;
        return 0;
    }}

    componentDidMount = () => {
        
        if (Object.keys(this.props.kt3data).length>1) {
            const kt3scheme = this.props.kt3data.scheme
            const kt3sem = this.props.kt3data.semester
            const kt3branch = this.props.kt3data.branch
            fetch(`${serverip}/scheme/${kt3scheme}/branch/${kt3branch}${kt3scheme}/semester/${kt3sem}${kt3branch}${kt3scheme}/course/`, {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.props.auth.token}`
                }
            }).then(res => res.json())
                .then(data => {
                    this.setState({ kt3subjects: data })
                    let kt3codes = []
                    for (let i = 0; i < this.props.kt3data.ktsubjects.length; i++) {
                        kt3codes.push(this.props.kt3data.ktsubjects[i].code)
                    }
                    console.log(kt3codes)
                    let kt3student = []
                    for (let i = 0; i < kt3codes.length; i++) {
                        for (let j = 0; j < this.state.kt3subjects.length; j++) {
                            if (kt3codes[i] === this.state.kt3subjects[j].code) {
                                kt3student.push(this.state.kt3subjects[j])
                                
                                kt3student.sort(this.sortByCode("code"))
                                console.log(kt3student)
                                this.setState({ kt3studentsubj: kt3student })
                            }
                        }
                    }
                })
        }

        if (Object.keys(this.props.kt4data).length>1) {
            const kt4scheme = this.props.kt4data.scheme
            const kt4sem = this.props.kt4data.semester
            const kt4branch = this.props.kt4data.branch
            fetch(`${serverip}/scheme/${kt4scheme}/branch/${kt4branch}${kt4scheme}/semester/${kt4sem}${kt4branch}${kt4scheme}/course/`, {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.props.auth.token}`
                }
            }).then(res => res.json())
                .then(data => {
                    this.setState({ kt4subjects: data })
                    let kt4codes = []
                    for (let i = 0; i < this.props.kt4data.ktsubjects.length; i++) {
                        kt4codes.push(this.props.kt4data.ktsubjects[i].code)
                    }
                    console.log(kt4codes)
                    let kt4student = []
                    for (let i = 0; i < kt4codes.length; i++) {
                        for (let j = 0; j < this.state.kt4subjects.length; j++) {
                            if (kt4codes[i] === this.state.kt4subjects[j].code) {
                                kt4student.push(this.state.kt4subjects[j])
                                kt4student.sort(this.sortByCode("code"))
                                this.setState({ kt4studentsubj: kt4student })
                            }
                        }
                    }
                })
        }

        if (Object.keys(this.props.kt5data).length>1) {

            const kt5scheme = this.props.kt5data.scheme
            const kt5sem = this.props.kt5data.semester
            const kt5branch = this.props.kt5data.branch
            fetch(`${serverip}/scheme/${kt5scheme}/branch/${kt5branch}${kt5scheme}/semester/${kt5sem}${kt5branch}${kt5scheme}/course/`, {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.props.auth.token}`
                }
            }).then(res => res.json())
                .then(data => {
                    this.setState({ kt5subjects: data })
                    let kt5codes = []
                    for (let i = 0; i < this.props.kt5data.ktsubjects.length; i++) {
                        kt5codes.push(this.props.kt5data.ktsubjects[i].code)
                    }
                    console.log(kt5codes)
                    let kt5student = []
                    for (let i = 0; i < kt5codes.length; i++) {
                        for (let j = 0; j < this.state.kt5subjects.length; j++) {
                            if (kt5codes[i] === this.state.kt5subjects[j].code) {
                                kt5student.push(this.state.kt5subjects[j])
                                kt5student.sort(this.sortByCode("code"))
                                this.setState({ kt5studentsubj: kt5student })
                            }
                        }
                    }
                })
        }
        if (Object.keys(this.props.kt6data).length>1) {
            const kt6scheme = this.props.kt6data.scheme
            const kt6sem = this.props.kt6data.semester
            const kt6branch = this.props.kt6data.branch
            fetch(`${serverip}/scheme/${kt6scheme}/branch/${kt6branch}${kt6scheme}/semester/${kt6sem}${kt6branch}${kt6scheme}/course/`, {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.props.auth.token}`
                }
            }).then(res => res.json())
                .then(data => {
                    this.setState({ kt6subjects: data })
                    let kt6codes = []
                    for (let i = 0; i < this.props.kt6data.ktsubjects.length; i++) {
                        kt6codes.push(this.props.kt6data.ktsubjects[i].code)
                    }
                    console.log(kt6codes)
                    let kt6student = []
                    for (let i = 0; i < kt6codes.length; i++) {
                        for (let j = 0; j < this.state.kt6subjects.length; j++) {
                            if (kt6codes[i] === this.state.kt6subjects[j].code) {
                                kt6student.push(this.state.kt6subjects[j])
                                kt6student.sort(this.sortByCode("code"))
                                this.setState({ kt6studentsubj: kt6student })
                            }
                        }
                    }
                })
        }



    }

    exportPDFWithComponentKt3 = () => {
        const atb = () => {
            toast.success(`All the best! 👍`, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT,
            })
        }
        atb()
        this.pdfExportComponentKt3.save();
    }

    exportPDFWithComponentKt4 = () => {
        const atb = () => {
            toast.success(`All the best! 👍`, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT,
            })
        }
        { atb() }
        this.pdfExportComponentKt4.save();
    }

    exportPDFWithComponentKt5 = () => {
        const atb = () => {
            toast.success(`All the best! 👍`, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT,
            })
        }
        { atb() }
        this.pdfExportComponentKt5.save();
    }


    openTab(evt, cityName) {
        var i, x, tablinks;
        x = document.getElementsByClassName("kttab");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("removetab");
        for (i = 0; i < x.length; i++) {
            tablinks[i].className = tablinks[i].className.replace("is-active", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.firstElementChild.className += " is-active";
    }

    render() {
        const user = this.props.user;
        const kt3data = this.props.kt3data;
        const kt4data = this.props.kt4data;
        
        
console.log(React.version)
        const kt5data = this.props.kt5data;
        const kt6data = this.props.kt6data;
        const data = this.props.data;
        const examsem = this.props.examsem;
        const kt3sem = "Second Year Engineering";
        const kt4sem =  "Second Year Engineering";
        const kt5sem =  "Third Year Engineering";
        const kt6sem =  "Third Year Engineering";
        const session = this.props.session;
        const studentdp=this.props.studentdp.image
        return (
            <div>
                <div className="hallticket-tabs" style={{ paddingTop: '20px', marginBottom: '0px', border: '1px #e6e6e6 solid' }}>
                    {kt3data ? (<a href="javascript:void(0)" onClick={(event) => { this.openTab(event, 'sem3') }}>
                        <div className="w3-third removetab w3-bottombar w3-padding is-active"><button>Semester 3</button></div>
                    </a>) : <div className="w3-third removetab w3-bottombar  w3-padding"></div>}
                    {kt4data ? (<a href="javascript:void(0)" onClick={(event) => { this.openTab(event, 'sem4') }}>
                        <div className="w3-third removetab w3-bottombar  w3-padding "><button>Semester 4</button></div>
                    </a>) : <div className="w3-third removetab w3-bottombar  w3-padding"></div>}
                    {kt5data ? (<a href="javascript:void(0)" onClick={(event) => { this.openTab(event, 'sem5') }}>
                        <div className="w3-third removetab w3-bottombar  w3-padding"><button>Semester 5</button></div>
                    </a>) : <div className="w3-third removetab w3-bottombar  w3-padding"></div>}
                    {kt6data ? (<a href="javascript:void(0)" onClick={(event) => { this.openTab(event, 'sem6') }}>
                        <div className="w3-third removetab w3-bottombar  w3-padding"><button>Semester 6</button></div>
                    </a>) : <div className="w3-third removetab w3-bottombar  w3-padding"></div>}
                </div>

                <div className="w3-container kttab" id="sem3" style={{ display: 'block' }}>

                    <PDFExport
                        scale={0.5}
                        forcePageBreak=".page-break"
                        paperSize="A4"
                        margin="2cm"
                        fileName={user && kt3data ? `KTHallticket:${user.first_name}:Sem${kt3data.semester}:(${kt3data.session} ${kt3data.year})` : null}
                        ref={(component) => this.pdfExportComponentKt3 = component}
                    >
                        <table style={{ tableLayout: "auto", background: 'white', boxShadow: ' 0 0 1em rgba(0,0,0,0.15)' }}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'center', paddingTop: '10px' }} >
                                        <img
                                            src={fcritlogo}
                                            width="80px"
                                            alt=""
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }} colspan="2" >
                                        <p><b>University of Mumbai</b></p>
                                        <p>
                                            <b
                                            >FR. C. RODRIGUES INSTITUTE OF TECHNOLOGY,VASHI (College Code:426)</b>
                                        </p>
                                        <p><b>HALL TICKET</b></p>
                                    </td>
                                    <td className="tdright" style={{ width: '20%', textAlign: 'center', paddingTop: '10px' }} >
                                        <img
                                            src={download}
                                            width="80px"
                                            alt=""
                                        />
                                    </td>
                                </tr>

                                <tr class="sd">
                                    <td className="tdleft" width="20%"><p>Student Name</p></td>
                                    <td colspan="2"><p>{user ? `${user.first_name}` : null}</p></td>
                                    <td rowspan="5" style={{ textAlign: "center", alignContent: 'center' }}>
                                        {/* <img src={this.state.photo ? this.state.photo[0].download_url : 'Loading...'}></img> */}
                                        <img src={studentdp} alt="" />
                                    </td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Examination</p></td>
                                    <td colspan="2"><p>{kt3data.semester ? `${kt3sem} Semester ${kt3data.semester} (CBCGS)` : null}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Held in</p></td>
                                    <td colspan="2"><p>{kt3data.year ? `${session} of ${kt3data.year}` : null}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Seat no</p></td>
                                    <td colspan="2"><p>{kt3data.seatNo ? kt3data.seatNo : `-Not generated yet-`}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Branch</p></td>
                                    <td colspan="2"><p>{kt3data.branch ? `${kt3data.branch} Engineering` : null}</p></td>
                                </tr>

                                <tr className="thbold">
                                    <th >CODE</th>
                                    <th>COURSE TITLE</th>
                                    <th>TIMINGS</th>
                                    <th >DATE</th>
                                </tr>
                                {this.state.kt3studentsubj ? this.state.kt3studentsubj.map((item) => (
                                    <tr className="thbold">
                                        <td><b>{item.code}</b></td>
                                        <td><b>{item.course}{item.isInternal?'(Internal)':null}</b></td>
                                        <td><b>{item.start_time}-{item.end_time}</b></td>
                                        <td style={{ textAlign: 'center' }}><b>{item.date}</b></td>
                                    </tr>
                                )) : null}



                                <tr class="student-signature">
                                    <td colspan="2"><b>Student Signature</b></td>
                                    <td><b>College Seal</b></td>
                                    <td style={{ textAlign: 'center' }}><img src={sign} style={{ height: '50px' }} /><br /><b>Principal</b></td>
                                </tr>
                            </tbody>
                        </table>

                        <ExamNotice />
                    </PDFExport>
                   {/*  <div className="notification is-danger" style={{ marginTop: '10px' }}>
                        <p>Warning: Please note that the hallticket download option will be available only once. After clicking Download, hallticket will be downloaded and the button will be freezed. Contact Examcell incase of a Duplicate Hallticket.</p>
                    </div> */}
                    <div className="field is-grouped is-grouped-centered">
                        <button className="button is-medium is-success" style={{ fontWeight: 'bold' }} onClick={this.exportPDFWithComponentKt3}><span class="material-icons"> get_app </span> Download Hallticket</button>
                    </div>
                </div>

                <div className="w3-container kttab" id="sem4" style={{ display: 'none' }}>

                    <PDFExport
                        scale={0.5}
                        forcePageBreak=".page-break"
                        paperSize="A4"
                        margin="2cm"
                        fileName={user ? `KTHallticket:${user.first_name} :Sem${kt4data.semester}:(${kt4data.session} ${kt4data.year})` : null}
                        ref={(component) => this.pdfExportComponentKt4 = component}
                    >
                        <table style={{ tableLayout: "auto", background: 'white', boxShadow: ' 0 0 1em rgba(0,0,0,0.15)' }}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'center', paddingTop: '10px' }} >
                                        <img
                                            src={fcritlogo}
                                            width="80px"
                                            alt=""
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }} colspan="2"  >
                                        <p><b>University of Mumbai</b></p>
                                        <p>
                                            <b
                                            >FR. C. RODRIGUES INSTITUTE OF TECHNOLOGY,VASHI (College Code:426)</b>
                                        </p>
                                        <p><b>HALL TICKET</b></p>
                                    </td>
                                    <td className="tdright" style={{ width: '20%', textAlign: 'center', paddingTop: '10px' }} >
                                        <img
                                            src={download}
                                            width="80px"
                                            alt=""
                                        />
                                    </td>
                                </tr>

                                <tr class="sd">
                                    <td className="tdleft" width="20%"><p>Student Name</p></td>
                                    <td colspan="2" ><p>{user ? `${user.first_name} ` : null}</p></td>
                                    <td rowspan="5" style={{ textAlign: "center", alignContent: 'center' }}>
                                        {/* <img src={this.state.photo ? this.state.photo[0].download_url : 'Loading...'}></img> */}
                                        <img src={studentdp} alt="" />
                                    </td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Examination</p></td>
                                    <td colspan="2" ><p>{kt4data.semester ? `${kt4sem} Semester ${kt4data.semester} (CBCGS)` : null}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Held in</p></td>
                                    <td colspan="2" ><p>{kt4data.year ? `${session} of ${kt4data.year}` : null}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Seat no</p></td>
                                    <td colspan="2" ><p>{kt4data.seatNo ? kt4data.seatNo : `-Not generated yet-`}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Branch</p></td>
                                    <td colspan="2" ><p>{kt4data.branch ? `${kt4data.branch} Engineering` : null}</p></td>
                                </tr>

                                <tr className="thbold">
                                    <th >CODE</th>
                                    <th>COURSE TITLE</th>
                                    <th>TIMINGS</th>
                                    <th >DATE</th>
                                </tr>
                                {this.state.kt4studentsubj ? this.state.kt4studentsubj.map((item) => (
                                    <tr className="thbold">
                                        <td><b>{item.code}</b></td>
                                        <td><b>{item.course}</b></td>
                                        <td><b>{item.start_time}-{item.end_time}</b></td>
                                        <td style={{ textAlign: 'center' }}><b>{item.date}</b></td>
                                    </tr>
                                )) : null}



                                <tr class="student-signature">
                                    <td colspan="2"><b>Student Signature</b></td>
                                    <td><b>College Seal</b></td>
                                    <td style={{ textAlign: 'center' }}><img src={sign} style={{ height: '50px' }} /><br /><b>Principal</b></td>
                                </tr>
                            </tbody>
                        </table>
                        <ExamNotice />
                    </PDFExport>
                   {/*  <div className="notification is-danger" style={{ marginTop: '10px' }}>
                        <p>Warning: Please note that the hallticket download option will be available only once. After clicking Download, hallticket will be downloaded and the button will be freezed. Contact Examcell incase of a Duplicate Hallticket.</p>
                    </div> */}
                    <div className="field is-grouped is-grouped-centered">
                        <button className="button is-medium is-success" style={{ fontWeight: 'bold' }} onClick={this.exportPDFWithComponentKt4}><span class="material-icons"> get_app </span> Download Hallticket</button>
                    </div>
                </div>

                <div className="w3-container kttab" id="sem5" style={{ display: 'none' }}>

                    <PDFExport
                        scale={0.5}
                        forcePageBreak=".page-break"
                        paperSize="A4"
                        margin="2cm"
                        fileName={user ? `KTHallticket:${user.first_name} :Sem${kt5data.semester}:(${kt5data.session} ${kt5data.year})` : null}
                        ref={(component) => this.pdfExportComponentKt5 = component}
                    >
                        <table style={{ tableLayout: "auto", background: 'white', boxShadow: ' 0 0 1em rgba(0,0,0,0.15)' }}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'center', paddingTop: '10px' }} >
                                        <img
                                            src={fcritlogo}
                                            width="80px"
                                            alt=""
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }} colspan="2"  >
                                        <p><b>University of Mumbai</b></p>
                                        <p>
                                            <b
                                            >FR. C. RODRIGUES INSTITUTE OF TECHNOLOGY,VASHI (College Code:426)</b>
                                        </p>
                                        <p><b>HALL TICKET</b></p>
                                    </td>
                                    <td className="tdright" style={{ width: '20%', textAlign: 'center', paddingTop: '10px' }} >
                                        <img
                                            src={download}
                                            width="80px"
                                            alt=""
                                        />
                                    </td>
                                </tr>

                                <tr class="sd">
                                    <td className="tdleft" width="20%"><p>Student Name</p></td>
                                    <td colspan="2" ><p>{user ? `${user.first_name} ` : null}</p></td>
                                    <td rowspan="5" style={{ textAlign: "center", alignContent: 'center' }}>
                                        {/* <img src={this.state.photo ? this.state.photo[0].download_url : 'Loading...'}></img> */}
                                        <img src={studentdp} alt="" />
                                    </td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Examination</p></td>
                                    <td colspan="2" ><p>{kt5data.semester ? `${kt5sem} Semester ${kt5data.semester} (CBCGS)` : null}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Held in</p></td>
                                    <td colspan="2" ><p>{kt5data.year ? `${session} of ${kt5data.year}` : null}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Seat no</p></td>
                                    <td colspan="2" ><p>{kt5data.seatNo ? kt5data.seatNo : `-Not generated yet-`}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Branch</p></td>
                                    <td colspan="2" ><p>{kt5data.branch ? `${kt5data.branch} Engineering` : null}</p></td>
                                </tr>

                                <tr className="thbold">
                                    <th >CODE</th>
                                    <th>COURSE TITLE</th>
                                    <th>TIMINGS</th>
                                    <th >DATE</th>
                                </tr>
                                {this.state.kt5studentsubj ? this.state.kt5studentsubj.map((item) => (
                                    <tr className="thbold">
                                        <td><b>{item.code}</b></td>
                                        <td><b>{item.course}</b></td>
                                        <td><b>{item.start_time}-{item.end_time}</b></td>
                                        <td style={{ textAlign: 'center' }}><b>{item.date}</b></td>
                                    </tr>
                                )) : null}



                                <tr class="student-signature">
                                    <td colspan="2"><b>Student Signature</b></td>
                                    <td><b>College Seal</b></td>
                                    <td style={{ textAlign: 'center' }}><img src={sign} style={{ height: '50px' }} /><br /><b>Principal</b></td>
                                </tr>
                            </tbody>
                        </table>
                        <ExamNotice />
                    </PDFExport>
                   {/*  <div className="notification is-danger" style={{ marginTop: '10px' }}>
                        <p>Warning: Please note that the hallticket download option will be available only once. After clicking Download, hallticket will be downloaded and the button will be freezed. Contact Examcell incase of a Duplicate Hallticket.</p>
                    </div> */}
                    <div className="field is-grouped is-grouped-centered">
                        <button className="button is-medium is-success" style={{ fontWeight: 'bold' }} onClick={this.exportPDFWithComponentKt5}><span class="material-icons"> get_app </span> Download Hallticket</button>
                    </div>
                </div>


                <div className="w3-container kttab" id="sem6" style={{ display: 'none' }}>

                    <PDFExport
                        scale={0.5}
                        forcePageBreak=".page-break"
                        paperSize="A4"
                        margin="2cm"
                        fileName={user ? `KTHallticket:${user.first_name} :Sem${kt6data.semester}:(${kt6data.session} ${kt6data.year})` : null}
                        ref={(component) => this.pdfExportComponentKt6 = component}
                    >
                        <table style={{ tableLayout: "auto", background: 'white', boxShadow: ' 0 0 1em rgba(0,0,0,0.15)' }}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'center', paddingTop: '10px' }} >
                                        <img
                                            src={fcritlogo}
                                            width="80px"
                                            alt=""
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }} colspan="2"  >
                                        <p><b>University of Mumbai</b></p>
                                        <p>
                                            <b
                                            >FR. C. RODRIGUES INSTITUTE OF TECHNOLOGY,VASHI (College Code:426)</b>
                                        </p>
                                        <p><b>HALL TICKET</b></p>
                                    </td>
                                    <td className="tdright" style={{ width: '20%', textAlign: 'center', paddingTop: '10px' }} >
                                        <img
                                            src={download}
                                            width="80px"
                                            alt=""
                                        />
                                    </td>
                                </tr>

                                <tr class="sd">
                                    <td className="tdleft" width="20%"><p>Student Name</p></td>
                                    <td colspan="2" ><p>{user ? `${user.first_name} ` : null}</p></td>
                                    <td rowspan="5" style={{ textAlign: "center", alignContent: 'center' }}>
                                        {/* <img src={this.state.photo ? this.state.photo[0].download_url : 'Loading...'}></img> */}
                                        <img src={studentdp} alt="" />
                                    </td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Examination</p></td>
                                    <td colspan="2" ><p>{kt6data.semester ? `${kt6sem} Semester ${kt6data.semester} (CBCGS)` : null}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Held in</p></td>
                                    <td colspan="2" ><p>{kt6data.year ? `${session} of ${kt6data.year}` : null}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Seat no</p></td>
                                    <td colspan="2" ><p>{kt6data.seatNo ? kt6data.seatNo : `-Not generated yet-`}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Branch</p></td>
                                    <td colspan="2" ><p>{kt6data.branch ? `${kt6data.branch} Engineering` : null}</p></td>
                                </tr>

                                <tr className="thbold">
                                    <th >CODE</th>
                                    <th>COURSE TITLE</th>
                                    <th>TIMINGS</th>
                                    <th >DATE</th>
                                </tr>
                                {this.state.kt6studentsubj ? this.state.kt6studentsubj.map((item) => (
                                    <tr className="thbold">
                                        <td><b>{item.code}</b></td>
                                        <td><b>{item.course}</b></td>
                                        <td><b>{item.start_time}-{item.end_time}</b></td>
                                        <td style={{ textAlign: 'center' }}><b>{item.date}</b></td>
                                    </tr>
                                )) : null}



                                <tr class="student-signature">
                                    <td colspan="2"><b>Student Signature</b></td>
                                    <td><b>College Seal</b></td>
                                    <td style={{ textAlign: 'center' }}><img src={sign} style={{ height: '50px' }} /><br /><b>Principal</b></td>
                                </tr>
                            </tbody>
                        </table>
                        <ExamNotice />
                    </PDFExport>
                   {/*  <div className="notification is-danger" style={{ marginTop: '10px' }}>
                        <p>Warning: Please note that the hallticket download option will be available only once. After clicking Download, hallticket will be downloaded and the button will be freezed. Contact Examcell incase of a Duplicate Hallticket.</p>
                    </div> */}
                    <div className="field is-grouped is-grouped-centered">
                        <button className="button is-medium is-success" style={{ fontWeight: 'bold' }} onClick={this.exportPDFWithComponentKt6}><span class="material-icons"> get_app </span> Download Hallticket</button>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, { logout })(KtSubTab)
