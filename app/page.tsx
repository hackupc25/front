"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { create_game, fetch_user_info } from "../lib/game-service";
import { useActiveUser } from "../lib/active-user-context";

export default function MainPage() {
  const [playerName, setPlayerName] = useState("");
  const [coinName, setCoinName] = useState("");
  const [coinVision, setCoinVision] = useState("");
  const [players, setPlayers] = useState<{ name: string; coin: string; vision: string }[]>([]);
  const [joinName, setJoinName] = useState("");
  const router = useRouter();
  const { activeUser, setActiveUser } = useActiveUser();

  const handleAdd = () => {
    if (playerName.trim() && coinName.trim() && coinVision.trim()) {
      setPlayers([...players, { name: playerName.trim(), coin: coinName.trim(), vision: coinVision.trim() }]);
      setPlayerName("");
      setCoinName("");
      setCoinVision("");
    }
  };

  const handleJoin = async () => {
    try {
      const user = await fetch_user_info(joinName.trim());
      console.log(user);
      setActiveUser({
        sessionId: user.session_id,
        userName: user.name,
        coinName: user.coin_name,
      });
      router.push(`/game/${user.session_id}`);
    } catch (e) {
      alert("Error joining game");
    }
    setJoinName("");
  };

  const handleStartGame = async () => {
    try {
      const response = await create_game(players.map(p => ({ 
        player_name: p.name, 
        coin_name: p.coin,
        coin_description: p.vision
      })));
      const sessionId = response.session_id;
      if (players.length > 0) {
        setActiveUser({
          sessionId,
          userName: players[0].name,
          coinName: players[0].coin,
        });
      }
      router.push(`/game/${sessionId}`);
    } catch (e) {
      alert("Error creating game");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-[#101014] px-4">
      <h1 className="text-6xl md:text-8xl font-extrabold text-center text-primary drop-shadow-lg mb-12">
        Coinpetition
      </h1>
      <div className="flex flex-col items-center w-full max-w-md gap-4">
        <div className="flex w-full gap-2">
          <div className="flex flex-col w-full gap-2">
            <div className="flex w-full gap-2">
              <input
                type="text"
                placeholder="Player name"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Coin name"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={coinName}
                onChange={e => setCoinName(e.target.value)}
              />
            </div>
            <input
              type="text"
              placeholder="Coin vision"
              className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={coinVision}
              onChange={e => setCoinVision(e.target.value)}
            />
            <button
              className={`w-full px-6 py-2 rounded-lg font-semibold text-base transition disabled:opacity-50 ${playerName.trim() && coinName.trim() && coinVision.trim() ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}
              onClick={handleAdd}
              disabled={!playerName.trim() || !coinName.trim() || !coinVision.trim()}
            >
              Add
            </button>
          </div>
        </div>
        {players.length === 0 && (
          <div className="w-full flex flex-col items-center gap-2 mt-6">
            <span className="text-lg text-muted-foreground font-medium">Trying to join a game?</span>
            <div className="w-full flex flex-col items-center gap-2">
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={joinName}
                onChange={e => setJoinName(e.target.value)}
              />
              <button
                className={`w-full px-6 py-2 rounded-lg font-semibold text-base transition ${joinName.trim() ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}
                onClick={handleJoin}
                disabled={!joinName.trim()}
              >
                Join
              </button>
            </div>
          </div>
        )}
        <div className="w-full mt-8">
          {players.length > 0 && (
            <ul className="flex flex-col gap-2">
              {players.map((p, idx) => (
                <li key={idx} className="flex justify-between items-center px-4 py-2 rounded-lg bg-muted text-foreground border border-border">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-primary font-mono">{p.coin}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="mt-8 w-full py-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-bold shadow-lg transition disabled:opacity-50"
          disabled={players.length === 0}
          onClick={handleStartGame}
        >
          Start Game
        </button>
      </div>
    </main>
  );
} 