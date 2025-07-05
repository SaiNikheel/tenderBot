const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://tenderbot.vercel.app',
      'https://tenderbot-git-main.vercel.app',
      'https://tenderbot-git-develop.vercel.app',
      'https://tender-bot-git-main-nikheels-projects.vercel.app',
      'https://tender-bot.vercel.app',
      'https://tenderbot-nikheels-projects.vercel.app',
      // Add your specific Vercel URLs here
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'TenderBot API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    endpoints: {
      analyze: '/api/analyze',
      chat: '/api/chat',
      health: '/'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    geminiKey: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
    cors: {
      allowedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://tenderbot.vercel.app',
        'https://tenderbot-git-main.vercel.app',
        'https://tenderbot-git-develop.vercel.app',
        'https://tender-bot-git-main-nikheels-projects.vercel.app',
        'https://tender-bot.vercel.app',
        'https://tenderbot-nikheels-projects.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean)
    }
  });
});

// Upload and analyze documents
app.post('/api/analyze', upload.fields([
  { name: 'tender', maxCount: 1 },
  { name: 'proposal', maxCount: 1 }
]), async (req, res) => {
  // Set timeout for this specific request
  req.setTimeout(120000); // 2 minutes
  res.setTimeout(120000); // 2 minutes
  
  try {
    if (!req.files.tender || !req.files.proposal) {
      return res.status(400).json({ error: 'Both tender and proposal documents are required' });
    }

    const tenderFile = req.files.tender[0];
    const proposalFile = req.files.proposal[0];

    console.log('Starting analysis for files:', tenderFile.originalname, proposalFile.originalname);

    // Extract text from PDFs
    const tenderText = await extractTextFromPDF(tenderFile.path);
    const proposalText = await extractTextFromPDF(proposalFile.path);

    console.log('PDF text extraction completed');

    // Analyze documents with AI
    const analysisResult = await analyzeDocuments(tenderText, proposalText);

    console.log('AI analysis completed');

    // Clean up uploaded files
    await fs.remove(tenderFile.path);
    await fs.remove(proposalFile.path);

    res.json(analysisResult);
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Clean up files if they exist
    if (req.files?.tender?.[0]?.path) {
      try { await fs.remove(req.files.tender[0].path); } catch (e) {}
    }
    if (req.files?.proposal?.[0]?.path) {
      try { await fs.remove(req.files.proposal[0].path); } catch (e) {}
    }
    
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await generateChatResponse(message, context);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed', details: error.message });
  }
});

// Helper function to extract text from PDF
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Helper function to analyze documents with AI
async function analyzeDocuments(tenderText, proposalText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are TenderBot, an expert AI assistant specialized in tender document analysis with 15+ years of experience in procurement, compliance, and contract management. Your task is to perform a comprehensive analysis of a tender document against a proposal document.

TENDER DOCUMENT CONTENT:
${tenderText.substring(0, 12000)}

PROPOSAL DOCUMENT CONTENT:
${proposalText.substring(0, 12000)}

ANALYSIS REQUIREMENTS:

1. COMPLIANCE VALIDATION:
   - Technical requirements compliance (specifications, standards, methodologies)
   - Financial requirements compliance (budget, pricing, financial capacity)
   - Legal and regulatory compliance (licenses, permits, legal requirements)
   - Experience and qualification requirements (past performance, team credentials)
   - Certification and accreditation requirements (ISO, industry certifications)
   - Insurance and liability requirements (coverage, limits, terms)

2. DOCUMENT STRUCTURE ANALYSIS:
   - Completeness of required sections and submissions
   - Quality and clarity of technical approach
   - Financial proposal adequacy and competitiveness
   - Risk management approach and mitigation strategies
   - Implementation methodology and timeline
   - Quality assurance measures and standards

3. COMPETITIVE POSITIONING:
   - Strengths and unique selling propositions
   - Areas of competitive advantage
   - Potential weaknesses or gaps
   - Risk factors and mitigation strategies
   - Innovation and value-added elements

4. EVALUATION CRITERIA MATCHING:
   - Technical evaluation criteria alignment
   - Financial evaluation criteria compliance
   - Experience and past performance relevance
   - Innovation and value-added elements
   - Risk assessment and management

Provide your analysis in the following EXACT JSON format (no additional text, only valid JSON):

{
  "matches": [
    {
      "id": 1,
      "requirement": "specific requirement name or criteria",
      "status": "matched",
      "description": "detailed explanation of how this requirement is met with specific evidence",
      "evidence": "specific evidence from the proposal document",
      "category": "technical|financial|legal|experience|certification|insurance"
    }
  ],
  "mismatches": [
    {
      "id": 1,
      "requirement": "specific requirement name or criteria",
      "status": "missing|insufficient|non-compliant",
      "description": "detailed explanation of the gap, deficiency, or non-compliance",
      "impact": "high|medium|low",
      "category": "technical|financial|legal|experience|certification|insurance",
      "recommendation": "specific, actionable recommendation to address this gap"
    }
  ],
  "recommendations": [
    "specific, actionable recommendation with priority level and expected impact"
  ],
  "summary": {
    "totalRequirements": number,
    "matchedRequirements": number,
    "mismatchedRequirements": number,
    "complianceRate": number,
    "riskLevel": "low|medium|high",
    "competitivePosition": "strong|moderate|weak"
  },
  "detailedAnalysis": {
    "technicalCompliance": "percentage and key findings with specific examples",
    "financialCompliance": "percentage and key findings with specific examples",
    "legalCompliance": "percentage and key findings with specific examples",
    "experienceCompliance": "percentage and key findings with specific examples",
    "overallAssessment": "comprehensive evaluation summary with strengths and areas for improvement"
  }
}

IMPORTANT GUIDELINES:
- Be extremely specific and detailed in your analysis
- Reference exact sections, page numbers, and requirements from both documents
- Provide actionable, prioritized recommendations with clear next steps
- Consider industry best practices, standards, and regulatory requirements
- Evaluate both compliance and competitive positioning objectively
- Focus on material requirements that significantly affect evaluation scores
- Consider risk factors, mitigation strategies, and contingency plans
- Provide evidence-based assessments with specific examples
- Ensure all numerical values are accurate and percentages are calculated correctly
- Maintain professional tone and objective analysis throughout`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResult = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      if (!parsedResult.matches || !parsedResult.mismatches || !parsedResult.summary) {
        throw new Error('Invalid response structure from AI');
      }
      
      return parsedResult;
    } else {
      throw new Error('No valid JSON found in AI response');
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

// Helper function to generate chat responses
async function generateChatResponse(message, context) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are TenderBot, an expert AI assistant specialized in tender document analysis with 15+ years of experience in procurement, compliance, and contract management.

CONTEXT FROM PREVIOUS ANALYSIS:
${JSON.stringify(context, null, 2)}

USER QUESTION: ${message}

INSTRUCTIONS:
1. Answer the user's question based on the analysis context provided above
2. Use a professional, helpful, and authoritative tone consistent with TenderBot's expertise
3. Provide specific insights and actionable advice with clear next steps
4. Reference specific data, percentages, and findings from the analysis when relevant
5. If the question is about missing requirements, provide detailed explanations with impact assessment
6. If the question is about recommendations, prioritize them by impact and provide implementation guidance
7. If the question is about compliance, explain the specific criteria and evaluation standards
8. If the question is about competitive positioning, provide strategic insights and improvement opportunities
9. If the question is unclear or outside the scope, politely ask for clarification
10. Keep responses concise but comprehensive, using bullet points and formatting for clarity
11. Always maintain consistency with the analysis results and recommendations provided
12. Provide evidence-based responses with specific examples from the analysis

RESPONSE FORMAT:
- Provide a clear, direct answer to the user's question
- Use specific examples, numbers, and findings from the analysis
- Include actionable recommendations when relevant
- Reference specific requirements, criteria, or sections from the documents
- Use professional formatting with bullet points where appropriate
- Maintain the same level of detail and expertise as the original analysis

SPECIALIZED KNOWLEDGE AREAS:
- Procurement processes and evaluation criteria
- Compliance requirements and regulatory standards
- Risk assessment and mitigation strategies
- Competitive analysis and positioning
- Technical and financial evaluation methods
- Contract management and negotiation strategies`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Chat generation error:', error);
    return "I apologize, but I'm experiencing technical difficulties. Please try again or rephrase your question about the tender analysis.";
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`TenderBot server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 