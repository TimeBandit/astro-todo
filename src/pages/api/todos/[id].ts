import type { APIRoute } from "astro";
import { v4 as uuidv4 } from "uuid";

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
  try {
    const data = await request.formData(); // * Blog
    const todoId = uuidv4();
    const task = data.get("task");

    return new Response(JSON.stringify({ id: todoId, done: false, task }), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, { status: 400 });
  }
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
