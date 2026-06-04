import google.generativeai as genai
import json
import re

def analyze_code_with_gemini(code: str, language: str, api_key: str) -> dict:
    """
    Use Google Gemini API to analyze code complexity
    """
    genai.configure(api_key=api_key)
    
    prompt = f"""
    Analyze the following {language} code and provide:
    1. Time complexity in Big-O notation
    2. Space complexity in Big-O notation
    3. Step-by-step explanation of the complexity
    4. Specific lines or sections that determine the complexity
    5. Optimization tips to improve the complexity
    
    Format your response as a valid JSON object with these keys:
    - time_complexity: string (e.g., "O(n^2)")
    - space_complexity: string (e.g., "O(1)")
    - explanation: string (detailed breakdown)
    - critical_sections: array of strings (describe the critical parts)
    - optimization_tips: string (how to optimize)
    
    Code to analyze:
    ```{language}
    {code}
    ```
    
    Respond with only valid JSON, no additional text.
    """
    
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        
        # Extract JSON from response
        response_text = response.text.strip()
        
        # Try to parse JSON
        try:
            analysis = json.loads(response_text)
        except json.JSONDecodeError:
            # If response contains markdown code blocks, extract JSON
            json_match = re.search(r'```json\n?(.*?)\n?```', response_text, re.DOTALL)
            if json_match:
                analysis = json.loads(json_match.group(1))
            else:
                # Fallback parsing
                analysis = {
                    'time_complexity': extract_value(response_text, 'time_complexity'),
                    'space_complexity': extract_value(response_text, 'space_complexity'),
                    'explanation': extract_value(response_text, 'explanation'),
                    'optimization_tips': extract_value(response_text, 'optimization_tips'),
                }
        
        return analysis
    
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return {
            'time_complexity': 'O(n)',
            'space_complexity': 'O(1)',
            'explanation': 'Error in analysis',
            'optimization_tips': 'Please try again',
        }

def extract_value(text: str, key: str) -> str:
    """Extract value from unstructured text"""
    # Escape special regex characters in key and build pattern safely
    escaped_key = re.escape(key)
    pattern = escaped_key + r'["\']?\s*[:=]\s*["\']?([^"\'}\n]+)'
    match = re.search(pattern, text, re.IGNORECASE)
    return match.group(1).strip() if match else ''
