export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[11.5px] font-medium text-ink-200 tracking-wide">
          {label} {required && <span className="text-maroon">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-3 py-2.5 rounded-[10px] text-[13px]
          bg-cream border-[1.5px] text-ink placeholder:text-ink-300
          transition-colors duration-150
          focus:outline-none focus:border-maroon
          ${error ? 'border-red-400' : 'border-border'}
        `}
      />
      {error && (
        <p className="text-[11px] text-red-500">{error}</p>
      )}
    </div>
  )
}