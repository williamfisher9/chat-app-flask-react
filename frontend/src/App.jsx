import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import Home from "./components/Home/Home"
import NoPage from "./components/NoPage/NoPage"
import Layout from "./components/Layout/Layout"
import ChangePassword from "./components/ChangePassword/ChangePassword"
import ResetForgottenPassword from "./components/ResetForgottenPassword/ResetForgottenPassword"
import ForgotPassword from "./components/ForgotPassword/ForgotPassword"
import VerifyUser from "./components/VerifyUser/VerifyUser"



const App = () => {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Login />} ></Route>
        <Route path="/login" element={<Login />} ></Route>
        <Route path="/register" element={<Register />} ></Route>
        <Route path="/home/:source_user/:dest_user" element={<Home />} ></Route>
        <Route path="/forgot-password" element={<ForgotPassword />} ></Route>
        <Route path="/forgot-password/:source_user/:token" element={<ResetForgottenPassword />} ></Route>
        <Route path="/verify-user/:source_user/:token" element={<VerifyUser />} ></Route>
        <Route path="/change-password/:source_user" element={<ChangePassword />} ></Route>
      </Route>
      <Route path="*" element={<NoPage />} ></Route>
    </Routes>
  </BrowserRouter>
}

export default App