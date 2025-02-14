import type { APIRoute } from "astro";

export const prerender = false;

const todos = [
  { id: 1, description: "first one", completed: true },
  { id: 2, description: "second one", completed: false },
  { id: 3, description: "third one", completed: true },
];

export const GET: APIRoute = async (context) => {
  console.log("GETTING TODOS");
  return new Response(JSON.stringify({ todos }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
