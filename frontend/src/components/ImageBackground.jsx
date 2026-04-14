import heroImg from "../assets/images/heroImg.jpg";

const ImageBackground = ({ src = heroImg }) => (
<div className="fixed inset-0 -z-10 h-[100dvh]">
      <img
      src={src}
      className="w-full h-full object-cover brightness-50"
    />
    <div className="absolute inset-0 bg-black/40" />
  </div>
);

export default ImageBackground;