import type { APIRoute } from "astro";

export const prerender = false;

const todos = [
  { id: 1, description: "first one", completed: true },
  { id: 2, description: "second one", completed: false },
  { id: 3, description: "third one", completed: true },
];

export const GET: APIRoute = async (context) => {
  // todo: print out the cookie from FE
  // todo: crud the todos
  // todo: validate the access token

  const ac = context.cookies.get("access_token")?.value;
  console.log(ac);
  // context.cookies.set("access_token", {
  //   // Match the original cookie settings
  //   path: "/",
  //   secure: true,
  //   sameSite: "strict",
  // });

  console.log("hallo");
  return new Response(JSON.stringify({ todos }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
