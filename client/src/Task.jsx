export default function Todo({ todo, setTodos }) {
  const updateTodo = async (todoId, todoStatus) => {
    try {
      const res = await fetch(`/api/todo/${todoId}`, {
        method: "PUT",
        body: JSON.stringify({ status: !todoStatus }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await res.json();
      if (responseData.acknowledged) {
        setTodos((currentTodos) =>
          currentTodos.map((currentTodo) =>
            currentTodo._id === todoId
              ? { ...currentTodo, status: !currentTodo.status }
              : currentTodo
          )
        );
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const res = await fetch(`/api/todo/${todoId}`, {
        method: "DELETE",
      });
      const responseData = await res.json();
      if (responseData.acknowledged) {
        setTodos((currentTodos) =>
          currentTodos.filter((currentTodo) => currentTodo._id !== todoId)
        );
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <div className="todo">
      <p>{todo.todo}</p>
      <div className="toggle">
        <button
          className="todo__status"
          onClick={() => updateTodo(todo._id, todo.status)}
        >
          {todo.status ? "☑" : "☐"}
        </button>
        <button className="todo__delete" onClick={() => deleteTodo(todo._id)}>
          🗑️
        </button>
      </div>
    </div>
  );
}
