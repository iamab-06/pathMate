import { Link } from 'react-router-dom'
import { Target, Handshake, Rocket, GraduationCap, Briefcase, Building2, ArrowRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

function Home() {
  // Section 2 — "Built for real journeys"
  const whyHeading = useScrollReveal()
  const whyCard1 = useScrollReveal()
  const whyCard2 = useScrollReveal()
  const whyCard3 = useScrollReveal()

  // Section 3 — "Three simple steps"
  const stepsHeading = useScrollReveal()
  const step1 = useScrollReveal()
  const step2 = useScrollReveal()
  const step3 = useScrollReveal()

  // Section 4 — "They made it"
  const journeyHeading = useScrollReveal()
  const journeyCard1 = useScrollReveal()
  const journeyCard2 = useScrollReveal()

  // Section 5 — Final CTA
  const ctaHeading = useScrollReveal()
  const ctaButton = useScrollReveal()

  return (
    <div className="page-bg min-h-screen relative overflow-hidden text-white">
      <div className="glow-blob" />
      <div className="noise-overlay" />
      
      {/* Container for all sections */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* 1. Hero Section — animates on page load (above fold) */}
        <section className="py-24 md:py-36 flex flex-col items-center text-center animate-fade-in">
          {/* Soft radial spotlight glow behind logo */}
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-indigo-500/[0.12] rounded-full blur-[120px] pointer-events-none" />
          
          <h1 className="relative text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 drop-shadow-xl leading-[0.9]">
            Path<span className="gradient-text">Mate</span>
          </h1>
          <p className="relative text-zinc-400 text-xl md:text-2xl lg:text-3xl font-light tracking-wide max-w-3xl leading-relaxed mb-14">
            Find mentors who once stood <span className="text-white font-medium">where you stand.</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-lg">
            <Link
              to="/register"
              className="flex-1 btn-primary font-medium px-8 py-4 rounded-2xl text-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </Link>
            <Link
              to="/login"
              className="flex-1 glass font-medium px-8 py-4 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 text-lg flex items-center justify-center"
            >
              Login
            </Link>
          </div>
        </section>

        {/* 2. Why PathMate Section */}
        <section className="py-24 flex flex-col items-center text-center space-y-14">
          <div
            ref={whyHeading.ref}
            className={`space-y-5 max-w-3xl sr-hidden ${whyHeading.isVisible ? 'sr-visible' : ''}`}
          >
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Why PathMate</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">Built for real journeys</h2>
            <p className="text-zinc-500 text-lg md:text-xl leading-relaxed">
              Traditional networking is broken. Connect with professionals who actually share your journey — not just their job titles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div
              ref={whyCard1.ref}
              className={`glass-elevated rounded-2xl p-8 card-hover flex flex-col items-center space-y-4 group sr-hidden ${whyCard1.isVisible ? 'sr-visible' : ''}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                <Target className="w-5 h-5 text-indigo-400" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-bold tracking-tight">Relatable Guidance</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Mentors who started exactly where you are right now.</p>
            </div>
            <div
              ref={whyCard2.ref}
              className={`glass-elevated rounded-2xl p-8 card-hover flex flex-col items-center space-y-4 group sr-hidden ${whyCard2.isVisible ? 'sr-visible' : ''}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                <Handshake className="w-5 h-5 text-purple-400" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-bold tracking-tight">Genuine Connections</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Build relationships based on shared experiences, not just credentials.</p>
            </div>
            <div
              ref={whyCard3.ref}
              className={`glass-elevated rounded-2xl p-8 card-hover flex flex-col items-center space-y-4 group sr-hidden ${whyCard3.isVisible ? 'sr-visible' : ''}`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/15 flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                <Rocket className="w-5 h-5 text-rose-400" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-bold tracking-tight">Proven Pathways</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Follow the exact steps of those who successfully made the leap.</p>
            </div>
          </div>
        </section>

        {/* 3. How it works Section */}
        <section className="py-24 flex flex-col items-center text-center space-y-16">
          <div
            ref={stepsHeading.ref}
            className={`space-y-5 max-w-3xl sr-hidden ${stepsHeading.isVisible ? 'sr-visible' : ''}`}
          >
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">How it works</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">Three simple steps</h2>
            <p className="text-zinc-500 text-lg md:text-xl leading-relaxed">
              From your background to your breakthrough.
            </p>
          </div>

          <div className="relative flex flex-col space-y-16 w-full max-w-5xl py-10">
            {/* Glowing vertical connector line */}
            <div className="absolute left-12 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/0 via-purple-500/30 to-emerald-500/0 hidden md:block" />

            {/* Step 1 — slides from left on desktop, fades up on mobile */}
            <div
              ref={step1.ref}
              className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 group sr-hidden-left ${step1.isVisible ? 'sr-visible' : ''}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="md:w-1/2 flex justify-end text-left md:text-right pr-0 md:pr-8 w-full pl-24 md:pl-0">
                <div className="space-y-3 max-w-md">
                  <h3 className="text-2xl font-bold text-zinc-200 group-hover:text-white transition-colors tracking-tight">Share your story</h3>
                  <p className="text-zinc-500 text-base leading-relaxed">Tell us about your background, your current challenges, and where you want to go.</p>
                </div>
              </div>
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-xl bg-[#0a0a1a] flex items-center justify-center border border-indigo-500/20 text-xl font-bold text-indigo-400 z-10 group-hover:border-indigo-500/40 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-500">1</div>
              <div className="md:w-1/2 pl-24 md:pl-8 flex justify-start w-full">
                 <div className="glass-surface rounded-2xl p-5 w-full max-w-sm border border-indigo-500/[0.06] group-hover:border-indigo-500/15 transition-colors">
                    <div className="h-2 w-1/3 bg-indigo-500/15 rounded-full mb-3 group-hover:w-1/2 transition-all duration-500" />
                    <div className="h-2 w-2/3 bg-white/[0.03] rounded-full mb-2" />
                    <div className="h-2 w-1/2 bg-white/[0.03] rounded-full" />
                 </div>
              </div>
            </div>

            {/* Step 2 — slides from right on desktop, fades up on mobile */}
            <div
              ref={step2.ref}
              className={`relative flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 group sr-hidden-right ${step2.isVisible ? 'sr-visible' : ''}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="md:w-1/2 flex justify-start text-left pl-24 md:pl-8 w-full">
                <div className="space-y-3 max-w-md">
                  <h3 className="text-2xl font-bold text-zinc-200 group-hover:text-white transition-colors tracking-tight">Find your match</h3>
                  <p className="text-zinc-500 text-base leading-relaxed">Browse mentors who share your exact background. Filter by college tier, past roles, or obstacles they've overcome.</p>
                </div>
              </div>
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-xl bg-[#0a0a1a] flex items-center justify-center border border-purple-500/20 text-xl font-bold text-purple-400 z-10 group-hover:border-purple-500/40 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-500">2</div>
              <div className="md:w-1/2 pr-0 md:pr-8 pl-24 md:pl-0 flex justify-start md:justify-end w-full">
                <div className="glass-surface rounded-2xl p-5 w-full max-w-sm border border-purple-500/[0.06] group-hover:border-purple-500/15 transition-colors flex flex-col md:items-end">
                    <div className="h-2 w-1/3 bg-purple-500/15 rounded-full mb-3 group-hover:w-1/2 transition-all duration-500" />
                    <div className="h-2 w-2/3 bg-white/[0.03] rounded-full mb-2" />
                    <div className="h-2 w-1/2 bg-white/[0.03] rounded-full" />
                </div>
              </div>
            </div>

            {/* Step 3 — slides from left on desktop, fades up on mobile */}
            <div
              ref={step3.ref}
              className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 group sr-hidden-left ${step3.isVisible ? 'sr-visible' : ''}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="md:w-1/2 flex justify-end text-left md:text-right pr-0 md:pr-8 w-full pl-24 md:pl-0">
                <div className="space-y-3 max-w-md">
                  <h3 className="text-2xl font-bold text-zinc-200 group-hover:text-white transition-colors tracking-tight">Bridge the gap</h3>
                  <p className="text-zinc-500 text-base leading-relaxed">Connect, schedule a session, and get the personalized guidance you need.</p>
                </div>
              </div>
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-xl bg-[#0a0a1a] flex items-center justify-center border border-emerald-500/20 text-xl font-bold text-emerald-400 z-10 group-hover:border-emerald-500/40 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-500">3</div>
              <div className="md:w-1/2 pl-24 md:pl-8 flex justify-start w-full">
                <div className="glass-surface rounded-2xl p-5 w-full max-w-sm border border-emerald-500/[0.06] group-hover:border-emerald-500/15 transition-colors">
                    <div className="h-2 w-1/3 bg-emerald-500/15 rounded-full mb-3 group-hover:w-1/2 transition-all duration-500" />
                    <div className="h-2 w-2/3 bg-white/[0.03] rounded-full mb-2" />
                    <div className="h-2 w-1/2 bg-white/[0.03] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Example journeys Section */}
        <section className="py-28 flex flex-col items-center text-center space-y-14 relative overflow-hidden rounded-2xl my-12 border border-white/[0.04]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-transparent to-[#0a0a1a] pointer-events-none opacity-80" />
          
          <div
            ref={journeyHeading.ref}
            className={`space-y-5 max-w-3xl relative z-10 px-6 sr-hidden ${journeyHeading.isVisible ? 'sr-visible' : ''}`}
          >
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Real Journeys</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">They made it</h2>
            <p className="text-zinc-500 text-lg md:text-xl leading-relaxed">
              And they're here to help you do the same.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10 px-6">
            <div
              ref={journeyCard1.ref}
              className={`glass-elevated rounded-2xl p-8 flex flex-col items-center space-y-8 border-white/[0.04] hover:border-indigo-500/20 card-hover relative group sr-hidden ${journeyCard1.isVisible ? 'sr-visible' : ''}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/[0.03] transition-colors duration-500 pointer-events-none rounded-2xl" />
              <div className="flex items-center w-full justify-between relative z-10">
                <div className="flex flex-col items-center w-1/3 text-center">
                  <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:border-indigo-500/20 transition-all">
                    <GraduationCap className="w-6 h-6 text-zinc-500 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
                  </div>
                  <span className="text-zinc-400 font-medium text-sm">Tier 3 College</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center px-4 relative">
                  <div className="w-full h-px bg-indigo-500/15 overflow-hidden absolute top-1/2 -translate-y-1/2">
                    <div className="h-full bg-indigo-400/60 w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-indigo-400 absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 group-hover:translate-x-6 transition-all duration-1000 delay-300" strokeWidth={1.5} />
                </div>

                <div className="flex flex-col items-center w-1/3 text-center">
                   <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-500">
                     <Briefcase className="w-6 h-6 text-indigo-400" strokeWidth={1.5} />
                   </div>
                  <span className="text-indigo-300 font-semibold text-sm">SWE at Google</span>
                </div>
              </div>
              <p className="text-zinc-500 text-sm relative z-10 italic leading-relaxed">"I didn't have referrals. I had to build my way up. Let me show you how."</p>
            </div>

            <div
              ref={journeyCard2.ref}
              className={`glass-elevated rounded-2xl p-8 flex flex-col items-center space-y-8 border-white/[0.04] hover:border-purple-500/20 card-hover relative group sr-hidden ${journeyCard2.isVisible ? 'sr-visible' : ''}`}
              style={{ transitionDelay: '200ms' }}
            >
               <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/[0.03] transition-colors duration-500 pointer-events-none rounded-2xl" />
              <div className="flex items-center w-full justify-between relative z-10">
                <div className="flex flex-col items-center w-1/3 text-center">
                  <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:border-purple-500/20 transition-all">
                    <Building2 className="w-6 h-6 text-zinc-500 group-hover:text-purple-400 transition-colors" strokeWidth={1.5} />
                  </div>
                  <span className="text-zinc-400 font-medium text-sm">Service Based</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center px-4 relative">
                  <div className="w-full h-px bg-purple-500/15 overflow-hidden absolute top-1/2 -translate-y-1/2">
                    <div className="h-full bg-purple-400/60 w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-400 absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 group-hover:translate-x-6 transition-all duration-1000 delay-300" strokeWidth={1.5} />
                </div>

                <div className="flex flex-col items-center w-1/3 text-center">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-500">
                    <Rocket className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
                  </div>
                  <span className="text-purple-300 font-semibold text-sm">Product Manager</span>
                </div>
              </div>
              <p className="text-zinc-500 text-sm relative z-10 italic leading-relaxed">"Breaking out of the service-based bubble is hard, but completely possible."</p>
            </div>
          </div>
        </section>

        {/* 5. Final CTA Section */}
        <section className="py-24 md:py-32 flex flex-col items-center text-center space-y-10 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/[0.06] rounded-full blur-[120px] pointer-events-none" />
           
          <div
            ref={ctaHeading.ref}
            className={`space-y-5 max-w-2xl relative z-10 sr-hidden ${ctaHeading.isVisible ? 'sr-visible' : ''}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">Ready to find your guide?</h2>
            <p className="text-zinc-500 text-lg md:text-xl leading-relaxed">
              Join PathMate today and start your journey with someone who truly understands it.
            </p>
          </div>
          
          <div
            ref={ctaButton.ref}
            className={`relative z-10 sr-hidden ${ctaButton.isVisible ? 'sr-visible' : ''}`}
            style={{ transitionDelay: '150ms' }}
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 btn-primary font-medium px-10 py-5 rounded-2xl text-xl transition-all duration-300"
            >
              Get Started Now <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}

export default Home
