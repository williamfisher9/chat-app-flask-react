import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Login.css'
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = () => {
    const navigate = useNavigate();
    const [formFields, setFormFields] = useState({emailAddress: "", password: ""})
    const [formFieldsErrors, setFormFieldsErrors] = useState({emailAddress: "", password: ""})
    const [loginRequestError, setLoginRequestError] = useState("");

    const {state} = useLocation();

    const handleFieldChange = () => {
        setFormFields({...formFields, [event.target.name]: event.target.value})
    }
    
    const handleLoginRequest = () => {
        event.preventDefault();
        let hasErrors = false;
        let newErrors = {};

        if(formFields.emailAddress.trim() == ""){
            newErrors["emailAddress"] = "Email address is required"
            hasErrors=true;
        }

        if(formFields.password.trim() == ""){
            newErrors["password"] = "Password field is required"
            hasErrors=true;
        }

        setFormFieldsErrors(newErrors);


        if(!hasErrors){
            axios.post("http://3.145.152.55:3030/api/v1/users/signin", {"email_address": formFields.emailAddress, "password": formFields.password})
            .then((res) => {
                if(res.status == 200){
                    Cookies.set("token", res.data.contents.token);
                    Cookies.set("email_address", res.data.contents.email_address);
                    Cookies.set("user_id", res.data.contents.user_id);
                    setLoginRequestError("")
                    navigate(`/chatter/home/${res.data.contents.user_id}/global`)
                }
            })
            .catch((err) => {
                console.log(err.response.data.contents)
                setLoginRequestError(err.response.data.contents)
            })
        }
    }

    return <div className='w-full min-h-screen flex justify-center items-center'>
        <form className='w-[500px] max-[550px]:w-[400px] min-h-11 border-2 border-[var(--global-color)] rounded-lg pb-8 flex flex-col gap-7 justify-center items-center backdrop-blur-lg overflow-hidden'>
        <div className='w-full flex'>
                <Link to="/chatter/login" className={`w-[50%] h-[60px] bg-[var(--global-color)]  border-b border-[var(--global-color)] flex justify-center items-center cursor-pointer`}>Sign In</Link>
                <Link to="/chatter/register" className={`w-[50%] h-[60px] text-[var(--global-color)] border-b border-[var(--global-color)] flex justify-center items-center cursor-pointer`}>Sign Up</Link>
            </div>

            <img src='logo_chat.png' alt='logo' className='h-16' />

            {
            state?.message && 
            <p className='text-gray-900 text-[16px] bg-[var(--global-color)] px-2 py-1 rounded-sm'>{state?.message}</p>
            }

            <div className='relative w-[90%] h-[45px] border border-[var(--global-color)]'>
                <input type='text' placeholder='Email Address' className='text-field' name='emailAddress' onChange={handleFieldChange}/>
                <span className="material-symbols-rounded absolute top-0 left-0 flex justify-center items-center text-3xl bg-[var(--global-color)] size-[44px] select-none">person</span>
                <p className='text-red-500 absolute bottom-[-25px] left-0'>{formFieldsErrors.emailAddress}</p>
            </div>

            <div className='relative w-[90%] h-[45px] border border-[var(--global-color)]'>
                <input type='password' placeholder='Password' className='text-field' name='password' onChange={handleFieldChange} autoComplete='off'/>
                <span className="material-symbols-rounded absolute top-0 left-0 flex justify-center items-center text-3xl bg-[var(--global-color)] size-[44px] select-none">password</span>
                <p className='text-red-500 absolute bottom-[-25px] left-0'>{formFieldsErrors.password}</p>
            </div>

            <div className='text-[var(--global-color)] underline w-[90%] '>
                <Link to={"/chatter/forgot-password"}>
                    <span>Forgot password?</span>
                </Link>
            </div>

            <button className='w-[90%] h-[45px] bg-[var(--global-color)] text-gray-800 hover:bg-[var(--global-color-hover)]' onClick={handleLoginRequest}>Sign In</button>
            
            {
                loginRequestError != "" ?
                <p className='text-red-500'>{loginRequestError}</p> :
                null
            }



            <span className='text-white'>Don't have an account? <a href='/register' className='underline text-[var(--global-color)]'>Sign Up</a></span>
        </form>
    </div>
}

export default Login;