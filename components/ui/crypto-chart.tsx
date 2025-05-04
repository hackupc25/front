"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "./card";
import { fetch_coins_data, Coin } from "../../lib/game-service";
import Image from "next/image";

const COLORS = ["#60a5fa", "#e63946", "#457b9d", "#f4a261", "#43aa8b", "#f3722c", "#b5179e", "#277da1"];

const ranges = ["1D", "1S", "1M", "1A", "MAX"];

function filterHistoryByRange(history: { timestamp: string; value: number }[], range: string) {
  if (!history.length) return [];
  const now = new Date();
  let from: Date;
  switch (range) {
    case "1D":
      from = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      break;
    case "1S":
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "1M":
      from = new Date(now);
      from.setMonth(now.getMonth() - 1);
      break;
    case "1A":
      from = new Date(now);
      from.setFullYear(now.getFullYear() - 1);
      break;
    default:
      from = new Date(0);
  }
  return history.filter(h => new Date(h.timestamp) >= from);
}

export function CryptoChart(props: {session_id: string}) {
  const [range, setRange] = useState("1M");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, { value: number; change: number }>>({});
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  useEffect(() => {
    setLoading(true);

    const fetchData = () => {
      fetch_coins_data(props.session_id).then((data) => {
        setCoins(data.coins);
        setLoading(false);
      });
    };

    fetchData(); // Llamada inicial
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [props.session_id]);

  useEffect(() => {
    if (!coins.length) return;
    // Para cada moneda, obtener su histórico filtrado
    const allDatesSet = new Set<string>();
    const coinHistories: Record<string, { timestamp: string; value: number }[]> = {};
    coins.forEach((coin) => {
      const filtered = filterHistoryByRange(coin.value_history, range).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      coinHistories[coin.coin_name] = filtered;
      filtered.forEach(h => allDatesSet.add(h.timestamp));
    });
    // Fechas ordenadas
    const sortedDates = Array.from(allDatesSet).sort();
    // Construir los datos para el gráfico
    const data = sortedDates.map(date => {
      const entry: Record<string, any> = { time: new Date(date).toLocaleDateString() };
      coins.forEach(coin => {
        // Buscar el valor más reciente antes o igual a la fecha
        const history = coinHistories[coin.coin_name];
        const prev = [...history].reverse().find(h => h.timestamp <= date);
        entry[coin.coin_name] = prev?.value ?? null;
      });
      return entry;
    });
    setChartData(data);
    // Calcular stats
    const newStats: Record<string, { value: number; change: number }> = {};
    coins.forEach((coin) => {
      const history = coinHistories[coin.coin_name];
      const first = history.length ? history[0].value : 0;
      const last = history.length ? history[history.length - 1].value : 0;
      const change = first ? ((last - first) / first) * 100 : 0;
      newStats[coin.coin_name] = { value: last, change };
    });
    setStats(newStats);
    
    // Update selected coin if it exists
    if (selectedCoin) {
      const updatedCoin = coins.find(c => c.coin_name === selectedCoin.coin_name);
      if (updatedCoin) {
        setSelectedCoin(updatedCoin);
      }
    }
  }, [coins, range, selectedCoin]);

  // Sort coins by value for leaderboard
  const sortedCoins = [...coins].sort((a, b) => {
    const valueA = stats[a.coin_name]?.value || 0;
    const valueB = stats[b.coin_name]?.value || 0;
    return valueB - valueA; // Sort in descending order
  });
  
  const handleCoinClick = (coin: Coin) => {
    if (selectedCoin && selectedCoin.coin_name === coin.coin_name) {
      setSelectedCoin(null); // Deselect if already selected
    } else {
      setSelectedCoin(coin); // Select the coin
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-primary drop-shadow-md">
          Coinpetition
        </h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-5xl mx-auto">
        {/* Leaderboard Section */}
        <Card className="w-full md:w-1/3 bg-slate-900 text-white">
          <CardContent className="p-4">
            <h3 className="text-xl font-bold mb-4">Crypto Leaderboard</h3>
            <div className="flex flex-col gap-2">
              {sortedCoins.map((coin, idx) => (
                <div 
                  key={coin.coin_name} 
                  className={`flex items-center p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedCoin?.coin_name === coin.coin_name 
                      ? "border-blue-500 bg-slate-800" 
                      : "border-slate-700 hover:bg-slate-800"
                  }`}
                  onClick={() => handleCoinClick(coin)}
                >
                  <span 
                    className={`font-bold text-lg min-w-8 text-center ${
                      idx === 0 ? "text-yellow-400" : 
                      idx === 1 ? "text-gray-300" : 
                      idx === 2 ? "text-amber-600" : 
                      "text-slate-400"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div className="h-8 w-8 relative mx-2">
                    <Image 
                      src={coin.image || "/coins/default.png"}
                      alt={coin.coin_name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                  <span className="font-medium ml-2">{coin.coin_name}</span>
                  <div className="ml-auto flex flex-col items-end">
                    <span className="font-bold text-lg">
                      {stats[coin.coin_name]?.value?.toFixed(2) ?? "-"} €
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart Section */}
        <Card className="w-full md:w-2/3 p-6">
          <div className="flex gap-2 mb-4 justify-end">
            {ranges.map(r => (
              <button
                key={r}
                className={`px-2 py-1 rounded text-xs font-medium ${r === range ? "bg-black text-white" : "bg-muted text-muted-foreground"}`}
                onClick={() => setRange(r)}
                disabled={loading}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="time" hide />
                <YAxis domain={["auto", "auto"]} hide />
                <Tooltip
                  content={({ label, payload }) => (
                    <div className="bg-background p-2 rounded shadow text-xs">
                      <div className="font-semibold mb-1">{label}</div>
                      {payload?.map((entry, idx) => (
                        <div key={idx} className="flex justify-between gap-2">
                          <span style={{ color: entry.color }}>{entry.name}</span>
                          <span>{entry.value} €</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
                {coins.map((coin, idx) => (
                  <Line
                    key={coin.coin_name}
                    type="monotone"
                    dataKey={coin.coin_name}
                    stroke={COLORS[idx % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    name={coin.coin_name}
                    isAnimationActive={true}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Coin Detail Section */}
      {selectedCoin && (
        <Card className="w-full max-w-5xl mt-6 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Coin Image */}
              <div className="relative w-40 h-40 flex-shrink-0">
                <Image
                  src={selectedCoin.image || "/coins/default.png"}
                  alt={selectedCoin.coin_name}
                  fill
                  className="rounded-xl object-cover"
                />
              </div>
              
              {/* Coin Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{selectedCoin.coin_name}</h2>
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{
                      background: COLORS[coins.findIndex(c => c.coin_name === selectedCoin.coin_name) % COLORS.length]
                    }}
                  />
                </div>
                
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold">
                    {stats[selectedCoin.coin_name]?.value?.toFixed(2) ?? "-"} €
                  </span>
                  
                </div>
                
                {/* Historical performance summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {ranges.map(r => (
                    <div key={r} className="bg-gray-100 dark:bg-slate-800 p-3 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{r} Change</div>
                      <div
                        className={`text-lg font-semibold ${
                          stats[selectedCoin.coin_name]?.change >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stats[selectedCoin.coin_name]?.change >= 0 ? "+" : ""}
                        {stats[selectedCoin.coin_name]?.change?.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Description - Use fetched description if available */}
                <p className="text-gray-600 dark:text-gray-300">
                    {selectedCoin.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 