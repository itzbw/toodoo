import { useEffect, useState, useCallback } from "react";
import Todo from "./Task";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch("/api/todo");
      const fetchedTodos = await res.json();
      setTodos(fetchedTodos);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createNewTask = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      try {
        const res = await fetch("/api/todo", {
          method: "POST",
          body: JSON.stringify({ todo: content }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const newTask = await res.json();
        setContent("");
        setTodos((prevTodos) => [...prevTodos, newTask]);
      } catch (error) {
        console.error("Failed to create new task:", error);
      }
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
          minLength={4}
        />
        <button className="submitButton" type="submit">
          Create
        </button>
      </form>

      <div className="todos">
        {todos.map((todo) => (
          <Todo key={todo._id} todo={todo} setTodos={setTodos} />
        ))}
      </div>
    </main>
  );
}
