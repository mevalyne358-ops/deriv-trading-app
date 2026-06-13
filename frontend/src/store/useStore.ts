import { create } from 'zustand';

interface Trade {
  id: string;
  symbol: string;
  type: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  timestamp: number;
  status: 'open' | 'closed';
}

interface AccountState {
  isAuthenticated: boolean;
  token: string | null;
  balance: number;
  currency: string;
  email: string;
  trades: Trade[];
  portfolio: any[];
  isDemoMode: boolean;
}

interface StoreState extends AccountState {
  setToken: (token: string) => void;
  setBalance: (balance: number) => void;
  addTrade: (trade: Trade) => void;
  removeTrade: (id: string) => void;
  setPortfolio: (portfolio: any[]) => void;
  toggleDemoMode: () => void;
  logout: () => void;
}

export const useStore = create<StoreState>((set) => ({
  isAuthenticated: false,
  token: null,
  balance: 0,
  currency: 'USD',
  email: '',
  trades: [],
  portfolio: [],
  isDemoMode: true,

  setToken: (token: string) =>
    set({ token, isAuthenticated: true }),

  setBalance: (balance: number) =>
    set({ balance }),

  addTrade: (trade: Trade) =>
    set((state) => ({ trades: [...state.trades, trade] })),

  removeTrade: (id: string) =>
    set((state) => ({
      trades: state.trades.filter((t) => t.id !== id),
    })),

  setPortfolio: (portfolio: any[]) =>
    set({ portfolio }),

  toggleDemoMode: () =>
    set((state) => ({ isDemoMode: !state.isDemoMode })),

  logout: () =>
    set({
      isAuthenticated: false,
      token: null,
      balance: 0,
      trades: [],
      portfolio: [],
    }),
}));
