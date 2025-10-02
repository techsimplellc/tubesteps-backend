const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - restrict to your extension only in production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow chrome-extension:// origins
    if (origin.startsWith('chrome-extension://')) {
      return callback(null, true);
    }
    
    // For development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Rate limiting - 20 requests per 5 minutes per IP
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main API endpoint - proxy to Abacus AI
app.post('/api/process-transcript', async (req, res) => {
  try {
    const { transcript, videoTitle, apiKey } = req.body;
    
    // Validation
    if (!transcript || !videoTitle || !apiKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: transcript, videoTitle, or apiKey'
      });
    }
    
    // Sanitize inputs
    const sanitizedTranscript = sanitizeInput(transcript, 100000);
    const sanitizedTitle = sanitizeInput(videoTitle, 500);
    
    if (!sanitizedTranscript || sanitizedTranscript.length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Transcript is too short or invalid'
      });
    }
    
    console.log(`Processing request - Title: ${sanitizedTitle.substring(0, 50)}...`);
    
    // Call Abacus AI API
    const abacusResponse = await fetch('https://api.abacus.ai/api/v0/evaluatePrompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': apiKey
      },
      body: JSON.stringify({
        llm_name: 'route-llm',
        system_message: `You are an AI assistant that extracts step-by-step instructions from video transcripts. Format the output as a clean markdown document with a title, brief overview, numbered step-by-step instructions with clear action items, and any important notes or tips mentioned. Make the instructions actionable and easy to follow. Remove any filler words, tangents, or unnecessary content. Focus only on the core instructional content.`,
        prompt: `I have a transcript from a YouTube video titled "${sanitizedTitle}". Please analyze this transcript and extract clear, step-by-step instructions that someone can follow to accomplish the task or learn what's being taught in the video.

Here's the transcript:

${sanitizedTranscript}

Please provide ONLY the markdown document with no citations, references, or meta-commentary.`,
        temperature: 0.7,
        max_tokens: 4096
      })
    });
    
    if (!abacusResponse.ok) {
      const errorData = await abacusResponse.json();
      console.error('Abacus AI error:', errorData);
      
      return res.status(abacusResponse.status).json({
        success: false,
        error: errorData.message || 'Failed to process with Abacus AI'
      });
    }
    
    const data = await abacusResponse.json();
    const markdown = data.content || data.result || '';
    
    // Sanitize output
    const sanitizedMarkdown = sanitizeInput(markdown, 50000);
    
    console.log(`Successfully processed - Output length: ${sanitizedMarkdown.length}`);
    
    res.json({
      success: true,
      markdown: sanitizedMarkdown
    });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Input sanitization function
function sanitizeInput(text, maxLength = 100000) {
  if (typeof text !== 'string') {
    return '';
  }
  
  // Remove null bytes and other control characters
  text = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Limit length to prevent abuse
  if (text.length > maxLength) {
    text = text.substring(0, maxLength);
  }
  
  // Trim whitespace
  return text.trim();
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
