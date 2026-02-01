import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content"), isDone: false });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  function toggleTodo(id: string, isDone: boolean | null | undefined) {
    client.models.Todo.update({ id, isDone: !isDone });
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.isDone;
    if (filter === "completed") return todo.isDone;
    return true;
  });

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <div>
        <button onClick={() => setFilter("all")} disabled={filter === "all"}>All</button>
        <button onClick={() => setFilter("active")} disabled={filter === "active"}>Active</button>
        <button onClick={() => setFilter("completed")} disabled={filter === "completed"}>Completed</button>
      </div>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.isDone || false}
              onChange={() => toggleTodo(todo.id, todo.isDone)}
            />
            <span style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
              {todo.content}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
