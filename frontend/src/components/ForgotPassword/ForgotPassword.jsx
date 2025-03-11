import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css'
import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [formFields, setFormFields] = useState({emailAddress: ""})
    const [formFieldsErrors, setFormFieldsErrors] = useState({emailAddress: ""})
    const [forgotPasswordRequestError, setForgotPasswordRequestError] = useState("");

    const handleFieldChange = () => {
        setFormFields({...formFields, [event.target.name]: event.target.value})
    }
    
    const handleForgotPasswordRequest = () => {
        event.preventDefault();

        let hasErrors = false;
        let newErrors = {};

        if(formFields.emailAddress.trim() == ""){
            newErrors["emailAddress"] = "Email address is required"
            hasErrors=true;
        }

        setFormFieldsErrors(newErrors);

        if(!hasErrors){
            axios.post("http://3.145.152.55:3030/chatter/api/v1/users/forgot-password", {"email_address": formFields.emailAddress})
            .then((res) => {
                if(res.status == 200){
                    console.log(res)
                    setForgotPasswordRequestError("")
                    navigate('/chatter/login', { state: { message: res.data.contents } })
                }
            })
            .catch((err) => {
                console.log(err.response.data.contents)
                setForgotPasswordRequestError(err.response.data.contents)
            })
        }
    }

    return <div className='w-full min-h-screen flex justify-center items-center'>
        <form className='w-[500px] min-h-11 border-2 border-[var(--global-color)] rounded-lg pb-8 flex flex-col gap-7 justify-center items-center backdrop-blur-lg overflow-hidden'>
            <img src='logo_chat.png' alt='logo' className='h-16 mt-3' />

            <div className='relative w-[90%] h-[45px] border border-[var(--global-color)]'>
                <input type='text' placeholder='Email Address' className='text-field' name='emailAddress' onChange={handleFieldChange}/>
                <span className="material-symbols-rounded absolute top-0 left-0 flex justify-center items-center text-3xl bg-[var(--global-color)] size-[44px] select-none">person</span>
                <p className='text-red-500 absolute bottom-[-25px] left-0'>{formFieldsErrors.emailAddress}</p>
            </div>

            <button className='w-[90%] h-[45px] bg-[var(--global-color)] text-gray-800 hover:bg-[var(--global-color-hover)]' onClick={handleForgotPasswordRequest}>Reset Password</button>
            
            {
                forgotPasswordRequestError != "" ?
                <p className='text-red-500'>{forgotPasswordRequestError}</p> :
                null
            }

            <span className='text-white'>Go back to login page? ? <a href='/login' className='underline text-[var(--global-color)]'>Sign In</a></span>
        </form>
    </div>
}

export default ForgotPassword;