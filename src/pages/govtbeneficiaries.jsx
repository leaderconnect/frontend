import { Link, useNavigate } from "react-router-dom";
import React , { useState } from "react";
import Select from "react-select";
import { govtbeneficiariesAPI } from "../utils/apis";
import AppInput from "../components/input";
import { AppSelect } from "../components/select";
import useForm from "../hooks/form";
import { notification } from 'antd';
import Navbar from "./navbar";
import UserNav from "./usernav";

const GovtBeneficiariesPage = () => {
    const _form = useForm({});
    const navigate = useNavigate();
    const [type, setType]= useState('');
    const [value, setValue] = useState('');

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
        let isFormValid = true;
        const numericRegex = /^[0-9]+$/;

        if (!_form.value.date) missingFields.push("Date");
        if (!_form.value.mandal) missingFields.push("Mandal");
        if (!_form.value.village) missingFields.push("Village");
        if (!(_form.value.voterId || _form.value.aadharId || _form.value.rationId)) missingFields.push("Voter ID or Adhaar Card or Ration Card");
        if (!_form.value.schemName) missingFields.push("Name of Govt Scheme");
        if (!_form.value.amountBenfitPerYear) missingFields.push("Amount Binefited Per Year");
        if (!_form.value.amountBenfitPerMonth) missingFields.push("Amount Binefited Per Month");
        if (!_form.value.voterName) missingFields.push("Voter Name");
        if (!_form.value.houseName) missingFields.push("Voter House No.");
        if (!_form.value.phone) missingFields.push("Voter Phone No.");

        if (_form.value.address && numericRegex.test(_form.value.address)) missingFields.push("Address should not be only numeric");
        if (_form.value.houseName && numericRegex.test(_form.value.houseName)) missingFields.push("Voter House No. should not be only numeric");

        if (missingFields.length > 0) {
            const missingFieldsString = missingFields.join(', ');
            notification.error({
                description: `Please fill the following fields: ${missingFieldsString}`,
                placement: "topRight"
            });
            isFormValid = false;
        }

        const amountBenfitPerYear = parseFloat(_form.value.amountBenfitPerYear);
        const amountBenfitPerMonth = parseFloat(_form.value.amountBenfitPerMonth);

        if (amountBenfitPerYear <= amountBenfitPerMonth) {
            notification.error({
                description: "Amount Benefited Per Year must be greater than the Amount Benefited Per Month.",
                placement: "topRight"
            });
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        } else {
            govtbeneficiaries();
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

    const govtbeneficiaries = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const { data } = await govtbeneficiariesAPI(_form.value);
            if (data.status === true) {
            document.body.classList.remove("loading-indicator");
            notification.success({
                description: data.message,
                placement: "topRight"
            });

            _form.reset({
                date: "",
                mandal: "",
                village:"",
                address:"",
                voterId:"",
                aadharId:"",
                rationId:"",
                schemName:"",
                amountBenfitPerYear:"",
                amountBenfitPerMonth:"",
                voterName:"",
                houseName:"",
                phone:""
            });
            } else {
                document.body.classList.remove("loading-indicator");
                handleResponse(data);
            }
        } catch (error) {
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
                            <h1 class="h3 mb-3 text-gray-800">Beneficiaries of Govt Scheme</h1>
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Govt Beneficiary Add</h6>
                                </div>
                                <div class="card-body">
                                    <div>
                                        <form onSubmit={handleSubmit}>
                                            <div class="row justify-content-start">
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="date">Date</label>
                                                <AppInput type="date" name="date" id="date" class="form-control" placeholder="" form={_form} validation={{ required: true }} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="mandal">Mandal</label>
                                                <AppInput type="text" name="mandal" id="mandal" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={30} onKeyPress={(e)=>handleTextonly(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="village">Village</label>
                                                <AppInput type="text" name="village" id="village" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={30} onKeyPress={(e)=>handleTextonly(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="address">Address</label>
                                                <AppInput type="text" name="address" id="address" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={150} onKeyPress={(e)=>handleChangeAddress(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="voterId">Voter ID of Beneficiary</label>
                                                <AppInput type="text" name="voterId" id="voterId" class="form-control" placeholder="" form={_form} minLength={10} maxLength={10} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="aadharId">Adhaar No. of Beneficiary</label>
                                                <AppInput type="text" name="aadharId" id="aadharId" class="form-control" placeholder="" form={_form} validation={{ required: true }} minLength={12} maxLength={12} onKeyPress={handleKeyPress} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="rationId">Ration Card No. of Beneficiary</label>
                                                <AppInput type="text" name="rationId" id="rationId" class="form-control" placeholder="" form={_form} minLength={10} maxLength={10} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                    <AppSelect
                                                        name="schemName"
                                                        form={_form}
                                                        label="Name of Govt Scheme"
                                                        options={[ {
                                                            label: "Select Scheme",
                                                            value: ""
                                                        }, {
                                                            label: "Raithu Bhandu",
                                                            value: "raithu bhandu"
                                                        }, {
                                                            label: "Widow Pension",
                                                            value: "widow pension"
                                                        }, {
                                                            label: "PH Penison",
                                                            value: "ph penison"
                                                        }, {
                                                            label: "Old Age Pension",
                                                            value: "old age pension"
                                                        }, {
                                                            label: "Raithu Bhima",
                                                            value: "raithu bhima"
                                                        }, {
                                                            label: "Subcidy Loans",
                                                            value: "subcidy loans"
                                                        }, {
                                                            label: "Society Loans",
                                                            value: "society loans"
                                                        }, {
                                                            label: "Double Bedroom House",
                                                            value: "double bedroom house"
                                                        }, {
                                                            label: "Tractor Loan",
                                                            value: "tractor loan"
                                                        }, {
                                                            label: "Others",
                                                            value: "others"
                                                        }]}
                                                        validation={{
                                                            required: true
                                                        }}
                                                    />
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="amountBenfitPerYear">Amount Benefited Per Year</label>
                                                <AppInput type="text" name="amountBenfitPerYear" id="amountBenfitPerYear" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={16} onKeyPress={handleKeyPress}/>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="amountBenfitPerMonth">Amount Benefited Per Month</label>
                                                <AppInput type="text" name="amountBenfitPerMonth" id="amountBenfitPerMonth" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={16} onKeyPress={handleKeyPress} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="voterName">Voter Name</label>
                                                <AppInput type="text" name="voterName" id="voterName" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={40} onKeyPress={(e)=>handleTextonly(e)}/>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="houseName">Voter House No.</label>
                                                <AppInput type="text" name="houseName" id="houseName" class="form-control" placeholder="" form={_form} validation={{ required: false }} maxLength={30} onKeyPress={(e)=>handleChangeAddress(e)}/>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="phone">Voter Phone No.</label>
                                                <AppInput type="text" name="phone" id="phone" class="form-control" placeholder="" minLength={10} maxLength={10} value={value} onKeyPress={handleKeyPress} form={_form} validation={{ required: true }}/>
                                                </div>
                                            </div>
                                            </div>
                                            <button type="submit" class="btn btn-primary">Save</button>
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

export default GovtBeneficiariesPage;