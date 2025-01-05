import "./Button.css";

const Button = ({ name, backgroundColor, onClick, color="" }) => {
  return (
    <button className="button" onClick={onClick} style={{ backgroundColor, color }}>
      {name}
    </button>
  );
};

export default Button;