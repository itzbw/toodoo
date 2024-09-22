export default function Todo(props) {
  const { todo, setTodo } = props;

  const updateTodo = async (todoId, todoStatus) => {
    const res = await fetch(`/api/todo/${todoId}`, {
      method: "PUT",
      body: JSON.stringify({ status: todoStatus }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // handlr the toggle box
    const responseData = await res.json();
    if (responseData.acknowledged) {
      setTodo((currentTodo) => {
        return currentTodo.map((currentTodo) => {
          if (currentTodo._id === todoId) {
            return { ...currentTodo, status: !currentTodo.status }; //  it returns a new object with all the current todo's properties, but with the status toggled
          }
          return currentTodo;
        });
      });
    }
  };

  const deleteTodo = async (todoId) => {
    const res = await fetch(`/api/todo/${todoId}`, {
      method: "DELETE",
    });
    const responseDate = await res.json();
    if (responseDate.acknowledged) {
      setTodo((currentTodo) => {
        return currentTodo.filter((currentTodo) => currentTodo._id !== todoId);
      });
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
