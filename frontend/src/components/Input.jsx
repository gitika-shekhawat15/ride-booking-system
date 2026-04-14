export default function Input({type, name, value, onChange, placeholder}) {
    return (
       <input
        name = {name}
        value = {value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full p-3 mb-4 rounded-lg bg-zinc-900 border border-zinc-700 outline-none"
      />
    );

}