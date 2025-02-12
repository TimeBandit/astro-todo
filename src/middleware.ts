// src/middleware.ts

import type { MiddlewareHandler } from "astro";
import { defineMiddleware } from "astro/middleware";
import jwt, {
  TokenExpiredError,
  type JwtHeader,
  type VerifyErrors,
} from "jsonwebtoken";
import jwksClient, { type SigningKey } from "jwks-rsa";

const region = import.meta.env.REGION;
const userPoolId = import.meta.env.USER_POOL_ID;
const clientId = import.meta.env.PUBLIC_CLIENT_ID;

type DecodedToken = {
  sub: string;
  iss: string;
  version: number;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: 1739375275;
  exp: 1739378875;
  iat: 1739375275;
  jti: string;
  username: string;
};

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

    // protected routes
    if (pathname === "/api/auth/login") {
      const authHeader = request.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    } else if (pathname.startsWith("/api/todos")) {
      token = cookies.get("access_token")?.value;
    } else {
      return next();
    }

    if (token) {
      try {
        const decoded = await new Promise<DecodedToken>((resolve, reject) => {
          if (decoded.exp * 1000 < Date.now()) {
            // saves the verify method from making a network request
            reject(
              new TokenExpiredError("Token Expired", new Date(decoded.exp))
            );
          }

          jwt.verify(
            token as string,
            getKey,
            {
              issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
              algorithms: ["RS256"],
            },
            (err, decoded) => {
              if (err) reject(err);
              else resolve(decoded as DecodedToken);
            }
          );
        });

        // Attach user information to context.locals for use in routes or components
        context.locals.userId = decoded.sub; // Cognito User ID (immutable)

        console.info("Token verified successfully 🎉");

        return next();
      } catch (err) {
        console.error("Token validation failed 🔥:", err);
        // Token is invalid or expired
        return new Response("Unauthorized", { status: 401 });
      }
    } else {
      console.error("No token found 🔥:", err);
      return new Response("Unauthorized", { status: 401 });
    }
  }
);
