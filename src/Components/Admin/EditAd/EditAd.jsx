import user from '../../Assets/user.png'
import { FaTrash, FaCamera } from "react-icons/fa6";
import './EditAd.css'
import { useEffect, useState } from 'react';
import NavAd from '../NavAd/NavAd.jsx'
import '../../Member/Edit/Edit.css'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../../baseUrl.js';
import Axios from 'axios';
function EditAd() {
    const [user_img , setUser_img] = useState();
    const userID = sessionStorage.getItem('userId');
    const [userName, setUserName] = useState("");
    const [userPic, setUserPic] = useState("");
    const [text_err,setText_err] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        Axios.get(baseUrl+'/api/see/profile/'+userID)
          .then((response) => {
            setUserName(response.data[0].name);
            setUserPic(response.data[0].img_pf);
            setUser_img(response.data[0].img_pf)
        })
      }, [userID]);

    const updatePro = () =>{
        setText_err("")
        const formData = new FormData();
        formData.append('name',userName);
        formData.append('img_pf',user_img);

        if(userName != ""){
            Axios.post(baseUrl+'/api/up/user/'+userID,formData,{
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            }).then(() =>{
                navigate('/HomeAdmin');
            })
        }
        else {
            setText_err("กรุณากรอกชื่อ")
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserPic(reader.result);
            };
            reader.readAsDataURL(file);
            setUser_img(file);
        }
    };

    const cancel_pf = () => {
        navigate("/ProfileAd")
    }

    const handleImageDelete = () => {
        setUserPic('');
        setUser_img('');
    };
    return (
        <div className='b'>
            <NavAd />
            <div className="containerss">
                <div className=" containerss1">

                    <div className="relative imgEdit">
                        <img
                            className="object-cover"
                            src={userPic ? userPic : user}
                            alt="Rounded avatar"
                            style={{ width: '200px', height: '200px', borderRadius: '50%' }}
                        />
                        <div
                            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 text-black rounded-full"
                            style={{ width: '70px', height: '30px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                        >
                            <label htmlFor="fileInput">
                                <FaCamera style={{ cursor: 'pointer' }} />
                            </label>
                            <input
                                id="fileInput"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                            <p className="mx-2">|</p>
                            <FaTrash onClick={handleImageDelete} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                    <div className="containerss3"><label htmlFor="website-admin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <p style={{textAlign:"center",color:"red",marginBottom:"20px"}}>{text_err}</p>
                    <div className="containerss4">
                        <button
                            type="button"
                            className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                            onClick={updatePro}
                        >
                            Update
                        </button>
                        <button type="button" onClick={cancel_pf} className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" style={{ borderRadius: '50px' }}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditAd