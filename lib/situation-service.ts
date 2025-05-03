export async function post_situation_answer(situation_id: number, answer_id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.38.220:8000/api";
  const url = `${baseUrl}/situation/${situation_id}/answer/`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ choice: answer_id }),
  });
  if (!res.ok) {
    throw new Error(`Failed to post answer: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function post_finance_answer(session_id: string, answer: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.38.220:8000/api";
  const url = `${baseUrl}/game/${session_id}/coin/BitCoin/finance_question/`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answer }),
  });
  if (!res.ok) {
    throw new Error(`Failed to post finance answer: ${res.status} ${res.statusText}`);
  }
  return res.json();
}    