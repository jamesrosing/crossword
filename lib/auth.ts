import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // Always return a mock session
      return {
        ...session,
        user: {
          id: "mock-user-id",
          name: "Mock User",
          email: "mock@example.com",
        },
      };
    },
    async signIn() {
      // Always allow sign in
      return true;
    },
  },
  // Remove the adapter temporarily
  // adapter: PrismaAdapter(prisma),
};