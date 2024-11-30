import { Link, useNavigate } from "react-router-dom";
import { villagevisitAPI } from "../utils/apis";
import { villagevisitAPIXls } from "../utils/apis";
import AppInput from "../components/input";
import { AppSelect } from "../components/select";
import useForm from "../hooks/form";
import { notification } from 'antd';
import React , { useState } from "react";
import { useEffect } from "react";
import Navbar from "./navbar";
import UserNav from "./usernav";

const VillageVisitsPage = () => {
    const _form = useForm({});
    const [value, setValue] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])
    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(e.target.files[0])
    };

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

        if (!_form.value.date) missingFields.push("Date of Visit");
        if (!_form.value.mandal) missingFields.push("Mandal");
        if (!_form.value.village) missingFields.push("Village Name");
        if (!_form.value.purposeVisit) missingFields.push("Purpose of Visit");
        if (!_form.value.gpProgram) missingFields.push("Govt / Private Program");
        if (!_form.value.proDesc) missingFields.push("Program Description");
        if (!_form.value.proInchagre) missingFields.push("Program Incharge/Coordinator");
        if (!_form.value.proInchagrePhone) missingFields.push("Incharge/Coordinator Phone Number");
        
        if (_form.value.address && numericRegex.test(_form.value.address)) missingFields.push("Address should not be only numeric");
        if (_form.value.proDesc && numericRegex.test(_form.value.proDesc)) missingFields.push("Program Description should not be only numeric");

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
            villagevisit();
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

    const villagevisit = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const { data } = await villagevisitAPI(_form.value);
            if (data.status === true) {
            document.body.classList.remove("loading-indicator");
            notification.success({
                description: data.message,
                placement: "topRight"
            });

            _form.reset({
                date: "",
                proInchagrePhone:"",
                mandal:"",
                address:"",
                proDesc:"",
                proInchagre:"",
                gpProgram:"",
                purposeVisit:"",
                village:"",
                selectedFile:""
            });
            } else {
                document.body.classList.remove("loading-indicator");
                handleResponse(data);
            }
        } catch (error) {
            handleErrorResponse();
        }
    };

    const validateXL = () => {
        let missingFields = [];

        if (!selectedFile) missingFields.push("XL Data File not selected");
        
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
    const handleSubmitXL = async (e) => {
        e.preventDefault();
        if (!validateXL()) {
            return;
        } else {
            villagevisitXls();
        }
    };
    const villagevisitXls = async () => {
        try {
            document.body.classList.add("loading-indicator");
            // const { data } = await villagevisitAPIXls(_form.value.selectedFile);
            // console.log(data);
            const payload = new FormData();
            payload.append("file", selectedFile);
            const { data } = await villagevisitAPIXls(payload);

            if (data.status === true) {
                document.body.classList.remove("loading-indicator");
                notification.success({
                    description: data.message,
                    placement: "topRight"
                });
                _form.reset({
                    file: "",
                    setSelectedFile: null
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
                            <div className="row d-flex align-items-center justify-content-between mb-4">
                                <div className="col-md-8"><h1 className="h3 mb-0 text-gray-800">MLA Village Visiting Record</h1></div>
                            </div>
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Add Visit</h6>
                                </div>
                                <div class="card-body">
                                    <div>
                                        <form onSubmit={handleSubmit}>
                                            <div class="row justify-content-start">
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="date">Date of Visit</label>
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
                                                <AppSelect
                                                    name="purposeVisit"
                                                    form={_form}
                                                    label="Purpose of Visit"
                                                    options={[ {
                                                        label: "Select Purpose",
                                                        value: ""
                                                    }, {
                                                        label: "Marriage",
                                                        value: "Marriage"
                                                    }, {
                                                        label: "Inauguration",
                                                        value: "Inauguration"
                                                    }, {
                                                        label: "Family Function",
                                                        value: "Family Function"
                                                    }, {
                                                        label: "Death Anniversay",
                                                        value: "Death Anniversay"
                                                    }, {
                                                        label: "Relief Fund",
                                                        value: "Relief Fund"
                                                    }, {
                                                        label: "Party Activities",
                                                        value: "Party Activities"
                                                    }, {
                                                        label: "General Review",
                                                        value: "General Review"
                                                    }, {
                                                        label: "Official Meeting",
                                                        value: "Official Meeting"
                                                    }, {
                                                        label: "Others",
                                                        value: "Others"
                                                    }]}
                                                    validation={{
                                                        required: true
                                                    }}
                                                />
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <AppSelect
                                                    name="gpProgram"
                                                    form={_form}
                                                    label="Govt / Private Program"
                                                    options={[ {
                                                        label: "Select Program",
                                                        value: ""
                                                    }, {
                                                        label: "Government Program",
                                                        value: "Government Program"
                                                    }, {
                                                        label: "Private Program",
                                                        value: "Private Program"
                                                    }, {
                                                        label: "Party Activity",
                                                        value: "Party Activity"
                                                    }]}
                                                    validation={{
                                                        required: true
                                                    }}
                                                />
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="proDesc">Program Description</label>
                                                <AppInput type="text" name="proDesc" id="proDesc" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={150} onKeyPress={(e)=>handleChange(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="proInchagre">Program Incharge/Coordinator</label>
                                                <AppInput type="text" name="proInchagre" id="proInchagre" class="form-control" placeholder="" form={_form} validation={{ required: true }} maxLength={40} onKeyPress={(e)=>handleTextonly(e)} />
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-6">
                                                <div class="form-group">
                                                <label for="proInchagrePhone">Incharge/Coordinator Phone Number</label>
                                                <AppInput type="text" name="proInchagrePhone" id="proInchagrePhone" class="form-control" minLength={10} maxLength={10} onKeyPress={handleKeyPress} form={_form} validation={{ required: true }} />
                                                </div>
                                            </div>
                                            </div>
                                            <button type="submit" class="btn btn-primary">Save</button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Add Multiple Visits</h6>
                                </div>
                                <div class="card-body">
                                    <div>
                                        <form onSubmit={handleSubmitXL}>
                                            <div class="row justify-content-center align-items-center">
                                                <div class="col-md-4 col-sm-6">
                                                    <div class="form-group mb-md-0">
                                                        <label className="mb-md-0">Upload MLA Village Visits XL Data File</label>
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-1 img-preview">
                                                    {selectedFile &&  <img src={preview} /> }
                                                </div> */}
                                                <div className="col-md-3 img-preview-input">
                                                    <input type='file' className="form-control" name="file" id="file" onChange={onSelectFile} validation={{ required: true }} form={_form}/>
                                                </div>
                                                <div className="col-md-2">
                                                    <button type="submit" class="btn btn-primary">Upload Data</button>
                                                </div>
                                                {/* <a href="#" id="exportButton" className="btn btn-sm btn-primary shadow-sm"><i
                                                    className="fas fa-download fa-sm text-white-50"></i> Upload XL File</a> */}
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

export default VillageVisitsPage;