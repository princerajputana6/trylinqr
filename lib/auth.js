import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }
        await connectDB();
        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        });
        if (!user) throw new Error('No account found with that email');

        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) throw new Error('Incorrect password');

        if (user.isBanned) throw new Error('This account has been suspended');
        if (user.role === 'admin' && !user.isApproved) {
          throw new Error('Your organizer account is pending approval');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || null,
          isVerified: user.isVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
        token.isVerified = user.isVerified;
      }
      if (trigger === 'update' && session) {
        token.name = session.name ?? token.name;
        token.avatar = session.avatar ?? token.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },
};

export function getSession() {
  return getServerSession(authOptions);
}

export async function requireUser(roles) {
  const session = await getSession();
  if (!session?.user) return { error: 'unauthorized', status: 401 };
  if (roles && !roles.includes(session.user.role)) {
    return { error: 'forbidden', status: 403 };
  }
  return { user: session.user };
}
