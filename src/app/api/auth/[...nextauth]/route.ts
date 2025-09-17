import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

const handle = NextAuth(authOptions);

export { handle as GET, handle as POST };
