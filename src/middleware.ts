// src/middleware.ts

import type { MiddlewareHandler } from "astro";
import { defineMiddleware } from "astro/middleware";
import jwt, { type JwtHeader, type VerifyErrors } from "jsonwebtoken";
import jwksClient, { type SigningKey } from "jwks-rsa";

const region = import.meta.env.REGION;
const userPoolId = import.meta.env.USER_POOL_ID;
const clientId = import.meta.env.PUBLIC_CLIENT_ID;

if (!region || !userPoolId || !clientId) {
  throw new Error("REGION and USER_POOL_ID must be set in .env");
}

const client = jwksClient({
  jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
});

function getKey(
  header: JwtHeader,
  callback: (err: VerifyErrors | null, key?: string) => void
): void {
  client.getSigningKey(header.kid as string, (err, key) => {
    if (err) {
      callback(err);
    } else {
      const signingKey = (key as SigningKey).getPublicKey();
      callback(null, signingKey);
    }
  });
}

export const onRequest: MiddlewareHandler = defineMiddleware(
  async (context, next) => {
    const { request, cookies } = context;
    const { pathname } = context.url;

    let token: string | undefined;

    switch (pathname) {
      case "/api/auth/login":
        const authHeader = request.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.substring(7);
        }

        break;
      case "/api/todos":
        token = cookies.get("access_token")?.value;
        break;

      default:
        return next();
    }

    if (token) {
      try {
        const decoded = await new Promise<object>((resolve, reject) => {
          jwt.verify(
            token as string,
            getKey,
            {
              issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
              algorithms: ["RS256"],
            },
            (err, decoded) => {
              if (err) reject(err);
              else resolve(decoded as object);
            }
          );
        });

        // Attach user information to context.locals for use in routes or components
        context.locals.user = decoded;

        console.info("Token verified successfully 🎉");

        return next();
      } catch (err) {
        console.error("Token validation failed 🔥:", err);
        // Token is invalid or expired
        return new Response("Unauthorized", { status: 401 });
      }
    } else {
      // No token found
      return new Response("Unauthorized", { status: 401 });
    }
  }
);
