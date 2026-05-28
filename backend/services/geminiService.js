const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-flash-latest';

const getModel = (isJson = true) => {
  return genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    generationConfig: isJson ? { responseMimeType: 'application/json' } : {}
  });
};

// Helper to wait
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced Retry wrapper for Gemini API calls
const withRetry = async (fn, maxRetries = 5) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const status = error.status || (error.message.match(/\b(503|429|500|504)\b/) || [])[0];
      
      const isRetryable = 
        status ||
        error.message.includes('Service Unavailable') ||
        error.message.includes('Too Many Requests') ||
        error.message.includes('high demand');
      
      if (isRetryable && i < maxRetries - 1) {
        // Exponential backoff: 2s, 4s, 8s, 16s, 32s
        const delay = Math.pow(2, i) * 2000; 
        console.warn(`Gemini API (${MODEL_NAME}) busy/unavailable (attempt ${i + 1}/${maxRetries}). Retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

// Helper to clean and parse JSON from Gemini
const parseGeminiResponse = (text) => {
  try {
    return JSON.parse(text.trim());
  } catch (error) {
    console.error('Error parsing Gemini JSON:', error);
    const jsonMatch = text.match(/\[[\s\S]*\]/) || text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        throw new Error('Failed to parse AI response as JSON');
      }
    }
    throw error;
  }
};

// Generate 10 interview questions based on tech + level
const generateInterviewQuestions = async ({ technology, experienceLevel, resumeContext = null }) => {
  const model = getModel(true);
  const resumeSection = resumeContext
    ? `\nThe candidate's resume highlights:\n${resumeContext}\nTailor questions to their specific background.`
    : '';

  const distributionRule = resumeContext
    ? `The questions MUST follow this specific distribution:
1. Questions 1-6 (PROJECTS & TECHNICAL): Deep dive into the projects listed in the resume. Ask about implementation details, challenges, and specific contributions.
2. Questions 7-10 (SKILLS): Technical questions specifically about the technologies mentioned in their skills list (${technology}, etc.).`
    : `Mix conceptual, practical, and problem-solving questions. Questions should progressively increase in difficulty.`;

  const prompt = `You are an expert technical interviewer at a top tech company.
Generate exactly 10 interview questions for a ${experienceLevel}-level ${technology} developer.${resumeSection}

Rules:
- Questions must be relevant to ${technology} and ${experienceLevel} level
- ${distributionRule}
- Include at least 2 coding/implementation questions (within the technical skills section)
- Be specific, not generic
- DO NOT include HR, behavioral, or high-level System Design questions. Focus strictly on technical implementation and core concepts.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "question": "Question text here",
    "type": "conceptual|practical|problem-solving|coding",
    "difficulty": "easy|medium|hard",
    "followUp": "A follow-up question to dig deeper",
    "keyPoints": ["point1", "point2"]
  }
]`;

  const result = await withRetry(() => model.generateContent(prompt));
  const text = result.response.text();
  return parseGeminiResponse(text);
};

// Generate 10 AI-powered mock interview questions with specific rules
const generateMockQuestions = async ({ technology, experienceLevel }) => {
  const model = getModel(true);
  
  let specialInstructions = '';
  if (technology.toLowerCase().includes('data science')) {
    specialInstructions = 'Include statistics, data preprocessing, feature engineering, visualization, model evaluation, and Python libraries.';
  } else if (technology.toLowerCase().includes('data analytics')) {
    specialInstructions = 'Include SQL, Excel, Power BI/Tableau, KPIs, dashboards, business insights, and data interpretation.';
  } else if (technology.toLowerCase() === 'artificial intelligence' || technology.toLowerCase() === 'ai') {
    specialInstructions = 'Include AI concepts, intelligent systems, NLP basics, computer vision basics, AI workflows, and ethical AI questions.';
  } else if (technology.toLowerCase().includes('machine learning')) {
    specialInstructions = 'Include supervised/unsupervised learning, algorithms, overfitting, model tuning, evaluation metrics, and deployment concepts.';
  } else if (technology.toLowerCase().includes('generative ai') || technology.toLowerCase() === 'gen ai') {
    specialInstructions = 'Include LLMs, transformers, prompt engineering, RAG, embeddings, vector databases, AI agents, fine-tuning, and AI applications.';
  }

  const prompt = `You are an expert technical interviewer at a top tech company.
Generate exactly 10 professional interview-quality questions for a candidate with ${experienceLevel} experience in ${technology}.
${specialInstructions}

Requirements:
1. Questions must match the selected technology: ${technology}.
2. Difficulty should depend on experience level: ${experienceLevel} (Junior: 0-2 yrs, Mid-Level: 2-5 yrs, Senior: 5+ yrs, Expert: Staff/Lead).
3. Include:
   - Conceptual questions
   - Practical/scenario-based questions
   - Problem-solving questions
   - Real-world technical interview style questions
4. DO NOT include HR, behavioral, or high-level System Design questions.

Return response in ONLY this JSON format:
{
  "technology": "${technology}",
  "experienceLevel": "${experienceLevel}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "type": "Conceptual | Scenario | Coding | Problem Solving",
      "difficulty": "Easy | Medium | Hard"
    }
  ]
}

Ensure the questions are high quality and similar to real company interviews.`;

  const result = await withRetry(() => model.generateContent(prompt));
  const text = result.response.text();
  return parseGeminiResponse(text);
};

// Analyze a single answer
const analyzeAnswer = async ({ question, answer, technology, experienceLevel, questionType }) => {
  const model = getModel(true);
  if (!answer || answer.trim() === '' || answer === '[Skipped]') {
    return {
      score: 0,
      grade: 'Poor',
      feedback: 'No answer was provided for this question.',
      strengths: [],
      improvements: ['Answer all questions to maximize your score', `Study ${technology} ${questionType} concepts`]
    };
  }

  const prompt = `You are an expert ${technology} technical interviewer evaluating a ${experienceLevel}-level candidate.

Question: "${question}"
Candidate's Answer: "${answer}"

Evaluate this answer and return ONLY a valid JSON object:
{
  "score": <0-100 integer>,
  "grade": "<Excellent|Good|Average|Poor>",
  "feedback": "<2-3 sentence specific feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "idealAnswer": "<brief 1-2 sentence ideal answer summary>"
}

Scoring guide: 90-100=Excellent, 70-89=Good, 50-69=Average, 0-49=Poor
Be fair, constructive, and specific to the actual answer given.`;

  const result = await withRetry(() => model.generateContent(prompt));
  const text = result.response.text();
  return parseGeminiResponse(text);
};

// Analyze full interview and generate comprehensive report
const generateFullReport = async ({ technology, experienceLevel, answers, type }) => {
  const model = getModel(true);
  const answersText = answers
    .map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.userAnswer}\nScore: ${a.aiAnalysis?.score || 0}/100`)
    .join('\n\n');

  const prompt = `You are a senior technical interviewer. Analyze this complete ${technology} interview for a ${experienceLevel}-level candidate.

Interview Transcript:
${answersText}

Generate a comprehensive report as ONLY a valid JSON object:
{
  "overallSummary": "<3-4 sentence overall assessment>",
  "overallGrade": "<Excellent|Good|Average|Poor>",
  "metrics": {
    "technicalAccuracy": <0-100>,
    "communication": <0-100>,
    "problemSolving": <0-100>,
    "codeKnowledge": <0-100>,
    "systemThinking": <0-100>
  },
  "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "criticalWeaknesses": ["<weakness 1>", "<weakness 2>"],
  "recommendations": [
    {
      "title": "<recommendation title>",
      "description": "<specific actionable advice>",
      "priority": "<high|medium|low>",
      "resources": "<suggested resource or topic to study>"
    }
  ],
  "hiringSuggestion": "<Strong Hire|Hire|Borderline|No Hire>",
  "nextSteps": "<Personalized next steps for the candidate>"
}`;

  const result = await withRetry(() => model.generateContent(prompt));
  const text = result.response.text();
  return parseGeminiResponse(text);
};

// Conversational AI response during interview
const getAIInterviewerResponse = async ({ conversationHistory, currentQuestion, userAnswer, questionNumber, totalQuestions }) => {
  const isLast = questionNumber >= totalQuestions;
  const textModel = getModel(false);

  const systemPrompt = `You are Alex, a friendly but professional technical interviewer at a top tech company.
Your role:
- Acknowledge the candidate's answer briefly (1 sentence max)
- ${isLast ? 'Thank them and let them know the interview is complete and feedback is being generated.' : `Transition smoothly to the next question: "${currentQuestion}"`}
- Be encouraging but neutral — don't reveal if they were right or wrong
- Keep responses concise (2-3 sentences max)
- Sound natural and conversational`;

  const chat = textModel.startChat({
    history: conversationHistory.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    })),
  });

  const prompt = `INSTRUCTIONS: ${systemPrompt}\n\nCANDIDATE'S LATEST ANSWER: ${userAnswer}`;
  const result = await withRetry(() => chat.sendMessage(prompt));
  return result.response.text();
};

// Parse resume text and extract detailed structured data with interview questions
const parseResumeAdvanced = async (resumeText) => {
  const model = getModel(true);
  const prompt = `You are a strict JSON Resume Parser API. Analyze the provided resume text.

IMPORTANT:
Your response will be directly parsed using JSON.parse() in a production MERN application.
You MUST calculate a realistic 'atsScore' (0-100) based on keyword density, formatting, and industry relevance.

STRICT RULES:
1. Return ONLY pure valid JSON.
2. Do NOT return markdown or \`json blocks.
3. Every property must exist.
4. Response must be directly parsable.

Resume Text:
${resumeText}

Return this exact JSON structure:
{
  "candidate": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },
  "skills": {
    "languages": [],
    "frameworks": [],
    "libraries": [],
    "databases": [],
    "tools": [],
    "cloud": []
  },
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": [],
      "domain": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "description": ""
    }
  ],
  "resumeAnalysis": {
    "atsScore": <integer 0-100>,
    "experienceLevel": "<Junior|Mid-Level|Senior|Expert>",
    "detectedDomains": [],
    "strengths": [],
    "missingSkills": [],
    "recommendedRoles": []
  },
  "interviewQuestions": [
    {
      "id": 1,
      "technology": "",
      "question": "",
      "type": "conceptual|practical|coding|behavioral",
      "difficulty": "easy|medium|hard"
    }
  ]
}

Interview Question Rules:
- Generate exactly 10 high-quality questions.
- Questions must match extracted skills and projects.
- Include: Conceptual, Scenario-based, Coding, and Debugging questions.

FINAL RULE: Return ONLY raw JSON object.`;

  const result = await withRetry(() => model.generateContent(prompt));
  const text = result.response.text();
  return parseGeminiResponse(text);
};

// Parse resume text and extract structured data
const parseResumeWithAI = async (resumeText) => {
  const model = getModel(true);
  const prompt = `Analyze the provided resume text and return a structured JSON object. 
You MUST include a 'resumeAnalysis' field for ATS scoring.

Return ONLY valid JSON with this exact structure:
{
  "candidate": {
    "name": "<name>",
    "email": "<email>",
    "phone": "<phone>",
    "linkedin": "<linkedin url>",
    "location": "<city, country>"
  },
  "resumeAnalysis": {
    "atsScore": <integer 0-100 based on keyword density, formatting, and impact>,
    "experienceLevel": "<Junior|Mid-Level|Senior|Expert>",
    "detectedDomains": ["<domain1>", "<domain2>"],
    "strengths": ["<strength1>", "<strength2>", "<strength3>"],
    "missingSkills": ["<missing1>", "<missing2>", "<missing3>"]
  },
  "skills": {
    "languages": ["<lang1>", "<lang2>"],
    "frameworks": ["<fw1>", "<fw2>"],
    "tools": ["<tool1>", "<tool2>"]
  },
  "experience": [
    { "company": "<name>", "role": "<title>", "duration": "<period>", "highlights": ["<key achievement>"] }
  ],
  "education": [
    { "degree": "<degree>", "institution": "<name>", "year": "<year>" }
  ],
  "primaryTechnology": "<main tech stack>",
  "yearsOfExperience": <number>,
  "keyProjects": ["<project description>"]
}

Resume text:
${resumeText.substring(0, 10000)}`;

  const result = await withRetry(() => model.generateContent(prompt));
  const text = result.response.text();
  return parseGeminiResponse(text);
};

// Query resume context with a specific question
const queryResume = async ({ resumeContext, question }) => {
  const model = getModel(false);
  const prompt = `You are an expert recruiter and technical analyst. Answer the following question based ONLY on the resume context provided.

Resume Context:
${resumeContext}

Question: "${question}"

Instructions:
- If the answer is in the resume, provide a clear and concise response.
- If the information is missing, politely state that the resume does not contain that information.
- Be professional and objective.`;

  const result = await withRetry(() => model.generateContent(prompt));
  return result.response.text();
};

module.exports = {
  generateInterviewQuestions,
  generateMockQuestions,
  analyzeAnswer,
  generateFullReport,
  getAIInterviewerResponse,
  parseResumeWithAI,
  parseResumeAdvanced,
  queryResume
};
