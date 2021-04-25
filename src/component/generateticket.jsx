import React, { Component } from 'react';
import { connect } from 'react-redux'
import fcritlogo from '../assets/fcritlogo.png'
import download from '../assets/download.png'
import dp from '../assets/dp.jpg';
import sign from '../assets/sign.png'
import {serverip} from '../actions/serverip'
import PropTypes from "prop-types"
import Footer from './Footer'
import { HashLink as Link } from 'react-router-hash-link';
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { logout } from '../actions/auth'
import { toast } from 'react-toastify';
import $ from "jquery"
import 'react-toastify/dist/ReactToastify.css';
import Header from '../pages/Header'
import ExamNotice from './ExamNotice';
import _ from 'lodash'
import KtSubTab from './KtSubTab';

export class generateticket extends Component {

    static propTypes = {
        logout: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,

    }
    constructor(props) {
        super(props);
        this.state = {
            isKT: null,
            data: [],
            image:'',
            courses: {},
            kt3profile: '',
            kt4profile: '',
            kt5profile: '',
            kt6profile: '',
        }
    }

    openCity(evt, cityName) {
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

    stopLoader = () => {
        $('.pageloader').removeClass('is-active')
    }

    renderExamTime = () => {
        for (var i in this.state.exam_time.length) {
            return (
                <div>{this.state.exam_time[i]}</div>
            )
        }
    }

    modal = () => {
        var width = window.innerWidth;
        /* console.log(window.innerWidth) */
        if (width < 526) {
            return (
                <div class="modal is-active">
                    <div class="modal-background"></div>
                    <div class="modal-content" style={{ width: '80%', margin: '0 auto' }}>
                        <header class="modal-card-head">
                            <p class="modal-card-title">Alert</p>
                            <button class="delete" aria-label="close" style={{ position: 'relative', top: '0px', color: 'black' }}></button>
                        </header>
                        <section class="modal-card-foot">
                            <h1>Better view in Landscape mode</h1>
                        </section>
                    </div>
                </div>
            )
        }
        else {
            return (<div></div>)
        }
    }

    componentDidMount = () => {
        const { user } = this.props.auth;
        const id=user.username
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

        $(".delete").click(function () {
            $(".modal").toggleClass("is-active");
        })

        $(".modal-background").click(function () {
            $(".modal").toggleClass("is-active");
        })
       
        console.log(user)
        fetch(`${serverip}/student/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data)
               
                var regular = data.filter(x => x.studentType === 'Regular');
                console.log(regular)
                if (!_.isEmpty(regular)) {
                  this.setState({ filled: true, data: regular[0], isRegular: true })
                }

                //check if KT3 exists
                const kt3 = data.filter(x => x.id.includes("KT3"))[0];
                if (!_.isEmpty(kt3)) {
                    this.setState({ kt3filled: true, kt3profile: kt3, isKT: true })
                }

                const kt4 = data.filter(x => x.id.includes("KT4"))[0];
                if (!_.isEmpty(kt4)) {
                    this.setState({ kt4filled: true, kt4profile: kt4, isKT: true })
                }

                const kt5 = data.filter(x => x.id.includes("KT5"))[0];
                if (!_.isEmpty(kt5)) {
                    this.setState({ kt5filled: true, kt5profile: kt5, isKT: true })
                }

                const kt6 = data.filter(x => x.id.includes("KT6"))[0];
                if (!_.isEmpty(kt6)) {
                    this.setState({ kt6filled: true, kt5profile: kt6, isKT: true })
                }
              
                const scheme = this.state.data.scheme;
                const branch = this.state.data.branch;
                const semester = this.state.data.semester;
                return fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${this.props.auth.token}`
                    },
                })
            })
            .then(response => {
                return response.json()
            })
            .then(coursedata => {
                this.setState({
                    courses: coursedata
                })
                let onlyelectives = []
                let onlycourses = []
                let onlyinternal = []
                const myelective = this.state.data.elective;
                console.log(myelective)
                for (let i = 0; i < this.state.courses.length; i++) {
                    if (this.state.courses[i].isElective === true) {
                        onlyelectives.push(this.state.courses[i])
                    }
                    else if (this.state.courses[i].isInternal === true) {
                        onlyinternal.push(this.state.courses[i])
                    }
                    else {
                        onlycourses.push(this.state.courses[i])
                    }
                }
                console.log(onlyelectives)
                console.log(onlycourses)
                this.setState({
                    electivestate: onlyelectives,
                    coursestate: onlycourses,
                })
                for (let i = 0; i < this.state.electivestate.length; i++) {
                    if (this.state.electivestate[i].course === myelective) {
                        this.setState({
                            studentelective: this.state.electivestate[i]
                        })
                    }
                }
            })
            .catch(function (error) {
                console.log('Request failed', error)
            })

        
       



    }

    fetchImage = () => {
        fetch(`https://picsum.photos/id/237/200/300`)
            .then(res => {
                console.log(res.data);
                if (!res.ok) {
                    throw Error("Error");
                }
                return res.json();
            })
    }

    renderHallticket = () => {
        const { user } = this.props.auth;
        const kt3data = this.state.kt3profile;
        const kt4data = this.state.kt4profile;
        const kt5data = this.state.kt5profile;
        const kt6data = this.state.kt6profile;
        const data = this.state.data;
        let session = this.state.data.session;
        const studentdp=this.state.image.image;
        if (session === 'FH') {
            session = 'First Half';
        }
        else {
            session = 'Second Half'
        }
        /* console.log(session); */

        let examsem = data.semester;
        if (examsem == 3 || examsem == 4) {
            examsem = 'Second Year Engineering'
        }
        else {
            examsem = 'Third Year Engineering'
        }

        

        if (this.state.isRegular === false && (this.state.kt3filled || this.state.kt4filled || this.state.kt5filled || this.state.kt6filled)) {
            return (
                <div >
                    {this.stopLoader()}
                    <div className="title">KT Hallticket</div>
                    <KtSubTab user={user}
                        kt3data={kt3data}
                        kt4data={kt4data}
                        kt5data={kt5data}
                        kt6data={kt6data}
                        session={session}
                        examsem={examsem}s
                        filled={this.state.filled}
                        isKT={this.state.isKT}
                        isRegular={this.state.isRegular}
                        kt3filled={this.state.kt3filled}
                        kt4filled={this.state.kt4filled}
                        kt5filled={this.state.kt5filled}
                        kt6filled={this.state.kt6filled}
                        openCity={this.openCity}
                    />


                </div>
            )
        }
        else if (this.state.isRegular === true && this.state.kt3filled || this.state.kt4filled || this.state.kt5filled || this.state.kt6filled) {
            return (
                <div>
                    {this.stopLoader()}
                    <div className="hallticket-tabs" style={{ marginTop: '20px', marginBottom: '0px' }}>
                        <a href="javascript:void(0)" onClick={(event) => { this.openCity(event, 'myhallticket') }}>
                            <div className="w3-third tablink w3-bottombar w3-padding is-active"><button>Regular Hallticket</button></div>
                        </a>
                        <a href="javascript:void(0)" onClick={(event) => { this.openCity(event, 'kthallticket') }}>
                            <div className="w3-third tablink w3-bottombar  w3-padding"><button>KT hallticket</button></div>
                        </a>
                    </div>
                    <div className=" w3-container city" id="kthallticket" style={{ display: 'none' }}>
                        <KtSubTab user={user}
                            kt3data={kt3data}
                            kt4data={kt4data}
                            kt5data={kt5data}
                            kt6data={kt6data}
                            session={session}
                            examsem={examsem}
                           
                            filled={this.state.filled}
                            isKT={this.state.isKT}
                            isRegular={this.state.isRegular}
                            kt3filled={this.state.kt3filled}
                            kt4filled={this.state.kt4filled}
                            kt5filled={this.state.kt5filled}
                            kt6filled={this.state.kt6filled}
                            openCity={this.openCity}
                            studentdp={this.state.studentdp}
                            pdfExportComponentKt={this.pdfExportComponentKt}
                        />

                    </div>
                    <div className=" w3-container city" id="myhallticket" style={{ display: 'block' }}>

                        <PDFExport
                            scale={0.5}
                            forcePageBreak=".page-break"
                            paperSize="A4"
                            margin="2cm"
                            fileName={user ? `Hallticket:${user.first_name}:Sem${this.state.data.semester}:(${this.state.data.session} ${this.state.data.year})` : null}
                            ref={(component) => this.pdfExportComponent = component}
                        >
                            <table style={{ tableLayout: "auto" }}>
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
                                                <b >FR. C. RODRIGUES INSTITUTE OF TECHNOLOGY,VASHI (College Code:426)</b>
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
                                        <td colspan="2"><p>{user ? `${this.props.auth.user.first_name}` : null}</p></td>
                                        <td rowspan="5" style={{ textAlign: "center", alignContent: 'center' }}>
                                            {/* <img src={this.state.photo ? this.state.photo[2].download_url : 'Loading...'}></img> */}
                                            <img src={studentdp} alt="" />
                                        </td>
                                    </tr>
                                    <tr class="sd">
                                        <td><p>Examination</p></td>
                                        <td colspan="2"><p>{data.semester ? `${examsem} Semester ${data.semester} (CBCGS)` : null}</p></td>
                                    </tr>
                                    <tr class="sd">
                                        <td><p>Held in</p></td>
                                        <td colspan="2"><p>{data.year ? `${session} of ${data.year}` : null}</p></td>
                                    </tr>
                                    <tr class="sd">
                                        <td><p>Seat no</p></td>
                                        <td colspan="2"><p>{data.seatNo ? data.seatNo : `-Not generated yet-`}</p></td>
                                    </tr>
                                    <tr class="sd">
                                        <td><p>Branch</p></td>
                                        <td colspan="2"><p>{data.branch ? `${data.branch} Engineering` : null}</p></td>
                                    </tr>

                                    <tr className="thbold">
                                        <th >CODE</th>
                                        <th>COURSE TITLE</th>
                                        <th>TIMINGS</th>
                                        <th >DATE</th>
                                    </tr>
                                    {this.state.coursestate ? this.state.coursestate.map((item) => (
                                        <tr className="thbold">
                                            <td><b>{item.code}</b></td>
                                            <td><b>{item.course}</b></td>
                                            <td><b>{item.start_time}-{item.end_time}</b></td>
                                            <td style={{ textAlign: 'center' }}><b>{item.date}</b></td>
                                        </tr>
                                    )) : null}

                                    {this.state.studentelective ? (
                                        <tr className="thbold">
                                            <td><b>{this.state.studentelective.code}</b></td>
                                            <td><b>{this.state.studentelective.course}</b></td>
                                            <td><b>{this.state.studentelective.start_time}-{this.state.studentelective.end_time}</b></td>
                                            <td style={{ textAlign: 'center' }}><b>{this.state.studentelective.date}</b></td>
                                        </tr>
                                    ) : null}

                                    <tr class="student-signature">
                                        <td colspan="2"><b>Student Signature</b></td>
                                        <td><b>College Seal</b></td>
                                        <td style={{ textAlign: 'center' }}><img src={sign} style={{ height: '50px' }} alt="sign" /><br /><b>Principal</b></td>
                                    </tr>
                                </tbody>
                            </table>
                            <ExamNotice />
                        </PDFExport>
                        <div className="notification is-danger" style={{ marginTop: '10px' }}>
                            <p>Warning: Please note that the hallticket download option will be available only once. After clicking Download, hallticket will be downloaded and the button will be freezed. Contact Examcell incase of a Duplicate Hallticket.</p>
                        </div>
                        <div className="field is-grouped is-grouped-centered">
                            <button className="button is-medium is-success" onClick={this.exportPDFWithComponent}><span class="material-icons"> get_app </span> Download Hallticket</button>
                        </div>
                    </div>
                </div>
            )
        }
        else if (this.state.isRegular === true) {
            return (

                <div className=" w3-container city" id="myhallticket" style={{ display: 'block' }}>
                    {this.stopLoader()}
                    <PDFExport
                        scale={0.5}
                        forcePageBreak=".page-break"
                        paperSize="A4"
                        margin="2cm"
                        fileName={user ? `Hallticket:${user.first_name}:Sem${this.state.data.semester}:(${this.state.data.session} ${this.state.data.year})` : null}
                        ref={(component) => this.pdfExportComponent = component}
                    >
                        <table style={{ tableLayout: "auto" }}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'center', paddingTop: '10px' }} >
                                        <img
                                            src={fcritlogo}
                                            width="80px"
                                            alt="logo"
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }} colspan="2">
                                        <p><b>University of Mumbai</b></p>
                                        <p>
                                            <b>FR. C. RODRIGUES INSTITUTE OF TECHNOLOGY,VASHI (College Code:426)</b>
                                        </p>
                                        <p><b>HALL TICKET</b></p>
                                    </td>
                                    <td className="tdright" style={{ width: '20%', textAlign: 'center' }} >
                                        <img
                                            src={download}
                                            width="80px"
                                            alt=""
                                        />
                                    </td>
                                </tr>

                                <tr class="sd">
                                    <td className="tdleft" width="20%" ><p>Student Name</p></td>
                                    <td colspan="2"><p>{user ? `${this.props.auth.user.first_name}` : null}</p></td>
                                    <td rowspan="5" style={{ textAlign: "center", alignContent: 'center' }}>
                                        {/* <img src={this.state.photo ? this.state.photo[9].download_url : 'Loading...'}></img> */}
                                        <img src={studentdp} alt="" />
                                    </td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Examination</p></td>
                                    <td colspan="2"><p>{data.semester ? `${examsem} Semester ${data.semester} (CBCGS)` : null}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Held in</p></td>
                                    <td colspan="2"><p>{data.year ? `${session} of ${data.year}` : null}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Seat no</p></td>
                                    <td colspan="2"><p>{data.seatNo ? data.seatNo : `-Not generated yet-`}</p></td>
                                </tr>
                                <tr class="sd">
                                    <td><p>Branch</p></td>
                                    <td colspan="2"><p>{data.branch ? `${data.branch} Engineering` : null}</p></td>
                                </tr>

                                <tr className="thbold">
                                    <th >CODE</th>
                                    <th>COURSE TITLE</th>
                                    <th>TIMINGS</th>
                                    <th style={{ textAlign: 'center' }}>DATE</th>
                                </tr>
                                {this.state.coursestate ? this.state.coursestate.map((item) => (
                                    <tr className="thbold">
                                        <td><b>{item.code}</b></td>
                                        <td><b>{item.course}</b></td>
                                        <td><b>{item.start_time}-{item.end_time}</b></td>
                                        <td style={{ textAlign: 'center' }}><b>{item.date}</b></td>
                                    </tr>
                                )) : null}

                                {this.state.studentelective ? (
                                    <tr className="thbold">
                                        <td><b>{this.state.studentelective.code}</b></td>
                                        <td><b>{this.state.studentelective.course}</b></td>
                                        <td><b>{this.state.studentelective.start_time}-{this.state.studentelective.end_time}</b></td>
                                        <td style={{ textAlign: 'center' }}><b>{this.state.studentelective.date}</b></td>
                                    </tr>
                                ) : null}

                                <tr class="student-signature">
                                    <td colspan="2"><b>Student Signature</b></td>
                                    <td><b>College Seal</b></td>
                                    <td style={{ textAlign: 'center' }}><img src={sign} style={{ height: '50px' }} alt="sign" /><br /><b>Principal</b></td>
                                </tr>
                            </tbody>
                        </table>
                        <ExamNotice />
                    </PDFExport>
                    {/* <div className="notification is-danger" style={{ marginTop: '10px' }}>
                        <p>Warning: Please note that the hallticket download option will be available only once. After clicking Download, hallticket will be downloaded and the button will be freezed. Contact Examcell incase of a Duplicate Hallticket.</p>
                    </div> */}
                    <div className="field is-grouped is-grouped-centered">
                        <button className="button is-medium is-success" style={{ fontWeight: 'bold' }} onClick={this.exportPDFWithComponent}><span class="material-icons"> get_app </span> Download Hallticket</button>
                    </div>
                </div>
            )
        }

        else if (!this.state.filled || !this.state.kt3filled || !this.state.k4filled || !this.state.kt5filled || !this.state.kt6filled) {

            return (<div className="container" >
                {this.stopLoader()}
                <div className="title has-text-centered">FORM NOT FILLED</div>
                <div className="field is-grouped is-grouped-centered">
                    <Link to="/form"><button className="button is-success">Go to fill form</button></Link>
                </div>
            </div>)
        }



    }


    exportPDFWithComponentKt = () => {
        const atb = () => {
            toast.success(`All the best! 👍`, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT,
            })
        }
         atb() 
        this.pdfExportComponentKt.save();
    }

    exportPDFWithComponent = () => {
        const atb = () => {
            toast.success(`All the best! 👍`, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT,
            })
        }
        atb() 
        this.pdfExportComponent.save();
    }



    render() {


        return (
            <div

            >
                <Header />
                {this.modal()}
                <div class="pageloader is-active "><span class="title" style={{ fontSize: '2em' }}></span></div>

                <div className="hero first">
                    <div className="section" >

                        <div className="container" style={{ maxWidth: "800px", backgroundColor: 'white', padding: '1em', borderRadius: '5px' }}>

                            <p className="help" style={{ animation: 'none', textAlign: 'center', marginBottom: '20px' }}>Scroll down to download Hallticket</p>
                            {this.renderHallticket()}
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, { logout })(generateticket);