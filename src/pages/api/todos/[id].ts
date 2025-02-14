import type { APIRoute } from "astro";

export const prerender = false;

/**
 *
 * @description Store a new todo in the database
 * @param request
 * @returns Response
 */
export const POST: APIRoute = async ({ params, request }) => {
  //
  console.log("POSTING TODO");
  let data;
  let task;
  try {
    data = await request.formData(); // * Blog
    task = data.get("task");
    console.log("post: ", task);
  } catch (error) {
    console.log(error);
  }

  return new Response(data, { status: 200 });
};

/**
 *
 * @description Delete a todo from the database
 * @param request
 * @returns Response
 */
export const DELETE: APIRoute = ({ params }) => {
  console.log("DELETING TODO");
  return new Response(null, { status: 200 });
};

/**
 *
 * @description Updates a todo in the database
 */
export const PATCH: APIRoute = async ({ params, request }) => {
  console.log("UPDATING TODO");
  let data;
  try {
    data = await request.formData(); // * Blog
  } catch (error) {
    console.log(error);
  }

  return new Response(null, { status: 200 });
};
