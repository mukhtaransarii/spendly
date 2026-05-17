import { useState } from 'react'
import { useAppContext } from '../context/AppContext'

export function AuthPage() {
  const { login, register } = useAppContext()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f5f4f0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 w-full max-w-sm shadow-sm">
        <h1 className="text-2xl font-extrabold mb-1">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-zinc-400 text-sm mb-6">
          {isLogin ? 'Login to your expense tracker' : 'Sign up to get started'}
        </p>

        <div className="space-y-3">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold uppercase text-zinc-400">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full mt-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-green-700"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase text-zinc-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full mt-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-zinc-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-4 rounded-xl"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </div>

        <p className="text-center text-sm text-zinc-400 mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError('') }}
            className="text-green-700 font-bold"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
