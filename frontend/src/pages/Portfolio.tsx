import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

interface Position {
  id: string;
  symbol: string;
  type: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: string;
}

export const Portfolio: React.FC = () => {
  const { trades, balance } = useStore();
  const [positions, setPositions] = useState<Position[]>([]);
  const [totalPnL, setTotalPnL] = useState(0);

  useEffect(() => {
    const openPositions = trades.filter((t) => t.status === 'open');
    const total = openPositions.reduce((sum, t) => sum + t.pnl, 0);
    setTotalPnL(total);
    setPositions(
      openPositions.map((t) => ({
        id: t.id,
        symbol: t.symbol,
        type: t.type,
        amount: t.amount,
        entryPrice: t.entryPrice,
        currentPrice: t.currentPrice,
        pnl: t.pnl,
        pnlPercent: (t.pnl / (t.entryPrice * t.amount)) * 100,
        timestamp: new Date(t.timestamp).toLocaleString(),
      }))
    );
  }, [trades]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Portfolio</h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Account Balance</p>
            <p className="text-3xl font-bold text-gray-900">${balance.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Total P&L</p>
            <p
              className={`text-3xl font-bold ${
                totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ${totalPnL.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Open Positions</p>
            <p className="text-3xl font-bold text-gray-900">{positions.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Symbol</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Entry</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Current</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">P&L</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos) => (
                <tr key={pos.id} className="border-t">
                  <td className="px-6 py-4 font-semibold">{pos.symbol}</td>
                  <td className="px-6 py-4">{pos.type}</td>
                  <td className="px-6 py-4">${pos.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">${pos.entryPrice.toFixed(5)}</td>
                  <td className="px-6 py-4">${pos.currentPrice.toFixed(5)}</td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      pos.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ${pos.pnl.toFixed(2)} ({pos.pnlPercent.toFixed(2)}%)
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{pos.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
