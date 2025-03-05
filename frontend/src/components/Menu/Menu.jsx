import { Link, useNavigate } from 'react-router-dom'
import './Menu.css'
import Cookies from 'js-cookie'

const Menu = ({handleDisconnect}) => {
    const navigate = useNavigate(null);
    const signUserOut = () => {
        Cookies.remove("token")
        Cookies.remove("user_id")
        Cookies.remove("email_address")
        handleDisconnect();
        navigate("/login")
    }

    return <div className='absolute border border-[var(--global-color)] top-6 left-[50%] translate-x-[-50%] h-14 rounded-xl flex justify-between items-center px-10 w-[600px]'>
        <Link to={"/"}>
            <img src='logo_chat.png' alt='logo' className='h-8 cursor-pointer' />
        </Link>

        <div className='flex gap-3' onClick={signUserOut}>
                <button className='btn'>Sign Out</button>
        </div>
    </div>
}

export default Menu