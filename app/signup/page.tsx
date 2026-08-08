"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

export default function SignUpPage() {
  const { palette } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Sign up");
    setLoading(false);
  };

  return (
    <div style={{ background: palette.bg, minHeight: "100vh" }}>
      <Link href="/">Financial Warfare</Link>
      <div style={{ maxWidth: "400px", margin: "0 auto", padding: "40px" }}>
        <h1>Create Account</h1>
        <form onSubmit={handleSignUp}>
          <input placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign Up</button>
        </form>
        <p>Already have account? <Link href="/signin">Sign In</Link></p>
      </div>
    </div>
  );
}