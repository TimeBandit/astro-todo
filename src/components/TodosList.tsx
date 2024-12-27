import type { FormEvent } from "react";
import { useState } from "react";

export const TodosList: React.FC = () => {
  const [list, setList] = useState<string[]>(["1", "2"]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const response = await fetch("/api/todos", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setList((prev) => [...prev, data.todo.toString()]);
  }

  return (
    <>
      <ul>
        {list.map((listItem, idx) => (
          <li key={idx}>{listItem}</li>
        ))}
      </ul>
      <form onSubmit={submit}>
        <label htmlFor="todo">
          Todo
          <input type="text" name="todo" required />
        </label>
        <button className="">Add</button>
      </form>
    </>
  );
};
