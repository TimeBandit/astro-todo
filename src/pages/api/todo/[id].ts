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
  let data;
  try {
    data = await request.formData(); // * Blog
  } catch (error) {
    console.log(error);
  }

  return new Response(null, { status: 200 });
};

/**
 *
 * @description Delete a todo from the database
 * @param request
 * @returns Response
 */
export const DELETE: APIRoute = ({ params }) => {
  return new Response(null, { status: 200 });
};

/**
 *
 * @description Updates a todo in the database
 */
export const PATCH: APIRoute = async ({ params, request }) => {
  let data;
  try {
    data = await request.formData(); // * Blog
  } catch (error) {
    console.log(error);
  }

  return new Response(null, { status: 200 });
};
