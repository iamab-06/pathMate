import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Users, MessageSquare, UserPen, LogOut, Compass } from 'lucide-react'

const iconMap = {
  '/dashboard': LayoutDashboard,
  '/mentors': Compass,
  '/requests': MessageSquare,
  '/profile': UserPen,
}

function SidebarLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Explore Mentors', path: '/mentors', hideForRole: 'mentor' },
    { name: user?.role === 'mentor' ? 'Incoming Requests' : 'My Requests', path: '/requests', requiresAuth: true },
    { name: 'Profile', path: '/profile', requiresAuth: true },
  ]

  const activeLink = navLinks.find(link => location.pathname === link.path || (link.path !== '/dashboard' && location.pathname.startsWith(link.path)))?.path || '/dashboard'

  return (
    <div className="page-bg h-screen flex text-zinc-100 font-sans overflow-hidden">
      <div className="noise-overlay" />
      <div className="page-content flex flex-1 w-full max-w-screen-2xl mx-auto h-full">
        
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 glass-surface border-r border-white/[0.04] p-6 h-screen sticky top-0 z-20 shrink-0">
          <Link to="/" className="text-2xl font-bold text-white mb-12 tracking-tight flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white text-xs font-black">P</span>
            </div>
            Path<span className="gradient-text">Mate</span>
          </Link>

          <nav className="flex-1 space-y-1">
            {navLinks.map((link) => {
              if (link.requiresAuth && !user) return null;
              if (link.hideForRole && user?.role === link.hideForRole) return null;
              
              const isActive = activeLink === link.path;
              const Icon = iconMap[link.path] || LayoutDashboard;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-250 ${
                    isActive
                      ? 'bg-white/[0.06] text-white shadow-[inset_2px_0_0_#8b5cf6]'
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] transition-colors duration-250 ${isActive ? 'text-indigo-400' : ''}`} strokeWidth={1.8} />
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile Snippet at Bottom */}
          {user ? (
            <div className="mt-auto pt-6 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/[0.06] flex items-center justify-center text-indigo-300 text-sm font-bold shrink-0">
                  {user.first_name?.[0] || user.email[0].toUpperCase()}
                </div>
                <div className="flex flex-col overflow-hidden min-w-0">
                  <span className="text-sm font-medium text-zinc-300 truncate">{user.first_name || user.email.split('@')[0]}</span>
                  <span className="text-xs text-zinc-600 capitalize">{user.role}</span>
                </div>
              </div>
              <button onClick={logout} className="p-2 rounded-lg hover:bg-white/[0.04] text-zinc-600 hover:text-rose-400 transition-colors duration-250" title="Log out">
                <LogOut className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </div>
          ) : (
            <div className="mt-auto pt-6 border-t border-white/[0.06]">
              <Link to="/login" className="btn-primary w-full block text-center py-2.5 rounded-xl text-sm font-medium">
                Log In
              </Link>
            </div>
          )}
        </aside>

        {/* Mobile Nav Header */}
        <div className="md:hidden fixed top-0 w-full glass-surface z-30 px-6 py-4 flex items-center justify-between border-b border-white/[0.04]">
           <Link to="/" className="text-xl font-bold text-white tracking-tight">
            Path<span className="gradient-text">Mate</span>
          </Link>
          <Link to="/dashboard" className="text-zinc-500 hover:text-white transition-colors">
             <LayoutDashboard className="w-5 h-5" strokeWidth={1.8} />
          </Link>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full h-screen relative z-10 pt-20 md:pt-0 overflow-y-auto">
          <div className="w-full max-w-5xl mx-auto px-6 py-8 md:py-12 pb-24">

            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default SidebarLayout
