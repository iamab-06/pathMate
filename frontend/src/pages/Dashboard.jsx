import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Zap, Star, CheckCircle, UserPen, Compass, MessageSquare, ArrowRight } from 'lucide-react'

function Dashboard() {
  const { user } = useAuth()

  const statCards = [
    { label: 'Active Sessions', value: '3', Icon: Zap, color: 'text-amber-400', glow: 'shadow-amber-500/10' },
    { label: 'Total Reviews', value: user?.role === 'mentor' ? '12' : '4', Icon: Star, color: 'text-indigo-400', glow: 'shadow-indigo-500/10' },
    { label: 'Profile Status', value: 'Complete', Icon: CheckCircle, color: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
  ]

  const actionCards = [
    {
      to: '/profile',
      Icon: UserPen,
      title: 'Complete Your Profile',
      description: `Set up your ${user?.role} profile so the right people can find you.`,
      accent: 'from-indigo-500/15 to-purple-500/15',
      borderGlow: 'hover:border-indigo-500/20',
      iconColor: 'text-indigo-400',
      show: true,
    },
    {
      to: '/mentors',
      Icon: Compass,
      title: 'Find Mentors',
      description: 'Discover mentors who walked in your shoes and made it.',
      accent: 'from-cyan-500/15 to-blue-500/15',
      borderGlow: 'hover:border-cyan-500/20',
      iconColor: 'text-cyan-400',
      show: user?.role === 'mentee',
    },
    {
      to: '/requests',
      Icon: MessageSquare,
      title: user?.role === 'mentor' ? 'Incoming Requests' : 'My Requests',
      description: user?.role === 'mentor'
        ? 'View and respond to session requests from mentees.'
        : 'Track the session requests you\'ve sent to mentors.',
      accent: 'from-amber-500/15 to-orange-500/15',
      borderGlow: 'hover:border-amber-500/20',
      iconColor: 'text-amber-400',
      show: true,
    },
  ].filter(c => c.show)

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Header with subtle spotlight */}
      <div className="animate-fade-in flex flex-col md:flex-row md:items-end justify-between gap-6 hero-spotlight">
        <div>
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-3">Dashboard</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-[1.1]">
            Welcome back, {user?.first_name || 'there'}
          </h1>
          <p className="text-zinc-500 text-lg leading-relaxed">
            Let's continue your learning journey.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to={user?.role === 'mentor' ? '/requests' : '/mentors'} className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            {user?.role === 'mentor' ? 'View Requests' : 'Book a Session'}
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Stats Overview — staggered entrance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((stat, i) => (
          <div key={i} className={`glass-elevated rounded-2xl p-6 flex items-center gap-5 card-hover animate-fade-in-d${i + 1}`}>
            <div className={`w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center ${stat.glow} shadow-md`}>
              <stat.Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1 tracking-wide">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Cards — staggered */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xs font-bold text-zinc-600 uppercase tracking-widest animate-fade-in-d3">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-5">
          {actionCards.map((card, i) => (
            <Link
              key={card.to}
              to={card.to}
              className={`glass-elevated rounded-2xl p-7 card-hover group relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between animate-fade-in-d${i + 3} ${card.borderGlow}`}
            >
              {/* Background ambient wash */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-5 w-full">
                <div className={`w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0`}>
                  <card.Icon className={`w-5 h-5 ${card.iconColor}`} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-200 transition-colors duration-300 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                    {card.description}
                  </p>
                </div>
              </div>
              
              <div className="relative z-10 mt-5 md:mt-0 w-9 h-9 rounded-full border border-white/[0.06] flex items-center justify-center bg-white/[0.02] group-hover:bg-white/[0.06] transition-all duration-300 shrink-0 self-end md:self-center">
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors transform group-hover:translate-x-0.5 transition-transform" strokeWidth={1.8} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
