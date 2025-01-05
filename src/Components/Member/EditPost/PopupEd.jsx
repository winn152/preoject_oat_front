import { AiFillDelete } from "react-icons/ai";
import { useState } from "react";
import "./Popup.css";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import { baseUrl } from "../../../baseUrl";

// eslint-disable-next-line react/prop-types
const Popup = ({ message, onClose }) => {
  const navigate = useNavigate();

  const location = useLocation([]);
  const postID = location.state;

  const toreport = async () => {
    Axios.get(baseUrl + "/api/delete/post/" + postID);
    navigate("/Saved");
  };

  return (
    <div className="overlay">
      <div className="popup">
        <AiFillDelete className="AiFillDelete"/>
        <h2>Confirm deletion</h2>
        <div className="buttonReport">
          <button className="banner-btn" onClick={toreport}>
            Confirm
          </button>
          <button className="banner-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
