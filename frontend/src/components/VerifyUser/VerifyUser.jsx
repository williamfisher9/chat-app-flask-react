import { useNavigate, useParams } from 'react-router-dom';
import './VerifyUser.css'
import { useEffect, useState } from 'react';
import axios from 'axios';

import logoImg from '../../assets/logo_chat.png'

const VerifyUser = () => {
    const navigate = useNavigate();
    const [verifyUserError, setVerifyUserError] = useState("");

    const params = useParams();

    useEffect(() => {

        axios.post("https://willtechbooth.dev/chatter/api/v1/users/verify-user", {"user_id": params.source_user, "token": params.token})
            .then((res) => {
                if(res.status == 200){
                    console.log(res)
                    setVerifyUserError("")
                    navigate('/chatter/login', { state: { message: res.data.contents } })
                }
            })
            .catch((err) => {
                console.log(err.response.data.contents)
                setVerifyUserError(err.response.data.contents)
            })

    }, [])
    
    return <></>
}

export default VerifyUser;