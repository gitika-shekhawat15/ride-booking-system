export default function Button({ text, onClick, type = "button"}) {
    return (
        <button
            type = {type}
            onClick={onClick}
            className="w-full bg-[#D6FF2F] text-black py-3 rounded-xl font-semibold"
        >
            {text}
        </button>
    );

}