const Interview = require('../models/Interview');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getNextInterviewQuestion = async (interviewId, userResponse = null) => {
  const interview = await Interview.findById(interviewId).populate('user');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const systemPrompt = `You are an empathetic, professional female senior technical interviewer. 
  Resume Data: ${JSON.stringify(interview.resumeData || {})}
  Interview History: ${JSON.stringify(interview.conversationHistory || [])}
  
  Your goal is to conduct a structured interview.
  1. If history is empty, say a warm greeting and ask: "Tell me about yourself."
  2. If user just answered, provide 1 sentence of constructive feedback, then ask the next question from:
     - Projects in detail.
     - 5 technical questions based on skills.
     - Scenario-based questions on their projects.
  
  Ask one question at a time. No hints. Keep it conversational.`;

  const result = await model.generateContent(`${systemPrompt} \n\n User response: ${userResponse || 'Start'}`);
  const nextQuestion = result.response.text();

  interview.conversationHistory.push({ role: 'assistant', content: nextQuestion });
  if (userResponse) interview.conversationHistory.push({ role: 'user', content: userResponse });
  await interview.save();

  return nextQuestion;
};

module.exports = { getNextInterviewQuestion };
