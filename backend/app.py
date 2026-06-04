from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_analyzer import analyze_code_with_gemini
from complexity_detector import detect_complexity_patterns
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Endpoint to analyze code complexity
    Expected JSON: {
        "code": "Python or JavaScript code string",
        "language": "python" or "javascript"
    }
    """
    try:
        data = request.json
        code = data.get('code', '')
        language = data.get('language', 'python')
        
        if not code:
            return jsonify({'error': 'No code provided'}), 400
        
        # First, detect patterns locally
        local_patterns = detect_complexity_patterns(code, language)
        
        # Then, use AI for deeper analysis
        ai_analysis = analyze_code_with_gemini(
            code, 
            language, 
            GEMINI_API_KEY
        )
        
        # Merge results
        result = {
            'time_complexity': ai_analysis.get('time_complexity', local_patterns.get('complexity', 'O(n)')),
            'explanation': ai_analysis.get('explanation', ''),
            'lines_of_interest': local_patterns.get('lines', []),
            'optimization_tips': ai_analysis.get('optimization_tips', ''),
            'space_complexity': ai_analysis.get('space_complexity', 'O(1)'),
        }
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)