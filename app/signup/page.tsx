"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

export default function SignUpPage() {
  const { palette } = useTheme();

  const handleSocialSignUp = (provider: string) => {
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
            <h1 style={{ fontFamily: "var(--font-header)", fontSize: "1.8rem", fontWeight: 700, marginBottom: "8px", textAlign: "center" }}>Create Account</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: palette.paperDim, textAlign: "center", marginBottom: "32px" }}>
              Join Financial Warfare and track your markets
            </p>

            <div style={{ marginBottom: "24px" }}>
              <SocialButton provider="Google" icon="🔵" onClick={() => handleSocialSignUp("google")} palette={palette} />
              <SocialButton provider="GitHub" icon="🐙" onClick={() => handleSocialSignUp("github")} palette={palette} />
            </div>

            <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: `1px solid ${palette.hairline}`, textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: palette.paperDim }}>
                Already have an account? <Link href="/signin" style={{ color: palette.amber, textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
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
      Sign up with {provider}
    </button>
  );
}