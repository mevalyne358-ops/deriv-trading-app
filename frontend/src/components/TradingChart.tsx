import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';

interface TradingChartProps {
  symbol: string;
  onPriceUpdate?: (price: number) => void;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  symbol,
  onPriceUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create chart
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#000000',
      },
      width: containerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    // Sample data - replace with real API data
    const sampleData = [
      {
        time: Math.floor(Date.now() / 1000) - 3600,
        open: 1.08,
        high: 1.085,
        low: 1.075,
        close: 1.082,
      },
      {
        time: Math.floor(Date.now() / 1000) - 1800,
        open: 1.082,
        high: 1.09,
        low: 1.08,
        close: 1.088,
      },
      {
        time: Math.floor(Date.now() / 1000),
        open: 1.088,
        high: 1.092,
        low: 1.086,
        close: 1.09,
      },
    ];

    candleSeries.setData(sampleData);
    chart.timeScale().fitContent();
    setIsLoading(false);

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-white rounded-lg shadow"
    >
      {isLoading && <div className="text-center py-20">Loading chart...</div>}
    </div>
  );
};
