import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function ProfileSetup() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const [menteeData, setMenteeData] = useState({ college_tier: '', target_role: '', current_skills: '' })
  const [mentorData, setMentorData] = useState({ company: '', experience_years: 0, domain: '', previous_college_tier: '', internship_status: 'none' })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.role === 'mentee') {
          const res = await api.get('/users/profile/mentee/')
          setMenteeData(res.data)
        } else {
          const res = await api.get('/users/profile/mentor/')
          const { user: _, id, ...editableData } = res.data
          setMentorData(editableData)
        }
      } catch (err) {
        console.log('No existing profile, starting fresh')
      }
    }
    fetchProfile()
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    try {
      if (user?.role === 'mentee') {
        await api.patch('/users/profile/mentee/', menteeData)
      } else {
        await api.patch('/users/profile/mentor/', mentorData)
      }
      setSaved(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      console.error('Error saving profile:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto animate-fade-in">
      
      {/* Back Button */}
      <Link to="/dashboard" className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm transition-colors w-fit">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="glass-elevated rounded-3xl p-8 md:p-12 relative overflow-hidden">
        {/* Subtle decorative glow in top right */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Stepper / Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              Complete Your Profile
            </h2>
            <p className="text-zinc-400 text-sm">
              {user?.role === 'mentee' ? 'Help us match you with the right mentor.' : 'Share your journey to help aspiring students.'}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Step 2 of 2</span>
            <div className="flex gap-1 mt-2">
              <div className="h-1 w-8 bg-indigo-500 rounded-full" />
              <div className="h-1 w-8 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </div>
          </div>
        </div>

        {saved && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-8 text-sm font-medium relative z-10">
            Profile saved! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {user?.role === 'mentee' ? (
            <>
              <div>
                <label className="block text-sm text-zinc-400 mb-2 font-medium">College Tier</label>
                <select value={menteeData.college_tier} onChange={(e) => setMenteeData({ ...menteeData, college_tier: e.target.value })} required className="glass-input w-full px-4 py-3 rounded-xl text-sm appearance-none">
                  <option value="" className="bg-[#09090b] text-white">Select tier</option>
                  <option value="1" className="bg-[#09090b] text-white">Tier 1 (IIT, NIT, BITS, etc.)</option>
                  <option value="2" className="bg-[#09090b] text-white">Tier 2 (Good State Colleges)</option>
                  <option value="3" className="bg-[#09090b] text-white">Tier 3 (Local/Private Colleges)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2 font-medium">Target Role</label>
                <input type="text" value={menteeData.target_role} onChange={(e) => setMenteeData({ ...menteeData, target_role: e.target.value })} placeholder="e.g. Frontend Developer, Product Manager" required className="glass-input w-full px-4 py-3 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2 font-medium">Current Skills</label>
                <textarea value={menteeData.current_skills} onChange={(e) => setMenteeData({ ...menteeData, current_skills: e.target.value })} placeholder="e.g. React, Python, SQL" rows={4} className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm text-zinc-400 mb-2 font-medium">Current Company</label>
                <input type="text" value={mentorData.company} onChange={(e) => setMentorData({ ...mentorData, company: e.target.value })} placeholder="e.g. Google, Razorpay, Zerodha" required className="glass-input w-full px-4 py-3 rounded-xl text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2 font-medium">Years of Experience</label>
                  <input type="number" value={mentorData.experience_years} onChange={(e) => setMentorData({ ...mentorData, experience_years: parseInt(e.target.value) || 0 })} min="0" required className="glass-input w-full px-4 py-3 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2 font-medium">Domain</label>
                  <input type="text" value={mentorData.domain} onChange={(e) => setMentorData({ ...mentorData, domain: e.target.value })} placeholder="e.g. Software Engineering" required className="glass-input w-full px-4 py-3 rounded-xl text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2 font-medium">Your Previous College Tier</label>
                <select value={mentorData.previous_college_tier} onChange={(e) => setMentorData({ ...mentorData, previous_college_tier: e.target.value })} required className="glass-input w-full px-4 py-3 rounded-xl text-sm appearance-none">
                  <option value="" className="bg-[#09090b] text-white">Select tier</option>
                  <option value="1" className="bg-[#09090b] text-white">Tier 1 (IIT, NIT, BITS, etc.)</option>
                  <option value="2" className="bg-[#09090b] text-white">Tier 2 (Good State Colleges)</option>
                  <option value="3" className="bg-[#09090b] text-white">Tier 3 (Local/Private Colleges)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2 font-medium">Internship Status (when you started)</label>
                <select value={mentorData.internship_status} onChange={(e) => setMentorData({ ...mentorData, internship_status: e.target.value })} required className="glass-input w-full px-4 py-3 rounded-xl text-sm appearance-none">
                  <option value="none" className="bg-[#09090b] text-white">No initial internship</option>
                  <option value="startup" className="bg-[#09090b] text-white">Startup internship</option>
                  <option value="mass" className="bg-[#09090b] text-white">Mass recruiter internship</option>
                </select>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-white/5">
            <button type="submit" disabled={loading} className="w-full btn-primary py-4 rounded-xl text-sm font-bold tracking-wide">
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileSetup
