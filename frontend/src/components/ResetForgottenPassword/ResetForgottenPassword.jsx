import { useNavigate, useParams } from 'react-router-dom';
import './ResetForgottenPassword.css'
import { useState } from 'react';
import axios from 'axios';

import logoImg from '../../assets/logo_chat.png'

const ResetForgottenPassword = () => {
    const navigate = useNavigate();
    const [formFields, setFormFields] = useState({userId: "", currentPassword: "", newPassword: ""})
    const [formFieldsErrors, setFormFieldsErrors] = useState({userId: "", currentPassword: "", newPassword: ""})
    const [resetForgottenPasswordRequestError, setResetForgottenPasswordRequestError] = useState("");

    const params = useParams();

    const handleFieldChange = () => {
        setFormFields({...formFields, [event.target.name]: event.target.value})
    }
    
    const handleChangePasswordRequest = () => {
        event.preventDefault();

        let hasErrors = false;
        let newErrors = {};


        if(formFields.newPassword.trim() == ""){
            newErrors["newPassword"] = "New password field is required"
            hasErrors=true;
        }

        setFormFieldsErrors(newErrors);

        if(!hasErrors){
            axios.post("http://localhost:5000/api/v1/users/reset-password", {"user_id": params.source_user, "token": params.token, "new_password": formFields.newPassword})
            .then((res) => {
                if(res.status == 200){
                    console.log(res)
                    setResetForgottenPasswordRequestError("")
                    navigate('/login', { state: { message: res.data.contents } })
                }
            })
            .catch((err) => {
                console.log(err.response.data.contents)
                setResetForgottenPasswordRequestError(err.response.data.contents)
            })
        }
    }

    return <div className='w-full min-h-screen flex justify-center items-center'>
        <form className='w-[500px] min-h-11 border-2 border-[var(--global-color)] rounded-lg pb-8 flex flex-col gap-7 justify-center items-center backdrop-blur-lg overflow-hidden'>
            <img src={logoImg} alt='logo' className='h-16 mt-3' />

            <div className='relative w-[90%] h-[45px] border border-[var(--global-color)]'>
                <input type='password' placeholder='New Password' className='text-field' name='newPassword' onChange={handleFieldChange}/>
                <span className="material-symbols-rounded absolute top-0 left-0 flex justify-center items-center text-3xl bg-[var(--global-color)] size-[44px] select-none">password</span>
                <p className='text-red-500 absolute bottom-[-25px] left-0'>{formFieldsErrors.newPassword}</p>
            </div>

            <button className='w-[90%] h-[45px] bg-[var(--global-color)] text-gray-800 hover:bg-[var(--global-color-hover)]' onClick={handleChangePasswordRequest}>Reset Password</button>
            
            {
                resetForgottenPasswordRequestError != "" ?
                <p className='text-red-500'>{resetForgottenPasswordRequestError}</p> :
                null
            }

        </form>
    </div>
}

export default ResetForgottenPassword;