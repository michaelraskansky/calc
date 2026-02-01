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
    client.models.Todo.create({
      content: window.prompt("Todo content"),
      isDone: false
    });
  }

  function toggleTodo(id: string, isDone: boolean | null | undefined) {
    client.models.Todo.update({ id, isDone: !isDone });
  }

  const completedCount = todos.filter(todo => todo.isDone).length;
  const totalCount = todos.length;

  return (
    <main>
      <h1>My todos</h1>
      <div style={{
        display: 'inline-block',
        padding: '4px 12px',
        backgroundColor: completedCount === totalCount && totalCount > 0 ? '#4caf50' : '#2196f3',
        color: 'white',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '10px'
      }}>
        {completedCount}/{totalCount} completed
      </div>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id, todo.isDone)}
            style={{
              cursor: 'pointer',
              textDecoration: todo.isDone ? 'line-through' : 'none'
            }}
          >
            {todo.isDone ? '✓' : '○'} {todo.content}
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
