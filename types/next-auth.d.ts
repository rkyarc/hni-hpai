import NextAuth, { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "CUSTOMER" | "ADMIN" | "OWNER"
    } & DefaultSession["user"]
  }

  interface User {
    role: "CUSTOMER" | "ADMIN" | "OWNER"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "CUSTOMER" | "ADMIN" | "OWNER"
  }
}