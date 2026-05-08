import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, Briefcase } from 'lucide-react'

function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'mentee',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(formData)
      navigate('/login', { state: { message: 'Account created! Please log in.' } })
    } catch (err) {
      const data = err.response?.data
      if (data) {
        // Django returns errors as { field: [messages] }
        const firstError = Object.values(data).flat()[0]
        setError(firstError || 'Registration failed')
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-bg flex items-center justify-center min-h-screen py-10">
      <div className="glow-blob" />
      <div className="noise-overlay" />
      <div className="page-content w-full max-w-md px-6 animate-fade-in">
        
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-3xl font-bold text-slate-900 tracking-tight">
            Path<span className="gradient-text">Mate</span>
          </Link>
        </div>

        <div className="glass-floating rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Create your account</h2>
          <p className="text-slate-500 mb-8 text-sm">Start your mentorship journey</p>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/15 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Rahul"
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Sharma"
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>

            {/* Role Selection */}
            <div className="pt-2">
              <label className="block text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">I want to be a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'mentee' })}
                  className={`py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    formData.role === 'mentee'
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-600'
                      : 'glass text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" strokeWidth={1.8} /> Mentee
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'mentor' })}
                  className={`py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    formData.role === 'mentor'
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-600'
                      : 'glass text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Briefcase className="w-4 h-4" strokeWidth={1.8} /> Mentor
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl text-sm font-medium mt-4"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-slate-500 text-sm mt-8 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-600 hover:text-cyan-500 font-medium transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
