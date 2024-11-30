import { Link, useNavigate } from "react-router-dom";
import React , { useState } from "react";
import { registrationAPI , organizationAPI } from "../utils/apis";
import AppInput from "../components/input";
import useForm from "../hooks/form";
import { AppSelect } from "../components/select";
import { notification } from 'antd';
import Navbar from "./navbar";
import UserNav from "./usernav";

const RegistrationPage = () => {
    const orgForm = useForm();
    const personalForm = useForm();
    const navigate = useNavigate();
    const [type, setType]= useState('');
    const [formValid, setFormValid] = useState(false);

    const [value, setValue] = useState('');

    // const handleKeyPress = (e) => {
    //     const keyCode = e.keyCode || e.which;
    //     const keyValue = String.fromCharCode(keyCode);
    //     if (!/\d/.test(keyValue)) {
    //         e.preventDefault();
    //         notification.error({
    //             description: "Please enter numbers only.",
    //             placement: "topRight"
    //         });
    //     }
    // };
    const handleKeyPress = (e, maxLength) => {
        const keyCode = e.keyCode || e.which;
        const keyValue = String.fromCharCode(keyCode);
        const inputLength = e.target.value.length;
    
        if (inputLength >= maxLength) {
            e.preventDefault();
            notification.error({
                description: `Maximum length (${maxLength} characters) reached.`,
                placement: "topRight"
            });
        } else if (!/\d/.test(keyValue)) {
            e.preventDefault();
            notification.error({
                description: "Please enter numbers only",
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
        if(!/[0-9a-zA-Z,./:# -]/.test(e.key)){
            e.preventDefault();
            notification.error({
                description: "Please don't add special characters",
                placement: "topRight"
            });
        }
    };
    const validateForm = () => {
        let missingFields = [];
        const numericRegex = /^[0-9]+$/;

        if (type === 'organization') {
            if (!orgForm.value.orgName) missingFields.push("Organization Name");
            if (!orgForm.value.poc) missingFields.push("Key of Person/POC");
            if (!orgForm.value.phone) missingFields.push("POC/Organization Contact No.");
            if (!orgForm.value.regdNo) missingFields.push("Registration No.");
            if (!orgForm.value.location) missingFields.push("Location");
        } else {
            if (!(personalForm.value.voterId || personalForm.value.aadharId || personalForm.value.rationId)) missingFields.push("Voter ID or Adhaar Card or Ration Card");
            if (!personalForm.value.phone) missingFields.push("Contact Number");
            if (!personalForm.value.firstName) missingFields.push("First Name");
            if (!personalForm.value.lastName) missingFields.push("Last Name");
            if (!personalForm.value.village) missingFields.push("Village/Location");
            if (!personalForm.value.ConstituencywithVoteId) missingFields.push("Constituency Associated with Voter ID");
        }

        if (personalForm.value.address && numericRegex.test(personalForm.value.address)) missingFields.push("Address should not be only numeric");

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
        if (!type) {
            notification.error({
                description: "Please select a registration type",
                placement: "topRight"
            });
            return;
        }
    
        if (!validateForm()) {
            notification.error({
                description: "Please fill the form correctly",
                placement: "topRight"
            });
            return;
        }
    
        if (type === 'organization') {
            organization();
        } else {
            registration();
        }
    };

    const registration = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const { data } = await registrationAPI({ type, ...personalForm.value });
            handleResponse(data);
        } catch (error) {
            handleErrorResponse();
        }
    };

    const organization = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const { data } = await organizationAPI({ type, ...orgForm.value });
            handleResponse(data);
        } catch (error) {
            handleErrorResponse();
        }
    };

    const handleResponse = (data) => {
        document.body.classList.remove("loading-indicator");
        if (data.status) {
            notification.success({
                description: data.message,
                placement: "topRight"
            });
            navigate(`/bookappointment/${data?.newPersonal?._id}`);
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

    // const registration = async () => {
    //     try {
    //         document.body.classList.add("loading-indicator");
    //         const payload = type === 'organization' ? orgForm.value : personalForm.value;
    //         const { data } = await registrationAPI({ type, ...payload });
    //         if(data.status = true){
    //             document.body.classList.remove("loading-indicator");
    //             notification.success({
    //                 description: data.message,
    //                 placement: "topRight"
    //             });
    //             navigate(`/bookappointment/${data?.newPersonal?._id}`);
    //         }
    //         else{
    //             document.body.classList.remove("loading-indicator");
    //             notification.error({
    //                 description: "Please fill the Form Currectly",
    //                 placement: "bottomRight"
    //             });
    //         }
    //     } catch (error) {
    //         document.body.classList.remove("loading-indicator");
    //         notification.error({
    //             description: "Something went wrong, Check your Internet Connection",
    //             placement: "bottomRight"
    //         });
    //     }
    // };

    // const organization = async () => {
    //     try {
    //         document.body.classList.add("loading-indicator");
    //         const payload = type === 'organization' ? orgForm.value : personalForm.value;
    //         const { data } = await organizationAPI({ type, ...payload });
    //         if(data.status = true){
    //             document.body.classList.remove("loading-indicator");
    //             notification.success({
    //                 description: data.message,
    //                 placement: "topRight"
    //             });
    //             // navigate(`/bookappointment/${data?.newPersonal?._id}`);
    //         }
    //         else{
    //             document.body.classList.remove("loading-indicator");
    //             notification.error({
    //                 description: "Something went wrong",
    //                 placement: "bottomRight"
    //             });
    //         }
    //     } catch (error) {
    //         document.body.classList.remove("loading-indicator");
    //         notification.error({
    //             description: "Something went wrong",
    //             placement: "bottomRight"
    //         });
    //     }
    // };
    const [showhide, setShowhide]=useState('');
        const handleshowhide=(event)=>{
            const getregtype = event.target.value;
            setShowhide(getregtype);
        };
    
    return (
        <>
            <div id="wrapper">
                <Navbar></Navbar>
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                                <i className="fa fa-bars"></i>
                            </button>
                            <UserNav></UserNav>
                        </nav>
                        <div className="container-fluid">
                            <h1 className="h3 mb-2 text-gray-800">Add Person</h1>
                            <p className="mb-4">Create an account for appointment booking</p>
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Registration Form</h6>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <form onSubmit={handleSubmit}>
                                            <div className="row justify-content-start">
                                                <div className="col-md-4">
                                                    <AppSelect
                                                        name="type"
                                                        value={type}
                                                        onChange={(e) => setType(e)}
                                                        label="Registration Type"
                                                        options={[ ...(type === '' ? [{
                                                            label: "Select type",
                                                            value: ""
                                                        }] : []), {
                                                            label: "Personal",
                                                            value: "personal"
                                                        }, {
                                                            label: "Organization",
                                                            value: "organization"
                                                        }]}
                                                        validation={{
                                                            required: true
                                                        }}
                                                    />
                                                </div>
                                                {
                                                    type ==='personal' && (
                                                        <>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="voterId">Voter ID</label>
                                                                <AppInput type="text" className="form-control" name="voterId" id="voterId" placeholder="" maxLength={10} form={personalForm} onKeyPress={(e)=>handleChange(e)}/>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="adhaar">Adhaar Card</label>
                                                                <AppInput type="text" className="form-control" name="aadharId" id="adhaar" placeholder="" minLength={12} maxLength={12} value={value} onKeyPress={(e) => handleKeyPress(e, 12)} form={personalForm} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="rationCard">Food / Ration Card</label>
                                                                <AppInput type="text" className="form-control" name="rationId" id="rationCard" placeholder="" maxLength={10} form={personalForm}  onKeyPress={(e)=>handleChange(e)}/>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="phone">Contact Number</label>
                                                                <AppInput type="text" className="form-control" placeholder="" name="phone" id="phone" minLength={10} maxLength={10} value={value} onKeyPress={(e) => handleKeyPress(e, 10)} form={personalForm} validation={{ required: true }} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="firstName">First Name</label>
                                                                <AppInput type="text" className="form-control" placeholder="" name="firstName" id="firstName" maxLength={30} form={personalForm}  onKeyPress={(e)=>handleTextonly(e)} validation={{ required: true }} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="lastName">Last Name</label>
                                                                <AppInput type="text" className="form-control" placeholder="" name="lastName" id="lastName" maxLength={30} form={personalForm} onKeyPress={(e)=>handleTextonly(e)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="location">Village/Location</label>
                                                                <AppInput type="text" className="form-control" name="village" id="location" placeholder="Coming From" maxLength={30} form={personalForm} validation={{ required: true }} onKeyPress={(e)=>handleTextonly(e)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="address">Address</label>
                                                                <AppInput type="text" className="form-control" name="address" id="address" placeholder="Location Details" maxLength={150} form={personalForm} validation={{ required: true }} onKeyPress={(e)=>handleChangeAddress(e)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="constituency">Constituency Associated with Voter ID</label>
                                                                <AppInput type="text" className="form-control" name="ConstituencywithVoteId" id="constituency" placeholder="Applicant Constituency" maxLength={30} form={personalForm} validation={{ required: true }}  onKeyPress={(e)=>handleChange(e)}/>
                                                            </div>
                                                        </div>
                                                        </>
                                                    )
                                                }

                                                {
                                                    type === 'organization' && (
                                                        <>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="orgName">Organisation Name</label>
                                                                <AppInput type="text" className="form-control" placeholder="" name="orgName" id="orgName" form={orgForm} maxLength={30} validation={{ required: true }} onKeyPress={(e)=>handleChange(e)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="address">Address</label>
                                                                <AppInput type="text" className="form-control" placeholder="" name="address" id="address" form={orgForm} maxLength={50} validation={{ required: true }} onKeyPress={(e)=>handleChangeAddress(e)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="poc">Key of Person/POC</label>
                                                                <AppInput type="text" className="form-control" placeholder="" name="poc" id="poc" form={orgForm} maxLength={20} validation={{ required: true }} onKeyPress={(e)=>handleChange(e)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="phone">POC/Organisation Contact No.</label>
                                                                <AppInput type="text" className="form-control" name="phone" id="phone" placeholder="" form={orgForm} maxLength={10} onKeyPress={(e) => handleKeyPress(e, 10)} validation={{ required: true }} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="regdNo">Registration No.</label>
                                                                <AppInput type="text" className="form-control" name="regdNo" id="regdNo" placeholder="" form={orgForm} maxLength={20} validation={{ required: true }} onKeyPress={(e)=>handleChange(e)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label for="location">Location (Coming from)</label>
                                                                <AppInput type="text" className="form-control" name="location" id="location" placeholder="" form={orgForm} maxLength={50} validation={{ required: true }} onKeyPress={(e)=>handleChange(e)} />
                                                            </div>
                                                        </div>
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <button type="submit" className="btn btn-primary">Submit</button>
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

export default RegistrationPage;