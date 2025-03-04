import type { MiddlewareHandler } from "astro";
import { defineMiddleware } from "astro/middleware";
import jwt, { type JwtHeader, type VerifyErrors } from "jsonwebtoken";
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

const isVerifyErrors = (error: unknown): error is VerifyErrors => {
  return error instanceof Error;
};

function getKey(
  header: JwtHeader,
  callback: (err: VerifyErrors | null, key?: string) => void
): void {
  client.getSigningKey(header.kid as string, (err, key) => {
    if (isVerifyErrors(err)) {
      callback(err);
    } else {
      const signingKey = (key as SigningKey).getPublicKey();
      callback(null, signingKey);
    }
  });
}
/**
 * 19.2.25: api endpoints cant return components
 * unless you return the experimental contianer
 * api; hence the mix of endpoints below
 * /partials/list-item
 * /partials/checkbox
 * /api/todos/
 */
export const onRequest: MiddlewareHandler = defineMiddleware(
  async (context, next) => {
    const { request, cookies } = context;
    const url = new URL(request.url);
    const pathname = url.pathname;

    let accessToken: string | null = null;
    let idToken: string | null = null;

    // protected routes
    const partialPaths = [
      "/api/todos/",
      "/partials/checkbox",
      "/partials/list-item",
      "/partials/todos",
    ];
    if (pathname === "/api/auth/login") {
      const authHeader = request.headers.get("Authentication");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.substring(7);
      }
    } else if (partialPaths.some((path) => pathname.startsWith(path))) {
      accessToken = cookies.get("access_token")?.value || null;
      idToken = cookies.get("id_token")?.value || null;
    } else {
      return next();
    }

    if (idToken) {
      context.locals.idToken = idToken;
    } else {
      context.locals.idToken = null;
    }

    if (accessToken) {
      try {
        const decoded = await new Promise<DecodedToken>((resolve, reject) => {
          jwt.verify(
            accessToken as string,
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

        console.info("Access token verified successfully 🎉");

        return next();
      } catch (err) {
        console.error("Access token validation failed 🔥:", err);
        // Token is invalid or expired
        return context.redirect("/");
        // return new Response("Unauthorized", { status: 401 });
      }
    } else {
      console.error("No access token found 🔥:");
      return context.redirect("/");
      // return new Response("Unauthorized", { status: 401 });
    }
  }
);
