import { useState } from 'react';
import './Register.css'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formFields, setFormFields] = useState({emailAddress: "", firstName: "", lastName: "", password: ""})
    const [formFieldsErrors, setFormFieldsErrors] = useState({emailAddress: "", firstName: "", lastName: "", password: ""})
    const [registerRequestError, setRegisterRequestError] = useState("");

    const handleFieldChange = () => {
        setFormFields({...formFields, [event.target.name]: event.target.value})
    }
    
    const handleSignUpRequest = () => {
        event.preventDefault();
        let hasErrors = false;
        let newErrors = {};

        if(formFields.emailAddress.trim() == ""){
            newErrors["emailAddress"] = "Email address is required"
            hasErrors=true;
        }

        if(formFields.firstName.trim() == ""){
            newErrors["firstName"] = "First name field is required"
            hasErrors=true;
        }

        if(formFields.lastName.trim() == ""){
            newErrors["lastName"] = "Last name field is required"
            hasErrors=true;
        }

        if(formFields.password.trim() == ""){
            newErrors["password"] = "Password field is required"
            hasErrors=true;
        }

        setFormFieldsErrors(newErrors);


        if(!hasErrors){
            axios.post("http://3.145.152.55:3030/chatter/api/v1/users/signup", {"email_address": formFields.emailAddress, 
                                                                    "first_name": formFields.firstName, 
                                                                    "last_name": formFields.lastName, 
                                                                    "password": formFields.password})
            .then((res) => {
                if(res.status == 201){
                    setRegisterRequestError("")
                    navigate("/chatter/login");
                }
            })
            .catch((err) => {
                console.log(err.response.data.contents)
                setRegisterRequestError(err.response.data.contents)
            })
        }
    }

    return <div className='w-full min-h-screen flex justify-center items-center'>
        <form className='w-[500px] max-[550px]:w-[400px] min-h-11 border-2 border-[var(--global-color)] rounded-lg pb-8 flex flex-col gap-7 justify-center items-center overflow-hidden'>
            <div className='w-full flex'>
                <Link to="/chatter/login" className={`w-[50%] h-[60px] text-[var(--global-color)] border-b border-[var(--global-color)] flex justify-center items-center cursor-pointer`}>Sign In</Link>
                <Link to="/chatter/register" className={`w-[50%] h-[60px] bg-[var(--global-color)] border-b border-[var(--global-color)] flex justify-center items-center cursor-pointer`}>Sign Up</Link>
            </div>

            <img src='logo_chat.png' alt='logo' className='h-16' />
            
            <div className='relative w-[90%] h-[45px] border border-[var(--global-color)]'>
                <input type='text' placeholder='Email Address' className='text-field' name='emailAddress' onChange={handleFieldChange}/>
                <span className="material-symbols-rounded absolute top-0 left-0 flex justify-center items-center text-3xl bg-[var(--global-color)] size-[44px] select-none">mail</span>
                <p className='text-red-500 absolute bottom-[-25px] left-0'>{formFieldsErrors.emailAddress}</p>
            </div>

            <div className='relative w-[90%] h-[45px] border border-[var(--global-color)]'>
                <input type='text' placeholder='First Name' className='text-field' name='firstName' onChange={handleFieldChange}/>
                <span className="material-symbols-rounded absolute top-0 left-0 flex justify-center items-center text-3xl bg-[var(--global-color)] size-[44px] select-none">badge</span>
                <p className='text-red-500 absolute bottom-[-25px] left-0'>{formFieldsErrors.firstName}</p>
            </div>

            <div className='relative w-[90%] h-[45px] border border-[var(--global-color)]'>
                <input type='text' placeholder='Last Name' className='text-field' name='lastName' onChange={handleFieldChange}/>
                <span className="material-symbols-rounded absolute top-0 left-0 flex justify-center items-center text-3xl bg-[var(--global-color)] size-[44px] select-none">badge</span>
                <p className='text-red-500 absolute bottom-[-25px] left-0'>{formFieldsErrors.lastName}</p>
            </div>

            <div className='relative w-[90%] h-[45px] border border-[var(--global-color)]'>
                <input type='password' placeholder='Password' className='text-field' name='password' onChange={handleFieldChange} autoComplete='off'/>
                <span className="material-symbols-rounded absolute top-0 left-0 flex justify-center items-center text-3xl bg-[var(--global-color)] size-[44px] select-none">password</span>
                <p className='text-red-500 absolute bottom-[-25px] left-0'>{formFieldsErrors.password}</p>
            </div>

            <button className='w-[90%] h-[45px] bg-[var(--global-color)] text-gray-800 hover:bg-[var(--global-color-hover)]' onClick={handleSignUpRequest}>Sign Up</button>

            {
                registerRequestError != "" ?
                <p className='text-red-500'>{registerRequestError}</p> :
                null
            }

            <span className='text-white'>You have an account? <a href='/login' className='underline text-[var(--global-color)]'>Sign In</a></span>
        </form>
    </div>
}

export default Register;