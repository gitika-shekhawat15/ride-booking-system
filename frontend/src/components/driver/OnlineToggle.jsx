
export default function OnlineToggle({ isOnline, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`w-18 h-8 flex items-center px-1 rounded-full cursor-pointer transition
        ${isOnline ? "bg-orange-700" : "bg-gray-400"}
      `}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition
          ${isOnline ? "translate-x-10" : "translate-x-0"}
        `}
      />
    </div>
  );
}
