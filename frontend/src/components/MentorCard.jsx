import { Link } from 'react-router-dom'
import { Star, ArrowUpRight } from 'lucide-react'

const tierLabels = {
  '1': 'Tier 1',
  '2': 'Tier 2',
  '3': 'Tier 3',
}

const tierColors = {
  '1': 'badge badge-emerald',
  '2': 'badge badge-amber',
  '3': 'badge badge-neon-purple',
}

const internshipLabels = {
  'none': 'Self-starter',
  'startup': 'Startup path',
  'mass': 'Corporate path',
}

const avatarGradients = [
  'from-indigo-500 to-purple-500',
  'from-cyan-500 to-blue-500',
  'from-pink-500 to-rose-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
]

function MentorCard({ mentor, index = 0 }) {
  const user = mentor.user || {}
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Mentor'
  const initials = (user.first_name?.[0] || 'M') + (user.last_name?.[0] || '')
  const gradient = avatarGradients[index % avatarGradients.length]

  return (
    <div className="glass-elevated rounded-2xl p-6 min-h-[240px] flex flex-col justify-between card-hover group relative overflow-hidden">
      {/* Subtle top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      
      {/* Background glow on hover — very subtle */}
      <div className={`absolute -top-24 -right-24 w-56 h-56 bg-gradient-to-br ${gradient} rounded-full blur-[100px] opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none`} />

      {/* Top Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            {/* Avatar with ring glow */}
            <div className="relative shrink-0">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base shadow-lg ring-2 ring-[#09090b]`}>
                {initials}
              </div>
              {/* Subtle ring glow on hover */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-700 pointer-events-none`} />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-bold text-base leading-tight group-hover:text-indigo-200 transition-colors duration-300 truncate tracking-tight">
                {fullName}
              </h3>
              <p className="text-zinc-500 text-sm truncate mt-0.5">
                {mentor.company} &middot; {mentor.experience_years}+ yrs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500 bg-white/[0.03] px-2 py-1 rounded-lg text-xs font-medium border border-white/[0.04]">
             <Star className="w-3 h-3 text-amber-400/80" strokeWidth={2} fill="currentColor" />
             <span>{mentor.average_rating || 'New'}</span>
          </div>
        </div>

        <p className="text-zinc-400 text-sm mb-5 leading-relaxed line-clamp-2">
          {mentor.domain}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {mentor.previous_college_tier && (
            <span className={tierColors[mentor.previous_college_tier] || 'badge bg-white/[0.04] text-zinc-400 border-white/[0.06]'}>
              {tierLabels[mentor.previous_college_tier] || mentor.previous_college_tier}
            </span>
          )}
          {mentor.internship_status && (
            <span className="badge badge-neon-cyan">
              {internshipLabels[mentor.internship_status] || mentor.internship_status}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="relative z-10 mt-auto pt-4 border-t border-white/[0.04] flex items-center justify-between">
         <span className="text-xs text-zinc-600 font-medium">{mentor.total_reviews} reviews</span>
         <Link to={`/mentors/${mentor.id}`} className="text-sm font-medium text-zinc-400 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] px-4 py-2 rounded-xl transition-all duration-300 group-hover:border-indigo-500/20 group-hover:text-indigo-300 flex items-center gap-1.5">
           View Profile <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
         </Link>
      </div>
    </div>
  )
}

export default MentorCard
