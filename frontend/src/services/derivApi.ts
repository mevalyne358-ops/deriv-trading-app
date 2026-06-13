import { useStore } from '../store/useStore';

interface DerivMessage {
  [key: string]: any;
}

class DerivAPI {
  private ws: WebSocket | null = null;
  private url: string;
  private appId: string;
  private token: string | null = null;
  private requestId: number = 1;
  private listeners: Map<string, Function[]> = new Map();

  constructor(appId: string, isDemo: boolean = true) {
    this.appId = appId;
    const baseUrl = isDemo 
      ? 'wss://ws.derivws.com/websockets/v3'
      : 'wss://ws.deriv.com/websockets/v3';
    this.url = `${baseUrl}?app_id=${appId}`;
  }

  /**
   * Connect to Deriv WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('✅ Connected to Deriv API');
          this.emit('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          const data: DerivMessage = JSON.parse(event.data);
          this.handleMessage(data);
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.emit('error', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 Disconnected from Deriv API');
          this.emit('disconnected');
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Authorize with API token
   */
  authorize(token: string): Promise<any> {
    this.token = token;
    return this.send({
      authorize: token,
    });
  }

  /**
   * Get account info
   */
  getAccountInfo(): Promise<any> {
    return this.send({
      get_account_status: 1,
    });
  }

  /**
   * Get balance
   */
  getBalance(): Promise<any> {
    return this.send({
      balance: 1,
      subscribe: 1,
    });
  }

  /**
   * Get trading instruments
   */
  getInstruments(): Promise<any> {
    return this.send({
      active_symbols: 'brief',
      product_type: 'all',
    });
  }

  /**
   * Subscribe to real-time ticks
   */
  subscribeTicks(symbol: string, callback: Function): string {
    const id = `tick_${symbol}_${Date.now()}`;
    this.on(id, callback);
    this.send({
      ticks: symbol,
      subscribe: 1,
      req_id: parseInt(id.split('_')[2]),
    });
    return id;
  }

  /**
   * Subscribe to candle data
   */
  subscribeCandles(
    symbol: string,
    granularity: number,
    callback: Function
  ): string {
    const id = `candle_${symbol}_${granularity}_${Date.now()}`;
    this.on(id, callback);
    this.send({
      ticks_history: symbol,
      style: 'candles',
      granularity,
      count: 100,
      subscribe: 1,
      req_id: parseInt(id.split('_')[3]),
    });
    return id;
  }

  /**
   * Get contract proposal
   */
  getContractProposal(params: {
    symbol: string;
    contract_type: string;
    duration: number;
    duration_unit: string;
    amount?: number;
  }): Promise<any> {
    return this.send({
      proposal: 1,
      subscribe: 1,
      ...params,
    });
  }

  /**
   * Buy a contract
   */
  buyContract(contractId: string): Promise<any> {
    return this.send({
      buy: contractId,
      price: 1,
    });
  }

  /**
   * Get portfolio/open positions
   */
  getPortfolio(): Promise<any> {
    return this.send({
      portfolio: 1,
    });
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(limit: number = 50): Promise<any> {
    return this.send({
      statement: 1,
      limit,
    });
  }

  /**
   * Close position
   */
  closePosition(contractId: string): Promise<any> {
    return this.send({
      sell: contractId,
      price: 1,
    });
  }

  /**
   * Send generic request
   */
  private send(payload: DerivMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const reqId = this.requestId++;
      const message = { ...payload, req_id: reqId };

      const timeout = setTimeout(() => {
        this.off(`response_${reqId}`, handler);
        reject(new Error(`Request timeout for req_id: ${reqId}`));
      }, 10000);

      const handler = (data: DerivMessage) => {
        clearTimeout(timeout);
        if (data.error) {
          reject(new Error(data.error.message));
        } else {
          resolve(data);
        }
      };

      this.on(`response_${reqId}`, handler);
      this.ws.send(JSON.stringify(message));
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: DerivMessage): void {
    const reqId = data.req_id;

    if (reqId) {
      this.emit(`response_${reqId}`, data);
    }

    // Handle streaming data
    if (data.tick) {
      this.emit(`tick_${data.tick.symbol}`, data.tick);
    }

    if (data.candle) {
      this.emit(`candle_${data.candle.symbol}`, data.candle);
    }

    if (data.balance) {
      this.emit('balance', data.balance);
    }

    if (data.portfolio) {
      this.emit('portfolio', data.portfolio);
    }
  }

  /**
   * Event listeners
   */
  private on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default DerivAPI;
