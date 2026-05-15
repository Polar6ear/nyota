export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
}) {
  const base = `
    inline-flex items-center justify-center
    px-5 py-2.5 rounded-[10px] text-sm font-medium
    transition-all duration-150 cursor-pointer
    disabled:opacity-60 disabled:cursor-not-allowed
  `
  const variants = {
    primary: 'bg-maroon text-[#FEF5F7] hover:bg-maroon-light active:scale-[0.98]',
    outline: 'bg-white border-[1.5px] border-border text-ink-200 hover:bg-cream',
    ghost:   'bg-transparent text-ink-200 hover:bg-cream',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  )
}