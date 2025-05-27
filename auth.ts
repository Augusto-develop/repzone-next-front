import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod"; // Assuming Zod is used in handleLogin for validation
import { handleLogin } from "./action/login-actions"; // Your custom login action
import { AuthResponse } from "./lib/model/auth-response"; // Your AuthResponse interface

// Extend NextAuth types to include custom properties on User and Session
declare module "next-auth" {
    interface User {
        id?: string;
        email?: string | null;
        pwApiToken: string; // Your custom API token
        name?: string | null;
    }

    interface Session {
        user: User & DefaultSession["user"];
        expires: string;
        // error: string; // This property is not standard for DefaultSession, consider if truly needed.
        // Errors are typically handled by signIn's result.error or thrown.
    }
}

// Extend JWT type if you're directly manipulating it beyond NextAuth's default
declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        email?: string | null;
        pwApiToken?: string; // Your custom API token on the JWT
    }
}


export const { handlers, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials", // A descriptive name for the provider
            credentials: {
                email: { label: "Email", type: "text", placeholder: "example@domain.com" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    // Ensure credentials are of the expected type
                    const { email, password } = credentials as {
                        email: string;
                        password: string;
                    };

                    // Call your custom login action
                    const authResponse: AuthResponse = await handleLogin(email, password);

                    // If authentication fails (e.g., no token returned from your API)
                    if (!authResponse || !authResponse.token) {
                        // Throwing an error here will cause NextAuth to return a CredentialsSignin error
                        // which your frontend can catch (result.error)
                        throw new Error("Credenciais inválidas.");
                    }

                    // Return a User object. This object will be passed to the jwt callback.
                    // Make sure 'id' is a string if your database IDs are strings.
                    return {
                        id: String(authResponse.id), // Ensure id is always a string
                        name: authResponse.name,
                        email: email,
                        pwApiToken: authResponse.token, // Store your custom token
                    };

                } catch (error) {
                    if (error instanceof ZodError) {
                        // If validation fails from Zod (e.g., in handleLogin)
                        // Log it for debugging, but return null to signify auth failure
                        console.error("Validation error during authorization:", error.issues);
                        // You might throw an error here with a more specific message if you want to differentiate
                        throw new Error("Validation Error.");
                    }
                    // Catch other general errors from handleLogin or network issues
                    console.error("Authorization error:", error);
                    // Return null to indicate authentication failure to NextAuth.js
                    return null;
                }
            },
        }),
    ],
    // Essential: Tells NextAuth.js to trust the Host header, crucial for Vercel deployments
    // and dynamic URLs to correctly generate callback URLs and secure cookies.
    trustHost: true,

    // Callbacks are used to manage session and JWT data
    callbacks: {
        // JWT callback: This function is called whenever a JWT is created or updated
        async jwt({ token, user, account, profile, isNewUser }) {
            // 'user' is only available on the first sign-in (after 'authorize' returns)
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.pwApiToken = user.pwApiToken; // Add your custom API token to the JWT
            }
            // You can also add properties from 'account' (e.g., access_token from OAuth) here
            return token;
        },
        // Session callback: This function is called whenever a session is checked
        async session({ session, token }) {
            // Transfer properties from the JWT (token) to the session object
            if (token) {
                session.user = {
                    ...session.user, // Keep default session user properties
                    id: String(token.id || ""), // Ensure id is a string
                    email: token.email || "",
                    pwApiToken: String(token.pwApiToken || ""), // Transfer API token to session
                };
            }
            return session;
        },
    },

    // A secret is required for signing and encrypting tokens.
    // MUST be a strong, randomly generated string. Use `openssl rand -base64 32`
    // or similar to generate.
    secret: process.env.NEXTAUTH_SECRET,

    // Session strategy: "jwt" is recommended for serverless environments.
    session: {
        strategy: "jwt",
        maxAge: 1 * 1 * 60 * 60, // JWT expiration in seconds (1 hour)
    },

    // Custom cookie configuration (optional, usually not needed to fix CSRF)
    // Your current setup for 'sessionToken' correctly uses secure cookies in production
    // and a 'lax' SameSite policy, which are good practices.
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
            options: {
                httpOnly: true, // Only accessible via HTTP, not JavaScript
                secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
                sameSite: "lax", // Generally recommended for security and compatibility
                maxAge: 1 * 1 * 60 * 60, // Match session maxAge
                path: "/",
            },
        },
        // Note: NextAuth.js automatically manages a separate CSRF token cookie (e.g., __Secure-next-auth.csrf-token)
        // You generally don't need to configure it here unless there's a very specific requirement.
    },

    // Optional: Define custom pages for sign-in, error, etc.
    // If you have a custom login page at /login, ensure this is set:
    pages: {
        signIn: '/login', // Path to your custom sign-in page component
        // error: '/auth/error', // Optional: Redirect to a custom error page
        // signOut: '/auth/signout', // Optional: Redirect to a custom sign-out page
    },
});