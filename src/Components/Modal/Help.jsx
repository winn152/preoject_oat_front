import NiceModal, { useModal } from "@ebay/nice-modal-react";
import "./Help.css";
import Button from "./Button";

const Help = NiceModal.create(
  ({ title, action, bgColor }) => {
    const modal = useModal();
    return (
      <div className="background max-h-full">
        <div className="modal">
          <h1 className="mt-3 font-bold">{title}</h1>
          <div className="actions">
            <Button
              name={action}
              backgroundColor={bgColor}
            />
            <Button
              name="Close"
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

export default Help;