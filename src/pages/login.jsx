import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppInput from "../components/input";
import { loginAPI } from "../utils/apis";
import { notification } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import useForm from "../hooks/form";

const LoginPage = () => {
    const _form = useForm({});
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
        document.body.classList.add('bg-gradient-primary');

        return () => {
            document.body.classList.remove('bg-gradient-primary');
        };
    }, []);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        _form.setValue('password', e.target.value);
    };

    const login = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const { data } = await loginAPI(_form.value);
            if (data.status === true) {
                sessionStorage.setItem('token', data.loginData.token);
                sessionStorage.setItem('firstName', data.loginData.firstName);
                sessionStorage.setItem('lastName', data.loginData.lastName);
                sessionStorage.setItem('phone', data.loginData.phone);
                sessionStorage.setItem('email', data.loginData.email);
                sessionStorage.setItem('permanentAdd', data.loginData.permanentAdd);
                sessionStorage.setItem('presentAdd', data.loginData.presentAdd);
                sessionStorage.setItem('proofType', data.loginData.proofType);
                sessionStorage.setItem('proofIdNumber', data.loginData.proofIdNumber);
                sessionStorage.setItem('image', data.loginData.imageUrl);
                sessionStorage.setItem('cloudUrl', data.loginData.cloudUrl);
                sessionStorage.setItem('type', data.loginData.type);
                sessionStorage.setItem('_id', data.loginData._id);
                document.body.classList.remove("loading-indicator");
                notification.success({
                    description: data.message + " \n" + "Welcome " + data.loginData.firstName,
                    placement: "topRight"
                });
                navigate('/searchticket');
            } else if (data.status === false) {
                notification.error({
                    description: data.message,
                    placement: "topRight"
                });
            }
        } catch (e) {
            document.body.classList.remove("loading-indicator");
            console.log(e);
        } finally {
            document.body.classList.remove("loading-indicator");
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12 col-md-9">
                    <div className="card o-hidden border-0 shadow-lg my-5 mt-md-10">
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Welcome to Leader Connect!</h1>
                                        </div>
                                        <form className="user" onSubmit={e => e.preventDefault()}>
                                            <div className="form-group">
                                                <AppInput type="text" className="form-control form-control-user" name="email" id="email" placeholder="Enter User ID..."
                                                    form={_form} validation={{ required: true }} />
                                            </div>
                                            <div className="form-group position-relative">
                                                <input
                                                    type={passwordVisible ? "text" : "password"}
                                                    className="form-control form-control-user"
                                                    name="password"
                                                    id="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={handlePasswordChange}
                                                    required
                                                />
                                                <span
                                                    onClick={togglePasswordVisibility}
                                                    className="password-toggle-icon position-absolute"
                                                    style={{ right: '15px', top: '45%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                                >
                                                    {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </span>
                                            </div>
                                            <button className="btn btn-primary btn-user btn-block" onClick={login} disabled={!_form.valid}>Login</button>
                                        </form>
                                        <hr />
                                        <div className="text-center">
                                            <Link to="/forgot-password" className="small">Forgot Password?</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
