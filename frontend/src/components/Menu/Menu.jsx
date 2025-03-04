import { Link } from 'react-router-dom'
import './Menu.css'

const Menu = () => {
    return <div className='absolute border border-[var(--global-color)] top-6 left-[50%] translate-x-[-50%] h-14 rounded-xl flex justify-between items-center px-10 w-[600px]'>
        <Link to={"/"}>
            <img src='logo_chat.png' alt='logo' className='h-8 cursor-pointer' />
        </Link>

        <div className='flex gap-3'>
            <Link to={"/login"}>
                <button className='btn'>Sign In</button>
            </Link>
            <Link to={"/register"}>
                <button className='btn'>Sign Up</button>
            </Link>
        </div>
    </div>
}

export default Menu