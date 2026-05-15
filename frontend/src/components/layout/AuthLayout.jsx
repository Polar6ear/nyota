import Logo from '../ui/Logo'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">

      {/* Left panel — maroon */}
      <div className="hidden lg:flex lg:w-[45%] bg-maroon flex-col items-center justify-center p-12 relative overflow-hidden">

        {/* Logo */}
        <div className="absolute top-8 left-8">
          <Logo white />
        </div>

        {/* Floral illustration — SVG decorative */}
        <div className="flex flex-col items-center text-center">
          <svg viewBox="0 0 300 320" className="w-72 h-72 opacity-90" fill="none">
            {/* Crescent moon base */}
            <path d="M150 280 C80 260 40 200 50 130 C60 60 110 20 150 10 C110 50 95 100 105 150 C115 200 145 240 150 280Z"
              fill="rgba(254,245,247,0.12)" stroke="rgba(254,245,247,0.25)" strokeWidth="1"/>
            {/* Floral circles */}
            <circle cx="120" cy="130" r="40" fill="rgba(184,134,11,0.2)" stroke="rgba(184,134,11,0.4)" strokeWidth="1.5"/>
            <circle cx="140" cy="180" r="28" fill="rgba(254,245,247,0.08)" stroke="rgba(254,245,247,0.2)" strokeWidth="1"/>
            <circle cx="95" cy="165" r="20" fill="rgba(184,134,11,0.15)" stroke="rgba(184,134,11,0.3)" strokeWidth="1"/>
            {/* Petals */}
            {[0,60,120,180,240,300].map((angle, i) => (
              <ellipse
                key={i}
                cx={120 + Math.cos(angle * Math.PI/180) * 44}
                cy={130 + Math.sin(angle * Math.PI/180) * 44}
                rx="12" ry="20"
                transform={`rotate(${angle}, ${120 + Math.cos(angle * Math.PI/180) * 44}, ${130 + Math.sin(angle * Math.PI/180) * 44})`}
                fill="rgba(254,245,247,0.1)"
                stroke="rgba(254,245,247,0.25)"
                strokeWidth="1"
              />
            ))}
            {/* Gold dots */}
            {[45, 135, 225, 315].map((angle, i) => (
              <circle
                key={i}
                cx={150 + Math.cos(angle * Math.PI/180) * 90}
                cy={150 + Math.sin(angle * Math.PI/180) * 90}
                r="3"
                fill="rgba(184,134,11,0.6)"
              />
            ))}
            {/* Decorative lines */}
            <path d="M80 220 Q120 200 160 230 Q140 260 80 220Z"
              fill="rgba(254,245,247,0.06)" stroke="rgba(254,245,247,0.15)" strokeWidth="1"/>
          </svg>

          <h2 className="text-white/90 text-xl font-medium mt-4 leading-relaxed">
            Shaadi ka neuta,<br/>
            <span className="text-gold-100">ab digital ho gaya</span>
          </h2>
          <p className="text-white/50 text-sm mt-3 max-w-xs leading-relaxed">
            QR code print karo, invitation pe lagao. Mehman seedha UPI se bhejenge.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          {children}
        </div>
      </div>

    </div>
  )
}