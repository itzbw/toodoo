import { useEffect, useState } from "react";
import Todo from "./Task";

export default function App() {
  const [todo, setTodo] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function getTodo() {
      const res = await fetch("/api/todo");
      const todo = await res.json();

      setTodo(todo);
    }
    getTodo();
  }, []);

  const createNewTask = async (e) => {
    e.preventDefault(); // Prevent refresh on form submission
    if (content.length > 3) {
      const res = await fetch("/api/todo", {
        method: "POST",
        body: JSON.stringify({ todo: content }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTask = await res.json();
      setContent("");
      setTodo([...todo, newTask]); // add new taks into current
    }
  };

  return (
    <main className="container">
      <h1 className="title">too.doo</h1>
      <form className="form" onSubmit={createNewTask}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new task"
          className="form__input"
          required
        />
        <button className="submitButton" type="submit">
          Create
        </button>
      </form>

      {/* {todo.length > 0 && <pre>{JSON.stringify(todo, null, 2)}</pre>} */}
      <div className="todos">
        {todo.length > 0 &&
          todo.map((todo) => (
            <Todo key={todo._id} todo={todo} setTodo={setTodo} />
          ))}
      </div>
    </main>
  );
}
