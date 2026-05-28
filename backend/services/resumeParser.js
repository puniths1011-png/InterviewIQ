const mammoth = require('mammoth');
const pdf = require('pdf-parse');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractResumeData = async (filePath, mimeType) => {
  let rawText = '';
  
  if (mimeType === 'application/pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    rawText = data.text;
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ path: filePath });
    rawText = result.value;
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Extract the following details from this resume text into JSON format: name, skills (array), projects (array of {name, description}), experience (array of {role, company}). 
  Resume text: ${rawText}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text().replace(/```json|```/g, ''));
};

module.exports = { extractResumeData };
