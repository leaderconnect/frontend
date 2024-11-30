import { Link, useNavigate, useParams } from "react-router-dom";
import { bookappointmentAPI, getUserById, getVisitorsAPI } from "../utils/apis";
import AppInput from "../components/input";
import { AppSelect } from "../components/select";
import useForm from "../hooks/form";
import React, { useRef } from 'react';
import { useEffect } from "react";
import AppTextarea from "../components/textarea";
import { useState } from "react";
import { notification } from 'antd';
import Select, { components } from 'react-select';
import { data, event } from "jquery";
import Navbar from "./navbar";
import UserNav from "./usernav";

const Option = (props) => {
    return (
        <components.Option {...props}>
            <div>{props.data?.label}</div>
            {props.data?.subLabel && <div style={{ fontSize: 12 }}>{props.data.subLabel}</div>}
        </components.Option>
    );
};

const BookappointmentPage = () => {
    const {userId} = useParams()

    const navigate = useNavigate();
    const selectedVisitorData = sessionStorage.getItem('selectedVisitor');
    const [file, setFile] = useState('');
    const [doc, setDoc] = useState();
    const [visitors, setVisitors] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const fileInputRef = useRef(null);
    const docInputRef = useRef(null);

    useEffect(() => {
        searchVisitor('');
    }, []);

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
                description: "Please enter count of visitors.",
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
    const handleChangeAddress = (e) => {
        if(!/[0-9a-zA-Z,.-/ ]/.test(e.key)){
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

        if (!(_form.value.voterId || _form.value.aadharId || _form.value.rationId)) missingFields.push("Voter ID or Adhaar Card or Ration Card");
        if (!_form.value.phone) missingFields.push("Contact Number");
        if (!_form.value.firstName) missingFields.push("First Name");
        if (!_form.value.ConstituencywithVoteId) missingFields.push("Constituency Associated with Voter ID");
        if (!_form.value.noOfVisitors) missingFields.push("No. of Visitors Accompanied");
        if (!_form.value.typeOfWork) missingFields.push("Nature Of Work / Type Of Work");
        if (!_form.value.priority) missingFields.push("Priority Of Visit");
        if (!_form.value.purposeOfVisit) missingFields.push("Purpose Of Visit");

        // Additional validation for numeric-only content
        if (_form.value.purposeOfVisit && numericRegex.test(_form.value.purposeOfVisit)) missingFields.push("Purpose Of Visit should not be only numeric");
        if (_form.value.remarks && numericRegex.test(_form.value.remarks)) missingFields.push("Remarks should not be only numeric");

        if (missingFields.length > 0) {
            const missingFieldsString = missingFields.join(', ');
            notification.error({
                description: `Please fill the following fields : ${missingFieldsString}`,
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
            bookappointment();
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

    const handleErrorResponse = (e) => {
        console.log(e);
        document.body.classList.remove("loading-indicator");
        notification.error({
            description: "Something went wrong, Check your Internet Connection",
            placement: "bottomRight"
        });
    };

    const _form = useForm(selectedVisitorData || {});

    const bookappointment = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const payload = new FormData();
        
            payload.append("vistCount", _form.value.noOfVisitors);
            payload.append("natureofWork", _form.value.typeOfWork);
            payload.append("priortyofVisit", _form.value.priority);
            payload.append("visitPurpose", _form.value.purposeOfVisit);
            payload.append("remarks", _form.value.remarks);
            payload.append("followupComments", '');
            payload.append("action", '');
            payload.append("image", selectedFile);
            payload.append("doc", selectedDoc);
            payload.append("userlinkid", _form.value._id);
            
            const { data } = await bookappointmentAPI(payload);

            if (data.status == true) {
            document.body.classList.remove("loading-indicator");
                notification.success({
                    description: data.message,
                    placement: "topRight"
                });
                sessionStorage.removeItem("selectedVisitor");
                _form.reset({
                    userId:"",
                    voterId:"",
                    aadharId:"",
                    rationId:"",
                    phone:"",
                    firstName:"",
                    lastName:"",
                    village:"",
                    address:"",
                    ConstituencywithVoteId:"",
                    noOfVisitors:"",
                    typeOfWork: "",
                    priority:"",
                    purposeOfVisit:"",
                    selectedFile: null,
                    selectedDoc: null,
                    preview: null,
                    previewDoc: null,
                    file:"",
                    doc:"",
                    remarks:"",
                });
                setSelectedFile(null);
                setSelectedDoc(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
                if (docInputRef.current) {
                    docInputRef.current.value = null;
                }
            } else {
                document.body.classList.remove("loading-indicator");
                handleResponse(data);
            }
        } catch (error) {
            document.body.classList.remove("loading-indicator");
            handleErrorResponse();
        }
    };

    const searchVisitor = async (key) => {
        try {
            setSearchValue(key);
            document.body.classList.add("loading-indicator");
            const payload = {
                key,
                limit: 10,
                offset: 0
            };
            document.body.classList.remove("loading-indicator");
            const { data } = await getVisitorsAPI(payload);

            if (data.status === true) {
                setVisitors((data.data || []).map((visitor) => ({
                    value: visitor._id,
                    label: visitor.firstName + ' ' + visitor.lastName,
                    subLabel: visitor.aadharId || visitor.voterId || visitor.rationId || '-',
                    ...visitor
                })));
            } else {
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
    }, [selectedFile]);
    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(e.target.files[0])
    }

    const [selectedDoc, setSelectedDoc] = useState();
    const [previewDoc, setPreviewDoc] = useState();
    useEffect(() => {
        if (!selectedDoc) {
            setPreviewDoc(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(selectedDoc)
        setPreviewDoc(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedDoc]);
    const onSelectDoc = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedDoc(undefined)
            return
        }
        setSelectedDoc(e.target.files[0])
    }

    const setValues = (e)=>{
        _form.setFormValues(e)
        console.log(e,"e")
    }

    const userById = async () =>{
        let res = await getUserById({_id:userId})
        _form.setFormValues(res?.data?.data)
    }

    useEffect(()=>{
        if(userId){
            userById()
        }
    },[])

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
                            <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                                <div className="input-group">
                                    <Select
                                        onChange={event => setValues(event)}
                                        onInputChange={event => searchVisitor(event)}
                                        options={visitors}
                                        placeholder={'Search visitor'}
                                        components={{ Option }}
                                        inputValue={searchValue} className="border-0"
                                    />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button">
                                            <i className="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <UserNav></UserNav>
                        </nav>
                        <div className="container-fluid">
                            <h1 className="h3 mb-2 text-gray-800">Book Appointment</h1>
                            <p className="mb-4">Schedule the meeting with a leader</p>
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Appointment Booking Form</h6>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <form onSubmit={handleSubmit}>
                                            <div className="row justify-content-start">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="voterId">Voter ID</label>
                                                        <AppInput type="text" name="voterId" className="form-control" placeholder=""  value={_form?.formValue?.['voterId']} disabled form={_form} validation={{ required: true }} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="aadharId">Adhaar Card</label>
                                                        <AppInput type="text" name="aadharId"   className="form-control" placeholder="" value={_form?.formValue?.['aadharId']} disabled form={_form} validation={{ required: true }} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="rationId">Food/Ration Card</label>
                                                        <AppInput type="text" name="rationId" className="form-control" placeholder="" value={_form?.formValue?.['rationId']} disabled form={_form} validation={{ required: true }} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="phone">Contact Number</label>
                                                        <AppInput type="text" name="phone" className="form-control" placeholder="" value={_form?.formValue?.['phone']} disabled form={_form} validation={{ required: true }} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="firstName">First Name</label>
                                                        <AppInput type="text" name="firstName" className="form-control" placeholder="" value={_form?.formValue?.['firstName']} disabled form={_form} validation={{ required: true }} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="lastName">Last Name</label>
                                                        <AppInput type="text" name="lastName" className="form-control" placeholder="" value={_form?.formValue?.['lastName']} disabled form={_form} validation={{ required: true }} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="address">Address</label>
                                                        <AppInput type="text" name="address" className="form-control" placeholder="" value={_form?.formValue?.['address']} disabled form={_form} validation={{ required: true }} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="ConstituencywithVoteId">Constituency Associated with Voter ID</label>  
                                                        <AppInput type="text" name="ConstituencywithVoteId" className="form-control" placeholder="" value={_form?.formValue?.['ConstituencywithVoteId']} disabled form={_form} validation={{ required: true }} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="noOfVisitors">No. of Visitors Accompanied</label>
                                                        <AppInput type="text" name="noOfVisitors" className="form-control" placeholder="" id="noOfVisitors" form={_form} validation={{ required: true }} maxLength={2} onKeyPress={(e) => handleKeyPress(e, 2)} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <AppSelect
                                                        name="typeOfWork"
                                                        form={_form}
                                                        label="Nature Of Work / Type Of Work"
                                                        options={[ {
                                                            label: "Select type",
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
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <AppSelect
                                                        name="priority"
                                                        form={_form}
                                                        label="Priority Of Visit"
                                                        options={[ {
                                                            label: "Select type",
                                                            value: ""
                                                        }, {
                                                            label: "Emergency",
                                                            value: "Emergency"
                                                        }, {
                                                            label: "Priority",
                                                            value: "Priority"
                                                        }, {
                                                            label: "Multiple Visits",
                                                            value: "Multiple Visits"
                                                        }, {
                                                            label: "General",
                                                            value: "General"
                                                        }]}
                                                        validation={{
                                                            required: true
                                                        }}
                                                    />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="purposeOfVisit">Purpose Of Visit</label>
                                                        <AppInput type="text" name="purposeOfVisit" className="form-control" placeholder="" id="purposeOfVisit" maxLength={150} form={_form} validation={{ required: true }} onKeyPress={(e)=>handleChange(e)}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="remarks">Remarks</label>
                                                        <AppTextarea class="form-control" name="remarks" rows="2" id="remarks" placeholder="" maxLength={360} form={_form} onKeyPress={(e)=>handleChangeAddress(e)}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="file">Photo of Visitor</label>
                                                        <div className="row">
                                                            <div className="col-md-9 img-preview-input">
                                                                <input type='file' className="form-control" name="file" id="file" ref={fileInputRef} required accept=".jpg, .jpeg, .png, .pdf" onChange={onSelectFile}/>
                                                            </div>
                                                            <div className="col-md-3 img-preview">
                                                                {selectedFile &&  <img src={preview} /> }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label for="doc">Upload Document</label>
                                                        <div className="row">
                                                            <div className="col-md-9 img-preview-input">
                                                                <input type='file' className="form-control" name="doc" id="doc" ref={docInputRef} accept=".jpg, .jpeg, .png, .pdf" onChange={onSelectDoc}/>
                                                            </div>
                                                            <div className="col-md-3 img-preview">
                                                                {selectedDoc &&  <img src={previewDoc} /> }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
export default BookappointmentPage;