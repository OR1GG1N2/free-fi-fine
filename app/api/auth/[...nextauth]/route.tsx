import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../../lib/prisma";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST },
auth,
 signIn,
signOut,
 } = NextAuth({
  adapter:  PrismaAdapter (prisma),
   providers: [
    Discord({
     clientId: process.env.AUTH_DISCORD_ID!,
       clientSecret: process.env.AUTH_DISCORD_SECRET!,
    } ),
Credentials({
     name: "Credentials",
credentials: {
  email: {  label: "Email", type: "text", placeholder:  "john@doe.com" }, 
  password:{ label: "Password" , type:  "password"   }, 
  },
  async authorize(credentials)  {
  if (!credentials || typeof credentials.email !== 'string' || typeof credentials.password !== 'string')  {
    console.error("Authorize: Invalid credentials format or missing email/password");
  return null;
  }
   const email = credentials.email;
  const password = credentials.password;
   console.log(`Authorize v5: Attempting login for email: ${email}`);
      try {
     const user = await prisma.users.findUnique({
      where: { email: email },
     });
        
      if (!user) {
            console.log(`Authorize v5: User not found for email: ${email}`);
            return null;
          }

          const isPasswordValid = user.password === password; 
          if (isPasswordValid)  {
            console.log(`Authorize v5: Password valid for user: ${user.id}`);
  return {
    id: user.id,
      email: user.email ?? null,
    name: user.name ?? null,
      image: user.image ?? null,
       };
    } else  {
    console.log(`Authorize v5: Invalid password for user: ${user.id}`);
   return null;
       }
     } catch (error) {
    console.error("Authorize v5 error:", error);
      return null;
      }
    },
  }),
],
session: {
  strategy: "jwt",
 },
secret: process.env.AUTH_SECRET,
callbacks: {
  async jwt({ token, user }) {
  if (user) {
   token.id = user.id;
    token.email = user.email;
    }
  return token;
  },
  async session({ session, token }) {
    if (token && session.user) {
    session.user.id = token.id as string;
    }
     return session;
   },
},
pages: {
  signIn: '/login',},
});