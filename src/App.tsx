import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [priorityFilter, setPriorityFilter] = useState<string>("All");

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    const priority = window.prompt("Priority (Low/Medium/High)", "Medium") as "Low" | "Medium" | "High";
    if (content && priority) {
      client.models.Todo.create({ content, priority });
    }
  }

  const filteredTodos = priorityFilter === "All"
    ? todos
    : todos.filter(todo => todo.priority === priorityFilter);

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <div>
        <label htmlFor="priority-filter">Filter by priority: </label>
        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            [{todo.priority}] {todo.content}
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
