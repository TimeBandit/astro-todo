import { createTodo, type Todo } from "@/domain";
import { getAllMyTodos, storeTodo } from "@/repository";
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
  console.log(`new todo after it's generated`, newTodo);
  try {
    const r = await storeTodo(newTodo, docClient);
    console.log("todo to be returned ", newTodo, r);
    return new Response(JSON.stringify(newTodo), {
      status: r.$metadata.httpStatusCode,
    });
  } catch (error) {
    return new Response(null, {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const GET: APIRoute = async ({ locals }) => {
  console.log("GETTING TODOS");

  const { userId, idToken } = locals;
  const docClient = getDocClient(idToken);
  const todos: Todo[] = [];

  try {
    const r = await getAllMyTodos({ userId }, docClient);
    console.log("todos to be returned ", r);
    const items = r.Items as Todo[];
    if (items)
      todos.push(...items, {
        todoId: "123",
        task: "test",
        title: "",
        done: "false",
        userId: "123",
        created: "",
      });
    console.log("todos to be returned ", todos);
    return new Response(JSON.stringify({ todos }), {
      status: r.$metadata.httpStatusCode,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(null, { status: 400 });
  }
};
