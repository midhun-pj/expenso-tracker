import { useState, useEffect, type FC, type FormEvent } from 'react';
import { useStore } from '../store/useStore';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import strings from './nls/auth_strings.json';

export const Auth: FC = () => {
  const { login, register } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError(strings.validationError);
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);

        setIsLogin(true);
        setError(null);
        setEmail('');
        setPassword('');
      }
    } catch(err) {
      if (isLogin) {
        setError(strings.loginError);
      } else {
        setError(strings.registerError);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    setError(null);
  }, [isLogin]);


  useEffect(() => {
    const originalTheme = document.body.getAttribute('data-theme');
    document.body.setAttribute('data-theme', 'ocean');

    return () => {

      if (originalTheme) {
        document.body.setAttribute('data-theme', originalTheme);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white mb-6 shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{strings.appName}</h1>
          <p className="text-slate-500 mt-3 text-sm">
            {isLogin ? strings.loginSubtitle : strings.registerSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">{strings.usernameLabel}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
              placeholder={strings.usernamePlaceholder}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">{strings.passwordLabel}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 pr-12"
                placeholder={strings.passwordPlaceholder}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:translate-y-[-1px] active:translate-y-[1px] flex items-center justify-center gap-2 group mt-2"
          >
            {loading ? strings.submitLoading : (isLogin ? strings.signInButton : strings.createAccountButton)}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {loading && (
          <div className="mt-4 text-sm text-center text-slate-500">{strings.pleaseWait}</div>
        )}
        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <p className="text-slate-500 text-sm">
            {isLogin ? strings.newHerePrompt : strings.existingAccountPrompt}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              {isLogin ? strings.createAccountLink : strings.signInLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};