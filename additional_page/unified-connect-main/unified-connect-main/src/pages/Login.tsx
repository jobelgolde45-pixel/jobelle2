import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import loginBg from '@/assets/login-bg.jpg';

type PortalChoice = 'user' | 'supervisor' | 'hrdd_admin' | 'signatory';

const DOTR_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png';

const portalInfo: Record<PortalChoice, { label: string; desc: string; icon: string }> = {
  user: { label: 'Employee Portal', desc: 'Access trainings, nominations, and competency tools', icon: '👤' },
  supervisor: { label: 'Supervisor Console', desc: 'Review nominations and job analysis forms', icon: '👔' },
  hrdd_admin: { label: 'HRDD Admin Console', desc: 'Manage trainings, approvals, and master lists', icon: '🏛️' },
  signatory: { label: 'Authorized Signatory', desc: 'Review and sign nomination forms', icon: '✍️' },
};

export default function Login() {
  const { setSelectedPortal } = useAuth();
  const [view, setView] = useState<'portal-select' | 'login' | 'signup' | 'info'>('portal-select');
  const [selectedRole, setSelectedRole] = useState<PortalChoice>('user');
  const [loading, setLoading] = useState(false);

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      setSelectedPortal(selectedRole);
      toast.success('Signed in successfully!');
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: { data: { full_name: signupName }, emailRedirectTo: window.location.origin },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! Please check your email to verify.');
      setView('login');
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-0 md:p-6 lg:p-10 bg-gradient-to-br from-muted to-secondary">
      <div className="h-full w-full max-w-[1400px] flex flex-col md:flex-row bg-card md:rounded-2xl shadow-2xl overflow-hidden relative border border-border/60">
        
        {/* Left Panel - Hero Image */}
        <div className="hidden md:flex flex-col md:w-1/2 lg:w-3/5 h-full relative overflow-hidden bg-brand-dark">
          <img src={loginBg} alt="DOTr Portal" className="absolute inset-0 w-full h-full object-cover z-0" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[hsl(217,91%,30%)] via-[hsl(217,91%,30%,0.8)] to-transparent h-full w-full" />
          
          <div className="relative z-10 w-full h-full flex flex-col justify-end p-10 lg:p-16 text-left">
            <h1 className="text-4xl lg:text-6xl font-extrabold font-display leading-tight tracking-tight mb-4 text-primary-foreground">
              Welcome to the<br /><span className="text-brand-300">HRDD Portal</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg font-light leading-relaxed max-w-xl mb-8">
              The HRDD portal is a comprehensive centralized hub providing seamless access to the complete catalog of training programs and developmental processes offered by the HRDD Learning and Development unit.
            </p>
            <button
              onClick={() => setView('info')}
              className="group bg-card text-primary hover:bg-muted font-bold py-3.5 px-8 rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-3 w-max"
            >
              Explore Services
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col flex-1 relative overflow-y-auto">
          {view === 'portal-select' && (
            <div className="fade-in-slide w-full max-w-md mx-auto mt-6 md:mt-10 lg:mt-12 mb-24 px-8 md:px-12 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-24 h-24 mx-auto flex items-center justify-center mb-4">
                  <img src={DOTR_LOGO} alt="DOTr Logo" className="w-full h-full object-contain drop-shadow-md" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground tracking-tight">Select Your Portal</h2>
                <p className="text-muted-foreground text-sm font-medium">Choose which portal you'd like to access</p>
              </div>

              <div className="space-y-3">
                {(Object.keys(portalInfo) as PortalChoice[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedRole(key);
                      setView(key === 'user' ? 'login' : 'login');
                    }}
                    className="w-full flex items-start gap-4 p-4 border border-border hover:border-brand-blue-light hover:shadow-md bg-card rounded-2xl transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {portalInfo[key].icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-base">{portalInfo[key].label}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{portalInfo[key].desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === 'login' && (
            <div className="fade-in-slide w-full max-w-md mx-auto mt-6 md:mt-10 lg:mt-16 mb-24 px-8 md:px-12 space-y-2">
              <div className="text-center space-y-2">
                <div className="w-28 h-28 mx-auto flex items-center justify-center mb-6">
                  <img src={DOTR_LOGO} alt="DOTr Logo" className="w-full h-full object-contain drop-shadow-md" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  {portalInfo[selectedRole].label}
                </h2>
                <p className="text-muted-foreground text-base font-medium mt-2">Enter your credentials to access your dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
                <div className="space-y-1.5 text-left">
                  <label className="block text-sm font-semibold text-foreground">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      placeholder="Enter your email"
                      className="input-glow block w-full pl-11 pr-4 py-4 border border-border rounded-xl bg-muted/50 focus:bg-card focus:border-brand-blue-light focus:outline-none transition-all placeholder:text-muted-foreground text-foreground font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-sm font-semibold text-foreground">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input
                      type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                      placeholder="••••••••"
                      className="input-glow block w-full pl-11 pr-4 py-4 border border-border rounded-xl bg-muted/50 focus:bg-card focus:border-brand-blue-light focus:outline-none transition-all placeholder:text-muted-foreground text-foreground font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-primary hover:bg-brand-blue-light text-primary-foreground font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base flex justify-center items-center gap-2 mt-4 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setView('portal-select')} className="text-sm text-brand-600 hover:text-brand-800 font-medium">
                  ← Back to Portals
                </button>
                {selectedRole === 'user' && (
                  <button onClick={() => setView('signup')} className="text-sm text-brand-600 hover:text-brand-800 font-semibold">
                    Create Account →
                  </button>
                )}
              </div>
            </div>
          )}

          {view === 'signup' && (
            <div className="fade-in-slide w-full max-w-md mx-auto mt-6 md:mt-8 mb-24 px-8 md:px-12 space-y-2">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 mx-auto flex items-center justify-center mb-4">
                  <img src={DOTR_LOGO} alt="DOTr Logo" className="w-full h-full object-contain drop-shadow-md" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
                <p className="text-muted-foreground text-sm mt-1">Join the DOTr-HRDD Learning Portal</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} required placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-card text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-card text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required placeholder="Create a password"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-card text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                  <input type="password" value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} required placeholder="Re-enter your password"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-card text-foreground" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-brand-blue-light transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </form>

              <div className="pt-4 text-center">
                <p className="text-sm text-muted-foreground">Already have an account? <button onClick={() => setView('login')} className="text-brand-600 hover:text-brand-800 font-semibold">Sign In</button></p>
              </div>
            </div>
          )}

          {view === 'info' && (
            <div className="fade-in-slide flex flex-col justify-center min-h-full p-8 md:p-12 lg:p-14 bg-card">
              <div className="w-full">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                  <h2 className="text-2xl font-extrabold font-display text-foreground">Portal Services</h2>
                  <button onClick={() => setView('portal-select')} className="text-sm font-bold text-brand-blue-light hover:text-primary bg-secondary hover:bg-brand-100 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Back
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: '📊', title: 'IPAR', desc: 'A performance management module for documenting, tracking, and assessing individual accomplishments and targets.' },
                    { icon: '📝', title: 'PNPKI Application', desc: 'A secure gateway for managing PNPKI digital certificates, ensuring trusted transactions and authentication.' },
                    { icon: '🛡️', title: 'CyberSecurity Response', desc: 'A centralized platform for ticketing and monitoring cybersecurity incidents, strengthening organizational security posture.' },
                    { icon: '📐', title: 'ISSP', desc: 'A strategic tool for planning, implementing, and monitoring IT projects and compliance initiatives across the organization.' },
                  ].map((s) => (
                    <div key={s.title} className="flex items-start gap-5 p-5 border border-border hover:border-brand-blue-light hover:shadow-md bg-card rounded-2xl transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {s.icon}
                      </div>
                      <div>
                        <h4 className="font-bold font-display text-foreground text-base">{s.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
