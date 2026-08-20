import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  User, 
  Mail, 
  KeyRound,
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    sendOtp, 
    verifyOtpAndLogin, 
    completeRegistration 
  } = useAuth();

  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PROFILE'>('PHONE');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // New user registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('Working Professional');
  const [workplace, setWorkplace] = useState('DLF Cyber City, Gurugram');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = await sendOtp(phoneInput);
    setIsLoading(false);

    if (result.success) {
      setDemoCode(result.demoOtp);
      setStep('OTP');
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = await verifyOtpAndLogin(phoneInput, otpInput);
    setIsLoading(false);

    if (result.success) {
      if (result.isNewUser) {
        setStep('PROFILE');
      } else {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        setIsAuthModalOpen(false);
      }
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMessage('Please fill in your name and email.');
      return;
    }

    setIsLoading(true);
    await completeRegistration(phoneInput, fullName, email, profession, workplace);
    setIsLoading(false);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in text-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">ekThikana Verified Sign In</h3>
              <p className="text-[11px] text-slate-400">Delhi/NCR Direct Rental & Roommate Portal</p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* STEP 1: Phone Number Input */}
          {step === 'PHONE' && (
            <form onSubmit={handleSendOtp} className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Enter your Mobile Number</h4>
                <p className="text-slate-500 text-[11px]">
                  We will send a 6-digit verification code via SMS to authenticate your account.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number (+91)</label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-700">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    placeholder="98101 44520"
                    maxLength={14}
                    className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Demo auto-fill helper */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Quick Demo Account:</span>
                <button
                  type="button"
                  onClick={() => setPhoneInput('98101 44520')}
                  className="font-bold text-emerald-600 hover:underline"
                >
                  Fill +91 98101 44520
                </button>
              </div>

              {errorMessage && (
                <p className="text-rose-600 font-semibold text-[11px]">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={!phoneInput.trim() || isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Send 6-Digit OTP</span>}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-[10px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your phone is safely encrypted in open-source IndexedDB. No spam guaranteed.</span>
              </div>
            </form>
          )}

          {/* STEP 2: 6-Digit OTP Verification */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Verify Verification Code</h4>
                <p className="text-slate-500 text-[11px]">
                  Enter the 6-digit code sent to <strong className="text-slate-800">{phoneInput}</strong>.
                </p>
              </div>

              {/* Simulated SMS notification bubble */}
              {demoCode && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                  <p className="font-bold text-[11px] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SMS Code Dispatched</span>
                  </p>
                  <p className="text-[11px]">
                    Your OTP is <strong className="font-mono text-sm tracking-wider text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">{demoCode}</strong> (or test code <strong className="font-mono text-sm tracking-wider text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">123456</strong>)
                  </p>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">6-Digit OTP Code</label>
                <input
                  type="text"
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value)}
                  placeholder="e.g. 123456"
                  maxLength={6}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-center text-lg tracking-widest text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                  autoFocus
                />
              </div>

              {errorMessage && (
                <p className="text-rose-600 font-semibold text-[11px]">{errorMessage}</p>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Change Number
                </button>

                <button
                  type="submit"
                  disabled={otpInput.length < 6 || isLoading}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Verify & Continue</span>}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Complete Profile (New Users) */}
          {step === 'PROFILE' && (
            <form onSubmit={handleCompleteProfile} className="space-y-3.5 animate-fade-in">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Complete Your Profile</h4>
                <p className="text-slate-500 text-[11px]">
                  Set up your display name and workplace to connect with roommates in Delhi/NCR.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="priya.sharma@gmail.com"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Profession</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={e => setProfession(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Workplace / Hub</label>
                  <input
                    type="text"
                    value={workplace}
                    onChange={e => setWorkplace(e.target.value)}
                    placeholder="e.g. DLF Cyber City"
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              {errorMessage && (
                <p className="text-rose-600 font-semibold text-[11px]">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition mt-2"
              >
                Complete Registration & Sign In
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
