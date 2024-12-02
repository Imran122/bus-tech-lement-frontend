import busImage from "../../assets/buspng.png";
import "./HomeLoader.css";

const HomeLoader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen pb-20 bg-gray-100">
      <div className="main">
        <div className="circle">
          <img src={busImage} alt="bus" className="bus-image" />
        </div>
      </div>
    </div>
  );
};

export default HomeLoader;
