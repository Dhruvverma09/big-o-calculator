import React, { useState } from 'react';
import axios from 'axios';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';

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

  const handleAnalyze = async () => {
    setLoading(true);
    setErrorMsg('');
    
    if (!code.trim()) {
      setErrorMsg('Please enter some code to analyze');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending request to backend...');
      console.log('Code:', code);
      console.log('Language:', language);
      
      const response = await axios.post('http://127.0.0.1:5000/api/analyze', {
        code,
        language
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response received:', response.data);
      setAnalysis(response.data);
      
      // Dispatch custom event for chart update
      window.dispatchEvent(new CustomEvent('analysisComplete', { detail: response.data }));
    } catch (error: any) {
      console.error('Analysis failed:', error);
      
      if (error.code === 'ECONNABORTED') {
        setErrorMsg('Request timeout - Backend took too long to respond');
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setErrorMsg('Network error - Is the backend running on http://127.0.0.1:5000?');
      } else if (error.response) {
        setErrorMsg(`Backend error: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`);
      } else if (error.request) {
        setErrorMsg('No response from backend - Check if it\'s running');
      } else {
        setErrorMsg(`Error: ${error.message}`);
      }
      
      console.error('Full error:', error);
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
        {loading ? 'Analyzing...' : 'Analyze Complexity'}
      </button>

      {errorMsg && (
        <div className="error-message">
          <strong>⚠️ Error:</strong> {errorMsg}
        </div>
      )}

      {analysis && (
        <div className="quick-result">
          <span className="complexity-badge">{analysis.time_complexity}</span>
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
        }

        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
        }

        .analyze-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          padding: 1rem;
          background: #6b3030;
          border: 1px solid #c41e3a;
          border-radius: 6px;
          color: #ffcccc;
          font-size: 0.9rem;
        }

        .quick-result {
          padding: 1rem;
          background: #16213e;
          border-radius: 6px;
          border-left: 4px solid #00d4ff;
        }

        .complexity-badge {
          background: #00d4ff;
          color: #000;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-weight: bold;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}
