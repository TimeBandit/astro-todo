import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  // Do something with the data, then return a success response
  return new Response(
    JSON.stringify({
      todo: "wash your face",
    }),
    { status: 200 }
  );
};
