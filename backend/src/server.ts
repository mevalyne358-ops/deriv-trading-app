import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocket } from 'ws';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/validate-token', async (req, res) => {
  const { token, isDemo } = req.body;
  try {
    const response = await validateDerivToken(token, isDemo);
    res.json({ valid: true, data: response });
  } catch (error) {
    res.status(401).json({ valid: false, error: error instanceof Error ? error.message : 'Invalid token' });
  }
});

// Validate token with Deriv API
async function validateDerivToken(token: string, isDemo: boolean): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = isDemo
      ? 'wss://ws.derivws.com/websockets/v3?app_id=' + process.env.DERIV_APP_ID
      : 'wss://ws.deriv.com/websockets/v3?app_id=' + process.env.DERIV_APP_ID;

    const ws = new WebSocket(url);

    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error('Connection timeout'));
    }, 5000);

    ws.onopen = () => {
      ws.send(JSON.stringify({ authorize: token }));
    };

    ws.onmessage = (event) => {
      clearTimeout(timeout);
      const data = JSON.parse(event.data);
      ws.close();

      if (data.error) {
        reject(new Error(data.error.message));
      } else {
        resolve(data);
      }
    };

    ws.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('WebSocket error'));
    };
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
