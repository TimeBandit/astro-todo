import {
  createTodo,
  type DeleteTodoParams,
  type GetAllMyTodoParams,
  type StoreTodoParams,
  type UpdateTodoParams,
} from "@/domain";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const storeTodo = async (
  todo: StoreTodoParams,
  client: DynamoDBDocumentClient
) => {
  const newTodo = createTodo(todo);

  const command = new PutCommand({
    TableName: "Todos",
    Item: newTodo,
  });

  const response = await client.send(command);
  return response;
};

const deleteTodo = async (
  arg: DeleteTodoParams,
  client: DynamoDBDocumentClient
) => {
  const command = new DeleteCommand({
    TableName: "Todos",
    Key: {
      userId: arg.userId,
      todoId: arg.todoId,
    },
  });

  const response = await client.send(command);
  return response;
};

const updateTodoDone = async (
  arg: UpdateTodoParams,
  client: DynamoDBDocumentClient
) => {
  const command = new UpdateCommand({
    TableName: "Todos",
    Key: { userId: arg.userId, todoId: arg.todoId },
    UpdateExpression: "SET done = :done",
    ExpressionAttributeValues: {
      ":done": arg.done,
    },
    ReturnValues: "ALL_NEW",
  });

  const response = await client.send(command);
  return response;
};

const getAllMyTodos = async (
  arg: GetAllMyTodoParams,
  client: DynamoDBDocumentClient
) => {
  const command = new QueryCommand({
    TableName: "Todos",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": arg.userId,
    },
  });

  const response = await client.send(command);
  return response;
};

export { deleteTodo, getAllMyTodos, storeTodo, updateTodoDone };
