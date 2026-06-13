import React, { useState, useEffect } from 'react';
import { TradingChart } from '../components/TradingChart';
import { useStore } from '../store/useStore';
import DerivAPI from '../services/derivApi';

interface ContractParams {
  symbol: string;
  contractType: 'CALL' | 'PUT';
  amount: number;
  duration: number;
}

export const Trading: React.FC = () => {
  const { balance, isDemoMode, token } = useStore();
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [contractParams, setContractParams] = useState<ContractParams>({
    symbol: 'EURUSD',
    contractType: 'CALL',
    amount: 10,
    duration: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [derivApi, setDerivApi] = useState<DerivAPI | null>(null);

  const symbols = [
    { code: 'EURUSD', name: 'EUR/USD' },
    { code: 'GBPUSD', name: 'GBP/USD' },
    { code: 'R_100', name: 'Volatility 100 Index' },
    { code: 'FRXAUDCAD', name: 'AUD/CAD' },
  ];

  // Initialize Deriv API
  useEffect(() => {
    const initializeApi = async () => {
      try {
        const api = new DerivAPI('YOUR_APP_ID', isDemoMode);
        await api.connect();
        setDerivApi(api);

        if (token) {
          await api.authorize(token);
          const balance = await api.getBalance();
          console.log('Balance:', balance);
        }

        // Subscribe to price updates
        api.subscribeTicks(selectedSymbol, (tick: any) => {
          setCurrentPrice(tick.quote);
        });
      } catch (error) {
        console.error('Failed to initialize API:', error);
      }
    };

    initializeApi();

    return () => {
      if (derivApi) {
        derivApi.disconnect();
      }
    };
  }, [isDemoMode, token]);

  const handlePlaceTrade = async () => {
    if (!derivApi || !token) {
      alert('Please log in first');
      return;
    }

    setIsLoading(true);
    try {
      const proposal = await derivApi.getContractProposal({
        symbol: contractParams.symbol,
        contract_type: contractParams.contractType,
        duration: contractParams.duration,
        duration_unit: 'm',
      });

      console.log('Contract proposal:', proposal);
      // Implement buy logic here
    } catch (error) {
      console.error('Trade error:', error);
      alert('Failed to place trade');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Live Trading</h1>
          <div className="text-lg font-semibold">
            Balance: ${balance.toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {symbols.map((sym) => (
            <button
              key={sym.code}
              onClick={() => setSelectedSymbol(sym.code)}
              className={`p-4 rounded-lg font-semibold transition ${
                selectedSymbol === sym.code
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
            >
              {sym.name}
              <div className="text-sm mt-2">${currentPrice.toFixed(5)}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <TradingChart symbol={selectedSymbol} />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Place Trade</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contract Type
                </label>
                <select
                  value={contractParams.contractType}
                  onChange={(e) =>
                    setContractParams({
                      ...contractParams,
                      contractType: e.target.value as 'CALL' | 'PUT',
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="CALL">Call (Up)</option>
                  <option value="PUT">Put (Down)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={contractParams.amount}
                  onChange={(e) =>
                    setContractParams({
                      ...contractParams,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={contractParams.duration}
                  onChange={(e) =>
                    setContractParams({
                      ...contractParams,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <button
                onClick={handlePlaceTrade}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded disabled:bg-gray-400"
              >
                {isLoading ? 'Placing Trade...' : 'Place Trade'}
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-700">
                <strong>Mode:</strong> {isDemoMode ? 'Demo' : 'Live'}
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Current Price:</strong> ${currentPrice.toFixed(5)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
