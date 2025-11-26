import bannerImg from "../assets/banner.png";

function Banner() {
  return (
    <div>
      <img src={bannerImg} alt="Banner" style={{ width: "100%", height: "auto" }} className="shadow border-b border-gray-300" />
    </div>
  );
}

export default Banner;
