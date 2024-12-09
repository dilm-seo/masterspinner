import { WritingStyle, BacklinkConfig } from '../types';

export const getWritingStylePrompt = (style: WritingStyle): string => {
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

export const getBacklinkPrompt = (backlink: BacklinkConfig): string => {
  const minOcc = backlink.minOccurrences || 1;
  const maxOcc = backlink.maxOccurrences || 3;
  
  return `
    Naturally include ${minOcc}-${maxOcc} backlinks to: ${backlink.url}
    Use these anchor texts randomly: ${backlink.anchorTexts.join(', ')}
    Make sure the links appear natural and contextually relevant.
    Format the links using proper HTML anchor tags.`;
};

export const createArticlePrompt = (
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

export const createSpinPrompt = (content: string, language: string): string => {
  return `Create a highly varied master spin version of the following HTML article in ${language}. 
    CRITICAL REQUIREMENTS:
    1. Create maximum variations for EVERY sentence and phrase using spintax format: {option1|option2|option3|option4|option5}
    2. Generate 4-6 unique variations for each part
    3. Break down complex sentences into smaller parts for more granular spinning
    4. Spin individual words where appropriate (adjectives, verbs, adverbs)
    5. Create variations for:
       - Sentence structures
       - Transition words
       - Descriptive phrases
       - Opening and closing statements
       - List items and examples
       - Calls to action
    6. Maintain all HTML tags and structure exactly as they are
    7. Only spin the text content within the HTML tags
    8. Preserve all links and their anchor texts without spinning them
    9. Each variation MUST:
       - Maintain perfect grammar and natural flow
       - Keep the same meaning and intent
       - Use proper vocabulary for the topic
       - Sound natural in ${language}
       - Maintain the original tone and expertise level

    Original article:
    ${content}

    Remember: The goal is to create MAXIMUM possible variations while maintaining quality and readability.`;
};

export const createAnchorTextPrompt = (url: string, language: string): string => {
  return `Generate 5 natural, SEO-friendly anchor text variations in ${language} for the following URL: ${url}
    Consider:
    - Include both branded and non-branded variations
    - Use a mix of exact match and partial match keywords
    - Keep them natural and contextual
    - Avoid overly promotional language
    - Each anchor text should be 2-5 words long
    - All text must be in ${language}
    
    Return only the anchor texts, one per line.`;
};