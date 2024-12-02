import busImage from "../../assets/buspng.png";
import "./HomeLoader.css";

const HomeLoader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen pb-20 bg-gray-100">
      <div className="main animate-pulse">
        {/* Rotating Bus */}
        <div className="circle">
          <img src={busImage} alt="bus" className="bus-image" />
        </div>
        {/* Road Inside Circle */}
        <div className="road"></div>
      </div>
    </div>
  );
};

export default HomeLoader;
