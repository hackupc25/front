"use client";
import { useState } from "react";
import { CryptoChart } from "../components/ui/crypto-chart";
import { PortfolioSummary } from "../components/ui/portfolio-summary";
import { QuestionModal } from "../components/ui/question-modal";
import { fetch_coin_situation, CoinSituation, fetch_finance_question } from "../lib/game-service";
import { post_situation_answer, post_finance_answer } from "../lib/situation-service";
import { SESSION_ID } from "../lib/costants";


export default function Home() {
  const [modalOpen, setModalOpen] = useState<null | "decision" | "learning">(null);
  const [modalQuestion, setModalQuestion] = useState<{
    question: string;
    answers: string[];
    situationId?: number;
    answerIds?: string[];
  } | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);

  // Simula obtener la primera moneda (en real, deberías obtenerla del backend o del estado global)
  const firstCoin = "BitCoin";

  const handleOpen = async (type: "decision" | "learning") => {
    setModalOpen(type);
    setLoadingModal(true);
    if (type === "decision") {
      try {
        const situation: CoinSituation = await fetch_coin_situation(SESSION_ID, firstCoin);
        setModalQuestion({
          question: situation.situation,
          answers: situation.choices.map(c => c.text),
          situationId: situation.situation_id,
          answerIds: situation.choices.map(c => c.id),
        });
      } catch (e) {
        setModalQuestion({
          question: "No se pudo cargar la situación.",
          answers: ["Cerrar"],
        });
      }
    } else {
      try {
        const finance = await fetch_finance_question(SESSION_ID);
        setModalQuestion({
          question: finance.question,
          answers: finance.options,
        });
      } catch (e) {
        setModalQuestion({
          question: "No se pudo cargar la pregunta.",
          answers: ["Cerrar"],
        });
      }
    }
    setLoadingModal(false);
  };

  const handleClose = () => {
    setModalOpen(null);
    setModalQuestion(null);
  };

  const handleConfirm = async (answer: string) => {
    if (modalOpen === "decision" && modalQuestion?.situationId && modalQuestion?.answerIds) {
      const idx = modalQuestion.answers.findIndex(a => a === answer);
      const answerId = modalQuestion.answerIds[idx];
      try {
        await post_situation_answer(modalQuestion.situationId, answerId);
      } catch (e) {
        // Podrías manejar el error aquí si lo deseas
      }
    }
    if (modalOpen === "learning" && modalQuestion?.answers) {
      const idx = modalQuestion.answers.findIndex(a => a === answer);
      const answerLetter = ["a", "b", "c", "d"][idx];
      try {
        await post_finance_answer(SESSION_ID, answerLetter);
      } catch (e) {
        // Podrías manejar el error aquí si lo deseas
      }
    }
    setModalOpen(null);
    setModalQuestion(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-background dark:bg-[#101014] pb-12">
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-2 mt-12 items-center md:items-start justify-center">
          {/* Columna izquierda: Summary */}
          <div className="flex-1 flex flex-col min-h-[500px] min-w-[280px] max-w-sm justify-between h-full">
            <PortfolioSummary />
            <div className="flex flex-row gap-3 mt-2 w-full">
              <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-semibold text-base transition" onClick={() => handleOpen("decision")}>Daily Decision</button>
              <button className="flex-1 py-3 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-semibold text-base transition" onClick={() => handleOpen("learning")}>Daily Learning</button>
            </div>
          </div>
          {/* Columna derecha: Gráfica */}
          <div className="flex-[2] min-w-0">
            <CryptoChart />
          </div>
        </div>
      </div>
      <QuestionModal
        open={modalOpen !== null}
        onClose={handleClose}
        onConfirm={handleConfirm}
        question={modalQuestion?.question}
        answers={modalQuestion?.answers}
        loading={loadingModal}
      />
    </main>
  );
} 