import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          email: data.email,
          name: data.name,
          role: data.role,
        }));

        // Redirect based on role
        if (data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/candidate');
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark transition-colors duration-300">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl p-8 md:p-10 border border-slate-200 dark:border-zinc-700">
            {/* Header */}
            <div className="text-center mb-8">
              <svg
                className="h-12 w-12 mx-auto text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-4">
                Welcome Back
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Please enter your credentials to login.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  htmlFor="username"
                >
                  Username / Email
                </label>
                <div className="relative">
                  <span className="material-icons-outlined text-slate-400 dark:text-slate-500 input-icon">
                    person_outline
                  </span>
                  <input
                    className="input-field block w-full rounded-md border-slate-300 dark:border-zinc-600 bg-slate-50 dark:bg-zinc-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-primary focus:border-primary transition duration-150"
                    id="username"
                    name="username"
                    placeholder="e.g. admin@quizforge.com"
                    required
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="material-icons-outlined text-slate-400 dark:text-slate-500 input-icon">
                    lock_outline
                  </span>
                  <input
                    className="input-field block w-full rounded-md border-slate-300 dark:border-zinc-600 bg-slate-50 dark:bg-zinc-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-primary focus:border-primary transition duration-150"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="text-right mt-2">
                  <a
                    className="text-sm font-medium text-primary hover:underline"
                    href="#"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  className="w-full flex justify-center items-center py-3 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-zinc-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <a className="font-medium text-primary hover:underline" href="#">
                  Contact Admin
                </a>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Demo Credentials:
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <strong>Admin:</strong> admin@quizforge.com
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <strong>Candidate:</strong> candidate@example.com
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                (Any password works in demo mode)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
