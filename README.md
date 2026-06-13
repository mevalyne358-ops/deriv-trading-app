# Deriv Trading Platform

A full-stack React + Node.js application for live trading on Deriv with real-time price charts, account management, and transaction history.

## Features

✅ **Live WebSocket Integration** - Real-time market data from Deriv API
✅ **Interactive Charts** - TradingView Lightweight Charts
✅ **Trade Execution** - Buy/Sell contracts with instant confirmation
✅ **Portfolio Management** - Track open positions and P&L
✅ **Account Management** - Balance, transaction history, account info
✅ **Demo Mode** - Practice trading with virtual funds
✅ **Multiple Instruments** - Forex, Synthetics, Crypto pairs
✅ **Responsive Design** - Mobile-friendly Tailwind CSS UI

## Prerequisites

- Node.js 16+ and npm
- Deriv account (deriv.com)
- Deriv API token

## Setup

### 1. Get Deriv Credentials

1. Sign up at [deriv.com](https://deriv.com)
2. Go to Settings → Security → API tokens
3. Create a new token with `read` and `trade` permissions
4. Note your App ID from the API section

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Update `.env`:
```
VITE_DERIV_APP_ID=your_app_id_here
VITE_API_URL=http://localhost:3001/api
```

Run development server:
```bash
npm run dev
```

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env`:
```
DERIV_APP_ID=your_app_id_here
PORT=3001
```

Run server:
```bash
npm run dev
```

## Usage

1. **Login**: Navigate to `/login` and enter your Deriv API token
2. **Trading**: Go to `/trading` to view live charts and place trades
3. **Portfolio**: Check `/portfolio` for open positions and P&L
4. **Demo Mode**: Toggle demo mode to practice with virtual funds

## API Endpoints

### Frontend → Backend

- `GET /api/health` - Health check
- `POST /api/validate-token` - Validate Deriv API token

### WebSocket Events

- `ticks` - Real-time price updates
- `candles` - OHLC candle data
- `portfolio` - Open positions
- `balance` - Account balance updates

## Trading Instruments

- **Forex**: EURUSD, GBPUSD, AUDUSD, etc.
- **Synthetics**: Volatility indices (R_100, R_75, etc.)
- **Crypto**: BTCUSD, ETHUSD, etc.

## Contract Types

- **Call (Up)** - Price will be higher at expiry
- **Put (Down)** - Price will be lower at expiry

## Project Structure

```
deriv-trading-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── TradingChart.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Trading.tsx
│   │   │   └── Portfolio.tsx
│   │   ├── services/
│   │   │   └── derivApi.ts
│   │   ├── store/
│   │   │   └── useStore.ts
│   │   └── App.tsx
│   ├── package.json
│   └── .env
└── backend/
    ├── src/
    │   └── server.ts
    ├── package.json
    └── .env
```

## Security Notes

⚠️ **Never commit API tokens to version control**
- Use `.env` files (added to `.gitignore`)
- Use environment variables in production
- Rotate tokens regularly
- Use read-only tokens for demo

## Troubleshooting

### WebSocket Connection Issues
- Check that your App ID is correct
- Ensure firewall allows WebSocket connections
- Try demo mode first before live trading

### Token Validation Fails
- Verify token has `read` and `trade` permissions
- Check token hasn't expired
- Generate a new token from Deriv settings

### Chart Not Loading
- Ensure TradingView library is properly installed
- Check browser console for errors
- Verify container element exists

## Deployment to Vercel

### Frontend

1. Push to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Set environment variables:
   - `VITE_DERIV_APP_ID`
   - `VITE_API_URL` (backend URL)
5. Deploy

### Backend

Use services like:
- Heroku (free tier deprecated)
- Railway.app
- Render.com
- AWS Lambda

## License

MIT

## Support

For Deriv API help: https://developers.deriv.com/
For platform issues: Create a GitHub issue
