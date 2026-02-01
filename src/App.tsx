import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function toggleDone(id: string, isDone: boolean) {
    client.models.Todo.update({ id, isDone: !isDone });
  }

  function archiveTodo(id: string) {
    client.models.Todo.update({ id, isArchived: true });
  }

  const activeTodos = todos.filter((todo) => !todo.isArchived);
  const archivedTodos = todos.filter((todo) => todo.isArchived);

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {activeTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.isDone || false}
              onChange={() => toggleDone(todo.id, todo.isDone || false)}
            />
            <span style={{ textDecoration: todo.isDone ? "line-through" : "none" }}>
              {todo.content}
            </span>
            {todo.isDone && (
              <button onClick={() => archiveTodo(todo.id)}>Archive</button>
            )}
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => setShowArchived(!showArchived)}>
          {showArchived ? "Hide" : "Show"} Archived ({archivedTodos.length})
        </button>
        {showArchived && (
          <ul>
            {archivedTodos.map((todo) => (
              <li key={todo.id} style={{ opacity: 0.6 }}>
                {todo.content}
              </li>
            ))}
          </ul>
        )}
      </div>
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
