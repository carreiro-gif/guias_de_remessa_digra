import React, { useEffect, useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("App carregado com sucesso");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">App funcionando ✅</h1>

        <p className="mb-4">Contador: {count}</p>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setCount(count + 1)}
        >
          Incrementar
        </button>
      </div>
    </div>
  );
}
