# 🤖 TenderBot - AI-Powered Tender Document Analyzer

TenderBot is an intelligent document analysis system that uses AI to compare tender documents against proposal documents, providing comprehensive compliance validation, risk assessment, and actionable recommendations.

## ✨ Features

### 🔍 **Comprehensive Document Analysis**
- **Multi-Document Comparison**: Analyze tender requirements against proposal responses
- **AI-Powered Validation**: Uses Google Gemini AI for intelligent document processing
- **Real-time PDF Processing**: Extract and analyze text from PDF documents

### 📊 **Detailed Compliance Validation**
- **Technical Requirements**: Validate technical specifications and capabilities
- **Financial Compliance**: Assess financial requirements and pricing adequacy
- **Legal & Regulatory**: Check legal compliance and regulatory requirements
- **Experience & Qualifications**: Validate experience requirements and certifications
- **Insurance & Liability**: Review insurance and liability requirements

### 🎯 **Smart Analysis Features**
- **Requirement Matching**: Identify matched and mismatched requirements
- **Impact Assessment**: Categorize issues by impact level (High/Medium/Low)
- **Evidence-Based Analysis**: Provide specific evidence from documents
- **Risk Assessment**: Evaluate overall risk level and competitive position
- **Actionable Recommendations**: Prioritized improvement suggestions

### 💬 **Interactive AI Chat**
- **Context-Aware Responses**: Chat with AI about analysis results
- **Detailed Explanations**: Get specific insights about requirements
- **Recommendation Guidance**: Receive personalized advice

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tenderbot.git
   cd tenderbot
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # In the server directory, create .env file
   cd ../server
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
   ```

4. **Start the application**
   ```bash
   # Start the backend server (from server directory)
   npm run dev
   
   # Start the frontend (from client directory, in a new terminal)
   cd ../client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 📖 Usage Guide

### 1. **Upload Documents**
   - Upload your tender document (PDF)
   - Upload your proposal document (PDF)
   - Both documents are required for analysis

### 2. **Run Analysis**
   - Click "Analyze Documents" to start the AI analysis
   - Wait for processing (typically 30-60 seconds)
   - View comprehensive results

### 3. **Review Results**
   - **Matches**: Requirements that are properly addressed
   - **Mismatches**: Gaps or deficiencies with impact levels
   - **Recommendations**: Prioritized improvement suggestions
   - **Detailed Analysis**: Category-wise compliance breakdown

### 4. **Interactive Chat**
   - Ask questions about specific requirements
   - Get detailed explanations of mismatches
   - Receive personalized recommendations

## 🏗️ Architecture

### Frontend (React)
- **Modern UI**: Built with React and Tailwind CSS
- **PDF Viewer**: Integrated PDF document preview
- **Real-time Updates**: Live progress tracking
- **Responsive Design**: Works on desktop and mobile

### Backend (Node.js/Express)
- **RESTful API**: Clean API endpoints
- **File Processing**: PDF text extraction
- **AI Integration**: Google Gemini API integration
- **Error Handling**: Comprehensive error management

### AI Analysis Engine
- **Domain Expertise**: Specialized in procurement and compliance
- **Structured Output**: Consistent JSON response format
- **Evidence-Based**: References specific document sections
- **Actionable Insights**: Practical recommendations

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
NODE_ENV=development
```

### API Endpoints

- `GET /` - Health check
- `POST /api/analyze` - Document analysis
- `POST /api/chat` - AI chat interface

## 📊 Analysis Output Structure

```json
{
  "matches": [
    {
      "id": 1,
      "requirement": "Technical Specification",
      "status": "matched",
      "description": "Detailed explanation",
      "evidence": "Specific evidence from proposal",
      "category": "technical"
    }
  ],
  "mismatches": [
    {
      "id": 1,
      "requirement": "Insurance Coverage",
      "status": "missing",
      "description": "Gap explanation",
      "impact": "high",
      "category": "insurance",
      "recommendation": "Action to address gap"
    }
  ],
  "recommendations": [
    "Prioritized improvement suggestions"
  ],
  "summary": {
    "totalRequirements": 25,
    "matchedRequirements": 20,
    "mismatchedRequirements": 5,
    "complianceRate": 80,
    "riskLevel": "medium",
    "competitivePosition": "strong"
  },
  "detailedAnalysis": {
    "technicalCompliance": "85% - Strong technical approach",
    "financialCompliance": "90% - Competitive pricing",
    "legalCompliance": "95% - Fully compliant",
    "experienceCompliance": "75% - Some gaps in experience",
    "overallAssessment": "Comprehensive evaluation summary"
  }
}
```

## 🛠️ Development

### Project Structure
```
tenderbot/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── uploads/           # Temporary file storage
│   ├── index.js           # Main server file
│   └── package.json
├── .gitignore
└── README.md
```

### Available Scripts

**Server:**
```bash
npm run dev      # Start development server
npm start        # Start production server
```

**Client:**
```bash
npm start        # Start development server
npm build        # Build for production
npm test         # Run tests
```

## 🔒 Security

- **File Validation**: Only PDF files are accepted
- **File Size Limits**: 20MB maximum file size
- **Temporary Storage**: Files are automatically cleaned up
- **Environment Variables**: Sensitive data stored in .env files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/tenderbot/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced document comparison algorithms
- [ ] Integration with procurement platforms
- [ ] Custom compliance frameworks
- [ ] Batch processing capabilities
- [ ] Advanced reporting features

---

**Built with ❤️ using React, Node.js, and Google Gemini AI** 