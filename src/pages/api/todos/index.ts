import type { APIRoute } from "astro";

export const prerender = false;

const todos = [
  { id: 1, task: "first one", done: true },
  { id: 2, task: "second one", done: false },
  { id: 3, task: "third one", done: true },
];

export const GET: APIRoute = async (context) => {
  console.log("GETTING TODOS");
  return new Response(JSON.stringify({ todos }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
