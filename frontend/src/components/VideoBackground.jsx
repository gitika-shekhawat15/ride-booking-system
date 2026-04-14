
import heroBg from "../assets/images/heroBg.mp4";

const VideoBackground = () => (
  <div className="fixed inset-0 -z-10">
    <video
      autoPlay loop muted playsInline
      className="w-full h-full object-cover brightness-50"
    >
      <source src={heroBg} type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-black/40" />
  </div>
);

export default VideoBackground;