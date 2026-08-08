"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { palette } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = (provider: string) => {
    signIn(provider.toLowerCase(), { callbackUrl: "/" });
  };

  return (
    <div style={{ background: palette.bg, color: palette.paper, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: `1px solid ${palette.hairline}`, padding: "16px 20px" }}>
        <Link href="/" style={{ fontFamily: "var(--font-header)", fontWeight: 600, fontSize: "1.1rem", color: palette.amber, textDecoration: "none" }}>
          ⚔ Financial Warfare
        </Link>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ background: `${palette.panel}99`, border: `1px solid ${palette.hairline}`, borderRadius: "8px", padding: "40px 32px" }}>
            <h1 style={{ fontFamily: "var(--font-header)", fontSize: "1.8rem", fontWeight: 700, marginBottom: "8px", textAlign: "center" }}>Sign In</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: palette.paperDim, textAlign: "center", marginBottom: "32px" }}>
              Access your Financial Warfare dashboard
            </p>

            {error && (
              <div style={{ background: `${palette.red}22`, border: `1px solid ${palette.red}`, color: palette.red, padding: "12px", borderRadius: "4px", fontSize: "0.9rem", marginBottom: "20px", fontFamily: "var(--font-body)" }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: "24px" }}>
              <SocialButton provider="Google" icon="🔵" onClick={() => handleSocialSignIn("google")} palette={palette} />
              <SocialButton provider="GitHub" icon="🐙" onClick={() => handleSocialSignIn("github")} palette={palette} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ flex: 1, height: "1px", background: palette.hairline }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: palette.paperDim }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: palette.hairline }} />
            </div>

            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 500, display: "block", marginBottom: "6px" }}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%", padding: "10px 12px", background: palette.bg, border: `1px solid ${palette.hairline}`, borderRadius: "4px", color: palette.paper, fontFamily: "var(--font-body)", fontSize: "0.95rem", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 500, display: "block", marginBottom: "6px" }}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "10px 12px", background: palette.bg, border: `1px solid ${palette.hairline}`, borderRadius: "4px", color: palette.paper, fontFamily: "var(--font-body)", fontSize: "0.95rem", boxSizing: "border-box" }} />
              </div>
              <button type="submit" disabled={loading} style={{ padding: "12px", background: palette.amber, color: palette.bg, border: "none", borderRadius: "4px", fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1, textTransform: "uppercase" }}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: `1px solid ${palette.hairline}`, textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: palette.paperDim }}>
                Don't have an account? <Link href="/signup" style={{ color: palette.amber, textDecoration: "none", fontWeight: 600 }}>Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialButton({ provider, icon, onClick, palette }: { provider: string; icon: string; onClick: () => void; palette: any }) {
  return (
    <button onClick={onClick} style={{ width: "100%", padding: "12px", marginBottom: "12px", background: palette.panel, border: `1px solid ${palette.hairline}`, borderRadius: "4px", color: palette.paper, fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = palette.amber; (e.currentTarget as HTMLButtonElement).style.background = `${palette.amber}11`; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = palette.hairline; (e.currentTarget as HTMLButtonElement).style.background = palette.panel; }}>
      <span>{icon}</span>
      Sign in with {provider}
    </button>
  );
}