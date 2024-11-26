import logo from "../../assets/logo.png";
const HomeLoader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen pb-20">
      <img src={logo} alt="logo" className="w-1/6 animate-pulse" />
    </div>
  );
};

export default HomeLoader;
