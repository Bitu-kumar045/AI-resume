import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, AlertCircle, ArrowRight, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || (formData.role ? `/${formData.role}` : '/student');

  const validate = () => {
    const newErrors = {};

    if (isRegister && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isRegister) {
        await register(formData);
        navigate(`/${formData.role}`);
      } else {
        const result = await login(formData.email, formData.password);
        const targetRole = result.user?.role || 'student';
        navigate(`/${targetRole}`);
      }
    } catch (err) {
      setApiError(
        err.response?.data?.detail ||
          'Authentication failed. Please verify your credentials and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick 1-click demo logins for instant evaluation
  const handleQuickLogin = async (demoRole) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const email = `${demoRole}@resumefit.com`;
      const result = await login(email, 'password123');
      navigate(`/${demoRole}`);
    } catch (err) {
      setApiError('Demo login failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-navy-950">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Card Header */}
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-600 items-center justify-center shadow-lg shadow-blue-600/30 mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isRegister ? 'Create your ResumeFit account' : 'Welcome back to ResumeFit'}
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            {isRegister
              ? 'Join thousands analyzing resumes and matching job requirements.'
              : 'Sign in to access your dashboard, skill gaps, and matches.'}
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-[#0f1d3b] border border-[#1e3463] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          {/* Tab Switcher */}
          <div className="flex bg-[#0c1730] p-1 rounded-xl mb-6 border border-[#182b54]">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrors({});
                setApiError(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                !isRegister
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrors({});
                setApiError(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                isRegister
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* API Error Notification */}
          {apiError && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Alex Mercer"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0c1730] border border-[#1e3463] text-white rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0c1730] border border-[#1e3463] text-white rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0c1730] border border-[#1e3463] text-white rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['student', 'recruiter', 'admin'].map((roleOption) => (
                    <button
                      type="button"
                      key={roleOption}
                      onClick={() =>
                        setFormData({ ...formData, role: roleOption })
                      }
                      className={`py-2 text-xs font-medium rounded-xl border capitalize transition-all ${
                        formData.role === roleOption
                          ? 'border-blue-500 bg-[#162955] text-white'
                          : 'border-[#1b2f59] bg-[#0c1730] text-slate-400 hover:text-white'
                      }`}
                    >
                      {roleOption}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for Instant Testing */}
          <div className="mt-6 pt-5 border-t border-[#182b54]">
            <p className="text-xs text-center text-slate-400 mb-3 font-medium">
              ⚡ Instant 1-Click Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="py-1.5 px-2 bg-[#122247] hover:bg-[#182d5e] border border-[#233a6f] text-emerald-400 rounded-lg text-xs font-medium transition-colors"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('recruiter')}
                className="py-1.5 px-2 bg-[#122247] hover:bg-[#182d5e] border border-[#233a6f] text-blue-400 rounded-lg text-xs font-medium transition-colors"
              >
                Recruiter
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-1.5 px-2 bg-[#122247] hover:bg-[#182d5e] border border-[#233a6f] text-purple-400 rounded-lg text-xs font-medium transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
