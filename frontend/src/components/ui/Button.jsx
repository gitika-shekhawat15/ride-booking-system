export default function Button({ 
  onClick, 
  loading = false, 
  disabled = false, 
  children, 
  className = "" 
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        relative flex items-center justify-center
        disabled:opacity-60 disabled:cursor-not-allowed
        transition-all duration-200
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <svg 
            className="animate-spin w-4 h-4" 
            fill="none" viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" cx="12" cy="12" r="10" 
              stroke="currentColor" strokeWidth="4"
            />
            <path 
              className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
}