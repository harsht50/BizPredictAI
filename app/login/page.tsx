"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const clearErrors = () => setErrors({});

  const getStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [
      { label: "Weak", color: "#ef4444", width: "25%" },
      { label: "Fair", color: "#f59e0b", width: "50%" },
      { label: "Good", color: "#60a5fa", width: "75%" },
      { label: "Strong 🔥", color: "#22c55e", width: "100%" },
    ];
    return levels[score - 1] || levels[0];
  };

  const getStoredUsers = (): any[] => {
    try { return JSON.parse(localStorage.getItem("vv_users") || "[]"); }
    catch { return []; }
  };

  const handleLogin = async () => {
    clearErrors();
    const errs: Record<string, string> = {};
    let ok = true;
    if (!isValidEmail(loginEmail)) { errs.loginEmail = "Please enter a valid email."; ok = false; }
    if (loginPass.length < 6) { errs.loginPass = "Password must be at least 6 characters."; ok = false; }
    if (!ok) { setErrors(errs); return; }

    const users = getStoredUsers();
    const user = users.find((u: any) => u.email === loginEmail && u.password === loginPass);
    if (!user) { setErrors({ loginEmail: "No account found with these credentials." }); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    localStorage.setItem("vv_session", JSON.stringify({ first: user.first, last: user.last, email: user.email }));
    setLoading(false);
    setSuccessMsg(`Welcome back, ${user.first}! Ready to analyse your next venture?`);
    setSuccess(true);
  };

  const handleSignup = async () => {
    clearErrors();
    const errs: Record<string, string> = {};
    let ok = true;
    if (!firstName.trim()) { errs.firstName = "Required."; ok = false; }
    if (!lastName.trim()) { errs.lastName = "Required."; ok = false; }
    if (!isValidEmail(signupEmail)) { errs.signupEmail = "Please enter a valid email."; ok = false; }
    if (signupPass.length < 8 || !/[0-9]/.test(signupPass)) { errs.signupPass = "Min 8 characters, include at least one number."; ok = false; }
    if (signupPass !== confirmPass) { errs.confirmPass = "Passwords do not match."; ok = false; }
    if (!ok) { setErrors(errs); return; }

    const users = getStoredUsers();
    if (users.find((u: any) => u.email === signupEmail)) { setErrors({ signupEmail: "An account with this email already exists." }); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    users.push({ first: firstName, last: lastName, email: signupEmail, password: signupPass });
    localStorage.setItem("vv_users", JSON.stringify(users));
    localStorage.setItem("vv_session", JSON.stringify({ first: firstName, last: lastName, email: signupEmail }));
    setLoading(false);
    setSuccessMsg(`Account created! Welcome to BizPredictAI, ${firstName}! 🎉`);
    setSuccess(true);
  };

  const strength = signupPass ? getStrength(signupPass) : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .bg-dots { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 28px 28px; opacity: 0.5; }
        .bg-blob { position: fixed; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%); top: -160px; right: -160px; pointer-events: none; z-index: 0; }
        .bg-blob2 { position: fixed; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%); bottom: -120px; left: -80px; pointer-events: none; z-index: 0; }

        .page-wrap { position: relative; z-index: 1; width: 100%; max-width: 440px; animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

        .logo-area { text-align: center; margin-bottom: 28px; }
        .brand-tag { display: inline-block; border: 1px solid var(--accent-border); color: #4f46e5; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 3px; padding: 5px 14px; border-radius: 20px; margin-bottom: 14px; text-transform: uppercase; background: var(--accent-bg); }
        .brand-title { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; color: var(--text); line-height: 1; }
        .brand-title span { color: #4f46e5; }
        .brand-sub { margin-top: 8px; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--text-faint); text-transform: uppercase; }

        .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 32px; box-shadow: var(--shadow-md); position: relative; overflow: hidden; }
        .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #4f46e5, #818cf8, #4f46e5); }

        .tabs { display: flex; background: var(--bg); border-radius: 10px; padding: 3px; margin-bottom: 26px; gap: 3px; border: 1px solid var(--border); }
        .tab { flex: 1; padding: 9px; border: none; background: transparent; color: var(--text-faint); font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .tab.active { background: var(--bg-card); color: #4f46e5; box-shadow: var(--shadow); }

        .panel { animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .row2 { display: flex; gap: 12px; }
        .row2 > * { flex: 1; }

        .field { margin-bottom: 14px; }
        .label { display: block; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 7px; }
        .input-wrap { position: relative; }
        .icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--text-faint); font-size: 13px; pointer-events: none; }
        .input { width: 100%; background: var(--bg-input); border: 1.5px solid var(--border); border-radius: 10px; padding: 11px 40px 11px 38px; color: var(--text); font-family: 'DM Mono', monospace; font-size: 0.82rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s; -webkit-appearance: none; }
        .input::placeholder { color: var(--text-placeholder); }
        .input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.08); }
        .eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-faint); cursor: pointer; font-size: 14px; padding: 0; transition: color 0.2s; }
        .eye:hover { color: #4f46e5; }
        .err { color: var(--danger-text); font-family: 'DM Mono', monospace; font-size: 10px; margin-top: 5px; }

        .extras { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .check { display: flex; align-items: center; gap: 7px; color: var(--text-muted); font-size: 0.78rem; cursor: pointer; user-select: none; }
        .check input { accent-color: #4f46e5; width: 14px; height: 14px; }
        .forgot { color: #4f46e5; text-decoration: none; font-size: 0.78rem; font-family: 'DM Mono', monospace; }
        .forgot:hover { text-decoration: underline; }

        .btn { width: 100%; background: var(--text); border: none; border-radius: 10px; padding: 13px; color: var(--bg); font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
        .btn:hover { opacity: 0.85; transform: translateY(-1px); box-shadow: var(--shadow-md); }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

        .divider { display: flex; align-items: center; gap: 10px; margin: 16px 0; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--text-faint); }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        .google-btn { width: 100%; background: transparent; border: 1.5px solid var(--border); border-radius: 10px; padding: 11px; color: var(--text-muted); font-family: 'DM Sans', sans-serif; font-size: 0.84rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; }
        .google-btn:hover { border-color: var(--accent-border); color: #4f46e5; background: var(--accent-bg); }

        .strength-bar { height: 3px; background: var(--border); border-radius: 4px; overflow: hidden; margin-top: 8px; }
        .strength-fill { height: 100%; border-radius: 4px; transition: width 0.3s, background 0.3s; }
        .strength-label { font-family: 'DM Mono', monospace; font-size: 9px; margin-top: 4px; }

        .terms { font-size: 0.72rem; color: var(--text-faint); text-align: center; margin-top: 14px; font-family: 'DM Mono', monospace; }
        .terms a { color: #4f46e5; text-decoration: none; }

        .success-wrap { text-align: center; padding: 16px 0; animation: fadeUp 0.4s ease both; }
        .success-icon { width: 68px; height: 68px; background: var(--accent-bg); border: 2px solid #4f46e5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 18px; animation: pop 0.4s cubic-bezier(.22,1,.36,1) 0.1s both; }
        @keyframes pop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .success-wrap h2 { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 800; margin-bottom: 8px; color: var(--text); }
        .success-wrap p { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 22px; line-height: 1.6; }
        .dash-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--text); color: var(--bg); border: none; border-radius: 10px; padding: 13px 28px; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
        .dash-btn:hover { opacity: 0.85; box-shadow: var(--shadow-md); transform: translateY(-1px); }
      `}</style>

      <div className="bg-dots" />
      <div className="bg-blob" />
      <div className="bg-blob2" />

      <div className="page-wrap">
        <div className="logo-area">
          <div className="brand-tag">AI — Powered Platform</div>
          <h1 className="brand-title">Biz<span>Predict</span>AI</h1>
          <p className="brand-sub">// Business Intelligence System</p>
        </div>

        <div className="card">
          {success ? (
            <div className="success-wrap">
              <div className="success-icon">✓</div>
              <h2>You&apos;re in!</h2>
              <p>{successMsg}</p>
              <button className="dash-btn" onClick={() => router.push("/")}>Open Dashboard →</button>
            </div>
          ) : (
            <>
              <div className="tabs">
                <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); clearErrors(); }}>Login</button>
                <button className={`tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); clearErrors(); }}>Sign Up</button>
              </div>

              {tab === "login" && (
                <div className="panel">
                  <div className="field">
                    <label className="label">Email Address</label>
                    <div className="input-wrap">
                      <span className="icon">✉</span>
                      <input className="input" type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} autoComplete="email" />
                    </div>
                    {errors.loginEmail && <p className="err">{errors.loginEmail}</p>}
                  </div>
                  <div className="field">
                    <label className="label">Password</label>
                    <div className="input-wrap">
                      <span className="icon">🔒</span>
                      <input className="input" type={showLoginPass ? "text" : "password"} placeholder="••••••••" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} autoComplete="current-password" />
                      <button className="eye" type="button" onClick={() => setShowLoginPass(!showLoginPass)}>{showLoginPass ? "🙈" : "👁"}</button>
                    </div>
                    {errors.loginPass && <p className="err">{errors.loginPass}</p>}
                  </div>
                  <div className="extras">
                    <label className="check"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />Remember me</label>
                    <a href="#" className="forgot">Forgot password?</a>
                  </div>
                  <button className="btn" onClick={handleLogin} disabled={loading}>{loading ? "Verifying…" : "Login →"}</button>
                  <div className="divider">or continue with</div>
                  <button className="google-btn" type="button">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Continue with Google
                  </button>
                </div>
              )}

              {tab === "signup" && (
                <div className="panel">
                  <div className="row2">
                    <div className="field">
                      <label className="label">First Name</label>
                      <div className="input-wrap">
                        <span className="icon">👤</span>
                        <input className="input" type="text" placeholder="Riya" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      </div>
                      {errors.firstName && <p className="err">{errors.firstName}</p>}
                    </div>
                    <div className="field">
                      <label className="label">Last Name</label>
                      <div className="input-wrap">
                        <span className="icon" style={{ opacity: 0 }}>👤</span>
                        <input className="input" type="text" placeholder="Sharma" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </div>
                      {errors.lastName && <p className="err">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Email Address</label>
                    <div className="input-wrap">
                      <span className="icon">✉</span>
                      <input className="input" type="email" placeholder="you@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} autoComplete="email" />
                    </div>
                    {errors.signupEmail && <p className="err">{errors.signupEmail}</p>}
                  </div>
                  <div className="field">
                    <label className="label">Password</label>
                    <div className="input-wrap">
                      <span className="icon">🔒</span>
                      <input className="input" type={showSignupPass ? "text" : "password"} placeholder="••••••••" value={signupPass} onChange={(e) => setSignupPass(e.target.value)} autoComplete="new-password" />
                      <button className="eye" type="button" onClick={() => setShowSignupPass(!showSignupPass)}>{showSignupPass ? "🙈" : "👁"}</button>
                    </div>
                    {signupPass && strength && (
                      <>
                        <div className="strength-bar"><div className="strength-fill" style={{ width: strength.width, background: strength.color }} /></div>
                        <p className="strength-label" style={{ color: strength.color }}>{strength.label}</p>
                      </>
                    )}
                    {errors.signupPass && <p className="err">{errors.signupPass}</p>}
                  </div>
                  <div className="field">
                    <label className="label">Confirm Password</label>
                    <div className="input-wrap">
                      <span className="icon">🔒</span>
                      <input className="input" type={showConfirmPass ? "text" : "password"} placeholder="••••••••" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} autoComplete="new-password" />
                      <button className="eye" type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}>{showConfirmPass ? "🙈" : "👁"}</button>
                    </div>
                    {errors.confirmPass && <p className="err">{errors.confirmPass}</p>}
                  </div>
                  <button className="btn" onClick={handleSignup} disabled={loading}>{loading ? "Creating account…" : "Create Account →"}</button>
                  <div className="divider">or continue with</div>
                  <button className="google-btn" type="button">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Continue with Google
                  </button>
                  <p className="terms">By signing up you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
