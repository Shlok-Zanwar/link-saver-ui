import React from "react";
import { Form, Input, Button, Alert, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { APP_TOKEN_KEY } from "../Config";
import "./LoginCSS.css";
import OtpInput from "react-otp-input";
import { TbDeviceMobileMessage } from "react-icons/tb";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { BiLockAlt } from "react-icons/bi";
import MyConditional from "../Components/MyConditional";

export default function Login() {
    const [details, setDetails] = React.useState({
        email: "",
        password: "",
        otp: 0,
        otpVisible: false,
        verify_account: false,
        reset_password: false,
    });

    const submitLogin = () => {
        // console.log("Received values of form: ", values);
        // test email regex
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(details.email)) {
            message.error("Invalid Email");
            return;
        }
        // test password regex
        if (!details.password || !details.password.length) {
            message.error("Invalid Password");
            return;
        }
        axios
            .post("/login", {
                email: details.email,
                password: details.password,
                otp: details.otp,
                verify_account: details.verify_account,
                reset_password: details.reset_password,
            })
            .then(res => {
                // console.log(res.data);
                localStorage.setItem(APP_TOKEN_KEY, res.data.token);
                window.location.href = "/";
            })
            .catch(err => {
                if (err?.response?.data?.detail === "Account not verified!") {
                    message.error("Account not verified! Please enter OTP");
                    setDetails(prev => ({
                        ...prev,
                        otpVisible: true,
                        verify_account: true,
                    }));
                }
                // err.handleGlobally && err.handleGlobally("Login Error");
            });
    };

    const resetPassword = () => {
        axios
            .post("/request-reset-password", {
                email: details.email,
            })
            .then(res => {
                console.log(res.data);
                setDetails(prev => ({
                    ...prev,
                    otpVisible: true,
                    reset_password: true,
                }));
                message.success("Reset password OTP sent to your email");
            })
            .catch(err => {
                err.handleGlobally && err.handleGlobally("Reset Password Error");
            });
    };


    const setDetailsKey = (key, value) => {
        setDetails(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div
            style={{
                width: "100%",
                height: "95vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <div className="card">
                <div className="card2">
                    <div className="form">
                        <p id="heading">Login</p>
                        <div className="field">
                            <MdOutlineAlternateEmail className="input-icon" />
                            <input type="text" className="input-field" placeholder="Email" value={details.email} onChange={e => setDetailsKey("email", e.target.value)} />
                        </div>
                        <div className="field">
                            <BiLockAlt className="input-icon" />
                            <input type="password" className="input-field" placeholder="Password" value={details.password} onChange={e => setDetailsKey("password", e.target.value)} />
                        </div>
                        <MyConditional visible={details.verify_account}>
                            <Alert showIcon={false} type="warning" message="You need to enter OTP for the first time! The password you enter now will be your new password" />
                        </MyConditional>
                        <MyConditional visible={details.reset_password}>
                            <Alert showIcon={false} type="warning" message="Enter OTP to reset password! The password you enter now will be your new password" />
                        </MyConditional>
                        <MyConditional visible={details.otpVisible}>
                            <div className="field">
                                <TbDeviceMobileMessage className="input-icon" />
                                <input type="number" className="input-field" placeholder="otp" value={details.otp} onChange={e => setDetailsKey("otp", e.target.value)} />
                            </div>
                        </MyConditional>
                        <button className="button3" onClick={() => {submitLogin()}}>Login</button>
                        <span onClick={()  => resetPassword()}>Reset Password !</span>
                    </div>
                </div>
            </div>
            <span style={{ marginTop: '30px'}}>Version : 1.1.0</span>
        </div>
    );
}
