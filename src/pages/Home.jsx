import React, { Component } from 'react';
import Header from './Header'
import { connect } from 'react-redux'
import Footer from '../component/Footer'
import PropTypes from "prop-types"
import ReactTooltip from 'react-tooltip';
import Timetable from '../component/Timetable'
import { logout } from '../actions/auth'
import axios from 'axios';
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
      selectedFile: '',
      uploadDp: false,
      correctDp: '',
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

  getBase64Image = (imgUrl, callback) => {

    var img = new Image();
    console.log(imgUrl)
    // onload fires when the image is fully loadded, and has width and height

    img.onload = function () {
      console.log("loaded")
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/jpg"),
        dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

      console.log(dataURL)
      // the base64 string

      localStorage.setItem('imgurl', dataURL)


    };

    // set attributes and src 
    img.setAttribute('crossOrigin', 'anonymous'); //
    img.src = "http://192.168.161.9:8090/media/Images/api/fcrit_examcell/assets/101727.jpg";

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
    }).then(res => {
      /* if(res.status==404){
        alert("Upload your photo")
      } */
      return res.json()
    })
      .then(data => {
        /* let base64image = this.getBase64Image(data.image);
        console.log(base64image) */
        if (data.detail) {
          this.setState({ uploadDp: true })
          console.log("not exists")
        }
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
            const kt4sem = kt4.semester
            const kt4branch = kt4.branch
            const kt4scheme = kt4.scheme
            fetch(`${serverip}/scheme/${kt4scheme}/branch/${kt4branch}${kt4scheme}/semester/${kt4sem}${kt4branch}${kt4scheme}/course/`, {
              method: 'Get',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
              },
            })
              .then(res => res.json())
              .then(kt4 => {
                this.setState({ kt4subjects: kt4, isKt: true })
                let kt4codes = []
                console.log(Object.keys(this.state.kt4profile).length)
                if (Object.keys(this.state.kt4profile).length > 1) {
                  for (let i = 0; i < this.state.kt4profile.ktsubjects.length; i++) {
                    kt4codes.push(this.state.kt4profile.ktsubjects[i].code)
                  }
                }
                console.log(kt4codes)
                let kt4student = []
                for (let i = 0; i < kt4codes.length; i++) {
                  for (let j = 0; j < this.state.kt4subjects.length; j++) {
                    if (kt4codes[i] === this.state.kt4subjects[j].code) {
                      kt4student.push(this.state.kt4subjects[j])
                      this.setState({ kt4studentsubj: kt4student })
                    }
                  }
                }
              })
          }

          //check if KT5 exists
          var kt5 = data.filter(x => x.id.includes("KT5"))[0];
          if (!_.isEmpty(kt5)) {
            this.setState({ kt5filled: true, kt5profile: kt5, isKt: true })
            const kt5sem = kt5.semester
            const kt5branch = kt5.branch
            const kt5scheme = kt5.scheme
            fetch(`${serverip}/scheme/${kt5scheme}/branch/${kt5branch}${kt5scheme}/semester/${kt5sem}${kt5branch}${kt5scheme}/course/`, {
              method: 'Get',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
              },
            })
              .then(res => res.json())
              .then(kt5 => {
                this.setState({ kt5subjects: kt5, isKt: true })
                let kt5codes = []
                console.log(Object.keys(this.state.kt5profile).length)
                if (Object.keys(this.state.kt5profile).length > 1) {
                  for (let i = 0; i < this.state.kt5profile.ktsubjects.length; i++) {
                    kt5codes.push(this.state.kt5profile.ktsubjects[i].code)
                  }
                }
                console.log(kt5codes)
                let kt5student = []
                for (let i = 0; i < kt5codes.length; i++) {
                  for (let j = 0; j < this.state.kt5subjects.length; j++) {
                    if (kt5codes[i] === this.state.kt5subjects[j].code) {
                      kt5student.push(this.state.kt5subjects[j])
                      this.setState({ kt5studentsubj: kt5student })
                    }
                  }
                }
              })
          }

          //check if KT6 exists
          var kt6 = data.filter(x => x.id.includes("KT6"))[0];
          if (!_.isEmpty(kt6)) {
            this.setState({ kt6filled: true, kt6profile: kt6, isKt: true })
            const kt6sem = kt6.semester
            const kt6branch = kt6.branch
            const kt6scheme = kt6.scheme
            fetch(`${serverip}/scheme/${kt6scheme}/branch/${kt6branch}${kt6scheme}/semester/${kt6sem}${kt6branch}${kt6scheme}/course/`, {
              method: 'Get',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
              },
            })
              .then(res => res.json())
              .then(kt6 => {
                this.setState({ kt6subjects: kt6, isKt: true })
                let kt6codes = []
                console.log(Object.keys(this.state.kt6profile).length)
                if (Object.keys(this.state.kt6profile).length > 1) {
                  for (let i = 0; i < this.state.kt6profile.ktsubjects.length; i++) {
                    kt6codes.push(this.state.kt6profile.ktsubjects[i].code)
                  }
                }
                console.log(kt6codes)
                let kt6student = []
                for (let i = 0; i < kt6codes.length; i++) {
                  for (let j = 0; j < this.state.kt6subjects.length; j++) {
                    if (kt6codes[i] === this.state.kt6subjects[j].code) {
                      kt6student.push(this.state.kt6subjects[j])
                      this.setState({ kt6studentsubj: kt6student })
                    }
                  }
                }
              })
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
              <div className="title" style={{ fontSize: '1.5em' }}>{user.first_name} </div>
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
                {profile.verified ? (<div className="tag is-medium verifytag is-success" data-tip="Form is submitted. Verified by admin.">Verified<span class="material-icons" style={{ marginLeft: '5px' }} > verified</span></div>) : (<div className="tag is-medium is-warning verifytag has-text-white" data-tip="Form is submitted. Not verified by admin yet.">Not Verified<span class="material-icons" style={{ marginLeft: '5px' }} >error_outline</span></div>)}
              </div>
              {this.state.filled ? <p>Form is filled.</p> : null}
              {profile.rejected ? (
                <div className="notification is-medium is-danger">
                  <p>Your form has been rejected due to incorrect details. Fill the form again with correct details. Reason of rejection :</p>
                  <li>{profile.rejectionReason}</li>
                </div>
              ) : null}
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
                    {this.state.kt3filled ? <p>Form is filled.</p> : null}
                    {kt3profile.rejected ? (
                      <div className="notification is-medium is-danger">
                        <p>Your form has been rejected due to incorrect details. Fill the form again with correct details. Reason of rejection :</p>
                        <li>{kt3profile.rejectionReason}</li>
                      </div>
                    ) : null}
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
                    {this.state.kt4filled ? <p>Form is filled.</p> : null}
                    {kt4profile.rejected ? (
                      <div className="notification is-medium is-danger">
                        <p>Your form has been rejected due to incorrect details. Fill the form again with correct details. Reason of rejection :</p>
                        <li>{kt4profile.rejectionReason}</li>
                      </div>
                    ) : null}
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
                    {this.state.kt5filled ? <p>Form is filled.</p> : null}
                    {kt5profile.rejected ? (
                      <div className="notification is-medium is-danger">
                        <p>Your form has been rejected due to incorrect details. Fill the form again with correct details. Reason of rejection :</p>
                        <li>{kt5profile.rejectionReason}</li>
                      </div>
                    ) : null}
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
                      {kt6profile.verified ? (<div className="verifytag">Verified<span class="material-icons" style={{ marginLeft: '5px' }}> verified</span></div>) : (<div className="tag is-medium verifytag is-warning has-text-white" style={{ background: '#ffbb00' }}>Not Verified<span class="material-icons" style={{ marginLeft: '5px' }}>error_outline</span></div>)}
                    </div>
                    {this.state.kt6filled ? <p>Form is filled.</p> : null}
                    {kt6profile.rejected ? (
                      <div className="notification is-medium is-danger">
                        <p>Your form has been rejected due to incorrect details. Fill the form again with correct details. Reason of rejection :</p>
                        <li>{kt6profile.rejectionReason}</li>
                      </div>
                    ) : null}
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

  updateDp = (e) => {
    const user = this.props.auth.user;
    const dp = new FormData();
    dp.append('id', user.username);
    dp.append('image', this.state.selectedFile)


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
          alert("Name and Email updated")
         // window.location.reload();
        }
      })

    if (this.state.correctDp) {
      const dp = new FormData();
      dp.append('id', user.username);
      dp.append('image', this.state.selectedFile)
      if (this.state.uploadDp === true) {
        axios.post(`${serverip}/api/image/`, dp, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${this.props.auth.token}`
          }
        }).then(res => console.log(res))
      }
      else {
        axios.put(`${serverip}/api/image/${user.username}`, dp, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${this.props.auth.token}`
          }
        }).then(res => console.log(res))
      }
      alert("Photo updated")
    }
    else {
      alert("Photo not updated. Wrong file name")
    }


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
                              <input class="input" type="text" autoComplete="off" onChange={this.handleChange} name="first_name" value={user.first_name} placeholder="Full name" />
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

                        <li>
                          <div class="field">
                            <label class="label">Update Profile picture</label>
                            <p className="help" style={{ animation: 'none' }}>Please name your image file as your roll number. ( e.g:101700.jpg )</p>
                            <div><input type="file" onChange={(event) => {
                              this.setState({ selectedFile: event.target.files[0] })
                              var fileName = event.target.files[0].name.split('.')[0]
                              if (fileName === `${user.username}`) {
                                this.setState({ correctDp: true })
                              }
                              else {
                                this.setState({ correctDp: false })
                              }
                            }} /></div>
                            {this.state.image.detail ? <p className="help is-danger">Photo not uploaded! Hallticket cannot be downloaded without photo.</p> : null}
                            {this.state.correctDp === false ? (<p className="help is-danger">Wrong file name</p>) : null}
                          </div>
                        </li>
                      </ul>


                      <br />


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
