import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import api from '../utils/api'

export default function Signup() {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    naam: '', email: '', phone: '', password: ''
  })
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
    if (!form.naam)                         errs.naam     = 'Naam zaroori hai'
    if (!form.email)                        errs.email    = 'Email zaroori hai'
    if (!form.phone || form.phone.length < 10) errs.phone = 'Valid phone number daalo'
    if (!form.password || form.password.length < 8) errs.password = 'Password kam se kam 8 characters ka ho'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    try {
      const res = await api.post('/auth/signup', form)
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
          Account banao
        </h1>
        <p className="text-sm text-ink-300 mb-8">
          Free · koi card nahi chahiye
        </p>

        {apiError && (
          <div className="mb-5 px-4 py-3 rounded-[10px] bg-red-50 border border-red-200 text-red-600 text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Poora naam"
            placeholder="Ramesh Sharma"
            value={form.naam}
            onChange={handleChange('naam')}
            error={errors.naam}
            required
          />
          <Input
            label="Email address"
            type="email"
            placeholder="ramesh@gmail.com"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
          />
          <Input
            label="Phone number"
            type="tel"
            placeholder="98765 43210"
            value={form.phone}
            onChange={handleChange('phone')}
            error={errors.phone}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            required
          />

          <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2 py-3">
            Continue →
          </Button>
        </form>

        <p className="text-center text-sm text-ink-300 mt-6">
          Account hai?{' '}
          <Link to="/login" className="text-maroon font-medium hover:underline underline-offset-2">
            Sign in karo
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}