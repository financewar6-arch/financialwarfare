"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function AuthNav() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <Link
        href="/signin"
        style={{
          textDecoration: "none",
          color: "inherit",
          fontWeight: 600,
          fontSize: "0.9rem",
        }}
      >
        SIGN IN
      </Link>
    );
  }

  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      <Link
        href="/dashboard"
        style={{
          textDecoration: "none",
          color: "inherit",
          fontWeight: 600,
          fontSize: "0.9rem",
        }}
      >
        DASHBOARD
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        style={{
          background: "none",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "0.9rem",
          textDecoration: "none",
        }}
      >
        SIGN OUT
      </button>
    </div>
  );
}
