# 📊 Visual Big-O Complexity Calculator

An AI-powered web application to analyze code complexity, visualize algorithmic efficiency, and learn about Big-O notation.

## ✨ Features

- **AI-Powered Analysis**: Uses Google Gemini Flash API to analyze code complexity
- **Visual Graphs**: Chart.js graphs comparing complexity classes
- **Code Editor**: Syntax-highlighted editor supporting Python and JavaScript
- **Educational Content**: Comprehensive guide to Big-O notation with real-world examples
- **SEO Optimized**: Structured data, meta tags, and long-form educational content
- **Dark Mode UI**: Modern, professional design focused on usability
- **Responsive**: Perfect on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Google Gemini API key

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY to .env
python app.py
```

The backend API runs on `http://localhost:5000`

## 📁 Project Structure

```
big-o-calculator/
├── frontend/           # Astro.js frontend
│   ├── src/
│   │   ├── pages/     # Astro pages (index, about, contact, etc)
│   │   ├── components/ # React components
│   │   ├── layouts/   # Base layout
│   │   └── styles/    # Global styles
│   ├── astro.config.mjs
│   └── package.json
├── backend/           # Python backend
│   ├── app.py
│   ├── ai_analyzer.py
│   ├── complexity_detector.py
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## 🔑 Key Features Explained

### 1. Code Analysis
- Submit Python or JavaScript code
- AI analyzes time/space complexity
- Identifies critical sections

### 2. Visualization
- Compare complexity classes on logarithmic scale
- Highlight user's algorithm against O(1) through O(2ⁿ)
- Interactive Chart.js graphs

### 3. Education
- 1,200+ word guide on Big-O notation
- Common complexity classes table
- Real-world O(n) vs O(n²) examples
- Optimization strategies

## 🎯 SEO & Monetization

- Meta tags optimized for "Big-O Calculator", "Code Complexity Analyzer"
- JSON-LD FAQ schema for rich snippets
- Google AdSense integration ready
- Long-form educational content for organic traffic

## 🔒 Privacy & Compliance

- Privacy Policy with AdSense disclosure
- Terms of Service
- GDPR-compliant data handling
- No user data stored permanently

## 🛠️ Technologies

**Frontend:**
- Astro.js
- React
- Chart.js
- Prism.js

**Backend:**
- Flask
- Python AST
- Google Gemini API
- CORS enabled

## 📝 API Endpoints

### POST `/api/analyze`
Analyzes code complexity
```json
{
  "code": "your code here",
  "language": "python" | "javascript"
}
```

Response:
```json
{
  "time_complexity": "O(n²)",
  "space_complexity": "O(1)",
  "explanation": "...",
  "lines_of_interest": [5, 6, 7],
  "optimization_tips": "..."
}
```

## 📈 Performance Targets

- Page load: < 2s
- Code analysis: < 3s
- Mobile score: > 90

## 🤝 Contributing

Contributions welcome! Please feel free to submit pull requests.

## 📄 License

MIT License

## 👨‍💻 Author

Dhruv Verma (@Dhruvverma09)

---

**Made with ❤️ to help developers write efficient code**