import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Inbox, Sparkles, Video, AlertCircle, Star } from 'lucide-react'

const statusConfig = {
  pending: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/15',
    dot: 'bg-amber-400',
    label: 'Pending',
    animate: true,
  },
  accepted: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/15',
    dot: 'bg-emerald-400',
    label: 'Accepted',
    animate: false,
  },
  rejected: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/15',
    dot: 'bg-rose-400',
    label: 'Declined',
    animate: false,
  },
  completed: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/15',
    dot: 'bg-cyan-400',
    label: 'Completed',
    animate: false,
  },
}

const avatarGradients = [
  'from-indigo-500 to-purple-500',
  'from-cyan-500 to-blue-500',
  'from-pink-500 to-rose-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
]

function MyRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [meetingLinks, setMeetingLinks] = useState({})

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await api.get('/sessions/')
      setRequests(res.data)
    } catch (err) {
      setError('Failed to load requests.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const payload = { status: newStatus }
      if (newStatus === 'accepted' && meetingLinks[requestId]) {
        payload.meeting_link = meetingLinks[requestId]
      }
      const res = await api.patch(`/sessions/${requestId}/`, payload)
      setRequests(requests.map(r =>
        r.id === requestId ? { ...r, status: newStatus, meeting_link: res.data.meeting_link } : r
      ))
    } catch (err) {
      alert('Failed to update status.')
    }
  }

  const isMentor = user?.role === 'mentor'

  return (
    <div className="flex flex-col max-w-4xl w-full">
      <div className="animate-fade-in mb-10 hero-spotlight">
        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-3">Sessions</p>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight leading-[1.1]">
          {isMentor ? 'Incoming Requests' : 'My Requests'}
        </h1>
        <p className="text-zinc-500 text-base leading-relaxed">
          {isMentor
            ? 'Mentees who want to connect with you. Accept or decline each request.'
            : 'Track the session requests you\'ve sent to mentors.'}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-surface rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/[0.04]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/[0.06] rounded-full w-1/3" />
                  <div className="h-3 bg-white/[0.03] rounded-full w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="glass-surface rounded-2xl p-12 text-center flex flex-col items-center">
          <AlertCircle className="w-10 h-10 text-rose-400/60 mb-4" strokeWidth={1.5} />
          <p className="text-rose-400 text-base mb-6">{error}</p>
          <button onClick={fetchRequests} className="btn-secondary px-6 py-2.5 rounded-xl text-sm">
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && requests.length === 0 && (
        <div className="glass-surface rounded-2xl p-16 text-center animate-fade-in-d1 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
            {isMentor
              ? <Inbox className="w-7 h-7 text-zinc-600" strokeWidth={1.5} />
              : <Sparkles className="w-7 h-7 text-zinc-600" strokeWidth={1.5} />
            }
          </div>
          <h3 className="text-white font-bold text-xl mb-3 tracking-tight">
            {isMentor ? 'No requests yet' : 'No requests sent yet'}
          </h3>
          <p className="text-zinc-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            {isMentor
              ? 'Once a mentee sends you a request, it will appear here.'
              : 'Find a mentor and send your first session request!'}
          </p>
          {!isMentor && (
            <Link to="/mentors" className="btn-primary px-7 py-3 rounded-xl text-sm font-medium">
              Browse Mentors
            </Link>
          )}
        </div>
      )}

      {/* Request list */}
      {!loading && !error && requests.length > 0 && (
        <div className="space-y-5">
          {requests.map((req, i) => {
            const otherUser = isMentor ? req.mentee : req.mentor
            const otherName = [otherUser.first_name, otherUser.last_name].filter(Boolean).join(' ') || otherUser.email
            const initials = (otherUser.first_name?.[0] || '') + (otherUser.last_name?.[0] || '')
            const gradient = avatarGradients[i % avatarGradients.length]
            const status = statusConfig[req.status] || statusConfig.pending
            const date = new Date(req.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })

            return (
              <div
                key={req.id}
                className="glass-elevated rounded-2xl p-6 lg:p-7 card-hover animate-fade-in relative overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Subtle top edge */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                
                <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-lg ring-2 ring-[#09090b]`}>
                    {initials}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center justify-between gap-4 mb-1.5 flex-wrap">
                      <h3 className="text-white font-bold text-lg tracking-tight">{otherName}</h3>
                      <span className={`text-[0.65rem] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider flex items-center gap-1.5 ${status.bg} ${status.text} ${status.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${status.animate ? 'animate-pulse' : ''}`} />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-zinc-600 text-xs mb-3 font-bold uppercase tracking-widest">{date}</p>
                    
                    {req.message && (
                      <div className="bg-white/[0.03] border border-white/[0.04] rounded-xl p-3.5 mb-4 relative">
                        <div className="absolute top-3.5 left-0 w-[2px] h-6 bg-white/10 rounded-r" />
                        <p className="text-zinc-400 text-sm leading-relaxed italic pl-2">
                          &ldquo;{req.message}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Mentor action buttons */}
                    {isMentor && req.status === 'pending' && (
                      <div className="mt-5 space-y-3 bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]">
                        <div>
                           <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Meeting Link (Optional)</label>
                           <input
                             type="url"
                             placeholder="e.g. https://meet.google.com/..."
                             value={meetingLinks[req.id] || ''}
                             onChange={(e) => setMeetingLinks({ ...meetingLinks, [req.id]: e.target.value })}
                             className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                           />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'accepted')}
                            className="flex-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-500/15 transition-all duration-300 font-bold"
                          >
                            Accept Request
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'rejected')}
                            className="sm:w-auto bg-rose-500/10 text-rose-400 border border-rose-500/15 px-5 py-2.5 rounded-xl text-sm hover:bg-rose-500/15 transition-all duration-300 font-bold"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    )}
                    {isMentor && req.status === 'accepted' && (
                      <div className="mt-5 pt-5 border-t border-white/[0.04]">
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'completed')}
                          className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/15 px-5 py-2.5 rounded-xl text-sm hover:bg-cyan-500/15 transition-all duration-300 font-bold"
                        >
                          Mark as Completed
                        </button>
                      </div>
                    )}

                    {/* Mentee meeting link & Review action */}
                    {!isMentor && (req.status === 'accepted' || req.status === 'completed') && (
                      <div className="mt-5 pt-5 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
                        {req.meeting_link ? (
                          <a
                            href={req.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500/15 transition-all duration-300"
                          >
                            <Video className="w-4 h-4" /> Join Meeting
                          </a>
                        ) : (
                          <div className="text-zinc-500 text-sm italic">No meeting link provided yet</div>
                        )}
                        
                        {req.status === 'completed' && req.mentor_profile_id && (
                          <Link
                            to={`/mentors/${req.mentor_profile_id}`}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-6 py-2.5 rounded-xl font-bold hover:bg-amber-500/15 transition-all duration-300 ml-auto"
                          >
                            <Star className="w-4 h-4" /> Leave a Review
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyRequests
