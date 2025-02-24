import { v4 as uuidv4 } from "uuid";

type Todo = {
  userId: string; // key
  todoId: string; // hash
  task: string;
  title: string;
  done: boolean;
  createdAt: string;
};

type StoreTodoParams = Pick<Todo, "title" | "task" | "userId">;
type DeleteTodoParams = Pick<Todo, "todoId" | "userId">;
type UpdateTodoParams = Pick<Todo, "todoId" | "userId" | "done">;
type GetAllMyTodoParams = Pick<Todo, "userId">;

type TodoFactoryParams = Pick<Todo, "userId" | "task" | "title">;

const createTodo = (todo: TodoFactoryParams): Todo => {
  return Object.freeze({
    userId: todo.userId,
    todoId: uuidv4(),
    task: todo.task,
    title: todo.title || "",
    done: false,
    createdAt: new Date().toISOString(),
  });
};

export { createTodo };
export type {
  DeleteTodoParams,
  GetAllMyTodoParams,
  StoreTodoParams,
  Todo,
  UpdateTodoParams,
};
