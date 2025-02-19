import { v4 as uuidv4 } from "uuid";

type Todo = {
  id: string;
  title: string;
  description: string;
  done: boolean;
  createdAt: string;
};

const createTodo = (todo: { title?: string; description: string }): Todo => {
  return Object.freeze({
    id: uuidv4(),
    title: todo.title || "",
    description: todo.description,
    done: false,
    createdAt: new Date().toISOString(),
  });
};

export { createTodo };
export type { Todo };
