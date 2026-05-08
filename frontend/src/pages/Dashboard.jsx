import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Layers, Star, ShieldCheck, UserPen, Compass, MessageSquare, ArrowRight } from 'lucide-react'

function Dashboard() {
  const { user } = useAuth()

  const statCards = [
    { label: 'Active Sessions', value: '3', Icon: Layers, color: 'text-teal-600' },
    { label: 'Total Reviews', value: user?.role === 'mentor' ? '12' : '4', Icon: Star, color: 'text-teal-600' },
    { label: 'Profile Status', value: 'Complete', Icon: ShieldCheck, color: 'text-teal-600' },
  ]

  const actionCards = [
    {
      to: '/profile',
      Icon: UserPen,
      title: 'Complete Your Profile',
      description: `Set up your ${user?.role} profile so the right people can find you.`,
      accent: 'from-cyan-500/15 to-emerald-500/15',
      borderGlow: 'hover:border-cyan-500/30',
      iconColor: 'text-cyan-600',
      show: true,
    },
    {
      to: '/mentors',
      Icon: Compass,
      title: 'Find Mentors',
      description: 'Discover mentors who walked in your shoes and made it.',
      accent: 'from-emerald-500/15 to-teal-500/15',
      borderGlow: 'hover:border-emerald-500/30',
      iconColor: 'text-emerald-600',
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
      borderGlow: 'hover:border-amber-500/30',
      iconColor: 'text-amber-500',
      show: true,
    },
  ].filter(c => c.show)

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Header with subtle spotlight */}
      <div className="animate-fade-in flex flex-col md:flex-row md:items-end justify-between gap-6 hero-spotlight">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dashboard</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight leading-[1.1]">
            Welcome back, {user?.first_name || 'there'}
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
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
            <stat.Icon className={`w-8 h-8 ${stat.color}`} strokeWidth={1.5} />
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1 tracking-wide">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Cards — staggered */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-fade-in-d3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {actionCards.map((card, i) => (
            <Link
              key={card.to}
              to={card.to}
              className={`glass-elevated rounded-2xl p-7 card-hover group relative overflow-hidden flex flex-col items-start animate-fade-in-d${i + 3} ${card.borderGlow}`}
            >
              {/* Background ambient wash */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              <div className="relative z-10 flex flex-col items-start gap-4 w-full h-full">
                <div className={`w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center`}>
                  <card.Icon className={`w-5 h-5 ${card.iconColor}`} strokeWidth={1.8} />
                </div>
                <div className="flex-1 w-full flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-700 transition-colors duration-300 tracking-tight flex items-center justify-between">
                    {card.title}
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors transform group-hover:translate-x-1" strokeWidth={2} />
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
