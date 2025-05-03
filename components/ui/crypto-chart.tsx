"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "./card";

const mockApiCall = (range: string) => {
  // Simula diferentes datos según el rango de tiempo
  const now = Date.now();
  let data = [];
  let points = 30;
  if (range === "1D") points = 12;
  if (range === "1S") points = 7;
  if (range === "1M") points = 30;
  if (range === "1A") points = 12;
  if (range === "MAX") points = 60;
  for (let i = 0; i < points; i++) {
    data.push({
      time: new Date(now - (points - i) * 3600 * 1000 * 24).toLocaleDateString(),
      price: 1000 + Math.sin(i / 2) * 100 + Math.random() * 50 - 25,
    });
  }
  return new Promise(resolve => setTimeout(() => resolve(data), 500));
};

const ranges = ["1D", "1S", "1M", "1A", "MAX"];

export function CryptoChart() {
  const [range, setRange] = useState("1A");
  const [data, setData] = useState<{ time: string; price: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    mockApiCall(range).then((d: any) => {
      setData(d);
      setLoading(false);
    });
  }, [range]);

  const priceNow = data.length ? data[data.length - 1].price : 0;
  const priceStart = data.length ? data[0].price : 0;
  const percent = priceStart ? ((priceNow - priceStart) / priceStart) * 100 : 0;

  return (
    <Card className="w-full max-w-xl mx-auto p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-muted-foreground text-sm">Total</div>
          <div className="text-2xl font-bold">{priceNow.toFixed(2)} €</div>
          <div className="text-xs text-muted-foreground">
            {percent >= 0 ? "▲" : "▼"} {Math.abs(percent).toFixed(2)} %
          </div>
        </div>
        <div className="flex gap-2">
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
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" hide />
            <YAxis domain={["auto", "auto"]} hide />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
            <Line type="monotone" dataKey="price" stroke="#000" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 