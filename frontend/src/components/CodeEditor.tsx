import React, { useState } from 'react';
import axios from 'axios';

interface AnalysisResult {
  time_complexity: string;
  explanation: string;
  lines_of_interest: number[];
  optimization_tips: string;
  space_complexity?: string;
}

export default function CodeEditor() {
  const [code, setCode] = useState('# Paste your Python or JavaScript code here\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const handleAnalyze = async () => {
    console.log('🔴 BUTTON CLICKED - Starting analysis...');
    setLoading(true);
    setErrorMsg('');
    setDebugInfo('📤 Sending request to backend...');
    setAnalysis(null);
    
    if (!code.trim()) {
      const msg = 'Please enter some code to analyze';
      setErrorMsg(msg);
      setDebugInfo('');
      setLoading(false);
      return;
    }

    try {
      const requestData = { code, language };
      console.log('📤 Request payload:', requestData);
      setDebugInfo('📤 Sending POST to http://127.0.0.1:5000/api/analyze...');
      
      const response = await axios.post(
        'http://127.0.0.1:5000/api/analyze',
        requestData,
        {
          timeout: 30000,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      console.log('✅ Response received:', response.data);
      setDebugInfo('✅ Response received from backend!');
      setAnalysis(response.data);
      
      // Dispatch custom event for chart update
      window.dispatchEvent(new CustomEvent('analysisComplete', { detail: response.data }));
    } catch (error: any) {
      console.error('❌ ERROR:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      let errorMessage = '';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = '⏱️ Request timeout - Backend took too long';
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        errorMessage = '🌐 Cannot connect to backend at http://127.0.0.1:5000 - Is it running?';
      } else if (error.response?.status === 500) {
        errorMessage = `🔥 Backend error: ${error.response.data?.error || 'Internal Server Error'}`;
      } else if (error.response?.status === 400) {
        errorMessage = `❌ Bad request: ${error.response.data?.error || 'Invalid code'}`;
      } else if (error.response) {
        errorMessage = `${error.response.status}: ${error.response.data?.error || error.response.statusText}`;
      } else {
        errorMessage = `${error.message}`;
      }
      
      setErrorMsg(errorMessage);
      setDebugInfo(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>Code Editor</h2>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      <textarea
        value={code}
        onChange={handleCodeChange}
        className="code-input"
        spellCheck="false"
      />

      <button 
        onClick={handleAnalyze}
        disabled={loading}
        className="analyze-btn"
      >
        {loading ? '⏳ Analyzing...' : '🚀 Analyze Complexity'}
      </button>

      {debugInfo && (
        <div className={`debug-info ${loading ? 'loading' : ''}`}>
          {debugInfo}
        </div>
      )}

      {errorMsg && (
        <div className="error-message">
          {errorMsg}
        </div>
      )}

      {analysis && (
        <div className="quick-result">
          <div className="result-label">⚡ Time Complexity:</div>
          <span className="complexity-badge">{analysis.time_complexity}</span>
          {analysis.explanation && (
            <div className="explanation">{analysis.explanation}</div>
          )}
          {analysis.optimization_tips && (
            <div className="tips">💡 {analysis.optimization_tips}</div>
          )}
        </div>
      )}

      <style>{`
        .editor-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .editor-header h2 {
          margin: 0;
          color: #00d4ff;
        }

        .language-select {
          background: #16213e;
          color: #fff;
          border: 1px solid #00d4ff;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
        }

        .code-input {
          background: #0f3460;
          color: #00d4ff;
          border: 2px solid #16213e;
          padding: 1rem;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          min-height: 300px;
          resize: vertical;
          line-height: 1.6;
        }

        .code-input:focus {
          outline: none;
          border-color: #00d4ff;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
        }

        .analyze-btn {
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          color: #000;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
        }

        .analyze-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .debug-info {
          padding: 0.75rem 1rem;
          background: #1a4d6d;
          border-left: 4px solid #00d4ff;
          border-radius: 4px;
          color: #00d4ff;
          font-size: 0.9rem;
          font-family: monospace;
        }

        .debug-info.loading {
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .error-message {
          padding: 1rem;
          background: #6b3030;
          border: 1px solid #c41e3a;
          border-radius: 6px;
          color: #ffcccc;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .quick-result {
          padding: 1.5rem;
          background: #16213e;
          border-radius: 8px;
          border: 2px solid #00d4ff;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .result-label {
          color: #00d4ff;
          font-weight: bold;
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .complexity-badge {
          display: inline-block;
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          color: #000;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: bold;
          font-family: monospace;
          font-size: 1.2rem;
          width: fit-content;
        }

        .explanation {
          color: #ddd;
          font-size: 0.9rem;
          line-height: 1.6;
          padding: 0.75rem;
          background: #0f3460;
          border-radius: 4px;
        }

        .tips {
          color: #ffdd00;
          font-size: 0.9rem;
          line-height: 1.6;
          padding: 0.75rem;
          background: #3d3000;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
