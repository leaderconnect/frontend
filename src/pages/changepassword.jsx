import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { passwordAPI } from "../utils/apis";
import { notification } from 'antd';
import Navbar from "./navbar";
import UserNav from "./usernav";

const ChangepasswordPage = () => {
    const [_form, setForm] = useState({ password: "", newPassword: "", newPassword1: "" });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); // State variable to toggle password visibility
    const [showNewPassword, setShowNewPassword] = useState(false); // State variable to toggle password visibility
    const [showNewPassword1, setShowNewPassword1] = useState(false); // State variable to toggle password visibility

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const validateForm = () => {
        let missingFields = [];

        if (!_form.password) missingFields.push("Old Password");
        if (!_form.newPassword) missingFields.push("New Password");
        if (!_form.newPassword1) missingFields.push("Confirm Password");

        if (missingFields.length > 0) {
            const missingFieldsString = missingFields.join(', ');
            notification.error({
                description: `Please fill the following fields: ${missingFieldsString}`,
                placement: "topRight"
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        } else {
            changepassword();
        }
    };

    const changepassword = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const { data } = await passwordAPI(_form);

            if (data.status === true) {
                document.body.classList.remove("loading-indicator");
                notification.success({
                    description: data.message,
                    placement: "topRight"
                });
            } else {
                document.body.classList.remove("loading-indicator");
                notification.error({
                    description: data.message,
                    placement: "topRight"
                });
            }
        } catch (e) {
            document.body.classList.remove("loading-indicator");
            notification.error({
                description: "Something went wrong",
                placement: "topRight"
            });
        } finally {
            document.body.classList.remove("loading-indicator");
        }
    };

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };
    const toggleNewPassword1Visibility = () => {
        setShowNewPassword1(!showNewPassword1);
    };

    return (
        <>
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                                <i className="fa fa-bars"></i>
                            </button>
                            <UserNav />
                        </nav>
                        <div className="container-fluid">
                            <h1 className="h3 mb-2 text-gray-800">Change Password</h1>
                            <p className="mb-4">You can change your login password here</p>
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Change Password</h6>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <form onSubmit={handleSubmit}>
                                            <div className="row justify-content-center">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="password">Old Password</label>
                                                        <div className="inner-addon right-addon">
                                                            <i className={`glyphicon far ${showPassword ? "fa-eye" : "fa-eye-slash"}`} onClick={togglePasswordVisibility} style={{ pointerEvents: 'auto', cursor: 'pointer' }}></i>
                                                            <input type={showPassword ? "text" : "password"} className="form-control" name="password" id="password" placeholder="Enter current password" value={_form.password} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row justify-content-center">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="newPassword">New Password</label>
                                                        <div className="inner-addon right-addon">
                                                            <i className={`glyphicon far ${showNewPassword ? "fa-eye" : "fa-eye-slash"}`} onClick={toggleNewPasswordVisibility} style={{ pointerEvents: 'auto', cursor: 'pointer' }}></i>
                                                            <input type={showNewPassword ? "text" : "password"} className="form-control" name="newPassword" id="newPassword" placeholder="Enter new password" value={_form.newPassword} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row justify-content-center">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="newPassword1">Re-Enter Password</label>
                                                        <div className="inner-addon right-addon">
                                                            <i className={`glyphicon far ${showNewPassword1 ? "fa-eye" : "fa-eye-slash"}`} onClick={toggleNewPassword1Visibility} style={{ pointerEvents: 'auto', cursor: 'pointer' }}></i>
                                                            <input type={showNewPassword1 ? "text" : "password"} className="form-control" name="newPassword1" id="newPassword1" placeholder="Confirm password" value={_form.newPassword1} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row justify-content-center">
                                                <div className="col-md-6">
                                                    <button type="submit" className="btn btn-primary">Save</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="sticky-footer bg-white">
                        <div className="container my-auto">
                            <div className="copyright text-center my-auto">
                                <span>Copyright &copy; Leader Connect 2022</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default ChangepasswordPage;
