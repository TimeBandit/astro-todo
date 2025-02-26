import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const { headers } = context.request;
  const accessToken = headers.get("Authentication")?.valueOf().split(" ")[1];
  const idToken = headers.get("Authorization")?.valueOf().split(" ")[1];
  const ttl = parseInt(headers.get("ttl")?.valueOf() || "0") || 3600; // 3600s = 1hr

  if (!accessToken) {
    return new Response(
      JSON.stringify({
        message: "No access token found",
      }),
      { status: 401 }
    );
  }

  if (!idToken) {
    return new Response(
      JSON.stringify({
        message: "No id token found",
      }),
      { status: 401 }
    );
  }

  context.cookies.set("access_token", accessToken, {
    path: "/",
    secure: true,
    httpOnly: true, // removes js access in the browser
    sameSite: "strict",
    expires: new Date(ttl * 1000),
    maxAge: ttl,
  });

  context.cookies.set("id_token", idToken, {
    path: "/",
    secure: true,
    httpOnly: true, // removes js access in the browser
    sameSite: "strict",
    expires: new Date(ttl * 1000),
    maxAge: ttl,
  });

  return new Response(
    JSON.stringify({
      message: "Logged in successfully",
    }),
    { status: 200 }
  );
};
