import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, Briefcase, Ban, TrendingUp, Building2, Check, Star, ArrowLeft, Crosshair, MessageSquare } from 'lucide-react'

const tierLabels = {
  '1': 'Tier 1 - IIT, NIT, BITS, etc.',
  '2': 'Tier 2 - Good State Colleges',
  '3': 'Tier 3 - Local / Private Colleges',
}
const tierShort = { '1': 'Tier 1', '2': 'Tier 2', '3': 'Tier 3' }
const tierColors = {
  '1': 'badge badge-emerald',
  '2': 'badge badge-amber',
  '3': 'badge badge-neon-purple',
}
const internshipLabels = {
  'none': 'No initial internship',
  'startup': 'Had a startup internship',
  'mass': 'Had a mass recruiter internship',
}
const internshipShort = {
  'none': 'Self-starter',
  'startup': 'Startup path',
  'mass': 'Corporate path',
}

function MentorDetail() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')

  const [reviews, setReviews] = useState([])
  const [myRequests, setMyRequests] = useState([])
  
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const [mentorRes, reviewsRes] = await Promise.all([
          api.get(`/mentors/${id}/`),
          api.get(`/mentors/${id}/reviews/`)
        ])
        setMentor(mentorRes.data)
        setReviews(reviewsRes.data)
      } catch (err) {
        setError('Mentor not found.')
      } finally {
        setLoading(false)
      }
    }
    
    const fetchMyRequests = async () => {
      if (currentUser && currentUser.role === 'mentee') {
        try {
          const res = await api.get('/sessions/')
          setMyRequests(res.data)
        } catch (err) {}
      }
    }
    
    fetchMentorData()
    fetchMyRequests()
  }, [id, currentUser])

  const handleSendRequest = async () => {
    setSending(true)
    setSendError('')
    try {
      await api.post('/sessions/request/', {
        mentor: mentor.user.id,
        message,
      })
      setSent(true)
    } catch (err) {
      setSendError(err.response?.data?.detail || 'Failed to send request. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const eligibleSession = myRequests.find(req => 
    req.mentor.id === mentor?.user?.id &&
    req.status === 'completed' &&
    !reviews.some(r => r.session_request === req.id)
  )

  const handleSubmitReview = async () => {
    setSubmittingReview(true)
    setReviewError('')
    try {
      await api.post('/sessions/reviews/', {
        session_request: eligibleSession.id,
        rating: reviewRating,
        comment: reviewComment,
      })
      const [mentorRes, reviewsRes] = await Promise.all([
        api.get(`/mentors/${id}/`),
        api.get(`/mentors/${id}/reviews/`)
      ])
      setMentor(mentorRes.data)
      setReviews(reviewsRes.data)
      setShowReviewModal(false)
      setReviewRating(0)
      setReviewComment('')
    } catch (err) {
      setReviewError(err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Failed to submit review.')
    } finally {
      setSubmittingReview(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-50" />
          <div className="space-y-3 flex-1">
            <div className="h-8 bg-slate-50 rounded-full w-1/3" />
            <div className="h-5 bg-slate-50 rounded-full w-1/4" />
          </div>
        </div>
        <div className="h-48 glass-surface rounded-2xl" />
        <div className="h-36 glass-surface rounded-2xl" />
      </div>
    )
  }

  // Error state
  if (error || !mentor) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-6">
          <Crosshair className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{error || 'Mentor not found'}</h2>
        <Link to="/mentors" className="btn-secondary px-6 py-2.5 rounded-xl text-sm font-medium">
          Back to all mentors
        </Link>
      </div>
    )
  }

  const user = mentor.user || {}
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Mentor'
  const initials = (user.first_name?.[0] || 'M') + (user.last_name?.[0] || '')

  // Build the journey narrative dynamically
  const journeyIcons = {
    college: GraduationCap,
    none: Ban,
    startup: Briefcase,
    mass: Briefcase,
    growth: TrendingUp,
    company: Building2,
  }

  const journeySteps = []
  if (mentor.previous_college_tier) {
    journeySteps.push({
      iconKey: 'college',
      title: 'Started at a ' + (tierShort[mentor.previous_college_tier] || '') + ' college',
      description: tierLabels[mentor.previous_college_tier] || '',
    })
  }
  if (mentor.internship_status) {
    journeySteps.push({
      iconKey: mentor.internship_status,
      title: internshipLabels[mentor.internship_status] || '',
      description: mentor.internship_status === 'none'
        ? 'Didn\'t have traditional internship opportunities early on — but kept pushing forward.'
        : mentor.internship_status === 'startup'
          ? 'Got early exposure at a startup, learning to wear multiple hats.'
          : 'Started with a mass recruiter role, building foundational skills.',
    })
  }
  journeySteps.push({
    iconKey: 'growth',
    title: `Grew into ${mentor.domain}`,
    description: `Focused on ${mentor.domain} and built deep expertise over ${mentor.experience_years}+ years.`,
  })
  journeySteps.push({
    iconKey: 'company',
    title: `Now at ${mentor.company}`,
    description: `Currently working at ${mentor.company}, ready to guide the next generation.`,
  })

  return (
    <div className="flex flex-col gap-10">
      
      {/* Back Link */}
      <Link to="/mentors" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" strokeWidth={1.8} />
        Back to all mentors
      </Link>

      {/* Cinematic Profile Header */}
      <div className="glass-elevated rounded-2xl p-8 md:p-10 relative overflow-hidden animate-fade-in">
        {/* Background atmospheric glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/[0.06] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/[0.05] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 font-bold text-4xl shadow-2xl shadow-slate-200/50 backdrop-blur-xl relative z-10">
              {initials}
            </div>
            {/* Soft ambient glow behind avatar */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight leading-[1.1]">{fullName}</h1>
            <p className="text-slate-500 text-lg mb-5">
              {mentor.domain} at <span className="text-slate-700 font-medium">{mentor.company}</span> {'\u00B7'} {mentor.experience_years}+ years
            </p>
            <div className="flex flex-wrap gap-1.5">
              {mentor.previous_college_tier && (
                <span className={tierColors[mentor.previous_college_tier]}>
                  {tierShort[mentor.previous_college_tier]}
                </span>
              )}
              {mentor.internship_status && (
                <span className="badge badge-neon-cyan">
                  {internshipShort[mentor.internship_status]}
                </span>
              )}
              <span className="badge border-slate-200 bg-slate-50 text-slate-600">
                {mentor.experience_years}+ yrs experience
              </span>
            </div>
          </div>
          
          <div className="md:self-center shrink-0 w-full md:w-auto mt-4 md:mt-0">
            {currentUser ? (
              <button onClick={() => setShowModal(true)} className="w-full md:w-auto btn-primary px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" strokeWidth={2} />
                Request a Session
              </button>
            ) : (
              <Link to="/login" className="block w-full md:w-auto btn-primary px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide text-center">
                Log in to Connect
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Journey Section */}
          <div className="glass-surface rounded-2xl p-7 md:p-8 animate-fade-in-d1">
            <h2 className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest flex items-center gap-2.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-600/70" strokeWidth={2} /> Their Journey
            </h2>
            <div className="space-y-0 pl-1">
              {journeySteps.map((step, index) => {
                const StepIcon = journeyIcons[step.iconKey] || TrendingUp
                return (
                  <div key={index} className="flex gap-5 group relative">
                    {/* Timeline Line */}
                    {index < journeySteps.length - 1 && (
                      <div className="absolute top-14 left-5 w-px h-[calc(100%-1rem)] border-l border-dashed border-slate-200 group-hover:border-cyan-500/30 transition-colors duration-500" />
                    )}
                    {/* Timeline Icon */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-lg shadow-slate-200/40 ring-4 ring-white group-hover:border-cyan-500/40 group-hover:bg-cyan-500/5 transition-all duration-300">
                        <StepIcon className="w-4 h-4 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" strokeWidth={1.8} />
                      </div>
                    </div>
                    {/* Content */}
                    <div className="pb-10 pt-1">
                      <h3 className="text-slate-900 font-bold mb-1.5 text-lg tracking-tight group-hover:text-cyan-700 transition-colors duration-300">{step.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Why This Mentor Matches You */}
          <div className="glass-surface rounded-2xl p-7 md:p-8 animate-fade-in-d2">
            <h2 className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest flex items-center gap-2.5">
              <Crosshair className="w-3.5 h-3.5 text-cyan-500/70" strokeWidth={2} /> Why they are right for you
            </h2>
            <ul className="space-y-5">
              {mentor.previous_college_tier === '3' && (
                <li className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/[0.03] border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-cyan-600" strokeWidth={2} />
                  </span>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    <span className="text-slate-800 font-medium">Came from a Tier 3 college</span> — they understand the challenges of limited campus placements and the hustle of self-learning.
                  </p>
                </li>
              )}
              {mentor.previous_college_tier === '2' && (
                <li className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/[0.03] border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-cyan-600" strokeWidth={2} />
                  </span>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    <span className="text-slate-800 font-medium">Came from a Tier 2 college</span> — they know what it's like to compete against Tier 1 peers and how to stand out.
                  </p>
                </li>
              )}
              {mentor.internship_status === 'none' && (
                <li className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/[0.03] border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-cyan-600" strokeWidth={2} />
                  </span>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    <span className="text-slate-800 font-medium">Had no initial internship</span> — they didn't have early opportunities, but still broke in. They can show you how.
                  </p>
                </li>
              )}
              {mentor.internship_status === 'startup' && (
                <li className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/[0.03] border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-cyan-600" strokeWidth={2} />
                  </span>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    <span className="text-slate-800 font-medium">Started with a startup internship</span> — they took an unconventional route and can guide you on making the most of it.
                  </p>
                </li>
              )}
              <li className="flex items-start gap-4">
                <span className="w-6 h-6 rounded-full bg-cyan-500/[0.03] border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-cyan-600" strokeWidth={2} />
                </span>
                <p className="text-slate-500 text-sm leading-relaxed">
                  <span className="text-slate-800 font-medium">Now at {mentor.company}</span> — proof that the starting point doesn't define the destination.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar / Reviews */}
        <div className="flex flex-col gap-8">
          <div className="glass-surface rounded-2xl p-7 animate-fade-in-d2">
            <div className="flex items-center justify-between mb-7 pb-5 border-b border-slate-200">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2.5">
                <Star className="w-3.5 h-3.5 text-amber-500/70" strokeWidth={2} /> Reviews
              </h2>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500" strokeWidth={2} fill="currentColor" />
                <span className="text-amber-500 text-lg font-bold">{mentor.average_rating > 0 ? mentor.average_rating.toFixed(1) : '-'}</span>
                <span className="text-slate-400 text-xs">({mentor.total_reviews})</span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="flex flex-col gap-5">
                {reviews.map(review => (
                  <div key={review.id} className="group">
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-500' : 'text-slate-200'}`} strokeWidth={0} fill="currentColor" />
                      ))}
                    </div>
                    {review.comment && <p className="text-slate-600 text-sm leading-relaxed mb-2">"{review.comment}"</p>}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-700 font-medium">{review.mentee_name}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-400 text-sm">No reviews yet.</p>
              </div>
            )}
            
            {eligibleSession && (
              <div className="mt-7 pt-5 border-t border-slate-200">
                <button onClick={() => setShowReviewModal(true)} className="w-full btn-secondary py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  <Star className="w-4 h-4 text-amber-500/80" strokeWidth={2} /> Leave a Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 px-4" onClick={(e) => e.target === e.currentTarget && !sending && setShowModal(false)}>
          <div className="glass-floating rounded-2xl p-8 md:p-10 w-full max-w-lg animate-fade-in relative overflow-hidden">
             {/* Decorative glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/[0.06] rounded-full blur-[100px] pointer-events-none" />
             
            {sent ? (
              <div className="text-center py-6 relative z-10">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-7 h-7 text-emerald-500" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Request Sent</h3>
                <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                  {user.first_name} will review your request. You can track it on your dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/requests" className="btn-primary px-7 py-3 rounded-xl text-sm font-bold">
                    View My Requests
                  </Link>
                  <button onClick={() => { setShowModal(false); setSent(false); setMessage(''); }} className="btn-secondary px-7 py-3 rounded-xl text-sm font-bold">
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                  Request a session
                </h3>
                <p className="text-slate-500 text-sm mb-7">
                  Tell {user.first_name} why you'd like to connect and what you hope to learn.
                </p>

                {sendError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-5 text-sm">
                    {sendError}
                  </div>
                )}

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I'm from a tier-3 college and I'd love to learn about your journey..."
                  rows={5}
                  className="glass-input w-full px-5 py-4 rounded-xl resize-none mb-7 text-sm"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleSendRequest} disabled={sending} className="flex-1 btn-primary py-3 rounded-xl text-sm font-bold tracking-wide">
                    {sending ? 'Sending...' : 'Send Request'}
                  </button>
                  <button onClick={() => { setShowModal(false); setSendError(''); }} className="btn-secondary px-7 py-3 rounded-xl text-sm font-bold">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 px-4" onClick={(e) => e.target === e.currentTarget && !submittingReview && setShowReviewModal(false)}>
          <div className="glass-floating rounded-2xl p-8 md:p-10 w-full max-w-lg animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.06] rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                Rate your session
              </h3>
              <p className="text-slate-500 text-sm mb-7">
                How was your mentorship session with {user.first_name}?
              </p>

              {reviewError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl mb-5 text-sm text-left">
                  {reviewError}
                </div>
              )}

              <div className="flex justify-center gap-2 mb-7">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`p-1 transition-all duration-300 ${reviewRating >= star ? 'scale-110' : 'hover:scale-105'}`}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors duration-300 ${reviewRating >= star ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]' : 'text-slate-200 hover:text-amber-500/30'}`}
                      strokeWidth={0}
                      fill="currentColor"
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience (optional)..."
                rows={4}
                className="glass-input w-full px-5 py-4 rounded-xl resize-none mb-7 text-sm text-left"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleSubmitReview} disabled={submittingReview || reviewRating === 0} className="flex-1 btn-primary py-3 rounded-xl text-sm font-bold tracking-wide disabled:opacity-50">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button onClick={() => { setShowReviewModal(false); setReviewError(''); }} className="btn-secondary px-7 py-3 rounded-xl text-sm font-bold">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MentorDetail
