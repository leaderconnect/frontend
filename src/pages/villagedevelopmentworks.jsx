import React , { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { villagedevelopmentAPI } from "../utils/apis";
import AppInput from "../components/input";
import useForm from "../hooks/form";
import { notification } from 'antd';
import Navbar from "./navbar";
import UserNav from "./usernav";

const VillageDevelopmentWorksPage = () => {
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
        if(!/[0-9a-zA-Z,./: -]/.test(e.key)){
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
        if (!_form.value.stateOrCentralSchemaL) missingFields.push("Central/State Scheme");
        if (!_form.value.departmentOfWork) missingFields.push("Department Of Work");
        if (!_form.value.workType) missingFields.push("Work Type");
        if (!_form.value.workDesc) missingFields.push("Work Description");
        if (!_form.value.inchargeofWork) missingFields.push("Incharge of Work");
        if (!_form.value.inchargePhone) missingFields.push("Incharge Phone No.");
        if (!_form.value.workStatus) missingFields.push("Status of Work");
        if (!_form.value.workStartDate) missingFields.push("Work (Estimated) Start Date");
        if (!_form.value.workEndDate) missingFields.push("Work (Estimated) End Date");
        if (!_form.value.amountStatus) missingFields.push("Amount Status");
        if (!_form.value.amountSpent) missingFields.push("Amount Spent");
        if (!_form.value.amountSanction) missingFields.push("Amount Sanctioned");
        if (!_form.value.amountApproved) missingFields.push("Amount Approved");
        if (!_form.value.stateContribution) missingFields.push("State Govt Contribution");
        if (!_form.value.centralContribution) missingFields.push("Central Govt Contribution");
        
        if (_form.value.address && numericRegex.test(_form.value.address)) missingFields.push("City should not be only numeric");
        if (_form.value.stateOrCentralSchemaL && numericRegex.test(_form.value.stateOrCentralSchemaL)) missingFields.push("Central/State Scheme should not be only numeric");
        if (_form.value.departmentOfWork && numericRegex.test(_form.value.departmentOfWork)) missingFields.push("Department Of Work should not be only numeric");
        if (_form.value.workType && numericRegex.test(_form.value.workType)) missingFields.push("Work Type should not be only numeric");
        if (_form.value.workDesc && numericRegex.test(_form.value.workDesc)) missingFields.push("Work Description should not be only numeric");
        if (_form.value.inchargeofWork && numericRegex.test(_form.value.inchargeofWork)) missingFields.push("Incharge of Work should not be only numeric");
        if (_form.value.workStatus && numericRegex.test(_form.value.workStatus)) missingFields.push("Status of Work should not be only numeric");
        if (_form.value.amountStatus && numericRegex.test(_form.value.amountStatus)) missingFields.push("Amount Status should not be only numeric");

        if (missingFields.length > 0) {
            const missingFieldsString = missingFields.join(', ');
            notification.error({
                description: `Please fill the following fields: ${missingFieldsString}`,
                placement: "topRight"
            });
            return false;
        }
        if (new Date(_form.value.workEndDate) < new Date(_form.value.workStartDate)) {
            notification.error({
                description: "Work (Estimated) End Date cannot be earlier than Work (Estimated) Start Date",
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
            villagedevelopmentworks();
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

    const villagedevelopmentworks = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const { data } = await villagedevelopmentAPI(_form.value);
            if (data.status === true) {
            document.body.classList.remove("loading-indicator");
            notification.success({
                description: data.message,
                placement: "topRight"
            });

            _form.reset({
                amountApproved: "",
                amountSanction:"",
                amountSpent:"",
                amountStatus:"",
                centralContribution:"",
                departmentOfWork:"",
                date:"",
                inchargeofWork:"",
                inchargePhone:"",
                mandal:"",
                stateContribution:"",
                stateOrCentralSchemaL:"",
                workStatus:"",
                village:"",
                address:"",
                workDesc:"",
                workEndDate:"",
                workStartDate:"",
                workType:""
            });
            } else {
                document.body.classList.remove("loading-indicator");
                handleResponse(data);
            }
        } catch (error) {
            handleErrorResponse();
        }
    };

    // const villagedevelopmentworks = async () => {
    //     try {
    //         document.body.classList.add("loading-indicator");
    //         const formattedDate = _form.value.date.split("T")[0];
            
    //         const requestData = {
    //             ..._form.value,
    //             date: formattedDate
    //         };
    //         console.log(requestData);
    //         const { data } = await villagedevelopmentAPI(requestData);

    //         if (data.status === true) {
    //             document.body.classList.remove("loading-indicator");
    //             notification.success({
    //                 description: data.message,
    //                 placement: "topRight"
    //             });
    //             _form.reset({
    //                 amountApproved: "",
    //                 amountSanction:"",
    //                 amountSpent:"",
    //                 amountStatus:"",
    //                 centralContribution:"",
    //                 departmentOfWork:"",
    //                 date:"",
    //                 inchargeofWork:"",
    //                 inchargePhone:"",
    //                 mandal:"",
    //                 stateContribution:"",
    //                 stateOrCentralSchemaL:"",
    //                 workStatus:"",
    //                 village:"",
    //                 workDesc:"",
    //                 workEndDate:"",
    //                 workStartDate:"",
    //                 workType:""
    //             });
    //         } else {
    //             document.body.classList.remove("loading-indicator");
    //             notification.error({
    //                 description: data.message,
    //                 placement: "topRight"
    //             });
    //         }
    //     } catch (e) {
    //         document.body.classList.remove("loading-indicator");
    //         notification.error({
    //             description: "Something went wrong",
    //             placement: "topRight"
    //         });
    //     } finally {
    //         document.body.classList.remove("loading-indicator");
    //         // Hide loading
    //     }

    // };

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
                            <h1 class="h3 mb-3 text-gray-800">Development Works of Villages</h1>
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Add Village Development Work</h6>
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
                                                <label for="address">City</label>
                                                <AppInput type="text" name="address" id="address" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={60} onKeyPress={(e)=>handleChangeAddress(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="stateOrCentralSchemaL">Central/State Scheme</label>
                                                <AppInput type="text" name="stateOrCentralSchemaL" id="stateOrCentralSchemaL" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={30} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="departmentOfWork">Department Of Work</label>
                                                <AppInput type="text" name="departmentOfWork" id="departmentOfWork" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={30} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="workType">Work Type</label>
                                                <AppInput type="text" name="workType" id="workType" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={60} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="workDesc">Work Description</label>
                                                <AppInput type="text" name="workDesc" id="workDesc" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={150} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="inchargeofWork">Incharge of Work</label>
                                                <AppInput type="text" name="inchargeofWork" id="inchargeofWork" class="form-control" form={_form} validation={{ required: true }} maxLength={30} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="inchargePhone">Incharge Phone No.</label>
                                                <AppInput type="text" name="inchargePhone" id="inchargePhone" class="form-control" minLength={10} maxLength={10} onKeyPress={handleKeyPress} form={_form} validation={{ required: true }} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="workStartDate">Work (Estimated) Start Date</label>
                                                <AppInput type="date" name="workStartDate" id="workStartDate" class="form-control" placeholder="" form={_form} validation={{ required: true }} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="workEndDate">Work (Estimated) End Date</label>
                                                <AppInput type="date" name="workEndDate" id="workEndDate" class="form-control" placeholder="" form={_form} validation={{ required: true }} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="workStatus">Status of Work</label>
                                                <AppInput type="text" name="workStatus" id="workStatus" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={30} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="amountStatus">Amount Status</label>
                                                <AppInput type="text" name="amountStatus" id="amountStatus" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={60} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="amountSpent">Amount Spent</label>
                                                <AppInput type="text" name="amountSpent" id="amountSpent" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={16} onKeyPress={handleKeyPress} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="amountSanction">Amount Sanctioned</label>
                                                <AppInput type="text" name="amountSanction" id="amountSanction" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={16} onKeyPress={handleKeyPress} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="amountApproved">Amount Approved</label>
                                                <AppInput type="text" name="amountApproved" id="amountApproved" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={16} onKeyPress={handleKeyPress} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="stateContribution">State Govt Contribution</label>
                                                <AppInput type="text" name="stateContribution" id="stateContribution" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={16} onKeyPress={handleKeyPress} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="centralContribution">Central Govt Contribution</label>
                                                <AppInput type="text" name="centralContribution" id="centralContribution" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={16} onKeyPress={handleKeyPress} />
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

export default VillageDevelopmentWorksPage;