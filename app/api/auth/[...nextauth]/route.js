import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/db";
import userModel from "@/app/models/userModel";
import { authOptions } from "./options";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        await connectToDatabase();

        // Check if user exists in DB
        const existingUser = await userModel.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = await userModel.create({
            name: user.name,
            email: user.email,
            isGoogleUser: true,
            role: "user", // ✅ default role
            profileImage: user.image,
          });
          token.id = newUser._id;
          token.role = newUser.role;
        } else {
          token.id = existingUser._id;
          token.role = existingUser.role;
        }

        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.image = token.picture;
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
