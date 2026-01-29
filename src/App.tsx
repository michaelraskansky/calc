import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

const CATEGORIES = ["work", "personal"];

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (!content) return;

    const category = window.prompt(`Category (${CATEGORIES.join(", ")}):`, CATEGORIES[0]);
    if (!category) return;

    client.models.Todo.create({ content, category });
  }

  function getTodosByCategory(category: string) {
    return todos.filter((todo) => todo.category === category);
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      {CATEGORIES.map((category) => (
        <div key={category}>
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          <ul>
            {getTodosByCategory(category).map((todo) => (
              <li key={todo.id}>{todo.content}</li>
            ))}
          </ul>
        </div>
      ))}
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
