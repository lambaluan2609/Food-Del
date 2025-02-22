import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import assets from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
const LoginPopup = ({ setShowLogin }) => {

    const { url, setToken } = useContext(StoreContext)


    const [currState, setCurrState] = useState("Login")
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        }
        else {
            newUrl += "/api/user/register";
        }

        const response = await axios.post(newUrl, data);

        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
        }
        else {
            alert(response.data.message)
        }
    }



    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-input">
                    {currState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Your password' required />
                </div>
                <button type='submit' >{currState === "Sign Up" ? "Tạo tài khoản" : "Đăng nhập"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>Bằng cách tiếp tục, tôi đồng ý với các Điều khoản sử dụng & Chính sách bảo mật. </p>
                </div>
                {currState === "Login"
                    ? <p>Tạo một tài khoản mới? <span onClick={() => setCurrState("Sign Up")}>Bấm vào đây</span></p>
                    : <p>Đã có một tài khoản? <span onClick={() => setCurrState("Login")}>Bấm vào đây</span></p>}

            </form>
        </div>
    )
}

export default LoginPopup