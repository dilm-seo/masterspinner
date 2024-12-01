import OpenAI from 'openai';
import { GenerateArticleParams, WritingStyle, BacklinkConfig } from '../types';

let openaiInstance: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openaiInstance = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

const getWritingStylePrompt = (style: WritingStyle): string => {
  const toneGuide = {
    professional: 'Use a formal, business-oriented tone with industry-specific terminology',
    casual: 'Write in a conversational, friendly tone that is easy to understand',
    academic: 'Employ scholarly language with proper citations and technical terminology',
    persuasive: 'Use compelling arguments and emotional triggers to convince the reader'
  };

  const expertiseGuide = {
    beginner: 'Explain concepts in simple terms with basic examples',
    intermediate: 'Balance technical details with practical applications',
    expert: 'Dive deep into advanced concepts and industry-specific details'
  };

  return `${toneGuide[style.tone]}. ${expertiseGuide[style.expertise]}.`;
};

const getBacklinkPrompt = (backlink: BacklinkConfig): string => {
  const minOcc = backlink.minOccurrences || 1;
  const maxOcc = backlink.maxOccurrences || 3;
  
  return `
    Naturally include ${minOcc}-${maxOcc} backlinks to: ${backlink.url}
    Use these anchor texts randomly: ${backlink.anchorTexts.join(', ')}
    Make sure the links appear natural and contextually relevant.
    Format the links using proper HTML anchor tags.`;
};

const createArticlePrompt = (
  keyword: string, 
  wordCount: number, 
  styleGuide: string,
  language: string,
  backlink?: BacklinkConfig
): string => {
  const backlinkPrompt = backlink ? getBacklinkPrompt(backlink) : '';
  
  return `Write a comprehensive, SEO-optimized blog article about "${keyword}" in ${language}.
    Target exactly ${wordCount} words.
    ${styleGuide}
    ${backlinkPrompt}
    Include proper HTML structure with semantic tags (h1, h2, h3, p, ul, li, etc.).
    Ensure proper keyword density and LSI keywords throughout the text.
    Include a compelling meta description in an HTML comment at the top.
    Structure the content with:
    - An engaging introduction
    - Well-organized main points
    - Practical examples or case studies
    - A strong conclusion
    - Clear calls to action`;
};

const createSpinPrompt = (content: string, language: string): string => {
  return `Create a master spin version of the following HTML article in ${language}. 
    For each important phrase or sentence, provide 3-4 high-quality alternative versions using the spintax format: {option1|option2|option3|option4}.
    Maintain all HTML tags and structure exactly as they are.
    Only spin the text content within the HTML tags.
    Preserve all links and their anchor texts without spinning them.
    Ensure each variation:
    - Maintains the same tone and expertise level
    - Uses proper grammar and natural language
    - Preserves the original meaning
    - Varies in structure and vocabulary

    Original article:
    ${content}`;
};

export const generateArticle = async ({ 
  keyword, 
  wordCount, 
  writingStyle, 
  model,
  language,
  backlink 
}: GenerateArticleParams) => {
  if (!openaiInstance) throw new Error('OpenAI not initialized');

  const styleGuide = getWritingStylePrompt(writingStyle);
  const prompt = createArticlePrompt(keyword, wordCount, styleGuide, language, backlink);

  const response = await openaiInstance.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content || '';
};

export const generateMasterSpin = async (content: string, model: string, language: string) => {
  if (!openaiInstance) throw new Error('OpenAI not initialized');

  const prompt = createSpinPrompt(content, language);

  const response = await openaiInstance.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 3000,
  });

  return response.choices[0].message.content || '';
};