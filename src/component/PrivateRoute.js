import React, { Component } from 'react';
import { Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, auth, ...rest })=> (
    <Route
        {...rest}
        render={props => {
            if(auth.isLoading){
                return "Loading..."
            }
            else if(!auth.isAuthenticated){
                return <Redirect to="/login"/>
                
            }
            else{
            return <Component {...props}/>;
            }
        }}
    
    />
)

const mapStatetoProps = state =>({
    auth:state.auth
});

export default connect(mapStatetoProps)(PrivateRoute);
