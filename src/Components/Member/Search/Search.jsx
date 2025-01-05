import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../Navber/Navbar";
import logo from "../../Assets/logo.jpg";
import "./Search.css";
import { FaRegUser } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { baseUrl } from "../../../baseUrl";
import Axios from "axios";
import picmain from "../../Assets/picmain.png";
import picprofile from "../../Assets/user.png";

function Search() {
  const [postData, setPostData] = useState([]);
  const [text, setText] = useState("");
  const [clickedButton, setClickedButton] = useState(null);
  const [hashtagData, setHashtagData] = useState({});
  const [noResults, setNoResults] = useState(false); // New state variable
  const userID = sessionStorage.getItem("userId");

  const s_post = () => {
    const data = { text: text };
    const apiUrl = text.charAt(0) === "#" ? "/api/search/hashtag" : "/api/search/post";

    Axios.get(baseUrl + apiUrl, {
      params: data,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        setPostData(response.data);
        // Check if there are no results
        setNoResults(response.data.length === 0);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setNoResults(true); // Consider there are no results on error as well
      });
  };

  const ud_search = (e) => {
    setText(e.target.value);
  };
  
  const handleClick = (buttonId) => {
    setClickedButton(buttonId);
  };

  useEffect(() => {
    setClickedButton("button1");
    const fetchHashtag = async (postID) => {
      try {
        const response2 = await Axios.get(baseUrl + "/api/see/hashtag/" + postID);
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
      <div className="containers">
        <div className="containers1">
          <a href="/Home" className="flex items-center space-x-8 rtl:space-x-reverse">
            <img src={logo} className="h-20" alt="foodcipes Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">foodcipes</span>
          </a>

          <form className="w-[450px] relative">
            <div className="relative">
              <input
                type="search"
                placeholder="Type the menu name"
                className="w-full p-4 bg-white rounded-full no-border"
                onChange={ud_search}
              />
            </div>
            <button
              className="absolute right-1 top-1/2 -translate-y-1/2 p-4 text-white focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
              style={{ backgroundColor: "#2EC4B6", borderColor: "#2EC4B6", marginTop: "5px" }}
              onClick={s_post}
              type="button"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="conSearchbutton">
          <Link to="/Search">
            <button className={`${clickedButton === "button1" ? "clicked" : ""}`} onClick={() => handleClick("button1")}>
              Post
            </button>
          </Link>
          <Link to="/SearchPerson">
            <button className={`${clickedButton === "button2" ? "clicked" : ""}`} onClick={() => handleClick("button2")}>
              Person
            </button>
          </Link>
        </div>

        <div className="containerse7">
          <div className="containerp3">
            {noResults ? ( // Conditional rendering for no results
              <p className="text-center text-xl text-red-500">ไม่พบข้อมูลที่ค้นหา</p>
            ) : (
              postData.map((i) => {
                const path = i.user_id === userID ? "/EditPost" : "/Details";
                return (
                  <Link
                    key={i.post_id} // Use a unique key for each item
                    to={path}
                    state={i.post_id}
                    className="min-w-[700px] flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div className="flex flex-col justify-between p-4">
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full object-cover mr-3"
                          src={i.img_pf || picprofile}
                          alt="Profile"
                        />
                        <h1>{i.username}</h1>
                      </div>
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{i.postname}</h5>
                      <h5 className="mb-2 text-l font-bold tracking-tight text-gray-900 dark:text-white">
                        {hashtagData[i.post_id] !== undefined ? hashtagData[i.post_id] : ""}
                      </h5>

                      <div className="flex">
                        <div className="flex flex-row w-[100px] justify-between items-center pr-3">
                          <FaRegClock size={20} />
                          <p>{i.time_post}</p>
                        </div>
                        <div className="flex flex-row w-[100px] justify-between items-center">
                          <FaRegUser size={20} />
                          <p>{i.for_post}</p>
                          <p>people</p>
                        </div>
                      </div>
                    </div>
                    <img
                      className="h-[170px] w-[250px] object-cover rounded-lg order-last"
                      src={i.img_main || picmain}
                      alt="Image"
                    />
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
