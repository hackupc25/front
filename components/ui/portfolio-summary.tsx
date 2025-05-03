"use client"
import React, { useEffect, useState } from "react";
import { Card } from "./card";

// Simula una llamada a API para obtener el resumen del portfolio
const mockPortfolioApi = () => {
  return new Promise<{
    balance: number;
    balanceChange: number;
    portfolio: number;
    portfolioChange: number;
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        balance: 10000.0,
        balanceChange: 2.5, // %
        portfolio: 9617.15,
        portfolioChange: 20.21, // %
      });
    }, 400);
  });
};

export function PortfolioSummary() {
  const [data, setData] = useState<{
    balance: number;
    balanceChange: number;
    portfolio: number;
    portfolioChange: number;
  } | null>(null);

  useEffect(() => {
    mockPortfolioApi().then(setData);
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <Card className="p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium">Total Balance</span>
          <span className="text-2xl text-muted-foreground">€</span>
        </div>
        <div className="text-4xl font-bold mb-1">
          {data ? `€${data.balance.toFixed(2)}` : <span className="opacity-50">----</span>}
        </div>
        <div className="text-muted-foreground text-base">
          {data ? `+${data.balanceChange}% from last week` : <span className="opacity-50">---</span>}
        </div>
      </Card>
      <Card className="p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium">Portfolio Value</span>
          <span className="text-2xl text-muted-foreground">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-credit-card"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          </span>
        </div>
        <div className="text-4xl font-bold mb-1">
          {data ? `€${data.portfolio.toFixed(2)}` : <span className="opacity-50">----</span>}
        </div>
        <div className="text-green-600 text-base flex items-center gap-1">
          {data ? (
            <>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline align-middle"><polyline points="6 9 9 12 14 7"></polyline></svg>
              +{data.portfolioChange}% from initial
            </>
          ) : (
            <span className="opacity-50">---</span>
          )}
        </div>
      </Card>
    </div>
  );
} 