import React , { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { villageleaderAPI } from "../utils/apis";
import AppInput from "../components/input";
import useForm from "../hooks/form";
import { notification } from 'antd';
import Navbar from "./navbar";
import UserNav from "./usernav";

const VillageLeadersPage = () => {
    const _form = useForm({});
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
        const numericRegex = /^[0-9]+$/;

        if (!_form.value.date) missingFields.push("Entry Date");
        if (!_form.value.mandal) missingFields.push("Mandal");
        if (!_form.value.village) missingFields.push("Village");
        if (!_form.value.leaderName) missingFields.push("Leader Name");
        if (!_form.value.govtDes) missingFields.push("Government Designation");
        if (!_form.value.party) missingFields.push("Party");
        if (!_form.value.partyDes) missingFields.push("Party Designation");
        if (!_form.value.phone) missingFields.push("Phone Number");
        if (!(_form.value.voterId || _form.value.aadharId || _form.value.rationId)) missingFields.push("Voter ID or Adhaar Card or Ration Card");
        
        if (_form.value.address && numericRegex.test(_form.value.address)) missingFields.push("Address should not be only numeric");
        if (_form.value.govtDes && numericRegex.test(_form.value.govtDes)) missingFields.push("Government Designation should not be only numeric");
        if (_form.value.party && numericRegex.test(_form.value.party)) missingFields.push("Party should not be only numeric");
        if (_form.value.partyDes && numericRegex.test(_form.value.partyDes)) missingFields.push("Party Designation should not be only numeric");

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
            villageleader();
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

    const villageleader = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const { data } = await villageleaderAPI(_form.value);
            if (data.status === true) {
            document.body.classList.remove("loading-indicator");
            notification.success({
                description: data.message,
                placement: "topRight"
            });

            _form.reset({
                date: "",
                mandal: "",
                village: "",
                address: "",
                leaderName: "",
                govtDes:"",
                party:"",
                partyDes:"",
                phone:"",
                voterId:"",
                aadharId: "",
                rationId: ""
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
                            <h1 class="h3 mb-3 text-gray-800">Village Leaders</h1>
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Add Village Leader</h6>
                                </div>
                                <div class="card-body">
                                    <div>
                                        <form onSubmit={handleSubmit}>
                                            <div class="row justify-content-start">
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="date">Entry Date</label>
                                                <AppInput type="date" name="date" id="date" class="form-control" placeholder="" form={_form} validation={{ required: true }} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="Mandal">mandal</label>
                                                <AppInput type="text" name="mandal" id="Mandal" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={30} onKeyPress={(e)=>handleTextonly(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="Village">Village</label>
                                                <AppInput type="text" name="village" id="Village" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={30} onKeyPress={(e)=>handleTextonly(e)} />
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
                                                <label for="LeaderName">Leader Name</label>
                                                <AppInput type="text" name="leaderName" id="LeaderName" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={40} onKeyPress={(e)=>handleTextonly(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="govtDes">Government Designation</label>
                                                <AppInput type="text" name="govtDes" id="govtDes" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={40} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="party">Party</label>
                                                <AppInput type="text" name="party" id="party" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={30} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="partyDes">Party Designation</label>
                                                <AppInput type="text" name="partyDes" id="partyDes" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={40} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="phone">Phone Number</label>
                                                <AppInput type="text" name="phone" id="phone" class="form-control" minLength={10} maxLength={10} onKeyPress={handleKeyPress} form={_form} validation={{ required: true }} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="voterId">Voter ID</label>
                                                <AppInput type="text" name="voterId" id="voterId" class="form-control" placeholder="" form={_form} maxLength={10} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="aadharId">Aadhaar Number</label>
                                                <AppInput type="text" name="aadharId" id="aadharId" class="form-control" placeholder="" form={_form} validation={{ required: true }}  minLength={12} maxLength={12} onKeyPress={handleKeyPress} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="rationId">Ration Card Number</label>
                                                <AppInput type="text" name="rationId" id="rationId" class="form-control" placeholder="" form={_form}  maxLength={10} onKeyPress={(e)=>handleChange(e)}/>
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

export default VillageLeadersPage;