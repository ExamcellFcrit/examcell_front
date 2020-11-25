import React, { Component } from 'react';
import './header.css'
import { logout } from '../actions/auth'
import { connect } from 'react-redux'
import PropTypes from "prop-types"
import ReactTooltip from 'react-tooltip';
import { serverip } from '../actions/serverip'
import logo from '../assets/fcritlogo.png'
import $ from "jquery"
import { HashLink as Link } from 'react-router-hash-link';
import { NavLink } from 'react-router-dom';
export class Header extends Component {

  static propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      filled: ''
    }

  }

  componentDidMount() {
    $(window).on('scroll', function () {
      if ($(window).scrollTop()) {
        $('nav').addClass('black');
      }
      else {
        $('nav').removeClass('black');
      }
    });
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function () {
      var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        $('nav').addClass('shownavbar')
        $('nav').removeClass('hidenavbar')
      } else {
        $('nav').removeClass('shownavbar')
        $('nav').addClass('hidenavbar')
      }
      prevScrollpos = currentScrollPos;
    }

    //get notice
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
      this.setState({ freezelink: data.freezelink })
    })

    //get student profile
    const { user } = this.props.auth
    console.log(user.username)
    fetch(`${serverip}/student/${user ? `${user.username}/` : null}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.props.auth.token}`
      }
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        this.setState({
          profile: data
        })
      })
      .catch(err => console.log(err))
  }



  render() {
    const { user } = this.props.auth;
    const profile = this.state.profile;
    let printbutton, formtab
    if (this.state.freezelink === false) {
      printbutton = <button type="button" id="printbutton" disabled style={{ background: '#efefef0', color: '#cfcfcf' }}>PRINT HALLTICKET</button>
    }
    else {
      printbutton = <button>PRINT HALLTICKET</button>
    }

    if (user.first_name === '' && user.email === '') {
      formtab = <button type="button" id="printbutton" disabled style={{ background: '#efefef0', color: '#cfcfcf' }}>EXAM FORM</button>
    }
    else {
      formtab = <button type="button">EXAM FORM</button>
    }

    return (
      <div>
        <ReactTooltip effect="solid" />
        {user ? <span className="tag is-danger" style={{ animation: 'none', margin: '0', position: 'fixed', borderRadius: '0', zIndex: '98', bottom: '0', right: '0px' }}>{`Logged in as : ${user.first_name}`}</span> : null}
        <nav className="header">
          <div className="header-wrap">
            <div className="left">
              <img src={logo} alt="" />
              <div className="content">
                <span className="subtitle">Agnel Charities' </span>

                <p className="title">FR. CONCEICAO RODRIGUES INSTITUTE OF TECHNOLOGY <span id="examcell-tag" className="is-success tag is-rounded" style={{ letterSpacing: '3px', textTransform: 'uppercase', fontWeight: '100', fontSize: '10px' }}>Examcell</span></p>

              </div>
            </div>
            <div className="right">
              <ul>
               
                <li><NavLink exact activeClassName="active" to="/" ><button>HOME</button></NavLink></li>
                {user && user.username !== 'admin' ? <li><NavLink exact activeClassName="active" to="/hallticket">{printbutton}</NavLink></li> : null}
                {user && user.username === 'admin' ? <li><NavLink exact activeClassName="active" to="/adminpanel"><button>ADMIN</button></NavLink></li> : null}
                {user && user.username === 'admin' ? <li><NavLink exact activeClassName="active" to="/createaccount"><button>CREATE ACCOUNT</button></NavLink></li> : null}
                <li><NavLink exact activeClassName="active" to="/form">{user && profile && user.username !== 'admin' ? user.first_name === '' && user.email === '' &&  profile.changedPassword===false ? (<button type="button" id="printbutton" disabled style={{ background: '#efefef0', color: '#cfcfcf' }}>EXAM FORM</button>) : (<button>EXAM FORM</button>) : null}</NavLink></li>
                {user ? <li><span className="material-icons" onClick={this.props.logout} style={{ background: 'white', borderRadius: '100vh', color: '#34a85c', cursor: 'pointer', fontSize: '1.5em' }} data-tip="Logout">exit_to_app</span></li> : <li><Link to="/login"><button >LOGIN</button></Link></li>}
              </ul>
            </div>
          </div>
        </nav>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Header);
