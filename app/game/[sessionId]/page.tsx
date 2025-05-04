"use client";
import { useState } from "react";
import { CryptoChart } from "../../../components/ui/crypto-chart";
import { QuestionModal } from "../../../components/ui/question-modal";
import { fetch_coin_situation, CoinSituation, fetch_finance_question, fetch_coins_data } from "../../../lib/game-service";
import { post_situation_answer, post_finance_answer } from "../../../lib/situation-service";
import { useParams } from "next/navigation";
import { useActiveUser } from "@/lib/active-user-context";


export default function Home() {
  const [modalOpen, setModalOpen] = useState<null | "decision" | "learning">(null);
  const [modalQuestion, setModalQuestion] = useState<{
    question: string;
    answers: string[];
    situationId?: number;
    answerIds?: string[];
  } | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<null | { correct: string; explanation: string }> (null);

  const sessionId = useParams().sessionId as string;

  const { activeUser } = useActiveUser();

  const handleOpen = async (type: "decision" | "learning") => {
    setModalOpen(type);
    setLoadingModal(true);
    if (type === "decision") {
      try {
        const situation: CoinSituation = await fetch_coin_situation(sessionId, activeUser?.coinName ?? "");
        setModalQuestion({
          question: situation.situation,
          answers: situation.choices.map(c => c.text),
          situationId: situation.id,
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
        const finance = await fetch_finance_question(sessionId, activeUser?.coinName ?? "");
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
    setModalFeedback(null);
  };

  const handleConfirm = async (answer: string) => {
    if (modalOpen === "decision" && modalQuestion?.situationId && modalQuestion?.answerIds) {
      const idx = modalQuestion.answers.findIndex(a => a === answer);
      const answerId = modalQuestion.answerIds[idx];
      try {
        const res = await post_situation_answer(modalQuestion.situationId, answerId);
        console.log("Res", res);
        setModalFeedback({
          explanation: res.consequence,
        });
      } catch (e) {
        // Podrías manejar el error aquí si lo deseas
      }
    } else if (modalOpen === "learning" && modalQuestion?.answers) {
      const idx = modalQuestion.answers.findIndex(a => a === answer);
      const answerLetter = ["A", "B", "C", "D"][idx];
      try {
        const res = await post_finance_answer(sessionId, activeUser?.coinName ?? "", answerLetter);
        setModalFeedback({
          correct: res.correct_answer,
          explanation: res.explanation,
        });
      } catch (e) {
        setModalFeedback({
          correct: "",
          explanation: "No se pudo obtener la explicación.",
        });
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-background dark:bg-[#101014] pb-12">
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-6xl flex flex-col gap-2 mt-12 items-center justify-center">
          {/* Gráfica */}
          <div className="w-full">
            <CryptoChart session_id={sessionId}/>
          </div>
          {/* Botones debajo de la gráfica */}
          <div className="w-full max-w-md flex flex-row gap-3 mt-4">
            <button className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-semibold text-base transition" onClick={() => handleOpen("decision")}>Daily Decision</button>
            <button className="flex-1 py-3 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-semibold text-base transition" onClick={() => handleOpen("learning")}>Daily Learning</button>
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
        feedback={modalFeedback}
      />
    </main>
  );
} 