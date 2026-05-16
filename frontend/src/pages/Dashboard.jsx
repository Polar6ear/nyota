import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'
import {
  LayoutDashboard, CalendarDays, BarChart2,
  Settings, Search, Plus, Bell, QrCode, Gift, AlertCircle,
  LogOut, ChevronDown, TrendingUp
} from 'lucide-react'
import api from '../utils/api'

// ── Dummy chart data ──────────────────────────────────────────
const chartData = [
  { month: 'Jan', amount: 18000 },
  { month: 'Feb', amount: 32000 },
  { month: 'Mar', amount: 27000 },
  { month: 'Apr', amount: 65000 },
  { month: 'May', amount: 72000 },
  { month: 'Jun', amount: 89000 },
  { month: 'Jul', amount: 45000 },
  { month: 'Aug', amount: 110000 },
  { month: 'Sep', amount: 58000 },
  { month: 'Oct', amount: 0 },
  { month: 'Nov', amount: 0 },
  { month: 'Dec', amount: 0 },
]

// ── Reusable Stat Card ────────────────────────────────────────
function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className={`
      rounded-2xl p-6 border-[1.5px]
      ${accent
        ? 'bg-maroon border-maroon text-white'
        : 'bg-white border-border text-ink'}
    `}>
      <p className={`text-xs font-medium tracking-wide uppercase mb-3
        ${accent ? 'text-white/60' : 'text-ink-300'}`}>
        {label}
      </p>
      <p className={`text-3xl font-medium tracking-tight
        ${accent ? 'text-white' : 'text-ink'}`}>
        {value}
      </p>
      {sub && (
        <p className={`text-xs mt-2 flex items-center gap-1
          ${accent ? 'text-white/60' : 'text-ink-300'}`}>
          <TrendingUp size={11} />
          {sub}
        </p>
      )}
    </div>
  )
}

// ── Action Card ───────────────────────────────────────────────
function ActionCard({ icon: Icon, label, count, color }) {
  return (
    <div className="flex flex-col items-center gap-3 cursor-pointer group">
      <div className="relative">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          transition-transform group-hover:scale-105
          ${color}
        `}>
          <Icon size={24} className="text-white" />
        </div>
        {count > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-ink text-white
            text-[10px] font-medium rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </div>
      <span className="text-xs text-ink-200 font-medium">{label}</span>
    </div>
  )
}

// ── Status Badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    upcoming: { label: 'Upcoming', cls: 'bg-maroon-50 text-maroon border-maroon-100' },
    new:      { label: 'New',      cls: 'bg-gold-50  text-gold-dark border-gold-100' },
    settled:  { label: 'Settled',  cls: 'bg-cream-100 text-ink-300 border-border' },
  }
  const { label, cls } = map[status] || map.new
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${cls}`}>
      {label}
    </span>
  )
}

// ── Main Dashboard ────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab]   = useState('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser]             = useState(null)
  const [events, setEvents]         = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) setUser(JSON.parse(saved))
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/my-events')
      setEvents(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Dummy events for display
  const dummyEvents = [
    { id: 'EVT-2026-38', status: 'upcoming', days: 'In 14 days', name: 'Sangeet Night',    venue: 'Laxmi Garden, Jaipur',  collected: 45000 },
    { id: 'EVT-2026-36', status: 'upcoming', days: 'In 28 days', name: 'Mehndi & Haldi',   venue: 'City Cultural Center',  collected: 128000 },
    { id: 'EVT-2026-30', status: 'upcoming', days: 'In 35 days', name: 'Banquet Plaza',    venue: 'Reception & Dinner',    collected: 38900 },
    { id: 'EVT-2026-39', status: 'new',      days: 'Created',    name: 'Puja & Blessings', venue: 'Temple hall booking',   collected: 66500 },
    { id: 'EVT-2026-40', status: 'settled',  days: 'Settled',    name: 'Community Grounds',venue: 'Venue booking',         collected: 139450 },
  ]

  const displayEvents = events.length > 0 ? events : dummyEvents

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Events',    icon: CalendarDays,    path: '/events' },
    { label: 'Stats',     icon: BarChart2,       path: '/stats' },
    { label: 'Settings',  icon: Settings,        path: '/settings' },
  ]

  return (
    <div className="min-h-screen bg-cream font-sans">

      {/* ── Top Navbar ── */}
      <nav className="bg-white border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-maroon rounded-[8px] flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <rect x="2" y="2" width="5" height="5" rx="1.2" fill="#FEF5F7"/>
                <rect x="9" y="2" width="5" height="5" rx="1.2" fill="#FEF5F7"/>
                <rect x="2" y="9" width="5" height="5" rx="1.2" fill="#FEF5F7"/>
                <rect x="10" y="10" width="3" height="3" rx=".7" fill="#FEF5F7"/>
              </svg>
            </div>
            <span className="font-medium text-[15px] text-ink">NeutaBook</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, icon: Icon, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors
                  ${window.location.pathname === path
                    ? 'bg-maroon-50 text-maroon font-medium'
                    : 'text-ink-300 hover:text-ink hover:bg-cream'}`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right — Search + User */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-[10px] border-[1.5px] border-border
                bg-cream text-sm text-ink placeholder:text-ink-300
                focus:outline-none focus:border-maroon w-56"
            />
          </div>

          {/* User avatar */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-maroon-50 border-[1.5px] border-maroon-100
              flex items-center justify-center text-maroon font-medium text-sm">
              {user?.naam?.[0]?.toUpperCase() || 'U'}
            </div>
            <ChevronDown size={14} className="text-ink-300" />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-ink-300
              hover:text-maroon transition-colors px-2 py-1 rounded-lg hover:bg-maroon-50"
          >
            <LogOut size={14} />
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-8 py-8">

        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-medium text-ink tracking-tight">Upcoming</h1>
            <p className="text-sm text-ink-300 mt-1">
              Namaste, {user?.naam?.split(' ')[0] || 'Host'} 👋
            </p>
          </div>
          <button
            onClick={() => navigate('/events/create')}
            className="flex items-center gap-2 bg-maroon text-[#FEF5F7]
              px-5 py-2.5 rounded-[10px] text-sm font-medium
              hover:bg-maroon-light transition-colors active:scale-[0.98]"
          >
            <Plus size={16} />
            Create
          </button>
        </div>

        {/* Stats + Chart row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Stat cards */}
          <div className="flex flex-col gap-4">
            <StatCard
              label="Total Collected"
              value="₹1,75,000"
              sub="+₹11,000 aaj"
              accent
            />
            <StatCard
              label="Recent Payments"
              value="₹55,090"
              sub="Last 7 days"
            />
          </div>

          {/* Bar chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border-[1.5px] border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-ink">Events this year</p>
              <span className="text-xs text-ink-300 bg-cream px-3 py-1 rounded-full border border-border">
                2026
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2D0BC" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#9C7B6A' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9C7B6A' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v === 0 ? '0' : `₹${v/1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1.5px solid #E2D0BC',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#1E0F08'
                  }}
                  formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Amount']}
                  cursor={{ fill: '#FCEEF1' }}
                />
                <Bar dataKey="amount" fill="#7B1C2E" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action cards */}
        <div className="bg-white rounded-2xl border-[1.5px] border-border p-6 mb-8">
          <p className="text-sm font-medium text-ink mb-6">Quick Actions</p>
          <div className="flex items-center justify-around">
            <ActionCard icon={Bell}        label="Notifications" count={3} color="bg-maroon" />
            <ActionCard icon={AlertCircle} label="Failed QR"     count={9} color="bg-maroon-light" />
            <ActionCard icon={QrCode}      label="Generate QR"   count={0} color="bg-gold-dark" />
            <ActionCard icon={Gift}        label="Gifts"         count={1} color="bg-ink-200" />
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-2xl border-[1.5px] border-border overflow-hidden">

          {/* Table header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
                  ${activeTab === 'active'
                    ? 'bg-maroon-50 text-maroon'
                    : 'text-ink-300 hover:text-ink'}`}
              >
                Active
                <span className="bg-maroon text-white text-[10px] px-1.5 py-0.5 rounded-full">5</span>
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === 'all'
                    ? 'bg-maroon-50 text-maroon'
                    : 'text-ink-300 hover:text-ink'}`}
              >
                All events
              </button>
            </div>

            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
              <input
                placeholder="Search by event or venue"
                className="pl-9 pr-4 py-2 text-sm rounded-[8px] border-[1.5px] border-border
                  bg-cream focus:outline-none focus:border-maroon text-ink
                  placeholder:text-ink-300 w-52"
              />
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="bg-cream-100">
                <th className="text-left px-6 py-3 text-[11.5px] font-medium text-ink-300 uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-[11.5px] font-medium text-ink-300 uppercase tracking-wide">Event ID</th>
                <th className="text-left px-6 py-3 text-[11.5px] font-medium text-ink-300 uppercase tracking-wide">Event name</th>
                <th className="text-left px-6 py-3 text-[11.5px] font-medium text-ink-300 uppercase tracking-wide">Details</th>
                <th className="text-right px-6 py-3 text-[11.5px] font-medium text-ink-300 uppercase tracking-wide">Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dummyEvents.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-cream/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={event.status} />
                      <span className="text-xs text-ink-300">{event.days}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-ink-300">{event.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-ink">{event.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-ink-200">{event.venue}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-ink">
                      ₹{event.collected.toLocaleString('en-IN')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table footer */}
          <div className="px-6 py-3 border-t border-border flex items-center justify-between bg-cream-100">
            <span className="text-xs text-ink-300">5 events dikha rahe hain</span>
            <div className="flex gap-2">
              <button className="text-xs border border-border px-3 py-1.5 rounded-lg text-ink-200 hover:bg-white bg-white">← Pehle</button>
              <button className="text-xs border border-border px-3 py-1.5 rounded-lg text-ink-200 hover:bg-white bg-white">Agle →</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}