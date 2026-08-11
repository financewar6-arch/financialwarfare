import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { getPrisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Implement real authentication
        // For now, accept any email/password for demo purposes
        if (credentials?.email && credentials?.password) {
          return {
            id: credentials.email,
            email: credentials.email,
            name: credentials.email.split("@")[0],
            image: `https://avatar.vercel.sh/${credentials.email}`,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id;

        // Ensure user has an entitlement record (if database is available)
        try {
          const prisma = getPrisma();
          const userId = token.id as string;
          const existingEntitlement = await prisma.userEntitlement.findUnique({
            where: { userId },
          });

          if (!existingEntitlement) {
            try {
              await prisma.userEntitlement.create({
                data: {
                  userId,
                  tier: "free",
                  isPremium: false,
                  features: [],
                },
              });
            } catch (err) {
              // Handle race condition if another process already created it
              console.error("Error creating default entitlement:", err);
            }
          }
        } catch (dbErr) {
          // Database unavailable - allow session to continue without entitlement
          console.warn("Database unavailable, skipping entitlement creation:", dbErr);
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-this",
};
