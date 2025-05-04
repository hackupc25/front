export type Coin = {
  coin_name: string;
  current_value: number;
  value_history: { timestamp: string; value: number }[];
  image?: string;
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
  if (coinName === "") {
    return {
      id: 0,
      coin_name: "",
      situation: "",
      category: "",
      choices: [],
    };
  }
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

export async function create_game(players: { player_name: string; coin_name: string }[]) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.185.91:8000/api";
  const url = `${baseUrl}/game`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ players }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create game: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export type UserInfo = {
  name: string;
  coin_name: string;
  session_id: string;
};

export async function fetch_user_info(userName: string): Promise<UserInfo> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.185.91:8000/api";
  const url = `${baseUrl}/user/${userName}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch user info: ${res.status} ${res.statusText}`);
  }
  return res.json();
} 