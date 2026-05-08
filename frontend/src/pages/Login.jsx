import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-bg flex items-center justify-center min-h-screen">
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Welcome back</h2>
          <p className="text-slate-500 mb-8 text-sm">Log in to your PathMate account</p>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/15 text-rose-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl text-sm font-medium mt-2"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-slate-500 text-sm mt-8 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-600 hover:text-cyan-500 font-medium transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
