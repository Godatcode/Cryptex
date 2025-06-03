import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface SparklineChartProps {
  data: number[];
  color: string;
  height?: number;
  width?: number;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ 
  data, 
  color,
  height = 40, 
  width = 100 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    // Destroy previous chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [
          {
            data,
            borderColor: color,
            borderWidth: 1.5,
            fill: false,
            pointRadius: 0,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
            min: Math.min(...data) * 0.95,
            max: Math.max(...data) * 1.05,
          },
        },
        animation: false,
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, color]);

  return (
    <div style={{ height: `${height}px`, width: `${width}%` }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default SparklineChart;