import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    bio?: string;
    profilePicture?: string;
  }

  interface Session {
    user: User;
  }
}