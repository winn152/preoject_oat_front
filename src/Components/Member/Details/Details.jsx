import Popup from "./Popup";
import { useEffect, useState } from "react";
import Navbar from "../Navber/Navbar";
import { FaRegUser } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { FaHeartCirclePlus, FaHeart } from "react-icons/fa6";
import { GoComment } from "react-icons/go";
import { Link, useLocation } from "react-router-dom";
import Axios from "axios";
import "./Details.css";
import { GrFormNext } from "react-icons/gr";
import picmain from "../../Assets/picmain.png";
import { baseUrl } from "../../../baseUrl";
import picprofile from "../../Assets/user.png";

const Details = () => {
  const userID = sessionStorage.getItem("userId");
  const location = useLocation([]);
  const postID = location.state;

  const [tl, setTl] = useState(0);
  const [img_link, setImg_link] = useState([]);
  const [video_link, setVideo_link] = useState("");

  const [likeClick, setLikeClick] = useState(false);
  const [saveClick, setSavePost] = useState(false);

  const [seeComm, setSeeComm] = useState([]);
  const [comm, setComm] = useState("");

  const [hashtag, setHashtag] = useState([]);

  const [sumUp, setSumUp] = useState(0);

  const handleClick2 = () => {
    if (likeClick == true) {
      const data = {
        user_id: userID,
        post_id: postID,
      };
      Axios.post(baseUrl + "/api/delete/like", data, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        setSumUp((index) => index - 1);
      });
    } else {
      const data = {
        user_id: userID,
        post_id: postID,
      };
      Axios.post(baseUrl + "/api/add/like", data, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        setSumUp((index) => index + 1);
      });
    }
  };

  const handleClick = () => {
    if (saveClick == true) {
      const data = {
        user_id: userID,
        post_id: postID,
      };
      Axios.post(baseUrl + "/api/delete/savedpost", data, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        setSumUp((index) => index - 1);
      });
    } else {
      const data = {
        user_id: userID,
        post_id: postID,
      };
      Axios.post(baseUrl + "/api/add/savedpost", data, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        setSumUp((index) => index + 1);
      });
    }
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const textcom = () => {
    if (comm.trim() != "") {
      const data = {
        post_id: postID,
        user_id: userID,
        text: comm,
      };

      Axios.post(baseUrl + "/api/add/comment", data, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        setComm("");
        setSumUp((index) => index + 1);
      });
    }
  };

  const ud_comment = (e) => {
    setComm(e.target.value);
  };

  const [postData, setPostData] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    Axios.get(baseUrl + "/api/see/post_detail/" + postID).then((response) => {
      setPostData(response.data[0]);
    });
    Axios.get(baseUrl + "/api/see/profile/" + userID).then((response) => {
      setUserData(response.data[0]);
    });
    Axios.get(baseUrl + "/api/see/like_detail/" + userID + "/" + postID).then(
      (response) => {
        if (response.data[0] != null) {
          setLikeClick(true);
        } else {
          setLikeClick(false);
        }
      }
    );
    Axios.get(
      baseUrl + "/api/see/savedpost_detail/" + userID + "/" + postID
    ).then((response) => {
      if (response.data[0] != null) {
        setSavePost(true);
      } else {
        setSavePost(false);
      }
    });
    Axios.get(baseUrl + "/api/see/comment_post/" + postID).then((response) => {
      setSeeComm(response.data);
    });
    Axios.get(baseUrl + "/api/see/link/" + postID).then((response) => {
      if (response.data[0].type_link == 1) {
        setTl(1);
        setImg_link(response.data);
      } else if (response.data[0].type_link == 2) {
        setTl(2);
        setVideo_link(response.data[0].linkpath);
      }
    });
    Axios.get(baseUrl + "/api/see/hashtag/" + postID).then((response) => {
      setHashtag(response.data);
    });
  }, [postID, sumUp, userID]);

  const onby = (e) => {
    const d = new Date(e);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `วันที่ ${day} เดือน ${month} ปี ${year}`;
  };

  return (
    <div className="b">
      <Navbar />
      <div className="containershowout">
        <div className="containershow">
          <img
            className="imgmainshow"
            src={postData.img_main ? postData.img_main : picmain}
            alt="description"
          />
          <div className="containershow1">
            <h1>{postData.name}</h1>
          </div>
          <div className="containershowstory">
            <h1>Story</h1>
            <p>{postData.story}</p>
          </div>
          <div className="containershow2">
            <h1>Ingredient</h1>
            <div className="iconshow">
              <div className="time">
                <p>
                  <FaRegClock size={20} />
                </p>
                <p>{postData.time_use}</p>
              </div>
              <div className="people">
                <p>
                  <FaRegUser size={20} />
                </p>
                <p>{postData.for_post}</p>
                <p>people</p>
              </div>
              <div className="hastag">
                {hashtag.map((i) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <p
                      style={{
                        fontSize: "20px",
                        marginTop: "-5px",
                        fontWeight: "bold",
                      }}
                    >
                      {i.name}
                    </p>
                  );
                })}
              </div>
            </div>
            <h2>{postData.ingredient}</h2>
          </div>
          <div className="containershow2">
            <h1>How to do it</h1>
            <h2>{postData.step_post}</h2>
            {tl === 1 ? (
              <div className="imghowto">
                {img_link.map((i) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <img
                      className="imghowto1"
                      src={i.linkpath}
                      alt="description"
                    />
                  );
                })}
              </div>
            ) : (
              <div className="videohowto">
                <iframe
                  className="videohowto1"
                  // width="560"
                  // height="315"
                  src={video_link} // ใช้ embed URL ของ YouTube
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          {/* <div className="feeling">
                        <div className='iconfeeling'>
                            <CiHeart className="iconfeelingshow" />
                            <h1>Feelings</h1>
                        </div>

                    </div> */}
          <div className="feeling">
            <div className="iconfeeling">
              <GoComment className="iconfeelingshow" />
              <h1>Comment</h1>
            </div>
            {seeComm.map((i) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <div className="commentuser">
                  <img
                    className=""
                    src={i.img_pf ? i.img_pf : picprofile}
                    alt="Profile"
                  />
                  <p>{i.text}</p>
                </div>
              );
            })}
            <hr />
            <div className="pro_comment">
              <img
                className=""
                src={userData.img_pf ? userData.img_pf : picprofile}
                alt="Profile"
              />
              <input
                type="text"
                placeholder="Comment..."
                required
                onChange={ud_comment}
                value={comm}
              />
              <button type="button" onClick={textcom}>
                <GrFormNext className="GrFormNext" />
              </button>
            </div>
          </div>
          <div className="posted">
            <h1>Recipe posted by</h1>
            <Link to="/Follow" state={postData.user_id} className="pronamedate">
              <img
                className="w-20 h-20 rounded-full object-cover mr-3"
                src={postData.img_pf ? postData.img_pf : picprofile}
                alt="Profile"
              />
              <h2>{postData.username}</h2>
              <h3>On {onby(postData.date_post)}</h3>
            </Link>
          </div>
        </div>
        <div className="containershowout2">
          <a
            className="inline-flex items-center px-1 py-1 text-2xl font-medium text-black-600 bg-gray-300 rounded-2xl hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-500"
            onClick={handleClick2}
          >
            {likeClick ? (
              <FaHeart className="FaHeart" />
            ) : (
              <FaHeartCirclePlus />
            )}
          </a>
          <button
            type="button"
            className={`report-btn ${saveClick ? "saved" : ""}`} // เพิ่มคลาสเมื่อปุ่มถูกกด
            onClick={handleClick}
          >
            {saveClick ? "Saved" : "Save"}
          </button>
          <button type="button" onClick={togglePopup} className="report-btn">
            Report
          </button>
          {isPopupOpen && (
            <Popup
              state={postID}
              message="This is a simple popup!"
              onClose={togglePopup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
