import { createTodo } from "@/domain";
import { storeTodo } from "@/repository";
import { getDocClient } from "@/repository/dynamoClient";
import type { APIRoute } from "astro";

export const prerender = false;

/**
 *
 * @description Store a new todo in the database
 * @param request
 * @returns Response
 */
export const POST: APIRoute = async ({ params, request, locals }) => {
  console.log("POSTING TODO");
  const { userId, idToken } = locals;
  const docClient = getDocClient(idToken);

  const data = await request.formData(); // * Blog
  const task = data.get("task") || "";
  const newTodo = createTodo({ userId, task: task.toString() });

  try {
    const r = await storeTodo(newTodo, docClient);

    return new Response(JSON.stringify(newTodo), {
      status: r.$metadata.httpStatusCode,
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
