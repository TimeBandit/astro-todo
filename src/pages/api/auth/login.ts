import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const { headers } = context.request;
  const token = headers.get("Authorization")?.valueOf().split(" ")[1];
  const ttl = headers.get("ttl")?.valueOf();

  if (!token) {
    return new Response(
      JSON.stringify({
        message: "No access token found",
      }),
      { status: 401 }
    );
  }

  // TODO: validate the token

  context.cookies.set("token", token, {
    path: "/",
    secure: true,
    httpOnly: true, // removes js access in the browser
    sameSite: "strict",
    maxAge: parseInt(ttl ?? "3600"), // 1 hour
  });

  return new Response(
    JSON.stringify({
      message: "Logged in successfully",
    }),
    { status: 200 }
  );
};
