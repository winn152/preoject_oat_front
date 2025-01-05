import './Forgot.css'
import logo from '../../Assets/logo.jpg';
import { MdEmail } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import { baseUrl } from '../../../baseUrl';
import { useEffect, useRef, useState } from 'react';
import emailjs from 'emailjs-com';


function Forgot() {

    const email = useRef();
    const [text_err,setText_err] = useState("");
    const navigate = useNavigate();
    const [user_id, setUser_id] = useState(0);

    useEffect(() => {
        if(user_id != 0){
            sendEmail()
        }
    },[user_id])


    const getUser = () => {
        setText_err("")
        
        Axios.post(baseUrl + '/api/forgot',{email: email.current.value}).then((response) => {
            setUser_id(response.data[0].user_id)
        })
        .catch(() => {
            setText_err("ไม่พบอีเมลที่ท่านค้นหา")
        })
    }

    const sendEmail = () => {

        let verificationCode = '';
        for (let i = 0; i < 6; i++) {
            const randomDigit = Math.floor(Math.random() * 10); // สุ่มเลข 0-9
            verificationCode += randomDigit.toString();
        }
    
        const data = {
          to_email: email.current.value,
          message: verificationCode
        };
    
        emailjs.send('service_3lxdd8f', 'template_zf47bg5', data, 'PFpgN_IBDxamsPHwk')
          .then((result) => {
            console.log('Email sent:', result.text);
            navigate('/Verify', { state: { userId: user_id,pass: verificationCode}});
          }, (error) => {
            console.log('Failed to send email:', error.text);
          });
      };

    return (
        <div className="container">
            <img src={logo} alt="Image 1" className="image-front" />
            <div className="container-1">
                <div className='containerf2'>
                    <form action="">
                        <h1>Forgot</h1>
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

export default Forgot