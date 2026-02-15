import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { v4 as uuidv4 } from 'uuid';
import { client, writeClient } from './client';

// Validate environment variables
if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
    if (process.env.NODE_ENV === 'production') {
        console.error("Missing GitHub OAuth environment variables");
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async session({ session, token }) {
            if (session?.user && token?.sub) {
                // @ts-ignore - Adding id to user object
                session.user.id = token.sub;
            }
            return session;
        },

        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
            }
            return token;
        },

        async signIn({ user, account, profile }) {
            try {
                if (!user.email) return false;

                // First, check if user already exists in Sanity
                const existingUser = await client.fetch(
                    `*[_type == "user" && email == $email][0]`,
                    { email: user.email }
                );

                // If user exists, return true without attempting to create
                if (existingUser) {
                    return true;
                }

                // Create new user in Sanity
                const sanityUser = {
                    _id: `user.${uuidv4()}`,
                    _type: 'user',
                    providerId: account?.providerAccountId,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    emailVerified: new Date().toISOString()
                }

                // Create the user
                await writeClient.create(sanityUser);

                return true;
            } catch (error) {
                console.error('Error creating Sanity user:', error);
                return true; // Return true even if Sanity user creation fails
            }
        },

        async redirect({ url, baseUrl }) {
            // Allow relative paths and URLs that start with the base URL
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            else if (url.startsWith(baseUrl)) return url;
            return baseUrl;
        }
    },

    debug: process.env.NODE_ENV === 'development',
};
