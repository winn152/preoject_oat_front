import { FaRegUser } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { Link } from "react-router-dom";
import "./Private.css";
import { useState, useEffect } from "react";
import Navbar from "../Navber/Navbar";
import Profile from "../Profile/Profile";
import Axios from "axios";
import { baseUrl } from "../../../baseUrl";
import picmain from "../../Assets/picmain.png";
import picprofile from "../../Assets/user.png";

function Private() {
  const [clickedButton, setClickedButton] = useState(null);
  const userID = sessionStorage.getItem("userId");
  const [postData, setPostData] = useState([]);
  const [hashtagData, setHashtagData] = useState({});
  const [noResults, setNoResults] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    Axios.get(baseUrl + "/api/see/mypost/2/" + userID).then((response) => {
      setPostData(response.data);
    });
  }, [userID]);

  const s_post = () => {
    const data = {
      text: text,
    };
    Axios.get(baseUrl + "/api/search/mypost/2/" + userID, {
      params: data,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      setPostData(response.data);
      setNoResults(response.data.length === 0);
    });
  };

  const ud_search = (e) => {
    setText(e.target.value);
  };

  const handleClick = (buttonId) => {
    setClickedButton(buttonId);
  };
  useEffect(() => {
    setClickedButton("button3");
    const fetchHashtag = async (postID) => {
      try {
        const response2 = await Axios.get(
          baseUrl + "/api/see/hashtag/" + postID
        );
        const response = response2.data.map((item) => item.name).join(" ");
        setHashtagData((prevData) => ({ ...prevData, [postID]: response }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    postData.forEach((post) => {
      fetchHashtag(post.post_id);
    });
  }, [postData]);
  return (
    <div className="b">
      <Navbar />
      <div className="containerp">
        <Profile />
        <div className="containerpp2">
          <Link to="/Saved">
            <button
              type="button"
              className={` flex items-center justify-center text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ${
                clickedButton === "button1" ? "clicked" : ""
              }`}
              onClick={() => handleClick("button1")}
            >
              Saved
            </button>
          </Link>

          <Link to="/Public">
            <button
              type="button"
              className={`flex items-center justify-center text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ${
                clickedButton === "button2" ? "clicked" : ""
              }`}
              onClick={() => handleClick("button2")}
            >
              Public
            </button>
          </Link>
          <Link to="/Private">
            <button
              type="button"
              className={`flex items-center justify-center text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ${
                clickedButton === "button3" ? "clicked" : ""
              }`}
              onClick={() => handleClick("button3")}
            >
              Private
            </button>
          </Link>
          <Link to="/Reported">
            <button
              type="button"
              className={`flex items-center justify-center text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ${
                clickedButton === "button4" ? "clicked" : ""
              }`}
              onClick={() => handleClick("button4")}
            >
              Reported
            </button>
          </Link>
        </div>
        <div className="containerp3">
          <form className="w-[450px] relative mb-5">
            <div className="relative">
              <input
                type="search"
                placeholder="Type the menu name"
                className="w-full p-4 bg-white rounded-full no-border"
                onChange={ud_search}
              />
            </div>
            <button
              className="buttonsearch absolute right-1 top-1/2 -translate-y-1/2 p-4 text-white focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
              style={{
                backgroundColor: "#FF9F1C",
                borderColor: "#FF9F1C",
                marginTop: "5px",
              }}
              type="button"
              onClick={s_post}
            >
              Search
            </button>
          </form>
          {noResults ? ( // Conditional rendering for no results
            <p className="text-center text-xl text-red-500">
              ไม่พบข้อมูลที่ค้นหา
            </p>
          ) : (
            postData.map((i) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Link
                  to="/EditPost"
                  state={i.post_id}
                  class="cardsave bg-white border border-gray-200 rounded-lg shadow"
                >
                  <div className="pc3 flex flex-col justify-between p-4 ">
                    <div className="flex items-center ">
                      <img
                        className="w-12 h-12 rounded-full object-cover mr-3"
                        src={i.img_pf ? i.img_pf : picprofile}
                        alt="Profile"
                      />
                      <h1>{i.username}</h1>
                    </div>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {i.name}
                    </h5>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {hashtagData[i.post_id] !== undefined
                        ? hashtagData[i.post_id]
                        : ""}
                    </h5>
                    <h1>
                      <p
                        className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-ellipsis "
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {i.ingredient}
                      </p>
                    </h1>
                    <div className="flex">
                      <div className="flex flex-row w-[100px] justify-between items-center pr-3">
                        <FaRegClock size={20} />
                        <p>{i.time_use}</p>
                      </div>
                      <div className="flex flex-row w-[100px] justify-between items-center ">
                        <FaRegUser size={20} />
                        <p>{i.for_post}</p>
                        <p>people</p>
                      </div>
                    </div>
                  </div>
                  <img
                    className="object-cover md:h-auto aa"
                    src={i.img_main ? i.img_main : picmain}
                    alt="Image"
                  />
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Private;
