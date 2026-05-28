const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth'); // Added for .docx parsing
const Interview = require('../models/Interview');
const { parseResumeWithAI, parseResumeAdvanced, generateInterviewQuestions } = require('../services/aiService');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user ? req.user.id : 'anonymous';
    const uniqueName = `resume_${userId}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.txt', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} is not supported. Please upload a PDF, TXT, or DOCX file.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }
});

// @route   POST /api/resume/upload
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      console.error('Upload Error: No file provided');
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    console.log(`Processing upload: ${req.file.originalname} (${req.file.mimetype})`);

    // Extract text from PDF, TXT, or DOCX
    let resumeText = '';
    const ext = path.extname(req.file.originalname).toLowerCase();

    try {
      if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        resumeText = pdfData.text;
      } else if (ext === '.txt') {
        resumeText = fs.readFileSync(req.file.path, 'utf-8');
      } else if (ext === '.docx') {
        const result = await mammoth.extractRawText({ path: req.file.path });
        resumeText = result.value;
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      return res.status(400).json({ success: false, message: 'Could not read the file content.' });
    }

    if (!resumeText || !resumeText.trim()) {
      console.error('Upload Error: Extracted text is empty');
      return res.status(400).json({ success: false, message: 'Could not extract text from the file.' });
    }

    console.log(`Extracted ${resumeText.length} characters of text. Parsing with AI...`);

    // Parse with AI
    let parsedData;
    try {
      parsedData = await parseResumeWithAI(resumeText);
      console.log('AI Parsing successful:', parsedData?.candidate?.name || parsedData?.name || 'Unknown Name');
      
      // Safety check: ensure parsedData exists and has defaults
      if (!parsedData) {
        throw new Error('AI returned empty response');
      }

      // Normalization: Ensure frontend gets exactly what it needs
      if (!parsedData.resumeAnalysis) {
        parsedData.resumeAnalysis = {
          atsScore: parsedData.atsScore || parsedData.score || 0,
          experienceLevel: parsedData.experienceLevel || 'Mid-Level',
          detectedDomains: parsedData.detectedDomains || [],
          strengths: parsedData.strengths || [],
          missingSkills: parsedData.missingSkills || []
        };
      }

      // If candidate info is at top level, move it to candidate object
      if (!parsedData.candidate) {
        parsedData.candidate = {
          name: parsedData.name || '',
          email: parsedData.email || '',
          phone: parsedData.phone || '',
          linkedin: parsedData.linkedin || ''
        };
      }
      
    } catch (aiError) {
      console.error('AI Parsing FATAL error:', aiError.message, aiError.stack);
      // Fallback data so the user can still proceed or get a better error
      parsedData = {
        candidate: { name: 'Candidate' },
        resumeAnalysis: {
          atsScore: 1, // Changed to 1 to distinguish from "not found" 0
          experienceLevel: 'Junior',
          detectedDomains: [],
          strengths: ['AI parsing failed, using basic analysis'],
          missingSkills: []
        },
        skills: { languages: [], frameworks: [], tools: [] },
        experience: [],
        education: [],
        primaryTechnology: 'General'
      };
    }

    // Clean up file
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    // Extract skills for Interview model (flatten them if they are in the new object format)
    let flatSkills = [];
    if (parsedData.skills) {
      if (Array.isArray(parsedData.skills)) {
        flatSkills = parsedData.skills;
      } else if (typeof parsedData.skills === 'object') {
        flatSkills = [
          ...(parsedData.skills.languages || []),
          ...(parsedData.skills.frameworks || []),
          ...(parsedData.skills.tools || [])
        ];
      }
    }

    // Create the Interview immediately with robust fallbacks
    const interview = await Interview.create({
      user: req.user.id,
      type: 'resume-based',
      technology: parsedData.primaryTechnology || 'General Technical',
      status: 'in-progress',
      resumeData: {
        parsedText: resumeText.substring(0, 10000),
        skills: flatSkills,
        experience: Array.isArray(parsedData.experience) ? parsedData.experience.map(e => `${e.role || 'Role'} at ${e.company || 'Company'}`) : [],
        education: Array.isArray(parsedData.education) ? parsedData.education.map(e => e.degree || 'Degree') : [],
        resumeAnalysis: parsedData.resumeAnalysis || {}
      },
      conversationHistory: [] 
    });

    console.log(`Interview session created: ${interview._id}. ATS Score: ${parsedData.resumeAnalysis?.atsScore || 0}`);
    res.json({ success: true, interviewId: interview._id, parsedResume: parsedData });
  } catch (error) {
    console.error('General uploadResume error:', error);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    next(error);
  }
};

// @route   POST /api/resume/start-interview
// Start a resume-based interview using parsed resume data
const startResumeInterview = async (req, res, next) => {
  try {
    const { parsedResume, technology, mode } = req.body;

    if (!parsedResume) {
      console.error('Start Interview Error: No resume data provided');
      return res.status(400).json({ success: false, message: 'Resume data is required.' });
    }

    const candidateName = parsedResume.candidate?.name || parsedResume.name || 'Candidate';
    console.log(`Starting interview for: ${candidateName}`);

    // Build context string for AI - with robust safety checks
    let skillsString = 'N/A';
    if (parsedResume.skills) {
      if (Array.isArray(parsedResume.skills)) {
        skillsString = parsedResume.skills.join(', ');
      } else if (typeof parsedResume.skills === 'object') {
        skillsString = [
          ...(parsedResume.skills.languages || []),
          ...(parsedResume.skills.frameworks || []),
          ...(parsedResume.skills.tools || [])
        ].join(', ');
      }
    }

    const experience = Array.isArray(parsedResume.experience) 
      ? parsedResume.experience.map(e => `${e.role || 'Role'} at ${e.company || 'Company'} (${e.duration || 'N/A'})`).join('; ') 
      : 'N/A';
    const education = Array.isArray(parsedResume.education) 
      ? parsedResume.education.map(e => `${e.degree || 'Degree'} from ${e.institution || 'Institution'}`).join('; ') 
      : 'N/A';
    const projects = Array.isArray(parsedResume.keyProjects) ? parsedResume.keyProjects.join('; ') : 'N/A';

    const resumeContext = `
Name: ${candidateName}
Title: ${parsedResume.title || 'N/A'}
Years of Experience: ${parsedResume.yearsOfExperience || 'N/A'}
Skills: ${skillsString}
Experience: ${experience}
Education: ${education}
Key Projects: ${projects}
    `.trim();

    const tech = technology || (parsedResume && parsedResume.primaryTechnology) || 'Full Stack';
    let rawLevel = (parsedResume && parsedResume.resumeAnalysis?.experienceLevel) || parsedResume.experienceLevel || 'mid';
    let level = rawLevel.toLowerCase();
    if (!['junior', 'mid', 'senior', 'expert'].includes(level)) {
        level = 'mid';
    }

    // Generate tailored questions
    console.log('Generating tailored questions...');
    const generatedQuestions = await generateInterviewQuestions({
      technology: tech,
      experienceLevel: level,
      resumeContext
    });

    const questionTexts = generatedQuestions.map(q => q.question);

    const interview = await Interview.create({
      user: req.user.id,
      type: 'resume-based',
      technology: tech,
      experienceLevel: level,
      mode: mode || 'text',
      questions: questionTexts,
      resumeData: {
        skills: skillsString.split(', '),
        experience: Array.isArray(parsedResume.experience) ? parsedResume.experience.map(e => `${e.role} at ${e.company}`) : [],
        education: Array.isArray(parsedResume.education) ? parsedResume.education.map(e => e.degree) : [],
        parsedText: resumeContext,
        resumeAnalysis: parsedResume.resumeAnalysis || {}
      },
      analytics: { totalQuestions: 10 },
      conversationHistory: [{
        role: 'assistant',
        content: `Hello ${candidateName}! I've reviewed your resume and I'm impressed by your background. I'll ask you 10 questions tailored to your experience.\n\nQuestion 1: ${questionTexts[0]}`
      }]
    });

    console.log(`Interview started: ${interview._id}`);
    res.status(201).json({
      success: true,
      message: 'Resume-based interview started!',
      interviewId: interview._id,
      questions: generatedQuestions,
      firstMessage: interview.conversationHistory[0].content,
      resumeSummary: {
        name: candidateName,
        skills: skillsString.split(', '),
        level: level
      }
    });
  } catch (error) {
    console.error('General startResumeInterview error:', error);
    next(error);
  }
};

// @route   POST /api/resume/:id/query
// Ask a question about the resume
const queryResumeContent = async (req, res, next) => {
  try {
    const { question } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    if (!interview.resumeData || !interview.resumeData.parsedText) {
      return res.status(400).json({ success: false, message: 'No resume context found for this session.' });
    }

    const { queryResume } = require('../services/aiService');
    const answer = await queryResume({
      resumeContext: interview.resumeData.parsedText,
      question
    });

    // Optionally save to conversation history
    interview.conversationHistory.push(
      { role: 'user', content: `[Resume Query]: ${question}` },
      { role: 'assistant', content: answer }
    );
    await interview.save();

    res.json({ success: true, answer });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/resume/analyze
// Advanced resume analysis with integrated question generation
const analyzeResumeAdvanced = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Extract text
    let resumeText = '';
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      resumeText = pdfData.text;
    } else if (ext === '.txt') {
      resumeText = fs.readFileSync(req.file.path, 'utf-8');
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: req.file.path });
      resumeText = result.value;
    }

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ success: false, message: 'Could not extract text from file.' });
    }

    // Parse with advanced AI prompt
    let analysis = await parseResumeAdvanced(resumeText);

    // Normalization: Ensure frontend gets exactly what it needs
    if (analysis && !analysis.resumeAnalysis) {
      analysis.resumeAnalysis = {
        atsScore: analysis.atsScore || analysis.score || 0,
        experienceLevel: analysis.experienceLevel || 'Mid-Level',
        detectedDomains: analysis.detectedDomains || [],
        strengths: analysis.strengths || [],
        missingSkills: analysis.missingSkills || []
      };
    }
    if (analysis && !analysis.candidate) {
      analysis.candidate = {
        name: analysis.name || '',
        email: analysis.email || '',
        phone: analysis.phone || '',
        linkedin: analysis.linkedin || ''
      };
    }

    // Clean up
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      parsedResume: analysis
    });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    next(error);
  }
};

module.exports = { upload, uploadResume, startResumeInterview, queryResumeContent, analyzeResumeAdvanced };
