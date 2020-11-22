import axios from 'axios';
import React, { Component } from 'react';
import speakeasy from 'speakeasy';
import { useAlert } from 'react-alert'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {serverip} from "./serverip"

export const loadUser = () => {

    return (dispatch, getState) => {
        dispatch({ type: "USER_LOADING" });
        const lastlogin_ts = localStorage.getItem("timestamp");
        const current_ts = new Date().getTime();
        console.log(current_ts);
        const ts_diff = current_ts - lastlogin_ts;
        console.log(ts_diff)
        const token = getState().auth.token;

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }

        axios.get(`${serverip}/api/auth/user`, config)
            .then(res => {
                if (res.data.username == "admin" && ts_diff > 6000000) {
                    dispatch({
                        type: 'USER_LOADING', user: res.data
                    });
                    const otp = prompt("Enter otp. Last login session elapsed 10 minutes.");
                    const verify = speakeasy.totp.verify({
                        secret: 'BbL021*V{:{0G:2?C%5Xn20ywfVkh;tf',
                        encoding: 'ascii',
                        token: otp
                    })
                    if (verify === true) {
                        console.log("verified");
                        dispatch({
                            type: 'USER_LOADED', user: res.data
                        });
                    }
                    else {
                        console.log("not verified")
                        alert("Otp not correct. Re-login")
                        dispatch({
                            type: "AUTH_ERROR"
                        })
                    }
                    console.log(verify)
                    localStorage.setItem("timestamp", new Date().getTime())
                }
                else if(res.data.username=='admin' && ts_diff<60000000){
                    dispatch({
                        type: 'USER_LOADED', user: res.data
                    });
                }
                else if(res.data.username!='admin'){
                    dispatch({
                        type: 'USER_LOADED', user: res.data
                    });
                    const user = res.data;
                    const loginsuccess = () => {
                    toast.success(`Welcome back ${user.first_name} ! 😊`, {
                        autoClose: 2000,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    })
                }
                { loginsuccess() }
                }
            }).catch(err => {
                dispatch({
                    type: "AUTH_ERROR"
                })
            });


    }
}




export const login = (username, password) => dispatch => {
    let toastId = null;
    const loading = () => toastId = toast("Loading...", { autoClose: false, position: toast.POSITION.BOTTOM_RIGHT });
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    { loading() }
    const body = JSON.stringify({ username, password })
    const d = new Date();
    const ts = d.getTime();
    console.log(serverip)
    axios.post(`${serverip}/api/auth/login`, body, config)
        
        .then(res => {
            dispatch({
                type: "LOGIN_SUCCESS",
                data: res.data
            });
            localStorage.setItem("timestamp", ts);
            const user = res.data.user;
            const success = () => toast.update(toastId, { type: toast.TYPE.SUCCESS, autoClose: 2000, render: `Logged in as ${user.first_name}  😊`, });
            { success() }
        })
        .catch(err => {
            dispatch({
                type: "LOGIN_FAILED",
            });
            const failed = () => toast.update(toastId, { type: toast.TYPE.ERROR, autoClose: 2000, render: `Login failed! 😕`, });
            { failed() }
            console.log(err.response.data)
            const errors = {
                msg: err.response.data,
                status: err.response.status
            }
            console.log(errors.msg)
            dispatch({
                type: "GET_ERRORS",
                data: errors
            })
        });
}

//LOGOUT USER
export const logout = () => {

    return (dispatch, getState) => {

        const token = getState().auth.token;
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }

        axios.post(`${serverip}/api/auth/logout`, null, config)
            .then(res => {
                dispatch({
                    type: 'LOGOUT_SUCCESS'

                });
                localStorage.removeItem("timestamp");
                localStorage.removeItem("image");
                const logoutsuccess = () => {
                    toast.success(`Logged out!`, {
                        autoClose: 2000,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    })
                }
                { logoutsuccess() }

            }).catch(err => {
                dispatch({
                    type: 'LOGOUT_FAILED'
                })
            });

    }
}