import NiceModal, { useModal } from "@ebay/nice-modal-react";
import "./Modal.css";
import Button from "./Button";
import { MdReport } from "react-icons/md";
import axios from "axios";


const Modal = NiceModal.create(
  ({ title, action, bgColor , data, baseURL }) => {
    const modal = useModal();
    return (
      <div className="background">
        <div className="modal">
          <MdReport className="w-full flex justify-center items-center text-red-500" size={40} />
          <h1 className="mt-3 font-bold">{title}</h1>
          <div className="actions">
            <Button
              name={action}
              backgroundColor={bgColor}
              onClick={async () => {
                if(action === "Confirm"){
                    console.log(baseURL);
                    
                    console.log(data);
                    try{
                        const response = await axios.post(baseURL ,data,{
                            headers: {
                                "Content-Type": "application/json",
                              },
                        });
                        if(response){
                            sessionStorage.setItem("reload", 1)
                            // eslint-disable-next-line no-undef
                            navigation.navigate('/HomeAdmin') 
                        }
                    } catch (error) {
                        console.log("Error");
                    }
                }
              }}
            />
            <Button
              name="Cancel"
              color="#ffffff"
              backgroundColor="#2EC4B6"
              onClick={() => {
                modal.remove();
              }}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Modal;