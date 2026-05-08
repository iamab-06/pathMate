import { useState, useEffect } from 'react'
import api from '../services/api'
import MentorCard from '../components/MentorCard'
import { SlidersHorizontal, Search, Users, AlertCircle } from 'lucide-react'

function MentorListing() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter state
  const [filters, setFilters] = useState({
    previous_college_tier: '',
    internship_status: '',
    domain: '',
    company: '',
  })

  // Fetch mentors whenever filters change
  useEffect(() => {
    fetchMentors()
  }, [filters])

  const fetchMentors = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value
      })
      const res = await api.get('/mentors/', { params })
      setMentors(res.data)
    } catch (err) {
      setError('Failed to load mentors. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    setFilters({ previous_college_tier: '', internship_status: '', domain: '', company: '' })
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const filterLabels = {
    previous_college_tier: { '1': 'Tier 1', '2': 'Tier 2', '3': 'Tier 3' },
    internship_status: { none: 'No Internship', startup: 'Startup', mass: 'Mass Recruiter' },
  }

  return (
    <div className="flex flex-col">
      {/* Hero section with spotlight */}
      <div className="animate-fade-in mb-12 hero-spotlight">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Explore</p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-[1.1] tracking-tight">
          Find mentors who walked in
          <span className="gradient-text"> your shoes</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
          Filter by background, not just achievements. Find someone who started where you are — and made it.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Filter Sidebar */}
        <div className="lg:w-64 shrink-0 animate-fade-in-d1">
          <div className="glass-surface rounded-2xl p-5 lg:sticky lg:top-8 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-600 font-semibold text-xs uppercase tracking-widest flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600/70" strokeWidth={2} /> Filters
              </h2>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-cyan-600 transition-colors">
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">College Tier</label>
                <select value={filters.previous_college_tier} onChange={(e) => handleFilterChange('previous_college_tier', e.target.value)} className="glass-input w-full px-4 py-2.5 rounded-xl text-sm appearance-none">
                  <option value="" className="bg-white text-slate-900">All tiers</option>
                  <option value="1" className="bg-white text-slate-900">Tier 1 (IIT, NIT, BITS)</option>
                  <option value="2" className="bg-white text-slate-900">Tier 2 (State Colleges)</option>
                  <option value="3" className="bg-white text-slate-900">Tier 3 (Local/Private)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">Starting Point</label>
                <select value={filters.internship_status} onChange={(e) => handleFilterChange('internship_status', e.target.value)} className="glass-input w-full px-4 py-2.5 rounded-xl text-sm appearance-none">
                  <option value="" className="bg-white text-slate-900">Any background</option>
                  <option value="none" className="bg-white text-slate-900">No initial internship</option>
                  <option value="startup" className="bg-white text-slate-900">Startup internship</option>
                  <option value="mass" className="bg-white text-slate-900">Mass recruiter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">Domain</label>
                <input type="text" value={filters.domain} onChange={(e) => handleFilterChange('domain', e.target.value)} placeholder="e.g. Frontend" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm" />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">Company</label>
                <input type="text" value={filters.company} onChange={(e) => handleFilterChange('company', e.target.value)} placeholder="e.g. Google" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Mentor Grid Area */}
        <div className="flex-1 min-w-0">
          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium mr-1">Active:</span>
              {filters.previous_college_tier && (
                <span className="badge badge-neon-purple flex items-center gap-1.5">
                  {filterLabels.previous_college_tier[filters.previous_college_tier]}
                  <button onClick={() => handleFilterChange('previous_college_tier', '')} className="hover:text-slate-900 transition-colors">&times;</button>
                </span>
              )}
              {filters.internship_status && (
                <span className="badge badge-neon-cyan flex items-center gap-1.5">
                  {filterLabels.internship_status[filters.internship_status]}
                  <button onClick={() => handleFilterChange('internship_status', '')} className="hover:text-slate-900 transition-colors">&times;</button>
                </span>
              )}
              {filters.domain && (
                <span className="badge badge-emerald flex items-center gap-1.5">
                  {filters.domain}
                  <button onClick={() => handleFilterChange('domain', '')} className="hover:text-slate-900 transition-colors">&times;</button>
                </span>
              )}
              {filters.company && (
                <span className="badge badge-amber flex items-center gap-1.5">
                  {filters.company}
                  <button onClick={() => handleFilterChange('company', '')} className="hover:text-slate-900 transition-colors">&times;</button>
                </span>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-surface rounded-2xl p-6 animate-pulse">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-50" />
                    <div className="flex-1 mt-1">
                      <div className="h-4 bg-slate-100 rounded-full w-2/3 mb-3" />
                      <div className="h-3 bg-slate-50 rounded-full w-1/2" />
                    </div>
                  </div>
                  <div className="h-3 bg-slate-50 rounded-full w-full mb-5 mt-8" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-slate-50 rounded-full w-14" />
                    <div className="h-5 bg-slate-50 rounded-full w-20" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="glass-surface rounded-2xl p-12 text-center flex flex-col items-center">
              <AlertCircle className="w-10 h-10 text-rose-400/60 mb-4" strokeWidth={1.5} />
              <p className="text-rose-400 text-base mb-6">{error}</p>
              <button onClick={fetchMentors} className="btn-secondary px-6 py-2.5 rounded-xl text-sm">
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && mentors.length === 0 && (
            <div className="glass-surface rounded-2xl p-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-slate-900 font-bold text-xl mb-3 tracking-tight">No mentors found</h3>
              <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                {activeFilterCount > 0
                  ? "We couldn't find anyone matching these exact filters. Try broadening your search."
                  : 'No mentors have signed up yet. Be the first!'}
              </p>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="btn-secondary px-8 py-3 rounded-xl text-sm font-medium">
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Mentor Cards Grid */}
          {!loading && !error && mentors.length > 0 && (
            <>
              <p className="text-xs text-slate-400 mb-4 uppercase tracking-widest font-bold flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
                {mentors.length} Mentor{mentors.length !== 1 ? 's' : ''} Found
              </p>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {mentors.map((mentor, index) => (
                  <div key={mentor.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.06}s` }}>
                    <MentorCard mentor={mentor} index={index} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MentorListing
