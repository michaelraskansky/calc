import { useState } from "react";

function App() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return a / b;
      default:
        return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleSquareRoot = () => {
    const currentValue = parseFloat(display);
    if (currentValue < 0) {
      setDisplay("Error");
    } else {
      const result = Math.sqrt(currentValue);
      setDisplay(String(result));
      setNewNumber(true);
    }
  };

  return (
    <main style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Calculator</h1>
      <div style={{
        padding: "10px",
        backgroundColor: "#f0f0f0",
        marginBottom: "10px",
        textAlign: "right",
        fontSize: "24px",
        borderRadius: "5px"
      }}>
        {display}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5px" }}>
        <button onClick={() => handleNumber("7")}>7</button>
        <button onClick={() => handleNumber("8")}>8</button>
        <button onClick={() => handleNumber("9")}>9</button>
        <button onClick={() => handleOperation("/")}>/</button>

        <button onClick={() => handleNumber("4")}>4</button>
        <button onClick={() => handleNumber("5")}>5</button>
        <button onClick={() => handleNumber("6")}>6</button>
        <button onClick={() => handleOperation("*")}>*</button>

        <button onClick={() => handleNumber("1")}>1</button>
        <button onClick={() => handleNumber("2")}>2</button>
        <button onClick={() => handleNumber("3")}>3</button>
        <button onClick={() => handleOperation("-")}>-</button>

        <button onClick={() => handleNumber("0")}>0</button>
        <button onClick={() => handleNumber(".")}>.</button>
        <button onClick={handleEquals}>=</button>
        <button onClick={() => handleOperation("+")}>+</button>

        <button onClick={handleClear} style={{ gridColumn: "span 2" }}>C</button>
        <button onClick={handleSquareRoot} style={{ gridColumn: "span 2" }}>√</button>
      </div>
    </main>
  );
}

export default App;
