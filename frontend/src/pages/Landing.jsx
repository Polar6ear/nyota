import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Lock, QrCode, Palette, Calendar, Gift, CreditCard } from 'lucide-react'
import api from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import mandala from '../assets/mandala.png'
import gifts from '../assets/gifts.png'
import qrPhone from '../assets/qr-phone.png'

function HeroLoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [tab, setTab] = useState('password')
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.access_token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Email ya password galat hai')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '20px',
      width: '260px', flexShrink: 0,
      boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#1E0F08', lineHeight: 1.1 }}>Host</p>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#1E0F08', lineHeight: 1.1 }}>Login</p>
          <p style={{ fontSize: '11px', color: '#9C7B6A', marginTop: '6px', lineHeight: 1.6, maxWidth: '130px' }}>
            Access your events, generate QR codes and manage gifts
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', color: '#9C7B6A' }}>Trusted by</p>
          <p style={{ fontSize: '13px', color: '#8B6914', fontWeight: 700 }}>12,340</p>
          <p style={{ fontSize: '13px', color: '#8B6914', fontWeight: 700 }}>couples</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #E2D0BC', marginBottom: '14px' }}>
        {[{ id: 'password', label: 'Email & Password' }, { id: 'otp', label: 'OTP' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            fontSize: '11px', fontWeight: 500, background: 'none', border: 'none',
            cursor: 'pointer', paddingBottom: '8px', marginBottom: '-1px',
            color: tab === t.id ? '#7B1C2E' : '#9C7B6A',
            borderBottom: tab === t.id ? '2px solid #7B1C2E' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              border: `1.5px solid ${tab === t.id ? '#7B1C2E' : '#9C7B6A'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {tab === t.id && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#7B1C2E' }} />}
            </div>
            {t.label}
          </button>
        ))}
      </div>

      {error && <p style={{ fontSize: '11px', color: '#dc2626', background: '#fef2f2', padding: '6px 8px', borderRadius: '6px', marginBottom: '8px' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <p style={{ fontSize: '11px', color: '#5C3D2E', fontWeight: 600, marginBottom: '4px' }}>Email</p>
        <input type="email" placeholder="host@neutabook.co" value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          style={{ width: '100%', padding: '9px 11px', fontSize: '12.5px', border: '1px solid #E2D0BC', borderRadius: '8px', background: 'white', color: '#1E0F08', outline: 'none', boxSizing: 'border-box', marginBottom: '10px', fontFamily: 'Inter, sans-serif' }}
        />
        <p style={{ fontSize: '11px', color: '#5C3D2E', fontWeight: 600, marginBottom: '4px' }}>Password</p>
        <input type="password" placeholder="Enter your password" value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          style={{ width: '100%', padding: '9px 11px', fontSize: '12.5px', border: '1px solid #E2D0BC', borderRadius: '8px', background: 'white', color: '#1E0F08', outline: 'none', boxSizing: 'border-box', marginBottom: '10px', fontFamily: 'Inter, sans-serif' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#9C7B6A', cursor: 'pointer' }}>
            <input type="checkbox" style={{ accentColor: '#7B1C2E', width: '12px', height: '12px' }} />
            Remember me
          </label>
          <span style={{ fontSize: '11px', color: '#9C7B6A', cursor: 'pointer' }}>Forgot?</span>
        </div>
        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '10px', background: '#7B1C2E', color: '#FEF5F7',
          border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0' }}>
        <div style={{ flex: 1, height: '1px', background: '#E2D0BC' }} />
        <span style={{ fontSize: '10px', color: '#9C7B6A' }}>Or sign in with</span>
        <div style={{ flex: 1, height: '1px', background: '#E2D0BC' }} />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {[['G', '#4285F4'], ['f', '#1877F2']].map(([s, c]) => (
          <button key={s} style={{
            flex: 1, padding: '8px', border: '1px solid #E2D0BC', borderRadius: '8px',
            background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: c,
          }}>{s}</button>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: '11px', color: '#9C7B6A' }}>
        Don't have an account?{' '}
        <span onClick={() => navigate('/signup')} style={{ color: '#8B6914', fontWeight: 700, cursor: 'pointer' }}>
          Create Account
        </span>
      </p>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    { icon: Lock,    title: 'Secure Payments', desc: 'PCI-compliant checkout for peace of mind.' },
    { icon: QrCode,  title: 'Instant QR',      desc: 'Generate QR codes for each event and guest.' },
    { icon: Palette, title: 'Elegant Designs', desc: 'Gold-accent motifs and customizable themes.' },
  ]

  const howItWorks = [
    { icon: Calendar,   title: 'Create Event',    desc: 'Set event details, dates, and guest lists in minutes.',         img: gifts },
    { icon: Gift,       title: 'Customize Gifts', desc: 'Choose themes, messages, and gift categories for your guests.', img: gifts },
    { icon: CreditCard, title: 'Guest Checkout',  desc: 'Fast, mobile-first payments with multilingual support.',        img: qrPhone },
  ]

  const howSteps = [
    { icon: Calendar,   title: 'Set up in minutes', desc: 'Enter event details, select a theme and generate QR gift cards for every guest.' },
    { icon: QrCode,     title: 'Guests scan & pay', desc: 'Guests use their phones to scan and contribute securely with a few taps.' },
    { icon: CreditCard, title: 'Track responses',   desc: 'Real-time host dashboard with contributions and guest notes.' },
  ]

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', background: '#7B1C2E' }}>

      {/* ── Navbar ── */}
      <nav style={{
        background: 'white', padding: '13px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #E2D0BC',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: '28px', height: '28px', background: '#7B1C2E', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 16 16" fill="none" style={{ width: '14px', height: '14px' }}>
              <rect x="2" y="2" width="5" height="5" rx="1.2" fill="#FEF5F7" />
              <rect x="9" y="2" width="5" height="5" rx="1.2" fill="#FEF5F7" />
              <rect x="2" y="9" width="5" height="5" rx="1.2" fill="#FEF5F7" />
              <rect x="10" y="10" width="3" height="3" rx=".7" fill="#FEF5F7" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '15px', color: '#1E0F08' }}>NeutaBook</span>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          {['How it Works', 'Pricing', 'Support'].map(item => (
            <button key={item} style={{ fontSize: '13px', color: '#9C7B6A', background: 'none', border: 'none', cursor: 'pointer' }}>{item}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/login')} style={{ fontSize: '13px', padding: '7px 20px', borderRadius: '8px', border: '1px solid #E2D0BC', color: '#5C3D2E', background: 'white', cursor: 'pointer' }}>Login</button>
          <button onClick={() => navigate('/signup')} style={{ fontSize: '13px', padding: '7px 20px', borderRadius: '8px', border: 'none', background: '#7B1C2E', color: '#FEF5F7', fontWeight: 600, cursor: 'pointer' }}>Sign Up</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ padding: '28px 40px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Top row: hero card + login form + mandala */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>

            {/* White hero card */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '32px', flex: 1 }}>
              <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#7B1C2E', lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.02em' }}>
                Digital wedding gift QR
              </h1>
              <p style={{ fontSize: '13.5px', color: '#5C3D2E', lineHeight: 1.85, marginBottom: '26px' }}>
                Create a beautiful, contactless gifting experience. Host a NeutaBook
                event, generate elegant QR gift cards, and let guests scan to
                contribute instantly — secure payments, instant confirmation, and
                customizable gift pages designed for weddings and celebrations.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                <button onClick={() => navigate('/events/create')} style={{
                  padding: '11px 24px', background: '#7B1C2E', color: '#FEF5F7',
                  border: 'none', borderRadius: '8px', fontSize: '13.5px', fontWeight: 500, cursor: 'pointer',
                }}>Create Event</button>
                <button style={{
                  padding: '11px 24px', background: 'white', color: '#7B1C2E',
                  border: '1.5px solid #7B1C2E', borderRadius: '8px', fontSize: '13.5px', cursor: 'pointer',
                }}>Scan as Guest</button>
              </div>
              <div style={{ display: 'flex', gap: '28px' }}>
                {features.map(({ icon: Icon, title, desc }) => (
                  <div key={title} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Icon size={13} style={{ color: '#8B6914', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#7B1C2E' }}>{title}</p>
                      <p style={{ fontSize: '11px', color: '#9C7B6A', lineHeight: 1.6, marginTop: '2px' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Login form */}
            <HeroLoginForm />

            {/* Mandala */}
            <div style={{ width: '200px', flexShrink: 0 }}>
              <img src={mandala} alt="" style={{ width: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Bottom 3 cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', paddingBottom: '32px' }}>
            {howItWorks.map(({ icon: Icon, title, desc, img }) => (
              <div key={title} style={{
                background: 'rgba(255,255,255,0.1)', borderRadius: '14px',
                padding: '18px', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                  <Icon size={13} style={{ color: '#F0D98A' }} />
                  <p style={{ fontSize: '13.5px', fontWeight: 600, color: 'white' }}>{title}</p>
                </div>
                <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: '12px' }}>{desc}</p>
                <div style={{ borderRadius: '10px', overflow: 'hidden', height: '130px', marginTop: 'auto' }}>
                  <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── How NeutaBook works ── */}
      <div style={{ background: '#F7F2EA', padding: '48px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#7B1C2E', marginBottom: '20px' }}>How NeutaBook works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
            {howSteps.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: 'white', borderRadius: '14px', padding: '22px', border: '1px solid #E2D0BC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                  <Icon size={13} style={{ color: '#8B6914' }} />
                  <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#7B1C2E' }}>{title}</p>
                </div>
                <p style={{ fontSize: '12.5px', color: '#5C3D2E', lineHeight: 1.75 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: '#7B1C2E', padding: '48px 40px 28px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 16 16" fill="none" style={{ width: '12px', height: '12px' }}>
                    <rect x="2" y="2" width="5" height="5" rx="1.2" fill="#FEF5F7" />
                    <rect x="9" y="2" width="5" height="5" rx="1.2" fill="#FEF5F7" />
                    <rect x="2" y="9" width="5" height="5" rx="1.2" fill="#FEF5F7" />
                    <rect x="10" y="10" width="3" height="3" rx=".7" fill="#FEF5F7" />
                  </svg>
                </div>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>NeutaBook</span>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
                NeutaBook makes gifting effortless — elegant QR gifting pages and secure payments for your wedding day.
              </p>
            </div>

            {[
              { title: 'Company', links: ['About', 'How it Works', 'Pricing'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>{title}</p>
                {links.map(l => (
                  <button key={l} style={{ display: 'block', fontSize: '12.5px', color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', padding: 0 }}>{l}</button>
                ))}
              </div>
            ))}

            <div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>Support</p>
              {['Contact', 'Help Center'].map(l => (
                <button key={l} style={{ display: 'block', fontSize: '12.5px', color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', padding: 0 }}>{l}</button>
              ))}
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '14px', marginBottom: '8px' }}>Subscribe</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input placeholder="your@email.com" style={{
                  flex: 1, padding: '8px 10px', borderRadius: '7px',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', fontSize: '12px', outline: 'none', minWidth: 0,
                  fontFamily: 'Inter, sans-serif',
                }} />
                <button style={{ padding: '8px 16px', background: '#B8860B', color: '#1E0F08', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Join
                </button>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>© 2026 NeutaBook. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['Instagram', 'Facebook', 'Twitter'].map(s => (
                <button key={s} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}