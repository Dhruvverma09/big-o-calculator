import React, { useState, useEffect } from 'react';

interface AnalysisResult {
  time_complexity: string;
  explanation: string;
  lines_of_interest: number[];
  optimization_tips: string;
}

export default function ResultsPanel() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const handleAnalysisComplete = (event: any) => {
      setAnalysis(event.detail);
    };

    window.addEventListener('analysisComplete', handleAnalysisComplete);
    return () => window.removeEventListener('analysisComplete', handleAnalysisComplete);
  }, []);

  if (!analysis) {
    return (
      <div className="empty-state">
        <p>Submit code to see complexity analysis</p>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <h3>Analysis Results</h3>
      
      <div className="complexity-main">
        <label>Time Complexity</label>
        <div className="complexity-badge">{analysis.time_complexity}</div>
      </div>

      <div className="explanation-section">
        <label>Explanation</label>
        <p className="explanation-text">{analysis.explanation}</p>
      </div>

      {analysis.lines_of_interest.length > 0 && (
        <div className="lines-section">
          <label>Lines of Interest</label>
          <div className="line-numbers">
            {analysis.lines_of_interest.map(line => (
              <span key={line} className="line-badge">{line}</span>
            ))}
          </div>
        </div>
      )}

      {analysis.optimization_tips && (
        <div className="tips-section">
          <label>Optimization Tips</label>
          <p className="tips-text">{analysis.optimization_tips}</p>
        </div>
      )}

      <style>{`
        .results-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .results-panel h3 {
          margin: 0;
          color: #00d4ff;
          font-size: 1.3rem;
        }

        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: #666;
          text-align: center;
        }

        .complexity-main {
          background: #0f3460;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #16213e;
        }

        .complexity-main label {
          display: block;
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .complexity-badge {
          display: inline-block;
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          color: #000;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: bold;
          font-family: monospace;
          font-size: 1.1rem;
        }

        .explanation-section, .lines-section, .tips-section {
          background: #0f3460;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #16213e;
        }

        label {
          display: block;
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .explanation-text, .tips-text {
          margin: 0;
          color: #ddd;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .line-numbers {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .line-badge {
          background: #16213e;
          color: #00d4ff;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: bold;
          border: 1px solid #00d4ff;
        }
      `}</style>
    </div>
  );
}