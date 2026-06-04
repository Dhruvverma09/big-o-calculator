import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

interface AnalysisResult {
  time_complexity: string;
}

export default function ComplexityChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [currentComplexity, setCurrentComplexity] = useState('O(n)');

  useEffect(() => {
    const handleAnalysisComplete = (event: any) => {
      setCurrentComplexity(event.detail.time_complexity);
    };

    window.addEventListener('analysisComplete', handleAnalysisComplete);
    return () => window.removeEventListener('analysisComplete', handleAnalysisComplete);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const n = [10, 50, 100, 500, 1000, 5000];
    
    const complexities = {
      'O(1)': n.map(() => 1),
      'O(log n)': n.map(x => Math.log2(x)),
      'O(n)': n,
      'O(n log n)': n.map(x => x * Math.log2(x)),
      'O(n²)': n.map(x => x * x),
      'O(2ⁿ)': n.map(x => Math.pow(2, x > 20 ? 20 : x)),
    };

    const datasets = Object.entries(complexities).map(([label, data]) => ({
      label,
      data,
      borderWidth: currentComplexity === label ? 4 : 2,
      borderColor: currentComplexity === label 
        ? '#00ff00' 
        : '#666',
      backgroundColor: currentComplexity === label
        ? 'rgba(0, 255, 0, 0.1)'
        : 'transparent',
      tension: 0.4,
      pointRadius: currentComplexity === label ? 5 : 3,
      pointBackgroundColor: currentComplexity === label ? '#00ff00' : '#888',
    }));

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: n.map(x => `n=${x}`),
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              color: '#ddd',
              font: { size: 12 },
            },
          },
          title: {
            display: true,
            text: 'Complexity Growth Comparison',
            color: '#ddd',
          },
        },
        scales: {
          y: {
            type: 'logarithmic',
            ticks: { color: '#888' },
            grid: { color: '#333' },
            title: { display: true, text: 'Operations (log scale)', color: '#ddd' },
          },
          x: {
            ticks: { color: '#888' },
            grid: { color: '#333' },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [currentComplexity]);

  return (
    <div className="chart-container">
      <canvas ref={canvasRef}></canvas>
      <style>{`
        .chart-container {
          background: #0f3460;
          border: 1px solid #16213e;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        canvas {
          max-width: 100%;
        }
      `}</style>
    </div>
  );
}