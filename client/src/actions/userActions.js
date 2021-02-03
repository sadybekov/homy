import { SET_USER, LOG_OUT } from "./types";
import swal from "sweetalert";

const setUser = (payload) => ({ type: SET_USER, payload });

export const logUserOut = () => ({ type: LOG_OUT });

export const fetchUser = (userInfo) => (dispatch) => {
    fetch(`http://localhost:3008/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
    })
        .then((res) => {
            localStorage.setItem("token", res.headers.get("x-auth-token"));
            return res.json();
        })
        .then((data) => dispatch(setUser(data)))
        .catch(err => {
            dispatch(logUserOut())
            loginErrorMsg()
        })
};
export const fetchUserAsManager = (userInfo) => (dispatch) => {
    fetch(`http://localhost:3008/api/login/manager`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
    })
        .then((res) => {
            localStorage.setItem("token", res.headers.get("x-auth-token"));
            return res.json();
        })
        .then((data) => {
            localStorage.setItem("isManager", true);
            dispatch(setUser(data))
        })
        .catch(err => {
            dispatch(logUserOut())
            loginErrorMsg()
        })
};

export const register = (userInfo) => (dispatch) => {
    fetch(`http://localhost:3008/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
    })
        .then((res) => {
            localStorage.setItem("token", res.headers.get("x-auth-token"));
            return res.json();
        })
        .then((data) => {
            if (data.isManager) localStorage.setItem("isManager", true);
            dispatch(setUser(data))
        })

};

export const autoLogin = () => (dispatch) => {
    if (localStorage.getItem("token")) {
        fetch(`http://localhost:3008/api/login`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "x-auth-token": `${localStorage.getItem("token")}`,
            },
        })
            .then((res) => {
                localStorage.setItem("token", res.headers.get("x-auth-token"));
                return res.json();
            })
            .then((data) => {
                if (data.isManager) localStorage.setItem("isManager", true);
                dispatch(setUser(data))
            })
            .catch(err => {
                dispatch(logUserOut())
            })
    }
};
const loginErrorMsg = () => {
    swal({
        title: "Error",
        text: 'Credential not valid',
        icon: "error",
        button: "Dismiss",
    });
}