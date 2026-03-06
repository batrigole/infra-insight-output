import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Mail, Lock, User, ArrowRight } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (isForgot) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage("If an account exists with that email, you'll receive a password reset link.");
      }
      setLoading(false);
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">Infra-Insight</span>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-lg font-semibold text-foreground text-center mb-1">
            {isForgot ? "Reset your password" : isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {isForgot ? "Enter your email to receive a reset link" : isLogin ? "Sign in to your dashboard" : "Get started with infrastructure monitoring"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isForgot && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            {!isForgot && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            )}

            {isLogin && !isForgot && (
              <div className="text-right">
                <button type="button" onClick={() => { setIsForgot(true); setError(""); setMessage(""); }}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-success">{message}</p>}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? "Please wait..." : isForgot ? "Send Reset Link" : isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            {isForgot ? (
              <button onClick={() => { setIsForgot(false); setError(""); setMessage(""); }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Back to Sign In
              </button>
            ) : (
              <button onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
