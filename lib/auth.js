import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const useSecureCookies =
  process.env.NODE_ENV === 'production' ||
  process.env.NEXTAUTH_URL?.startsWith('https://');

const sessionCookieName = useSecureCookies
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token';

export const authOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/login' },
  // Lock cookie naming down so middleware always knows what to look for.
  // Without this, NextAuth will silently flip the cookie prefix based on
  // whether it detects HTTPS — which behind a proxy on production is not
  // always reliable, and middleware then can't find the token.
  useSecureCookies,
  cookies: {
    sessionToken: {
      name: sessionCookieName,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
  },
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
        // Unapproved organizers CAN log in — the dashboard will show a
        // pending-verification banner and their events stay private until
        // the platform team approves the account.

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || null,
          isVerified: user.isVerified,
          isApproved: user.isApproved !== false, // org account approval flag
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
        token.isApproved = user.isApproved;
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
        session.user.isApproved = token.isApproved !== false;
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
