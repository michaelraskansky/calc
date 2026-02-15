import { useState } from "react";

function App() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const multiply = () => {
    const product = Number(num1) * Number(num2);
    setResult(product);
  };

  return (
    <main>
      <h1>Calculator</h1>
      <div>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="Enter first number"
        />
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Enter second number"
        />
        <button onClick={multiply}>Multiply</button>
      </div>
      {result !== null && <div>Result: {result}</div>}
    </main>
  );
}

export default App;
