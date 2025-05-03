export type Coin = {
  coin_name: string;
  current_value: number;
  value_history: { timestamp: string; value: number }[];
};

export type GameSessionData = {
  session_id: string;
  created_at: string;
  updated_at: string;
  coins: Coin[];
};

export async function fetch_coins_data(session: string): Promise<GameSessionData> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.38.220:8000/api";

  const url = `${baseUrl}/game/${session}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch coins data: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export type SituationChoice = {
  id: string;
  text: string;
  consequence: string;
};

export type CoinSituation = {
  id: number;
  coin_name: string;
  situation: string;
  category: string;
  choices: SituationChoice[];
};

export async function fetch_coin_situation(sessionId: string, coinName: string): Promise<CoinSituation> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.38.220:8000/api";
  const url = `${baseUrl}/game/${sessionId}/coin/${coinName}/situation`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch coin situation: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export type FinanceQuestionApi = {
  question: string;
  answers: Record<"A"|"B"|"C"|"D", string>;
};

export type FinanceQuestion = {
  question: string;
  options: string[];
};

export async function fetch_finance_question(sessionId: string, coinName: string): Promise<FinanceQuestion> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.38.220:8000/api";
  const url = `${baseUrl}/game/${sessionId}/coin/${coinName}/finance_question`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch finance question: ${res.status} ${res.statusText}`);
  }
  const data: FinanceQuestionApi = await res.json();
  return {
    question: data.question,
    options: [data.answers.A, data.answers.B, data.answers.C, data.answers.D],
  };
} 