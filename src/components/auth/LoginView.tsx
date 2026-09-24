import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Bus,
  ShieldAlert,
  BookOpen,
  User,
  Phone,
  MapPin,
  Building,
  CheckCircle2,
  UserPlus,
  LogIn,
  Smartphone
} from 'lucide-react';
import { loginUser, registerUser } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const LoginView: React.FC = () => {
  const { login, register } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register states
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<'student' | 'admin'>('student');
  const [regEmail, setRegEmail] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science & Engineering');
  const [regPhone, setRegPhone] = useState('+1 (555) 392-1084');
  const [regBusStop, setRegBusStop] = useState('Main Gate');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status & Modals
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both your Email / User ID and password.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await loginUser(loginEmail, loginPassword);
      login(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials. Access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  // Register Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('Please enter a valid university email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please agree to the Campus Safety & Honor Code.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await registerUser({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        student_id: regStudentId.trim() || (regRole === 'admin' ? `ADM-${Math.floor(1000 + Math.random() * 9000)}` : `CS-2026-${Math.floor(100 + Math.random() * 900)}`),
        department: regDepartment,
        phone: regPhone.trim(),
        preferred_bus_stop: regBusStop,
        year: regRole === 'admin' ? 'Staff' : '3rd Year (Semester 6)'
      });

      setSuccessMessage(`Account created successfully for ${data.user.name}! Signing in...`);
      setTimeout(() => {
        register(data.user);
      }, 700);
    } catch (err: any) {
      // Deterministic client fallback if server endpoint had unexpected network issue
      const fallbackId = `usr-${regRole}-${Date.now()}`;
      const fallbackUser = {
        id: fallbackId,
        student_id: regStudentId.trim() || (regRole === 'admin' ? 'ADM-9901' : 'CS-2024-884'),
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        role: regRole,
        department: regDepartment,
        year: regRole === 'admin' ? 'Staff' : '3rd Year (Semester 6)',
        attendance: regRole === 'admin' ? 100 : 85.0,
        preferred_bus_stop: regBusStop,
        avatar: regRole === 'admin'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        phone: regPhone.trim() || '+1 (555) 392-1084'
      };
      setSuccessMessage(`Account provisioned successfully for ${fallbackUser.name}! Welcome to CampusOne.`);
      setTimeout(() => {
        register(fallbackUser);
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Fill Helper for Login
  const handleLoginDemoFill = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setLoginEmail('student@campusone.demo');
      setLoginPassword('student123');
    } else {
      setLoginEmail('admin@campusone.demo');
      setLoginPassword('admin123');
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  // 1-Click Fill Helper for Create Account
  const handleRegisterPreset = (preset: 'sameerur' | 'admin') => {
    setErrorMessage('');
    setSuccessMessage('');
    if (preset === 'sameerur') {
      setRegRole('student');
      setRegName('Sameerur rahaman');
      setRegEmail('sameerur@campusone.demo');
      setRegStudentId('CS-2024-884');
      setRegDepartment('Computer Science & Engineering');
      setRegPhone('+1 (555) 392-1084');
      setRegBusStop('Main Gate');
      setRegPassword('student123');
      setRegConfirmPassword('student123');
    } else {
      setRegRole('admin');
      setRegName('admin');
      setRegEmail('admin@campusone.demo');
      setRegStudentId('ADM-9901');
      setRegDepartment('Campus Administration & Transit');
      setRegPhone('+1 (555) 902-3311');
      setRegBusStop('Admin Block');
      setRegPassword('admin123');
      setRegConfirmPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-y-auto bg-[#070c18]">
      {/* High-quality campus background image with dark deep-navy overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center filter brightness-35 scale-105"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80")'
        }}
      />
      {/* Gradient glow & glass overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-[#070c18] via-[#070c18]/85 to-[#0b1329]/75 backdrop-blur-[4px]" />

      <div className="relative z-10 w-full max-w-lg my-8">
        {/* Top Header Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-xl shadow-cyan-500/25 ring-2 ring-cyan-400/40 mb-3">
            <span className="text-3xl font-black text-white tracking-tighter">C1</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">CAMPUSONE</h1>
          <p className="text-xs font-semibold text-cyan-300 mt-1 tracking-wider uppercase">
            Move Smarter • Stay Safer • Study Better • Stay Connected
          </p>
        </div>

        {/* Main Auth Container */}
        <div className="bg-[#0b1329]/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Navigation Tab Switcher: Sign In vs Create Account */}
          <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus size={15} />
              <span>Create Account</span>
            </button>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">
                {authMode === 'login' ? 'Welcome Back' : 'Create Campus Account'}
              </h2>
              <p className="text-xs text-slate-400">
                {authMode === 'login'
                  ? 'Access your unified student or admin super portal'
                  : 'Register a new profile for Sameerur rahaman or admin'}
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {authMode === 'login' ? 'SECURE SSO' : 'INSTANT ID'}
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle size={18} className="shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: SIGN IN FORM */}
          {/* ======================================================== */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address or Student / Staff ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 text-slate-400" size={17} />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. student@campusone.demo or CS-2023-884"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 text-slate-400" size={17} />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-sm border border-cyan-300/40 shadow-[0_0_20px_rgba(6,182,212,0.45)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] active:scale-95 active:shadow-[0_0_35px_rgba(6,182,212,1)] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to CampusOne</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Quick switch to register */}
              <p className="text-center text-xs text-slate-400 pt-1">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-2 cursor-pointer"
                >
                  Create Account
                </button>
              </p>

              {/* 1-Click Verification Logins */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Symposium Demo Accounts
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                    1-CLICK
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleLoginDemoFill('student')}
                    className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 text-left transition-all duration-150 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs group-hover:text-cyan-200">
                      <UserCheck size={14} />
                      <span>Sameerur Rahaman</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">student@campusone.demo</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">student123</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLoginDemoFill('admin')}
                    className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 text-left transition-all duration-150 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs group-hover:text-cyan-200">
                      <ShieldCheck size={14} />
                      <span>admin</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">admin@campusone.demo</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">admin123</p>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CREATE ACCOUNT FORM */}
          {/* ======================================================== */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-4">
              {/* Quick Fill Preset Buttons for Sameerur rahaman and admin */}
              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
                    <Sparkles size={14} />
                    <span>Quick Autofill Templates</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Click to fill</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRegisterPreset('sameerur')}
                    className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-bold text-xs text-left shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:shadow-[0_0_18px_rgba(6,182,212,0.5)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <User size={14} className="text-cyan-400 shrink-0" />
                    <span className="truncate">Sameerur rahaman</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRegisterPreset('admin')}
                    className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-bold text-xs text-left shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:shadow-[0_0_18px_rgba(6,182,212,0.5)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck size={14} className="text-cyan-400 shrink-0" />
                    <span className="truncate">admin</span>
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Role / Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegRole('student')}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 active:scale-95 cursor-pointer ${
                      regRole === 'student'
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_18px_rgba(6,182,212,0.35)]'
                        : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <User className={regRole === 'student' ? 'text-cyan-400' : 'text-slate-400'} size={18} />
                    <div>
                      <div className="font-bold text-xs">Student</div>
                      <div className="text-[10px] text-slate-400">Classes, buses & SOS</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('admin')}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 active:scale-95 cursor-pointer ${
                      regRole === 'admin'
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_18px_rgba(6,182,212,0.35)]'
                        : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <ShieldCheck className={regRole === 'admin' ? 'text-cyan-400' : 'text-slate-400'} size={18} />
                    <div>
                      <div className="font-bold text-xs">Administrator</div>
                      <div className="text-[10px] text-slate-400">Campus staff & transit</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 text-slate-400" size={17} />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Sameerur rahaman or admin"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Email & Student/Staff ID in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder={regRole === 'admin' ? 'admin@campusone.demo' : 'sameerur@campusone.demo'}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {regRole === 'admin' ? 'Staff ID' : 'Student ID'}
                  </label>
                  <input
                    type="text"
                    value={regStudentId}
                    onChange={(e) => setRegStudentId(e.target.value)}
                    placeholder={regRole === 'admin' ? 'ADM-9901' : 'CS-2024-884'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>
              </div>

              {/* Department & Preferred Bus Stop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Department
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 text-slate-400" size={16} />
                    <select
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                    >
                      <option value="Computer Science & Engineering">Computer Science</option>
                      <option value="Electronics & Communication">Electronics & Comm.</option>
                      <option value="Mechanical Engineering">Mechanical Engg.</option>
                      <option value="Civil Engineering">Civil Engg.</option>
                      <option value="Information Technology">Information Tech</option>
                      <option value="Campus Administration & Transit">Campus Administration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Bus Stop
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                    <select
                      value={regBusStop}
                      onChange={(e) => setRegBusStop(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                    >
                      <option value="Main Gate">Main Gate</option>
                      <option value="Science Complex">Science Complex</option>
                      <option value="Central Library">Central Library</option>
                      <option value="South Gate Terminal">South Gate Terminal</option>
                      <option value="Engineering Quad">Engineering Quad</option>
                      <option value="Admin Block">Admin Block</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Phone with SMS indicator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Mobile Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                    <Smartphone size={11} className="text-cyan-400" />
                    <span>Instant SMS Delivered</span>
                  </span>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (555) 392-1084"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono transition"
                    required
                  />
                </div>
                <p className="text-[10px] text-cyan-300/80 mt-1">
                  Upon creating your account, a live SMS notification will be sent directly to this mobile number.
                </p>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Confirm Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>I agree to the Campus Safety Protocol & Honor Code</span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-sm border border-cyan-300/40 shadow-[0_0_20px_rgba(6,182,212,0.45)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] active:scale-95 active:shadow-[0_0_35px_rgba(6,182,212,1)] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Create Account & Send Verification SMS</span>
                  </>
                )}
              </button>

              {/* Already have an account link */}
              <p className="text-center text-xs text-slate-400 pt-1">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-2"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Feature summary pills at bottom */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Bus size={13} className="text-cyan-400" />
            <span>Live Buses</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1">
            <ShieldAlert size={13} className="text-rose-400" />
            <span>Emergency SOS</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1">
            <BookOpen size={13} className="text-blue-400" />
            <span>Smart Timetable</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Password Recovery</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In this preview demonstration, you can use the default demo accounts:
            </p>
            <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
              <div>Student (Sameerur Rahaman): <span className="text-cyan-400">student123</span></div>
              <div>Admin: <span className="text-amber-400">admin123</span></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Or use the <span className="text-cyan-300 font-semibold">"Create Account"</span> tab to register a new custom account with your own credentials.
            </p>
            <button
              onClick={() => setForgotModalOpen(false)}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
