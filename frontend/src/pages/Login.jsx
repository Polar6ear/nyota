import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import api from '../utils/api'

export default function Login() {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    setApiError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.email)    errs.email    = 'Email zaroori hai'
    if (!form.password) errs.password = 'Password zaroori hai'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.access_token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Kuch galat hua, dobara try karo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div>
        <h1 className="text-3xl font-medium text-ink tracking-tight mb-1">
          Log in
        </h1>
        <p className="text-sm text-ink-300 mb-8">
          Apne account mein wapas aao
        </p>

        {apiError && (
          <div className="mb-5 px-4 py-3 rounded-[10px] bg-red-50 border border-red-200 text-red-600 text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email address"
            type="email"
            placeholder="host@neutabook.in"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
          />
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11.5px] font-medium text-ink-200 tracking-wide">
                Password <span className="text-maroon">*</span>
              </label>
              <Link to="/forgot-password" className="text-[11.5px] text-maroon hover:underline underline-offset-2">
                Bhool gaye?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange('password')}
              className={`
                w-full px-3 py-2.5 rounded-[10px] text-[13px]
                bg-cream border-[1.5px] text-ink placeholder:text-ink-300
                focus:outline-none focus:border-maroon transition-colors
                ${errors.password ? 'border-red-400' : 'border-border'}
              `}
            />
            {errors.password && (
              <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2 py-3">
            Login
          </Button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border"/>
          <span className="text-xs text-ink-300">ya</span>
          <div className="flex-1 h-px bg-border"/>
        </div>

        <Button variant="outline" fullWidth>
          Google se sign in
        </Button>

        <p className="text-center text-sm text-ink-300 mt-6">
          Account nahi hai?{' '}
          <Link to="/signup" className="text-maroon font-medium hover:underline underline-offset-2">
            Sign up karo
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}