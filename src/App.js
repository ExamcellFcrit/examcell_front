import React, {useState, Fragment, Component} from 'react';
import './App.css';
import { BrowserRouter as Router,Route,Switch,Redirect} from 'react-router-dom'
import PrivateRoute from './component/PrivateRoute'
import Developers from './component/Developers'
import Login from './component/login'
import Footer from './component/Footer'
import AdminLogin from './component/AdminLogin'
import resetPassword from './component/resetPassword'
import Form from './component/form2'
import Register from './component/register'
import createaccount from './component/createaccount'
import { Provider } from 'react-redux'
import Home from './pages/Home'
import store from './store';
import { loadUser } from './actions/auth'
import Pdfconvert from './component/Verification'
import AdminPanel from './component/adminpanel'
import AdminHome from './pages/AdminHome'
import GenerateTicket from './component/generateticket'
import changePassword from './component/changePassword'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verification from './component/Verification';
import ReactTooltip from 'react-tooltip';


toast.configure()

class App extends Component{

  componentDidMount() {
    store.dispatch(loadUser());
  }

  render(){
  return (
    <Provider store={store}>
        <Router >
        <div className="App" id="bgsvg">
                  <Switch>
                    <PrivateRoute path="/" exact component={Home}/>
                    <Route path="/register" exact component={Register}/>
                    <PrivateRoute path="/form" exact component={Form}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/createaccount" component={createaccount}/>
                    <Route path="/admin_login" component={AdminLogin}/>
                    <PrivateRoute path="/admin_home" component={AdminHome}/>
                    <PrivateRoute path="/change_password" component={changePassword}/>
                    <Route path="/password_reset_confirm" component={resetPassword}/>
                    <PrivateRoute path="/adminpanel" component={AdminPanel}/>
                    <PrivateRoute path="/hallticket" component={GenerateTicket}/>
                  </Switch>  
        </div>
        </Router>
    </Provider>
  );
  } 
}



export default (App);

