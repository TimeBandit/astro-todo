import type { APIRoute } from "astro";

export const prerender = false;

export const DELETE: APIRoute = ({ params }) => {
  console.log("deleting id: ", params["id"]);
  return new Response(null, { status: 200 });
};
