import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function exportTodos() {
    const format = window.prompt("Export format? (json, csv, txt)", "json");
    if (!format) return;

    let content = "";
    let mimeType = "";
    let filename = "";

    switch (format.toLowerCase()) {
      case "json":
        content = JSON.stringify(todos, null, 2);
        mimeType = "application/json";
        filename = "todos.json";
        break;
      case "csv":
        content = "ID,Content\n" + todos.map(todo => `${todo.id},"${todo.content}"`).join("\n");
        mimeType = "text/csv";
        filename = "todos.csv";
        break;
      case "txt":
        content = todos.map(todo => todo.content).join("\n");
        mimeType = "text/plain";
        filename = "todos.txt";
        break;
      default:
        alert("Invalid format. Please use json, csv, or txt");
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <button onClick={exportTodos}>Export</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
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
