import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Menu, X, LogOut, User, Shield, Briefcase, GraduationCap } from 'lucide-react';

export const Navbar = () => {
  const { user, role, logout, switchRole, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleClick = (targetRole, path) => {
    switchRole(targetRole);
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isStudentActive = location.pathname === '/' || location.pathname.startsWith('/student');
  const isRecruiterActive = location.pathname.startsWith('/recruiter');
  const isAdminActive = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#142347] bg-[#070e1e]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span>ResumeFit</span>
        </Link>

        {/* Desktop Navigation Links matching Screenshot 1 */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Student Tab */}
          <button
            type="button"
            onClick={() => handleRoleClick('student', '/student')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isStudentActive
                ? 'bg-[#15254d] text-white shadow-sm border border-[#233a6f]'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d3e]'
            }`}
          >
            Student
          </button>

          {/* Recruiter Tab */}
          <button
            type="button"
            onClick={() => handleRoleClick('recruiter', '/recruiter')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isRecruiterActive
                ? 'bg-[#15254d] text-white shadow-sm border border-[#233a6f]'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d3e]'
            }`}
          >
            Recruiter
          </button>

          {/* Admin Tab */}
          <button
            type="button"
            onClick={() => handleRoleClick('admin', '/admin')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isAdminActive
                ? 'bg-[#15254d] text-white shadow-sm border border-[#233a6f]'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d3e]'
            }`}
          >
            Admin
          </button>

          <div className="h-5 w-px bg-[#1c2f5a] mx-2" />

          {/* Auth State Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#162752] text-blue-300 border border-[#263e77] capitalize">
                {role}
              </span>
              <button
                type="button"
                onClick={logout}
                title="Log out"
                className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#122246] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-slate-200 hover:text-white px-4 py-1.5 rounded-lg hover:bg-[#101f42] transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#162752] text-blue-300 border border-[#263e77] capitalize">
              {role}
            </span>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#122246]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#142347] bg-[#091328] px-4 pt-3 pb-4 space-y-2">
          <button
            type="button"
            onClick={() => handleRoleClick('student', '/student')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
              isStudentActive ? 'bg-[#15254d] text-white' : 'text-slate-300 hover:bg-[#0f1d3e]'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Student Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleClick('recruiter', '/recruiter')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
              isRecruiterActive ? 'bg-[#15254d] text-white' : 'text-slate-300 hover:bg-[#0f1d3e]'
            }`}
          >
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>Recruiter Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleClick('admin', '/admin')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
              isAdminActive ? 'bg-[#15254d] text-white' : 'text-slate-300 hover:bg-[#0f1d3e]'
            }`}
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Admin Center</span>
          </button>

          <div className="pt-2 border-t border-[#1a2c56]">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out ({user?.name || user?.email})</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium"
              >
                Sign in / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
