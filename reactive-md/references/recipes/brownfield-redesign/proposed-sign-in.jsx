import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

/**
 * ProposedSignIn — redesigned sign-in screen using progressive disclosure.
 *
 * Step 1: collect email, validate format client-side, advance.
 * Step 2: collect password with visibility toggle and co-located "Forgot?" link.
 *
 * The confirmed email is shown as context in step 2 so users know where they are.
 */

export function ProposedSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');

  function handleEmailContinue(e) {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setStep('password');
  }

  function handleSignIn(e) {
    e.preventDefault();
    if (!password) {
      setError('Enter your password.');
      return;
    }
    setError('');
    // In production: submit credentials to auth endpoint
  }

  function resetToEmail() {
    setStep('email');
    setPassword('');
    setError('');
  }

  return (
    <div className="min-h-[520px] bg-white flex flex-col justify-center px-6 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Sign in</h1>

      {step === 'password' && (
        <p className="text-sm text-gray-500 mb-6">
          {email} ·{' '}
          <button type="button" onClick={resetToEmail} className="text-blue-600 hover:underline">
            Change
          </button>
        </p>
      )}
      {step === 'email' && <div className="mb-6" />}

      {step === 'email' ? (
        <form onSubmit={handleEmailContinue} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Continue <ArrowRight size={15} />
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <button type="button" className="text-sm text-blue-600 hover:underline">
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Sign in
          </button>
        </form>
      )}

      <p className="mt-10 text-center text-sm text-gray-500">
        No account?{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Create one
        </a>
      </p>
    </div>
  );
}
