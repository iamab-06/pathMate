import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function NotFound() {
  return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <div className="glow-blob" />
      <div className="noise-overlay" />
      <div className="page-content text-center animate-fade-in">
        <h1 className="text-8xl font-bold gradient-text mb-4 tracking-tighter">404</h1>
        <p className="text-zinc-500 text-lg mb-8">
          This page doesn't exist.
        </p>
        <Link
          to="/"
          className="btn-secondary px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.8} /> Go back home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
