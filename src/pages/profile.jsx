import { Link } from "react-router-dom";
import React , { useState , useEffect } from "react";
import { profileAPI } from "../utils/apis";
import AppInput from "../components/input";
import { AppSelect } from "../components/select";
import useForm from "../hooks/form";
import { notification } from 'antd';
import Navbar from "./navbar";
import UserNav from "./usernav";

const ProfilePage = () => {
    const _form = useForm({});
    const [type, setType]= useState('');

    var firstNameData = sessionStorage.getItem('firstName');
    var lastNameData = sessionStorage.getItem('lastName');
    var phoneData = sessionStorage.getItem('phone');
    var emailData = sessionStorage.getItem('email');
    var presentAddressData = sessionStorage.getItem('presentAdd');
    var permanentAddressData = sessionStorage.getItem('permanentAdd');
    var idTypeData = sessionStorage.getItem('proofType');
    var idValueData = sessionStorage.getItem('proofIdNumber');

    const handleKeyPress = (e) => {
        const keyCode = e.keyCode || e.which;
        const keyValue = String.fromCharCode(keyCode);
        // Allow only numeric characters (0-9)
        if (!/\d/.test(keyValue)) {
            e.preventDefault();
            notification.error({
                description: "Please enter numbers only.",
                placement: "topRight"
            });
        }
    };
    const handleChange = (e) => {
        if(!/[0-9a-zA-Z ]/.test(e.key)){
            e.preventDefault();
            notification.error({
                description: "Please don't add special characters",
                placement: "topRight"
            });
        }
    };
    const handleTextonly = (e) => {
        if(!/[a-zA-Z ]/.test(e.key)){
            e.preventDefault();
            notification.error({
                description: "Please enter text only",
                placement: "topRight"
            });
        }
    };
    const handleChangeAddress = (e) => {
        if(!/[0-9a-zA-Z,./: -]/.test(e.key)){
            e.preventDefault();
            notification.error({
                description: "Please don't add special characters",
                placement: "topRight"
            });
        }
    };
    const handleChangeMail = (e) => {
        if(!/[0-9a-zA-Z.@_]/.test(e.key)){
            e.preventDefault();
            notification.error({
                description: "Please use proper mail id",
                placement: "topRight"
            });
        }
    };
    const validateForm = () => {
        let missingFields = [];

        if (!_form.value.firstName) missingFields.push("First Name");
        if (!_form.value.lastName) missingFields.push("Last Name");
        if (!_form.value.phone) missingFields.push("Email ID");
        if (!_form.value.email) missingFields.push("Contact Number");
        if (!_form.value.presentAdd) missingFields.push("Present Address");
        if (!_form.value.permanentAdd) missingFields.push("Permanent Address");
        if (!_form.value.proofType) missingFields.push("Select ID Proof");
        if (!_form.value.proofIdNumber) missingFields.push("ID Proof Number");

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
            profileUpdate();
        }
    };

    const handleResponse = (data) => {
        document.body.classList.remove("loading-indicator");
        if (data.status) {
            notification.success({
                description: data.message,
                placement: "topRight"
            });
        } else {
            notification.error({
                description: data.message || "Something went wrong",
                placement: "bottomRight"
            });
        }
    };

    const handleErrorResponse = () => {
        document.body.classList.remove("loading-indicator");
        notification.error({
            description: "Something went wrong, Check your Internet Connection",
            placement: "bottomRight"
        });
    };

    const profileUpdate = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const { data } = await profileAPI(_form.value);

            if (data.status === true) {
                document.body.classList.remove("loading-indicator");
                notification.success({
                    description: data.message + ' - Re-Login the Application for see Updates',
                    placement: "topRight"
                });
            } else {
                document.body.classList.remove("loading-indicator");
                handleResponse(data);
            }
        } catch (e) {
            document.body.classList.remove("loading-indicator");
            handleErrorResponse();
        }
    };

    return (
        <>
            <div id="wrapper">
                <Navbar></Navbar>
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                            <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                                <i class="fa fa-bars"></i>
                            </button>
                            <UserNav></UserNav>
                        </nav>
                        <div className="container-fluid">
                            <h1 className="h3 mb-2 text-gray-800">Profile Details</h1>
                            <p className="mb-4">You can update your profile details here</p>
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">User Profile Details</h6>
                                </div>
                                <div className="card-body">
                                    <div className="row align-items-center justify-content-center">
                                        <div className="col-md-10 table-responsive">
                                            <table className="table table-bordered table-hover">
                                                <tbody>
                                                <tr>
                                                    <th>First Name</th>
                                                    <td>{firstNameData}</td>
                                                    <th>Last Name</th>
                                                    <td>{lastNameData}</td>
                                                </tr>
                                                <tr>
                                                    <th>Phone Number</th>
                                                    <td>{phoneData}</td>
                                                    <th>Mail ID</th>
                                                    <td>{emailData}</td>
                                                </tr>
                                                <tr>
                                                    <th>Present Address</th>
                                                    <td>{presentAddressData}</td>
                                                    <th>Permanent Address</th>
                                                    <td>{permanentAddressData}</td>
                                                </tr>
                                                <tr>
                                                    <th>ID Proof</th>
                                                    <td>{idTypeData}</td>
                                                    <th>ID Number</th>
                                                    <td>{idValueData}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <h5 className="text-primary mt-2 mb-2"><b>Edit User Profile Detials :</b></h5>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label for="firstName">First Name</label>
                                                    <AppInput type="text" className="form-control" name="firstName" id="firstName" value={firstNameData} form={_form} validation={{ required: true }} maxLength={30} onKeyPress={(e)=>handleTextonly(e)} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label for="lastName">Last Name</label>
                                                    <AppInput type="text" className="form-control" name="lastName" id="lastName" form={_form} maxLength={30} onKeyPress={(e)=>handleTextonly(e)} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label for="email">Email ID</label>
                                                    <AppInput type="text" className="form-control" name="email" id="email" form={_form} maxLength={60} onKeyPress={(e)=>handleChangeMail(e)} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label for="phone">Contact Number</label>
                                                    <AppInput type="text" className="form-control" name="phone" id="phone" form={_form} validation={{ required: true }}  minLength={10} maxLength={10} onKeyPress={handleKeyPress} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label for="presentAdd">Present Address</label>
                                                    <AppInput type="text" className="form-control" name="presentAdd" id="presentAdd" form={_form} maxLength={150} onKeyPress={(e)=>handleChangeAddress(e)} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label for="permanentAdd">Permanent Address</label>
                                                    <AppInput type="text" className="form-control" name="permanentAdd" id="permanentAdd" form={_form} maxLength={60} onKeyPress={(e)=>handleChangeAddress(e)} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <AppSelect
                                                    name="proofType"
                                                    form={_form}
                                                    value={type}
                                                    onChange={(e) => setType(e)}
                                                    label="Select ID Proof"
                                                    options={[ ...(type === '' ? [{
                                                        label: "Select type",
                                                        value: ""
                                                    }] : []), {
                                                        label: "Voter ID",
                                                        value: "voterId"
                                                    }, {
                                                        label: "Adhaar Card",
                                                        value: "adhaar"
                                                    }, {
                                                        label: "Food/Ration Card",
                                                        value: "rationCard"
                                                    }]}
                                                    validation={{
                                                        required: true
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label for="proofIdNumber">ID Proof Number</label>
                                                    <AppInput type="text" className="form-control" name="proofIdNumber" id="proofIdNumber" form={_form}  maxLength={12} onKeyPress={(e)=>handleChange(e)}/>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Save</button>
                                    </form>
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

export default ProfilePage;