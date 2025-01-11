import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get("todo");

  // Validate the data - you'll probably want to do more than this
  if (!name) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 }
    );
  }
  // Do something with the data, then return a success response
  return new Response(
    JSON.stringify({
      todo: "wash your face",
    }),
    { status: 200 }
  );
};
