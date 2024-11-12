import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { accounts, authenticators, sessions, users, verificationTokens } from '@db/schema';
import NextAuth from 'next-auth';
import resend from 'next-auth/providers/resend';
import db from '../db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    authenticatorsTable: authenticators,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    resend({
      from: 'sicaru@sicaru.fsvdr.me',
    }),
  ],
  pages: {
    signIn: '/signin',
    error: '/signin',
    verifyRequest: '/verify-email',
    newUser: '/setup',
  },
});
