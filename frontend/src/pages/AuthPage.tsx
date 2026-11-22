import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpenText, Eye, EyeOff, Heart, LoaderCircle, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { IMAGES } from '../data/demoData';
import { errorMessage } from '../lib/helpers';

export default function AuthPage({ kind }: { kind: 'login' | 'signup' }) {
  const creating = kind === 'signup';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { signIn, signUp, enterDemo } = useAuth();
  const navigate = useNavigate();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (creating && password.length < 8) { setError('Please use at least 8 characters for your password.'); return; }
    setBusy(true);
    try {
      if (creating) await signUp({ name: name.trim(), email: email.trim(), password });
      else await signIn({ email: email.trim(), password });
      navigate('/library', { replace: true });
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  }
  function demo() { enterDemo(); navigate('/library'); }

  return <main className="auth-page container">
    <section className="auth-panel">
      <div className="auth-panel__top"><div className="auth-icon"><BookOpenText size={25}/></div><div className="eyebrow">YOUR PERSONAL COOKBOOK</div><h1>{creating ? <>Let's cook up<br/><span>something good.</span></> : <>Welcome <span>back.</span></>}</h1><p>{creating ? 'Create your account to start collecting recipes and making cookbooks of your own.' : 'The best recipes are worth coming back to. Sign in to pick up where you left off.'}</p></div>
      <form className="form-stack auth-form" onSubmit={submit}>
        {creating && <div className="field"><label htmlFor="full-name">Your name</label><div className="input-icon"><UserRound size={18}/><input id="full-name" name="name" autoComplete="name" placeholder="Your name" minLength={2} required value={name} onChange={e => setName(e.target.value)}/></div></div>}
        <div className="field"><label htmlFor="email-address">Email address</label><div className="input-icon"><Mail size={18}/><input id="email-address" name="email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)}/></div></div>
        <div className="field"><label htmlFor="account-password">Password</label><div className="input-icon"><LockKeyhole size={18}/><input id="account-password" name="password" type={showPassword ? 'text' : 'password'} minLength={creating ? 8 : undefined} autoComplete={creating ? 'new-password' : 'current-password'} placeholder={creating ? 'At least 8 characters' : 'Enter your password'} required value={password} onChange={e => setPassword(e.target.value)}/><button className="password-eye" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button--primary button--full button--large" disabled={busy}>{busy ? <LoaderCircle className="spin" size={19}/> : null}{creating ? 'Create account' : 'Log in'} <ArrowRight size={18}/></button>
      </form>
      <div className="auth-divider"><span>or just looking around?</span></div>
      <button onClick={demo} className="button button--outline button--full">Try demo without an account <ArrowRight size={17}/></button>
      <p className="auth-switch">{creating ? 'Already have an account?' : 'New around here?'} <Link to={creating ? '/login' : '/signup'}>{creating ? 'Log in' : 'Create an account'}</Link></p>
      <p className="auth-footnote">Live account access requires your Flask API. Demo recipes are stored only in this browser.</p>
    </section>
    <aside className="auth-aside"><img src={IMAGES.pasta} alt="A beautiful homemade pasta dish"/><div className="auth-aside__shade"/><div className="auth-aside__quote"><div><Heart size={22} fill="currentColor"/></div><h2>Good food.<br/>Great memories.</h2><p>A little corner of the internet for recipes that feel like home.</p></div></aside>
  </main>;
}
