import React, { Component } from 'react';
import Header from './Header'
import { connect } from 'react-redux'
import Footer from '../component/Footer'
import PropTypes from "prop-types"
import ReactTooltip from 'react-tooltip';
import Timetable from '../component/Timetable'
import { logout } from '../actions/auth'
import $ from "jquery"
import { serverip } from '../actions/serverip'
import { Link, Redirect } from 'react-router-dom'
import _ from 'lodash'
import dp from '../assets/dp.jpg'

export class Home extends Component {

  static propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      filled: '',
      notice: '',
      freezelink: false,
      showtimetable: null,
      image: '',
      profile: '',
      data: [],
      studentprofile: { email: '', username: '', id: '', first_name: '' },
      credentials: { branch: '', semester: '', revscheme: null },
      sort: [
        { field: 'code', dir: 'asc' }
      ]
    }
  }


  stopLoader = () => {
    $('.pageloader').removeClass('is-active')
  }
  componentDidMount = async (e) => {

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      console.log("dev")
    } else {
      console.log("prod")
    }


    //passwordModal open,close Jquery
    $(".delete").click(function () {
      $(".modal").removeClass("is-active");
      $(".modal").addClass("not-active");
    })
    $(".modal-background").click(function () {
      $(".modal").removeClass("is-active");
      $(".modal").addClass("not-active");
    })


    const { user } = this.props.auth
    /*  console.log(user.username) */

    //get student image
    fetch(`${serverip}/api/image/${user.username}/`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.props.auth.token}`
      },
    }).then(res => res.json())
      .then(data => {
        this.setState({ image: data })
      })

    //get halltkt switch status
    if (user.username !== 'admin') {

      fetch(`${serverip}/controls/freezelink/`, {
        method: "get",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.props.auth.token}`
        }
      }).then(res => {
        /*  console.log(res) */
        return res.json()
      }).then(data => {
        console.log(data.freezelink)
        this.setState({ freezelink: data.freezelink, showtimetable: data.showtimetable })
      })
    }



    //Get notice
    if (user.username !== 'admin') {
      fetch(`${serverip}/notice/`, {
        method: "get",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.props.auth.token}`
        }
      }).then(res => res.json())
        .then(data => this.setState({ notice: data }))
    }



    /* Fetch Students Regular profile */
    if (user.username !== 'admin') {
      fetch(`${serverip}/student/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.props.auth.token}`
        }
      }).then((response) => {
        console.log("ok");

        return response.json()
      })
        .then(async (data) => {
          console.log(data)

          var regular = data.filter(x => x.studentType === 'Regular');
          if (!_.isEmpty(regular)) {
            this.setState({ filled: true, profile: regular[0], isRegular: true })
          }

          //check if KT3 exists
          const kt3 = data.filter(x => x.id.includes("KT3"))[0];
          if (!_.isEmpty(kt3)) {
            this.setState({ kt3filled: true, kt3profile: kt3, isKt: true })
            const kt3sem = kt3.semester
            const kt3branch = kt3.branch
            const kt3scheme = kt3.scheme
            fetch(`${serverip}/scheme/${kt3scheme}/branch/${kt3branch}${kt3scheme}/semester/${kt3sem}${kt3branch}${kt3scheme}/course/`, {
              method: 'Get',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
              },
            })
              .then(res => res.json())
              .then(kt3 => {
                this.setState({ kt3subjects: kt3, isKt: true })
                let kt3codes = []
                console.log(Object.keys(this.state.kt3profile).length)
                if (Object.keys(this.state.kt3profile).length > 1) {
                  for (let i = 0; i < this.state.kt3profile.ktsubjects.length; i++) {
                    kt3codes.push(this.state.kt3profile.ktsubjects[i].code)
                  }
                }
                console.log(kt3codes)
                let kt3student = []
                for (let i = 0; i < kt3codes.length; i++) {
                  for (let j = 0; j < this.state.kt3subjects.length; j++) {
                    if (kt3codes[i] === this.state.kt3subjects[j].code) {
                      kt3student.push(this.state.kt3subjects[j])
                      this.setState({ kt3studentsubj: kt3student })
                    }
                  }
                }
              })
          }

          //check if KT4 exists
          var kt4 = data.filter(x => x.id.includes("KT4"))[0];
          if (!_.isEmpty(kt4)) {
            this.setState({ kt4filled: true, kt4profile: kt4, isKt: true })

          }

          //check if KT5 exists
          var kt5 = data.filter(x => x.id.includes("KT5"))[0];
          if (!_.isEmpty(kt5)) {
            this.setState({ kt5filled: true, kt5profile: kt5, isKt: true })
          }

          //check if KT6 exists
          var kt6 = data.filter(x => x.id.includes("KT6"))[0];
          if (!_.isEmpty(kt6)) {
            this.setState({ kt6filled: true, kt6profile: kt6, isKt: true })
          }
          this.setState({

            credentials: { 'branch': data.branch, 'semester': data.semester, 'revscheme': data.scheme }
          })
          /*  end of regular profile */


          /* Fetch students current exam timetable */
          /* const semester = data.semester;
          const branch = data.branch;
          const scheme = data.scheme;
          const api_call = await fetch(`${serverip}/scheme/${scheme}/branch/${branch}${scheme}/semester/${semester}${branch}${scheme}/course/`, {
            headers: {
              'Authorization': `Token ${this.props.auth.token}`
            }
          });
          const response = await api_call.json();
          this.setState({
            data: response,
          })
          console.log(this.state.data.sort()) */
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    /* end of time table */




  }

  renderStudentProfile = () => {
    const { user } = this.props.auth;
    const studentdp = this.state.image.image;
    const profile = this.state.profile;
    const kt3profile = this.state.kt3profile;
    const kt4profile = this.state.kt4profile;
    const kt5profile = this.state.kt5profile;
    const kt6profile = this.state.kt6profile;

    if (profile) {   /* Check profile of Regular,KT exam student and render Kt if exists*/
      return (
        <div>
          {this.stopLoader()}
          <ReactTooltip effect="solid" />
          <div className="columns">
            <div className="column is-half" style={{ textAlign: 'center' }} >
              <figure className="image is-150x150">
                <img className="is-rounded" style={{ width: "150px", height: '150px', display: 'block', margin: 'auto', marginBottom: '10px' }} src={studentdp} alt="" />
              </figure>
              <div className="title is-uppercase" style={{ fontSize: '1.5em' }}>{user.first_name} </div>
            </div>
            <div className="column">
              <p ><b>Branch: </b>{profile.branch}</p>
              <p ><b>Semester: </b>{profile.semester}</p>
              <p ><b>Roll number: </b>{user.username}</p>
            </div>

          </div>
          <div className="columns">
            <div className="column" style={{ border: '3px solid #34a85d59', borderRadius: '5px', margin: '5px',/* boxShadow:'#34a85d59 0px 10px 20px 0px' */ }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="title" >Regular Exam</div>
                {profile.verified ? (<div className="tag is-medium verifytag is-success" data-tip="Status of your exam form">Verified<span class="material-icons" style={{ marginLeft: '5px' }} > verified</span></div>) : (<div className="tag is-medium is-warning verifytag has-text-white" data-tip="Status of your exam form">Not Verified<span class="material-icons" style={{ marginLeft: '5px' }} >error_outline</span></div>)}
              </div>

              <p ><b>Semester: </b>{profile ? profile.semester : `Form not filled`}</p>
              <p><b>Seat number: </b> {profile.seatNo ? <span className="subtitle is-4">{profile.seatNo}</span> : 'Not generated yet'}</p>

            </div>
            <hr />
          </div>
          <div className="columns">

            {this.state.isKt ? (
              <div className="column" style={{ border: '3px solid #e6262663', borderRadius: '5px', margin: '5px' }}>
                <div className="title">KT Exam</div>
                {/*  <p><b>KT Form filled for: </b>  {`Semester ${kt3profile ? `3` : ''}${kt4profile ? `, 4` : ''}${kt5profile ? `, 5` : ''}${kt6profile ? `, 6` : ''}`}</p> */}

                {/* Sem 3 details */}
                {kt3profile ? (
                  <div>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="title">Semester 3</div>
                      {kt3profile.verified ? (<div className="tag is-medium verifytag is-success">Verified<span class="material-icons" style={{ marginLeft: '5px' }} > verified</span></div>) : (<div className="tag is-medium is-warning verifytag has-text-white ">Not Verified<span class="material-icons" style={{ marginLeft: '5px' }} >error_outline</span></div>)}
                    </div>
                    <p><b>KT seat number: </b>{kt3profile.seatNo ? <span className="subtitle is-4">{kt3profile.seatNo}</span> : ' Not generated yet'}</p>
                    <p><b>Selected Subjects: </b><ul style={{ marginLeft: '10px' }}>{this.state.kt3studentsubj ? this.state.kt3studentsubj.map(x => (
                      <li key={x.id} style={{ listStyle: 'circle' }} >{x.course} {x.isInternal ? '(Internal)' : null} on {x.date ? x.date : '( date to be announced )'} </li>
                    )) : null}</ul></p>

                  </div>

                ) : null}


                {/* Sem 4 details */}
                {kt4profile ? (
                  <div>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="title">Semester 4</div>
                      {kt4profile.verified ? (<div className="tag is-medium verifytag is-success">Verified<span class="material-icons" style={{ marginLeft: '5px' }} > verified</span></div>) : (<div className="tag is-medium verifytag is-warning has-text-white">Not Verified<span class="material-icons" style={{ marginLeft: '5px' }} >error_outline</span></div>)}
                    </div>

                    <p><b>Seat number: </b>{kt4profile.seatNo ? <span className="subtitle is-4">{kt4profile.seatNo}</span> : ' Not generated yet'}</p>
                    <p><b>Selected Subjects: </b><ul style={{ marginLeft: '10px' }}>{this.state.kt4studentsubj ? this.state.kt4studentsubj.map(x => (
                      <li key={x.id} style={{ listStyle: 'circle' }} >{x.course} {x.isInternal ? '(Internal)' : null} on  {x.date ? x.date : '( date to be announced )'} </li>
                    )) : null}</ul></p>

                  </div>

                ) : null}

                {/* Sem 5 details */}
                {kt5profile ? (
                  <div>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="title">Semester 5</div>
                      {kt5profile.verified ? (<div className="verifytag">Verified<span class="material-icons" style={{ marginLeft: '5px' }}> verified</span></div>) : (<div className="tag is-medium verifytag is-warning has-text-white" style={{ background: '#ffbb00' }}>Not Verified<span class="material-icons" style={{ marginLeft: '5px' }}>error_outline</span></div>)}
                    </div>
                    <p><b>Seat number: </b>{kt5profile.seatNo ? <span className="subtitle is-4">{kt5profile.seatNo}</span> : ' Not generated yet'}</p>
                    <p><b>Selected Subjects: </b><ul style={{ marginLeft: '10px' }}>{this.state.kt5studentsubj ? this.state.kt5studentsubj.map(x => (
                      <li key={x.id} style={{ listStyle: 'circle' }} >{x.course} {x.isInternal ? '(Internal)' : null} on  {x.date ? x.date : '( date to be announced )'} </li>
                    )) : null}</ul></p>

                  </div>
                ) : null}

                {/* Sem 6 details */}
                {kt6profile ? (
                  <div>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="title">Semester 6</div>
                      {kt5profile.verified ? (<div className="verifytag">Verified<span class="material-icons" style={{ marginLeft: '5px' }}> verified</span></div>) : (<div className="tag is-medium verifytag is-warning has-text-white" style={{ background: '#ffbb00' }}>Not Verified<span class="material-icons" style={{ marginLeft: '5px' }}>error_outline</span></div>)}
                    </div>
                    <p><b>Seat number: </b>{kt6profile.seatNo ? kt6profile.seatNo : ' Not generated yet'}</p>
                    <p><b>Selected Subjects: </b><ul style={{ marginLeft: '10px' }}>{kt6profile ? kt6profile.ktsubjects.map(x => (
                      <li key={x.id} style={{ listStyle: 'circle' }} >{x.ktsubject} {x.isInternal ? '(Internal)' : null} on  {x.date ? x.date : '( date to be announced )'} </li>
                    )) : null}</ul></p>
                    <hr />
                  </div>
                ) : null}
              </div>) : null}

          </div>
        </div>
      )
    }
    /* Check if only KT student profile exists*/
    else if (kt3profile || kt4profile || kt5profile || kt6profile) {
      let branch = []
      if (kt3profile) { branch.push(kt3profile.branch) }
      else if (kt4profile) { branch.push(kt4profile.branch) }
      else if (kt5profile) { branch.push(kt5profile.branch) }
      else if (kt6profile) { branch.push(kt6profile.branch) }

      branch = _.uniq(branch, true)
      return (
        <div>
          {this.stopLoader()}
          <div className="columns">
            <div className="column is-half" style={{ textAlign: 'center' }} >
              <figure className="image is-100x100">
                <img className="is-rounded" style={{ width: "100px", height: '100px', display: 'block', margin: 'auto', marginBottom: '10px' }} src={studentdp} alt="" />
              </figure>
              <div className="title" style={{ fontSize: '1.5em' }}>{user.first_name}</div>
            </div>
            <div className="column">
              <p ><b>Branch: </b>{branch}</p>
              <p ><b>Roll number: </b>{user.username}</p>
            </div>

          </div>

          {/* Sem 3 details */}
          {kt3profile ? (
            <div>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="title">Semester 3</div>
                {kt3profile.verified ? (<div className="verifytag">Verified<span class="material-icons" style={{ marginLeft: '5px' }}> verified</span></div>) : (<div className="tag is-medium verifytag is-warning has-text-white" style={{ background: '#ffbb00' }}>Not Verified<span class="material-icons" style={{ marginLeft: '5px' }}>error_outline</span></div>)}
              </div>
              <p><b>Seat number: </b>{kt3profile.seatNo ? kt3profile.seatNo : ' Not generated yet'}</p>
              <p><b>Selected Subjects for KT exams: </b><ul style={{ marginLeft: '10px' }}>{kt3profile ? kt3profile.ktsubjects.map(x => (
                <li key={x.id} style={{ listStyle: 'circle' }} >{x.ktsubject} on {x.date ? x.date : '( date to be announced )'}</li>
              )) : null}</ul></p>

            </div>

          ) : null}


          {/* Sem 4 details */}
          {kt4profile ? (
            <div>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="title">Semester 4</div>
                {kt4profile.verified ? (<div className="verifytag">Verified<span class="material-icons" style={{ marginLeft: '5px' }}> verified</span></div>) : (<div className="tag is-medium verifytag is-warning has-text-white" style={{ background: '#ffbb00' }}>Not Verified<span class="material-icons" style={{ marginLeft: '5px' }}>error_outline</span></div>)}
              </div>
              <p><b>Seat number: </b>{kt4profile.seatNo ? kt4profile.seatNo : ' Not generated yet'}</p>
              <p><b>Selected Subjects for KT exams: </b><ul style={{ marginLeft: '10px' }}>{kt4profile ? kt4profile.ktsubjects.map(x => (
                <li key={x.id} style={{ listStyle: 'circle' }} >{x.ktsubject} {x.isInternal ? '(Internal)' : null} on  {x.date ? x.date : '( date to be announced )'} </li>
              )) : null}</ul></p>
            </div>
          ) : null}

          {/* Sem 5 details */}
          {kt5profile ? (
            <div>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="title">Semester 5</div>
                {kt5profile.verified ? (<div className="verifytag">Verified<span class="material-icons" style={{ marginLeft: '5px' }}> verified</span></div>) : (<div className="tag is-medium verifytag is-warning has-text-white" style={{ background: '#ffbb00' }}>Not Verified<span class="material-icons" style={{ marginLeft: '5px' }}>error_outline</span></div>)}
              </div>
              <p><b>Seat number: </b>{kt5profile.seatNo ? kt5profile.seatNo : ' Not generated yet'}</p>
              <p><b>Selected Subjects for KT exams: </b><ul style={{ marginLeft: '10px' }}>{kt5profile ? kt5profile.ktsubjects.map(x => (
                <li key={x.id} style={{ listStyle: 'circle' }} >{x.ktsubject} {x.isInternal ? '(Internal)' : null} on  {x.date ? x.date : '( date to be announced )'} </li>
              )) : null}</ul></p>
            </div>
          ) : null}

          {/* Sem 6 details */}
          {kt6profile ? (
            <div>
              <hr />
              <p><b>Semester 6 KT seat number: </b>{kt6profile.seatNo ? kt6profile.seatNo : ' Not generated yet'}</p>
              <p><b>Selected Subjects for KT exams: </b><ul style={{ marginLeft: '10px' }}>{kt6profile ? kt6profile.ktsubjects.map(x => (
                <li key={x.id} style={{ listStyle: 'circle' }} >{x.ktsubject} {x.isInternal ? '(Internal)' : null} on  {x.date ? x.date : '( date to be announced )'} </li>
              )) : null}</ul></p>
            </div>
          ) : null}

        </div>
      )
    }
    else {
      return (
        <div>
          {this.stopLoader()}
          <div className="columns">
            <div className="column is-one-third" style={{ textAlign: 'center' }} >
              <figure className="image is-100x100">
                <img className="is-rounded" style={{ width: "100px", height: '100px', display: 'block', margin: 'auto', marginBottom: '10px' }} src={studentdp} alt="" />
              </figure>
              <div className="title" style={{ fontSize: '1.5em' }}>{user.first_name} </div>
            </div>
            <div className="column">
              <p ><b>Branch: </b>{profile ? profile.branch : 'Form not filled'}</p>
              <p ><b>Semester: </b>{profile ? profile.semester : 'Form not filled'}</p>
              <p ><b>Roll number: </b>{user.username}</p>
            </div>

          </div>
          <hr />
          <div className="field is-grouped is-grouped-centered">
            <Link to="/form"><button className="button is-success">Fill form</button></Link>
          </div>
        </div>
      );
    }
  }


  oepnNoticeModal = () => {
    $(".modal").addClass("is-active")
    $(".modal").removeClass("not-active");
  }

  handleChange = async (e) => {
    const cred = this.state.studentprofile
    cred[e.target.name] = e.target.value;
    this.setState({
      studentprofile: cred,
    })
  }

  noticeModal = () => {
    return (
      <div className="modal not-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <section className="modal-card-body">
            <ul style={{ marginLeft: '1em' }}>
              {this.state.notice ? this.state.notice.map((i) => {
                return <li style={{ listStyle: 'circle' }}>{i.notice}</li>
              }) : null}
            </ul>
          </section>
        </div>
      </div>
    )
  }

  handleChange = async (e) => {
    const prof = this.props.auth.user
    prof[e.target.name] = e.target.value;
    this.setState({
      studentprofile: prof,
    })
  }

  updateProfile = () => {
    const user = this.props.auth.user
    fetch(`${serverip}/update_profile/${user.id}/`, {
      method: 'Put',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${this.props.auth.token}` },
      body: JSON.stringify(
        {
          "first_name": user.first_name,
          "email": user.email
        }
      )
    })
      .then(res => {
        if (res.status === 400) {
          this.setState({ updateError: true })
        }
        else {
          this.setState({ updateError: false })
        }
        return res.json()
      }).then(data => {
        this.setState({
          msg: data
        })
        if (this.state.updateError) {
          alert(data.email)
        }
        else {
          alert("Updated")
          window.location.reload();
        }
      })


  }





  render() {
    const { data } = this.state;
    const { user } = this.props.auth;
    const profile = this.state.profile;
    const kt3profile = this.state.kt3profile;
    if (this.props.auth.user.username === 'admin') {
      return <Redirect to="/admin_home" />
    }

    return (
      <div >

        <Header />
        {this.noticeModal()}
        <div className="columns"  >
          <div className="column" style={{ padding: '0' }}>
            <section className="hero first "  >
              <div className="section" >
                <div className="container">

                  <div className="title has-text-white" style={{ fontSize: '3em' }}>Dashboard</div>
                  <marquee loop="infinite" behaviour="scroll" id="maq" scrollamount="10" scrolldelay="0" onClick={this.oepnNoticeModal} data-tip="Click to open Notices">
                    {this.state.notice.length > 0 ? this.state.notice.map((i, index) => {
                      return <span style={{ margin: '0 1em' }} className="tag is-medium is-danger is-light "><span className="tag is-small is-danger mr-2">{index + 1}</span> {i.notice}</span>
                    }) : <p className="tag is-medium is-danger is-light ">No notice from admin yet. Keep a watch in future.</p>}
                  </marquee>

                  <div>

                    <div className="box" style={{ margin: '0 auto', marginTop: '30px', maxWidth: '700px' }}>
                      <div className="title">My Profile</div>
                      <ul style={{ listStyle: 'decimal' }} className='ml-4'>
                        <li>
                          <Link to="/change_password" style={{ color: '#48c774' }}>Change Password</Link>
                          <p className="help" style={{ animation: 'none' }}>Change the default password before filling form.</p>
                        </li>

                        <li>
                          <div class="field">
                            <label class="label">Full name ( LASTNAME FIRSTNAME FATHERNAME MOTHERNAME )</label>
                            <p className="help" style={{ animation: 'none' }}>Fill in uppercase</p>
                            <div class="control">
                              <input class="input" type="text" autoComplete="off" onChange={this.handleChange} name="first_name" value={user.first_name} placeholder="Full name" style={{ textTransform: 'uppercase' }} />
                            </div>
                            {user.first_name === '' ? <p className="help is-danger">Please fill your name before filling form</p> : null}
                          </div>
                        </li>

                        <li>
                          <div class="field">
                            <label class="label">Email address </label>
                            <p className="help" style={{ animation: 'none' }}>This email will be used to send password reset links, notifications etc.</p>
                            <div class="control">
                              <input class="input" type="text" autoComplete="off" onChange={this.handleChange} name="email" value={user.email} placeholder="Email address" />
                            </div>
                            {user.email === '' ? <p className="help is-danger">Please fill you email before filling form</p> : null}
                          </div>
                        </li>
                      </ul>

                      <button className="button is-success" onClick={this.updateProfile} >Update Profile</button>
                    </div>

                    <div className='box' style={{ margin: '0 auto', marginTop: '30px', maxWidth: '700px' }}>
                      <div className='title'>Exam Details</div>
                      <div class="pageloader is-active "><span class="title" style={{ fontSize: '2em' }}></span></div>
                      {this.renderStudentProfile()}
                    </div>

                  </div>
                </div>
              </div>
            </section>
          </div>

          {this.state.showtimetable && user.username !== 'admin  ' ? (
            <div className="column " style={{ padding: '0' }}>
              <section className="hero first  " >
                <div className="section">
                  <div className="container">
                    <div className="title has-text-white" style={{ fontSize: '3em' }}>Exam Time Table</div>
                    <Timetable profile={this.state.profile} data={this.state.data} />
                  </div>
                </div>
              </section>
            </div>

          ) : null}

        </div>
        {/* <Footer/>   */}

        <Footer />
      </div>

    );
  }

}
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { logout })(Home);
