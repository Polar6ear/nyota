import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, Info, RotateCcw } from 'lucide-react'
import api from '../utils/api'

const DONATION_PRESETS = [500, 1000, 2500]

export default function CreateEvent() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    event_naam: '',
    event_date: '',
    venue: '',
    upi_naam: '',
    dulha_dulhan: '',
  })

  const [upiIds, setUpiIds] = useState([
    { label: '', upi_id: '' }
  ])

  const [donations, setDonations] = useState([500, 1000, 2500])
  const [customDonation, setCustomDonation] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  const addUpi = () => {
    if (upiIds.length < 6) {
      setUpiIds([...upiIds, { label: '', upi_id: '' }])
    }
  }

  const removeUpi = (i) => {
    setUpiIds(upiIds.filter((_, idx) => idx !== i))
  }

  const updateUpi = (i, field, val) => {
    const updated = [...upiIds]
    updated[i][field] = val
    setUpiIds(updated)
  }

  const handleReset = () => {
    setForm({ event_naam: '', event_date: '', venue: '', upi_naam: '', dulha_dulhan: '' })
    setUpiIds([{ label: '', upi_id: '' }])
    setDonations([500, 1000, 2500])
    setAnonymous(false)
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.event_naam || !form.event_date || !upiIds[0]?.upi_id) {
      setError('Event naam, date aur kam se kam ek UPI ID zaroori hai')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/events/create', {
        event_naam: form.event_naam,
        dulha_dulhan: form.dulha_dulhan || form.event_naam,
        event_date: form.event_date,
        venue: form.venue,
        upi_id: upiIds[0].upi_id,
        upi_naam: form.upi_naam,
      })
      navigate(`/events/${res.data.id}/qr`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Kuch galat hua')
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width: '100%', padding: '9px 12px', fontSize: '13px',
    border: '1px solid #E2D0BC', borderRadius: '8px',
    background: 'white', color: '#1E0F08', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
  }

  const lbl = {
    fontSize: '12px', fontWeight: 600, color: '#1E0F08',
    marginBottom: '5px', display: 'block',
  }

  const hint = {
    fontSize: '11px', color: '#9C7B6A', marginTop: '4px',
  }

  // Live preview data
  const previewName  = form.event_naam  || 'Sangeet & Reception'
  const previewHost  = form.upi_naam    || 'Shalini & Family'
  const previewDate  = form.event_date  || 'Sat, 12 Dec 2026 • 7:00 PM'
  const previewVenue = form.venue       || 'The Banyan Hall, Mumbai'

  return (
    <div style={{ minHeight: '100vh', background: '#FDFAF5', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav style={{
        background: 'white', borderBottom: '1px solid #E2D0BC',
        padding: '12px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: '24px', height: '24px', background: '#7B1C2E', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 16 16" fill="none" style={{ width: '12px', height: '12px' }}>
                <rect x="2" y="2" width="5" height="5" rx="1.2" fill="#FEF5F7"/>
                <rect x="9" y="2" width="5" height="5" rx="1.2" fill="#FEF5F7"/>
                <rect x="2" y="9" width="5" height="5" rx="1.2" fill="#FEF5F7"/>
                <rect x="10" y="10" width="3" height="3" rx=".7" fill="#FEF5F7"/>
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#1E0F08' }}>NeutaBook</span>
          </div>
          <span style={{ color: '#9C7B6A', fontSize: '13px' }}>›</span>
          <span onClick={() => navigate('/dashboard')} style={{ fontSize: '13px', color: '#9C7B6A', cursor: 'pointer' }}>Host Dashboard</span>
          <span style={{ color: '#9C7B6A', fontSize: '13px' }}>›</span>
          <span style={{ fontSize: '13px', color: '#1E0F08', fontWeight: 500 }}>Create Event</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#7B1C2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: 'white' }}>P</div>
          <span style={{ fontSize: '13px', color: '#5C3D2E' }}>Priya Shah</span>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>

        {/* ── Left Form ── */}
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2D0BC', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1E0F08', margin: 0 }}>
              Create Event & QR Generator
            </h1>
            <p style={{ fontSize: '11.5px', color: '#9C7B6A', margin: 0 }}>Preview updates live as you type</p>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '12.5px', color: '#dc2626', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {/* Event Name + Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={lbl}>Event Name</label>
              <input style={inp} placeholder="Sangeet & Reception of Aanya & Raj"
                value={form.event_naam}
                onChange={e => setForm(p => ({ ...p, event_naam: e.target.value }))}
              />
              <p style={hint}>Enter a clear title that appears on the invitation and QR card...</p>
            </div>
            <div>
              <label style={lbl}>Date & Time</label>
              <input style={inp} placeholder="Sat, 12 Dec 2026 • 7:00 PM"
                value={form.event_date}
                onChange={e => setForm(p => ({ ...p, event_date: e.target.value }))}
              />
              <p style={hint}>Use format: Day, DD Mon YYYY • HH:MM AM/PM</p>
            </div>
          </div>

          {/* Venue + Host Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={lbl}>Venue</label>
              <input style={inp} placeholder="The Banyan Hall, Mumbai"
                value={form.venue}
                onChange={e => setForm(p => ({ ...p, venue: e.target.value }))}
              />
              <p style={hint}>Include full address for guests and print-ready card.</p>
            </div>
            <div>
              <label style={lbl}>Host Name</label>
              <input style={inp} placeholder="Shalini & Family"
                value={form.upi_naam}
                onChange={e => setForm(p => ({ ...p, upi_naam: e.target.value }))}
              />
              <p style={hint}>Shown on invitation as 'Hosted by ...'</p>
            </div>
          </div>

          {/* UPI IDs */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ ...lbl, marginBottom: 0 }}>UPI IDs</label>
              <p style={{ fontSize: '11.5px', color: '#9C7B6A', margin: 0 }}>Add multiple UPI IDs for contributions</p>
            </div>

            {upiIds.map((u, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 36px', gap: '8px', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#5C3D2E', fontWeight: 600, marginBottom: '4px' }}>Label</p>
                    <input style={inp} placeholder="Main Account"
                      value={u.label}
                      onChange={e => updateUpi(i, 'label', e.target.value)}
                    />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#5C3D2E', fontWeight: 600, marginBottom: '4px' }}>UPI ID</p>
                    <input style={inp} placeholder="name@bank"
                      value={u.upi_id}
                      onChange={e => updateUpi(i, 'upi_id', e.target.value)}
                    />
                    {u.upi_id && (
                      <p style={{ ...hint, color: u.upi_id.includes('@') ? '#059669' : '#DC2626' }}>
                        {u.upi_id.includes('@') ? '✓ Valid format. Verified with quick checksum.' : '⚠ Ensure format: name@bank'}
                      </p>
                    )}
                  </div>
                  {upiIds.length > 1 && (
                    <button onClick={() => removeUpi(i)} style={{
                      marginTop: '20px', padding: '9px 10px', background: 'none',
                      border: '1px solid #E2D0BC', borderRadius: '8px',
                      color: '#9C7B6A', cursor: 'pointer', fontSize: '12px',
                    }}>
                      REMOVE
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={addUpi} style={{
                padding: '8px 16px', background: '#7B1C2E', border: 'none',
                borderRadius: '8px', color: 'white', fontSize: '12.5px',
                fontWeight: 600, cursor: 'pointer',
              }}>ADD UPI</button>
              <p style={{ fontSize: '11.5px', color: '#9C7B6A', margin: 0 }}>
                You can add up to 6 UPI IDs.
              </p>
            </div>
          </div>

          {/* Donation Suggestions */}
          <div style={{ marginBottom: '20px' }}>
            <label style={lbl}>Donation Suggestions</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
              {DONATION_PRESETS.map(amt => (
                <button key={amt} style={{
                  padding: '7px 16px', borderRadius: '20px',
                  background: donations.includes(amt) ? '#7B1C2E' : 'white',
                  border: `1px solid ${donations.includes(amt) ? '#7B1C2E' : '#E2D0BC'}`,
                  color: donations.includes(amt) ? 'white' : '#5C3D2E',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                }}>₹{amt}</button>
              ))}
              <input
                type="number"
                placeholder="138"
                value={customDonation}
                onChange={e => setCustomDonation(e.target.value)}
                style={{ ...inp, width: '80px' }}
              />
            </div>
            <p style={hint}>Preset amounts help guests choose quickly. Editable during checkout.</p>
          </div>

          {/* Toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <label style={{ ...lbl, marginBottom: 0 }}>Anonymous Gifts</label>
                <div
                  onClick={() => setAnonymous(!anonymous)}
                  style={{
                    width: '36px', height: '20px', borderRadius: '10px',
                    background: anonymous ? '#7B1C2E' : '#E2D0BC',
                    cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%', background: 'white',
                    position: 'absolute', top: '2px',
                    left: anonymous ? '18px' : '2px', transition: 'left 0.2s',
                  }} />
                </div>
              </div>
              <p style={hint}>When enabled, donor names are hidden on event page and receipts.</p>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <label style={{ ...lbl, marginBottom: 0 }}>Privacy Tooltip</label>
                <Info size={13} style={{ color: '#9C7B6A' }} />
              </div>
              <p style={hint}>Click the info icon next to inputs for guidance on what to share publicly and what remains private.</p>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '11px 24px', background: '#7B1C2E', border: 'none',
                borderRadius: '8px', color: 'white', fontSize: '13.5px',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              {loading ? 'Generating...' : 'VALIDATE & GENERATE QR'}
            </button>
            <button onClick={handleReset} style={{
              padding: '11px 18px', background: 'none', border: '1px solid #E2D0BC',
              borderRadius: '8px', color: '#5C3D2E', fontSize: '13px', cursor: 'pointer',
            }}>RESET FORM</button>
            <p style={{ fontSize: '11.5px', color: '#9C7B6A', margin: 0 }}>
              All fields marked optional will not appear on the printed card if left empty.
            </p>
          </div>
        </div>

        {/* ── Right Preview ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Live Preview Card */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2D0BC', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1E0F08', margin: 0 }}>Live Invitation Preview</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button style={{ padding: '5px 12px', background: 'none', border: '1px solid #E2D0BC', borderRadius: '6px', fontSize: '11.5px', color: '#5C3D2E', cursor: 'pointer' }}>Download PNG</button>
                <button style={{ padding: '5px 12px', background: 'none', border: '1px solid #E2D0BC', borderRadius: '6px', fontSize: '11.5px', color: '#5C3D2E', cursor: 'pointer' }}>Download SVG</button>
              </div>
            </div>

            {/* Invitation card preview */}
            <div style={{
              border: '3px solid #7B1C2E', borderRadius: '10px',
              padding: '20px', background: '#FDFAF5',
              textAlign: 'center', position: 'relative',
              minHeight: '280px',
            }}>
              {/* Corner decorations */}
              {['topleft','topright','bottomleft','bottomright'].map(pos => (
                <div key={pos} style={{
                  position: 'absolute',
                  top: pos.includes('top') ? '8px' : 'auto',
                  bottom: pos.includes('bottom') ? '8px' : 'auto',
                  left: pos.includes('left') ? '8px' : 'auto',
                  right: pos.includes('right') ? '8px' : 'auto',
                  width: '28px', height: '28px',
                  background: '#7B1C2E', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px',
                }}>🌸</div>
              ))}

              {/* QR placeholder */}
              <div style={{
                width: '120px', height: '120px', background: '#1E0F08',
                margin: '20px auto 14px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', color: 'white',
              }}>
                QR Code
              </div>

              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#7B1C2E', marginBottom: '5px' }}>
                {previewName}
              </h2>
              <p style={{ fontSize: '12px', color: '#5C3D2E', marginBottom: '5px' }}>
                Hosted by {previewHost}
              </p>
              <p style={{ fontSize: '11.5px', color: '#9C7B6A' }}>
                {previewDate} • {previewVenue}
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {['Print-Ready Layout', 'Edit Card Styles'].map(btn => (
                <button key={btn} style={{ padding: '7px 14px', background: 'none', border: '1px solid #E2D0BC', borderRadius: '6px', fontSize: '12px', color: '#5C3D2E', cursor: 'pointer' }}>{btn}</button>
              ))}
              <button style={{ padding: '7px 12px', background: 'none', border: '1px solid #E2D0BC', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>📱</button>
              <button style={{ padding: '7px 12px', background: 'none', border: '1px solid #E2D0BC', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>✉️</button>
            </div>
          </div>

          {/* Available Outputs */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2D0BC', padding: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#1E0F08', marginBottom: '12px' }}>Available Outputs</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
              {[
                { label: 'PNG • 300 DPI', emoji: '🖼️' },
                { label: 'SVG • Vector', emoji: '⚡' },
                { label: 'PDF • Print',  emoji: '📄' },
              ].map(({ label, emoji }) => (
                <div key={label} style={{
                  border: '1px solid #E2D0BC', borderRadius: '8px',
                  padding: '12px 8px', textAlign: 'center', cursor: 'pointer',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{emoji}</div>
                  <p style={{ fontSize: '10.5px', color: '#5C3D2E', fontWeight: 500, margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shareable Invite Card */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2D0BC', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', background: '#FCEEF1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🎫</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1E0F08', margin: 0 }}>Shareable Invite Card</p>
                <p style={{ fontSize: '11px', color: '#9C7B6A', margin: 0 }}>Compact card suitable for WhatsApp sharing</p>
              </div>
              <button style={{ padding: '7px 14px', background: 'none', border: '1px solid #E2D0BC', borderRadius: '6px', fontSize: '12px', color: '#5C3D2E', cursor: 'pointer' }}>Share</button>
              <button style={{ padding: '7px 14px', background: 'none', border: '1px solid #E2D0BC', borderRadius: '6px', fontSize: '12px', color: '#5C3D2E', cursor: 'pointer' }}>Copy Link</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: '#1E0F08', padding: '32px 24px 20px', marginTop: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '32px', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>NeutaBook</p>
            <p style={{ fontSize: '12px', color: '#9C7B6A', lineHeight: 1.7 }}>
              Helping hosts create beautiful invites and seamless UPI collections.
            </p>
          </div>
          {[
            { title: 'Resources', links: ['Help Center', 'Design Templates', 'Print Guidelines'] },
            { title: 'Contact',   links: ['support@neutabook.com', '+91 22 5555 1234'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#9C7B6A', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>{title}</p>
              {links.map(l => (
                <p key={l} style={{ fontSize: '12px', color: '#666', marginBottom: '6px', cursor: 'pointer' }}>{l}</p>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: '1100px', margin: '0 auto', borderTop: '1px solid #2a2a2a', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '11px', color: '#444' }}>© 2026 NeutaBook, Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['f', '📷', '🐦'].map(s => (
              <span key={s} style={{ fontSize: '14px', cursor: 'pointer' }}>{s}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}