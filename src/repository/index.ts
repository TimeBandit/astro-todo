import { createTodo, type Todo } from "@/domain";
import { dynamoClient } from "@/repository/dynamoClient";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const docClient = DynamoDBDocumentClient.from(dynamoClient);

type TodoParams = Pick<Todo, "title" | "description" | "id" | "done">;

const storeTodo = async (todo: TodoParams) => {
  const newTodo = createTodo(todo);

  const command = new PutCommand({
    TableName: "Todos",
    Item: newTodo,
  });

  const response = await docClient.send(command);
  return response;
};

const deleteTodo = async (id: string) => {
  const command = new DeleteCommand({
    TableName: "Todos",
    Key: {
      id,
    },
  });

  const response = await docClient.send(command);
  return response;
};

const updateTodo = async (userId: string, todo: TodoParams) => {
  const { id: todoId, done } = todo;

  const command = new UpdateCommand({
    TableName: "Todos",
    Key: { userId, todoId },
    UpdateExpression: "SET done = :done",
    ExpressionAttributeValues: {
      ":done": done,
    },
    ReturnValues: "ALL_NEW",
  });

  const response = await docClient.send(command);
  return response;
};

const getAllMyTodos = async (userId: string) => {
  const command = new QueryCommand({
    TableName: "Todos",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  });

  const response = await docClient.send(command);
  return response;
};
