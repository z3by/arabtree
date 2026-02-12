import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                if (!isLoggedIn) return false;
                // Basic check, proper RBAC should verify role value
                if (auth.user.role !== 'ADMIN') return Response.redirect(new URL('/', nextUrl));
                return true;
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            }
            return true;
        },
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
                session.user.role = token.role as any;
            }
            return session;
        },
        jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.role = user.role;
            }
            return token;
        },
    },
    providers: [],
    session: { strategy: "jwt" },
} satisfies NextAuthConfig;
