// import './Forgot.css'
import logo from '../../Assets/logo.jpg';
import { MdEmail } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';



function Verify() {

    const email = useRef();
    const location = useLocation();
    const userId = location.state?.userId;
    console.log(userId);
    
    const verificationCode = location.state?.pass;
    const [text_err,setText_err] = useState("");
    const navigate = useNavigate();

    const getUser = () => {
        setText_err("")

        if (email.current.value == verificationCode) {
            navigate('/Repassword', { state: { userId: userId}});
        }
        else {
            setText_err("รหัสไม่ถูกต้อง")
        }
    }

    return (
        <div className="container">
            <img src={logo} alt="Image 1" className="image-front" />
            <div className="container-1">
                <div className='containerf2'>
                    <form action="">
                        <h1>Verify Email</h1>
                        <div className='input-box'>
                            <input type="text" ref={email} placeholder='Email' required />
                            <MdEmail className='icon' />
                        </div>
                        <p style={{textAlign:"center",color:"red",marginTop:"-20px",marginBottom:"20px"}}>{text_err}</p>
                        <button type='button' onClick={getUser} className='Link'>OK</button>
                        <div className='register-link'>
                            {/* <p>Don't have an account? <Link to="/Register">Register</Link></p> */}
                        </div>
                    </form>
                </div>

            </div>
            <div className="container-2">
                <h1>foodcipes</h1>
            </div>
        </div>
    )
}

export default Verify