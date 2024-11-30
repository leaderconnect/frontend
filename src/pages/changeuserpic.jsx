import React from "react";
import { changeprofilepicAPI } from "../utils/apis";
import { useEffect } from "react";
import { useState } from "react";
import { notification } from 'antd';
import { data, event } from "jquery";
import Navbar from "./navbar";
import UserNav from "./usernav";

const ChangeuserpicPage = () => {
    var profilepicture = sessionStorage.getItem('image');
    const [doc, setDoc] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState(profilepicture);

    const updateprofilepic = async (event) => {
        try {
            event.preventDefault();
            if (!selectedFile) {
                notification.error({
                    description: "Please select the user photo",
                    placement: "topRight"
                });
                return;
            }
            document.body.classList.add("loading-indicator");
            const payload = new FormData();
            payload.append("_id", sessionStorage.getItem("_id"));
            payload.append("public_id", sessionStorage.getItem("cloudUrl"));
            payload.append("image", selectedFile)
            if (doc) {
                payload.append("photo", selectedFile);
            }
            const { data } = await changeprofilepicAPI(payload);
            if (data.status == true) {
                document.body.classList.remove("loading-indicator");
                notification.success({
                    description: data.message,
                    placement: "topRight"
                });
                // Update preview with the newly selected image
                setPreview(URL.createObjectURL(selectedFile));
            } else {
                document.body.classList.remove("loading-indicator");
                notification.error({
                    description: data.message,
                    placement: "topRight"
                });
            }
        } catch (e) {
            console.log(e);
            notification.error({
                description: "Something went wrong",
                placement: "topRight"
            });
        }
    };

    useEffect(() => {
        // Set the initial value of preview to the profile picture stored in sessionStorage
        setPreview(profilepicture);
    }, []);
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
            setSelectedFile(undefined);
            setPreview(profilepicture); // Reset preview to profile picture on clear
            return;
        }
        setSelectedFile(e.target.files[0]);
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
                            <h1 className="h3 mb-2 text-gray-800">Change Profile Picture</h1>
                            <p className="mb-4">You can change your profile display picture here</p>
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Change Profile Picture</h6>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <form onSubmit={e => e.preventDefault()}>
                                            <div className="row justify-content-center align-items-center">
                                                <div className="col-md-10">
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-3">
                                                            <div className="form-group text-right mt-2">
                                                                <label for="file">Select User Picture</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 img-preview-input">
                                                            <input type='file' className="form-control" name="file" id="file" onChange={onSelectFile} validation={{ required: true }}/>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <button type="submit" className="btn btn-primary mt-1" onClick={updateprofilepic}>Submit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="col-md-12 img-preview">
                                                        {selectedFile ? <img src={preview} alt="Preview" /> : <img src={profilepicture} alt="Profile" />} 
                                                    </div>
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
export default ChangeuserpicPage;