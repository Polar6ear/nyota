import { useNavigate } from 'react-router-dom'

export default function Logo({ size = 'md', white = false }) {
  const navigate = useNavigate()
  const sizes = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10 text-base' }

  return (
    <div
      className="flex items-center gap-2.5 cursor-pointer"
      onClick={() => navigate('/')}
    >
      <div className={`
        ${sizes[size]} rounded-[8px] flex items-center justify-center flex-shrink-0
        ${white ? 'bg-white/20' : 'bg-maroon'}
      `}>
        <svg viewBox="0 0 16 16" fill="none" className="w-[55%] h-[55%]">
          <rect x="2" y="2" width="5" height="5" rx="1.2" fill={white ? '#FEF5F7' : '#FEF5F7'}/>
          <rect x="9" y="2" width="5" height="5" rx="1.2" fill={white ? '#FEF5F7' : '#FEF5F7'}/>
          <rect x="2" y="9" width="5" height="5" rx="1.2" fill={white ? '#FEF5F7' : '#FEF5F7'}/>
          <rect x="10" y="10" width="3" height="3" rx=".7" fill={white ? '#FEF5F7' : '#FEF5F7'}/>
        </svg>
      </div>
      <span className={`font-medium text-[15px] ${white ? 'text-white' : 'text-ink'}`}>
        NeutaBook
      </span>
    </div>
  )
}