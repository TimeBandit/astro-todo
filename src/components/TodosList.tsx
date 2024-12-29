import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";

export const TodosList: React.FC = () => {
  const [list, setList] = useState<string[]>(["1", "2"]);
  const [input, setInput] = useState<string>("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const response = await fetch("/api/todos", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setInput("")
    setList((prev) => [...prev, data.todo.toString()]);
  }

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <ul>
          {list.map((listItem, idx) => (
            <li key={idx}>{listItem}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <form onSubmit={submit}>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              name="todo"
              placeholder="Enter a new task"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
            <Button type="submit">Add</Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
};
