import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async (context) => {
  context.cookies.delete("access_token", {
    // Match the original cookie settings
    path: "/",
    secure: true,
    sameSite: "strict",
  });

  return new Response(
    JSON.stringify({
      message: "Logged out successfully",
    }),
    { status: 200 }
  );
};
