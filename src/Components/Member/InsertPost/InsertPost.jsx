import { HiPhoto, HiVideoCamera } from "react-icons/hi2";
import { useState, useEffect, useRef } from "react";
import Navbar from "../Navber/Navbar";
import "./InsertPost.css";
import { useNavigate } from "react-router-dom";
import { MdAddAPhoto } from "react-icons/md";
import axios from "axios";
import { baseUrl } from "../../../baseUrl";
import { IoReload } from "react-icons/io5";
import { MdHelp } from "react-icons/md";
import NiceModal from "@ebay/nice-modal-react";
import Help from "../../Modal/Help";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./Help.css";

function InsertPost() {
  const navigate = useNavigate();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState("Select Option");

  const user_id = sessionStorage.getItem("userId");

  //changeDatapost
  const [namePost, setNamePost] = useState("");
  const [storyPost, setStoryPost] = useState("");
  const [forPost, setForPost] = useState(0);
  const [timePost, setTimePost] = useState("");
  const [statusPost, setStatusPost] = useState(0);
  const [ingredientPost, setIngredientPost] = useState("");
  const [stepPost, setStepPost] = useState("");
  const [imgPost, setImgPost] = useState();
  //////////////////////////////////////////////////////
  const [hashtags, setHashtags] = useState([]);
  const testHash = useRef(null);

  const [namePost_error, setNamePost_error] = useState("");
  const [status_error, setStatus_error] = useState("");
  const [story_error, setStory_error] = useState("");
  const [ingredient_error, setIngredient_error] = useState("");
  const [step_error, setStep_error] = useState("");

  //stepLink
  const [link, setLink] = useState([]);
  const [type_link, setType_link] = useState(0);

  const [inputValue, setInputValue] = useState("");
  const [filteredHashtags, setFilteredHashtags] = useState([]);

  // ฟังก์ชันเมื่อมีการเปลี่ยนแปลงในช่อง input
  const handleChange = (e) => {
    const userInput = e.target.value;
    setInputValue(userInput);

    // แยกคำออกโดยใช้ space เพื่อดึงคำสุดท้ายที่ผู้ใช้กำลังพิมพ์
    const words = userInput.split(" ");
    const lastWord = words[words.length - 1];

    // กรอง Hashtags เฉพาะคำที่เป็น hashtag
    if (lastWord.startsWith("#")) {
      const filtered = hashtags.filter((hashtag) =>
        hashtag.toLowerCase().startsWith(lastWord.toLowerCase())
      );
      setFilteredHashtags(filtered);
    } else {
      setFilteredHashtags([]);
    }
  };

  // ฟังก์ชันเมื่อผู้ใช้คลิกเลือก hashtag
  const handleSuggestionClick = (suggestion) => {
    const words = inputValue.split(" ");
    words[words.length - 1] = suggestion; // แทนคำสุดท้ายด้วย hashtag ที่ถูกเลือก
    setInputValue(words.join(" ")); // ต่อคำกลับมาเป็นข้อความเต็ม
    setFilteredHashtags([]); // ล้างการแนะนำ
  };
  //////////////////////////////////////////////////////

  const refnamePost = useRef();
  const refstoryPost = useRef();
  const refforPost = useRef();
  const reftimePost = useRef();

  const refingredientPost = useRef();
  const refstepPost = useRef();

  const ud = () => {
    setNamePost(refnamePost.current.value);
    setStoryPost(refstoryPost.current.value);
    setForPost(refforPost.current.value);
    setTimePost(reftimePost.current.value);
    setIngredientPost(refingredientPost.current.value);
    setStepPost(refstepPost.current.value);
  };
  //////////////////////////////////////////////////////////////////////////////////////////////

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    if (option == "Private") {
      setStatusPost(2);
    } else if (option == "Public") {
      setStatusPost(1);
    }
    setSelectedOption(option);
    setIsOpen(false); // ปิด dropdown หลังจากเลือกตัวเลือก
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // สร้าง URL เพื่อแสดงพรีวิว
      setImgPost(file);
    }
  };

  const handleIconClick = () => {
    document.getElementById("fileInput").click(); // เปิด input file เมื่อกดที่ไอคอน
  };
  const addPost = () => {
    setNamePost_error("");
    setStatus_error("");
    setStory_error("");
    setIngredient_error("");
    setStep_error("");

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("name", namePost);
    formData.append("story", storyPost);
    formData.append("for_post", forPost);
    formData.append("time_use", timePost);
    const value = testHash.current.value;
    const foundHashtags = value.match(/#[\wก-๙]+/g);
    if (foundHashtags) {
      formData.append("hashtag", foundHashtags);
    }
    formData.append("status_post", statusPost);
    formData.append("ingredient", ingredientPost);
    formData.append("step_post", stepPost);
    formData.append("img_main", imgPost);

    Array.from(link).forEach((file) => {
      formData.append("linkpath", file);
    });
    formData.append("type_link", type_link);

    if (namePost == "") {
      setNamePost_error("กรุณากรอกชื่อโพสต์");
    } else if (namePost.length > 250) {
      setNamePost_error("กรุณาใส่ไม่เกิน 250 คำ");
    }

    if (storyPost.length > 350) {
      setStory_error("กรุณาใส่ไม่เกิน 350 คำ");
    }

    if (ingredientPost.length > 250) {
      setIngredient_error("กรุณาใส่ไม่เกิน 250 คำ");
    }

    if (stepPost.length > 250) {
      setStep_error("กรุณาใส่ไม่เกิน 250 คำ");
    }

    if (statusPost == 0) {
      setStatus_error("กรุณาเลือกสถานะของโพสต์");
    }

    if (
      (namePost != "") &
      (statusPost != 0) &
      (namePost.length < 250) &
      (storyPost.length < 350) &
      (ingredientPost.length < 250) &
      (stepPost.length < 250)
    ) {
      axios.post(baseUrl + "/api/add/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/Home");
    }
  };

  const [clickedButton, setClickedButton] = useState("photo");
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideo, setPreviewVideo] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios.get(baseUrl + "/api/see/hashtag_auto").then((response) => {
      setHashtags([]);
      response.data.forEach((i) => {
        setHashtags((index) => [...index, i.name]);
      });
    });
  }, []);

  const handleClick = (type) => {
    setClickedButton(type);
  };

  const handleFilesChange = (event) => {
    const files = event.target.files;

    if (clickedButton === "photo") {
      if (files.length > 5) {
        alert("You can only upload a maximum of 5 photos.");
        return;
      }
      const imagePreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setLink(files);
      setPreviewImages(imagePreviews);
      setType_link(1);
      setPreviewVideo(null);
    } else if (clickedButton === "video") {
      if (files.length > 1) {
        alert("You can only upload 1 video.");
        return;
      }

      const videoFile = files[0];
      const videoElement = document.createElement("video");

      videoElement.src = URL.createObjectURL(videoFile);

      videoElement.onloadedmetadata = () => {
        const videoDuration = videoElement.duration;

        if (videoDuration > 300) {
          // 300 seconds = 5 minutes
          alert("The video must not exceed 5 minutes.");
          return;
        }

        const videoPreview = URL.createObjectURL(videoFile);
        setLink(files);
        setPreviewVideo(videoPreview);
        setType_link(2);
        setPreviewImages([]);
      };
    }
  };

  const openHelpModal = () => {
    setIsOpenPopup(true);
  };

  const closeHelpModal = () => {
    setIsOpenPopup(false);
  };

  return (
    <div className="b">
      <Navbar />
      <div className="containeri">
        {selectedImage === null ? (
          <div
            className="containeri1"
            onClick={handleIconClick}
            style={{ cursor: "pointer" }}
          >
            <MdAddAPhoto className="icon" />
            <h1>Include a picture of the finished food</h1>
          </div>
        ) : (
          <div className="img-main" onClick={handleIconClick}>
            <img src={selectedImage} alt="Selected" />
          </div>
        )}
        <input
          id="fileInput"
          type="file"
          style={{ display: "none" }}
          onChange={handleImageChange}
          accept="image/*"
        />
        <div className="containeri2">
          <input
            type="text"
            ref={refnamePost}
            onChange={ud}
            className="mar10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Menu name"
            required
          />
          <p
            style={{
              textAlign: "center",
              color: "red",
              marginTop: "10px",
              marginBottom: "5px",
            }}
          >
            {namePost_error}
          </p>
          <input
            type="text"
            ref={refstoryPost}
            onChange={ud}
            className="mar10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Story"
            required
          />
          <p
            style={{
              textAlign: "center",
              color: "red",
              marginTop: "10px",
              marginBottom: "5px",
            }}
          >
            {story_error}
          </p>

          <div className="for mar10">
            <h1>For</h1>
            <input
              type="text"
              ref={refforPost}
              onChange={ud}
              className="mar10 w-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="People"
              required
            />
          </div>

          <div className="for mar10">
            <h1>Time Use</h1>
            <input
              type="text"
              ref={reftimePost}
              onChange={ud}
              className="mar10 w-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="เช่น 20 น., 1 ชม., 30 น."
              required
            />
          </div>
          <div className="for mar10">
            <h1>Hashtag</h1>
            <div className="hashtag_input">
              <input
                type="text"
                className="mar10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="#"
                value={inputValue}
                onChange={handleChange}
                required
                ref={testHash}
              />
              {filteredHashtags.length > 0 && (
                <ul>
                  {filteredHashtags.slice(0, 5).map((hashtag, index) => (
                    <li
                      key={index}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSuggestionClick(hashtag)}
                    >
                      {hashtag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="status for mar10">
            <h1>Status</h1>
            <div className="dropdown-container">
              <button
                onClick={toggleDropdown}
                className="min-w-[200px]  bg-[#2EC4B6] hover:bg-[#28B0A5] flex justify-center text-white focus:ring-4 focus:outline-none font-medium rounded-3xl text-sm px-5 py-2.5 text-center inline-flex items-center"
              >
                {selectedOption}
                <svg
                  className=" w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1l4 4 4-4"
                  />
                </svg>
              </button>
              {isOpen && (
                <div className="dropdown z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <a
                        onClick={() => handleOptionClick("Public")}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Public
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => handleOptionClick("Private")}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Private
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <p
            style={{
              textAlign: "center",
              color: "red",
              marginTop: "10px",
              marginLeft: "430px",
            }}
          >
            {status_error}
          </p>
        </div>

        <div className="containeri2">
          <h2>Ingredient</h2>
          <input
            type="text"
            ref={refingredientPost}
            onChange={ud}
            className="mar10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="-2 onions, -2 tablespoons vegetable oil"
            required
          />
          <p
            style={{
              textAlign: "center",
              color: "red",
              marginTop: "10px",
              marginBottom: "5px",
            }}
          >
            {ingredient_error}
          </p>
        </div>

        <div className="containeri2">
          <div className="step_help"
          title="Help"
          >
            <h2>Step</h2>
            <MdHelp className="text-3xl" onClick={() => openHelpModal()}           style={{cursor : 'pointer' }}
            />
          </div>
          <Popup
            open={isOpenPopup}
            closeOnDocumentClick
            onClose={closeHelpModal}
            position="center center"
            contentStyle={{
              borderRadius: "8px",
              background: "#fff",
              width: "35%",
            }}
          >
            <div className="max-w-xl shadow-lg rounded-lg p-4 bg-white flex flex-col justify-center">
              <h1 className="text-lg font-semibold mb-4 text-center">
                คำแนะนำ
              </h1>
              <h1 className="text-lg font-semibold mb-4 text-left">1.สามารถเลือกได้ว่าจะลงรูปภาพหรือวิดีโอ (โดยเลือกอย่างใดอย่างหนึ่ง)</h1>
              <h1 className="text-lg font-semibold mb-4 text-left">2.สามารถลงรูปภาพได้สูงสุด 5 รูป</h1>
              <h1 className="text-lg font-semibold mb-4 text-left">3.สามารถลงวิดีโอได้สูงสุด 1 คลิป</h1>
              <h1 className="text-lg font-semibold mb-4 text-left">4.ไม่สามารถเพิ่มรูปภาพใหม่ต่อจากรูปภาพเก่าได้ โดยทุกครั้งที่เลือกรูปใหม่หากต้องการให้มีรูปภาพเก่าอยู่ให้ผู้ใช้เลือกรูปภาพนั้นเข้ามาด้วย</h1>
              <div className="flex justify-end">
                <button
                  onClick={closeHelpModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </Popup>
          <input
            type="text"
            ref={refstepPost}
            onChange={ud}
            className="mar10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="For example, boil water"
            required
          />
          <p
            style={{
              textAlign: "center",
              color: "red",
              marginTop: "10px",
              marginBottom: "5px",
            }}
          >
            {step_error}
          </p>

          <div className="containeriin2">
            <button
              type="button"
              className={`flex items-center justify-center text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ${
                clickedButton === "photo" ? "clicked" : ""
              }`}
              onClick={() => handleClick("photo")}
            >
              Photo
            </button>

            <button
              type="button"
              className={`flex items-center justify-center text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 ${
                clickedButton === "video" ? "clicked" : ""
              }`}
              onClick={() => handleClick("video")}
            >
              Video
            </button>
          </div>

          <div className="iicon">
            {clickedButton === "photo" ? (
              previewImages.length > 0 ? (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <IoReload style={{ fontSize: "50px" }} />
                    <h1 style={{ fontSize: "15px" }}>Choos new file</h1>
                  </div>
                  <div className="image-previews">
                    {previewImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`preview-${index}`}
                        className="preview-image"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current.click()}>
                  <HiPhoto />
                </div>
              )
            ) : previewVideo === null ? (
              <div onClick={() => fileInputRef.current.click()}>
                <HiVideoCamera />
              </div>
            ) : (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <IoReload style={{ fontSize: "50px" }} />
                  <h1 style={{ fontSize: "15px" }}>Choos new file</h1>
                </div>
                <div className="video-preview">
                  <video key={previewVideo} controls>
                    <source src={previewVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept={clickedButton === "photo" ? "image/*" : "video/*"}
            multiple={clickedButton === "photo"}
            onChange={handleFilesChange}
          />
          <button
            onClick={addPost}
            type="button"
            className="flex items-center justify-center bg-[#FFA726] text-white hover:bg-[#FB8C00] focus:outline-none focus:ring-4 focus:ring-[#FFB74D] font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#EF6C00] dark:text-white dark:hover:bg-[#E65100] dark:focus:ring-[#FF8A65]"
          >
            Add Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default InsertPost;
