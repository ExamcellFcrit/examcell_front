import React, { Component } from 'react';
import dp from '../assets/dp.jpg';
import sign from '../assets/sign.png'
import fcritlogo from '../assets/fcritlogo.png'
import { logout } from '../actions/auth'
import download from '../assets/download.png'
import PropTypes from 'prop-types';
import ExamNotice from './ExamNotice';
import { connect } from 'react-redux'


export class DuplicateHalltkt extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            courses: this.props.courses,
            credentials: { branch: '', semester: '', starting_seatno: undefined },
            regularProfile: 'null'
        };

    }

    exportPDFWithComponent = () => {
        this.props.exportPDFWithComponent()
    }



    render() {
        const user = this.props.user
        const data = this.props.data
        const examsem = this.props.examsem
        const session = this.props.session
        const ktsubject=this.props.ktstudentsubj
        return (
            <div >

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
                            <td style={{ textAlign: 'center' }} colspan="2">
                                <p><b>University of Mumbai</b></p>
                                <p>
                                    <b>FR. C. RODRIGUES INSTITUTE OF TECHNOLOGY,VASHI (College Code:426)</b>
                                </p>
                                <p><b>(DUPLICATE) HALL TICKET</b></p>
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
                            <td className="tdleft" width="20%" ><p>Student Name</p></td>
                            <td colspan="2"><p>{user ? `${data.studentname} ${data.surname}` : null}</p></td>
                            <td rowspan="5" style={{ textAlign: "center", alignContent: 'center' }}>
                                {/* <img src={this.state.photo ? this.state.photo[9].download_url : 'Loading...'}></img> */}
                                <img src={dp} alt="" />
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
                        {this.props.courses && this.props.data.studentType ==='Regular' ? this.props.courses.map((item) => (
                            <tr className="thbold">
                                <td><b>{item.code}</b></td>
                                <td><b>{item.course}</b></td>
                                <td><b>{item.start_time}-{item.end_time}</b></td>
                                <td style={{ textAlign: 'center' }}><b>{item.date}</b></td>
                            </tr>
                        )) : null}

                        {this.props.studentelective && this.props.data.studentType === 'Regular' ? (
                            <tr className="thbold">
                                <td><b>{this.props.studentelective.code}</b></td>
                                <td><b>{this.props.studentelective.course}</b></td>
                                <td><b>{this.props.studentelective.start_time}-{this.props.studentelective.end_time}</b></td>
                                <td style={{ textAlign: 'center' }}><b>{this.props.studentelective.date}</b></td>
                            </tr>
                        ) : null}

                        {this.props.ktstudentsubj && this.props.data.studentType === 'KT' ? this.props.ktstudentsubj.map((item) => (
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
                            <td style={{ textAlign: 'center' }}><img src={sign} style={{ height: '50px' }} alt="sign" /><br /><b>Principal</b></td>
                        </tr>
                    </tbody>
                </table>
                <ExamNotice />

            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(DuplicateHalltkt);