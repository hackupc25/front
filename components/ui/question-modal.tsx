import React, { useState, useEffect } from "react";

// Mock de pregunta y respuestas
const mockQuestion = {
  question: "¿Qué harías si el mercado cae un 10% en un día?",
  answers: [
    "Vendería todas mis monedas",
    "Mantendría mi posición",
    "Compraría más",
    "Esperaría y observaría"
  ]
};

export function QuestionModal({
  open,
  onClose,
  onConfirm,
  question,
  answers,
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (answer: string) => void;
  question?: string;
  answers?: string[];
  loading?: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [open, question]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background rounded-xl shadow-xl p-8 w-full max-w-2xl relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-2xl text-muted-foreground hover:text-foreground"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-6 text-center">
          {loading ? "Cargando..." : question}
        </h2>
        <div className="flex flex-col gap-3 mb-6">
          {!loading && answers && answers.map((ans, idx) => (
            <button
              key={ans}
              className={`w-full py-3 rounded-lg border text-base font-medium transition
                ${selected === idx ? "bg-blue-700 text-blue-100 border-blue-700" : "bg-muted text-foreground border-border hover:bg-primary/10"}`}
              onClick={() => setSelected(idx)}
            >
              {ans}
            </button>
          ))}
        </div>
        <button
          className="w-full py-3 rounded-lg bg-emerald-700 text-emerald-100 font-semibold text-base transition disabled:opacity-50"
          disabled={selected === null || loading}
          onClick={() => selected !== null && answers && onConfirm(answers[selected])}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
} 