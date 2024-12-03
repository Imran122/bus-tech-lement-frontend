import busImage from "../../assets/buspng.png";
import "./HomeLoader.css";

const HomeLoader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen pb-20 bg-gray-100">
      <div className="main animate-pulse">
        {/* Rotating Circle */}
        <div className="circle">{/* Road Inside Circle */}</div>
        {/* Rotating Bus Outside Circle */}
        <div className="bus-container">
          <img src={busImage} alt="bus" className="bus-image" />
        </div>
      </div>
    </div>
  );
};

export default HomeLoader;
