import { useEffect } from "react";
import { Link } from "react-router-dom";
import useForm from "../hooks/form";
import AppInput from "../components/input";
import { forgotPasswordAPI } from "../utils/apis";
import { notification } from 'antd';

const ForgotPasswordPage = () => {
    const _form = useForm({});

    const forgetPassword = async () => {
        try {
            document.body.classList.add("loading-indicator");
            const { data } = await forgotPasswordAPI(_form.value);
            
            if(data.status===true){
                notification.success({
                    description: data.message,
                    placement: "topRight"
                });
                document.body.classList.remove("loading-indicator");
                _form.reset({
                    email: "",
                });
            }
            else{
                document.body.classList.remove("loading-indicator");
                notification.error({
                    description: data.message,
                    placement: "topRight"
                });
            }
        } catch (e) {
            document.body.classList.remove("loading-indicator");
            notification.error({
                description: "Something went wrong. Try again later",
                placement: "topRight"
            });
        } 
    };

    useEffect(() => {
        document.body.classList.add('bg-gradient-primary');

        return () => {
            document.body.classList.remove('bg-gradient-primary');
        };
    }, []);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12 col-md-9">
                    <div className="card o-hidden border-0 shadow-lg my-5 mt-md-10">
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-lg-6 d-none d-lg-block bg-password-image"></div>
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-2">Forgot Your Password?</h1>
                                            <p className="mb-4">We get it, stuff happens. Just enter your email address below
                                                and we'll send you a link to reset your password!</p>
                                        </div>
                                        <form className="user" onSubmit={e => e.preventDefault()}>
                                        <div className="form-group">
                                                <AppInput type="text" className="form-control form-control-user"
                                                    id="email" name="email" aria-describedby="emailHelp"
                                                    placeholder="Enter User ID..." form={_form} validation={{
                                                        required: true,
                                                        minLength: 4
                                                    }} />
                                            </div>
                                            <a href="#" onClick={forgetPassword} className="btn btn-primary btn-user btn-block">Reset Password 
                                            </a>
                                        </form>
                                        <hr />
                                        <div className="text-center">
                                            <Link className="small" to="/login">Already have an account? Login!</Link>
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

export default ForgotPasswordPage;