import { Outlet } from "react-router-dom"
import Menu from "../Menu/Menu"

const Layout = () => {
    return <div className="w-full">
        <Outlet />
    </div>
}

export default Layout