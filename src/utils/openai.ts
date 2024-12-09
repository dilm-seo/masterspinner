import OpenAI from 'openai';
import { GenerateArticleParams } from '../types';
import { 
  createArticlePrompt, 
  createSpinPrompt, 
  createAnchorTextPrompt,
  getWritingStylePrompt 
} from './prompts';

let openaiInstance: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openaiInstance = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const generateAnchorTexts = async (url: string, language: string): Promise<string[]> => {
  if (!openaiInstance) throw new Error('OpenAI not initialized');

  const prompt = createAnchorTextPrompt(url, language);

  const response = await openaiInstance.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
  });

  const content = response.choices[0].message.content || '';
  return content.split('\n').filter(text => text.trim()).slice(0, 5);
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
    temperature: 0.9,
    max_tokens: 4000,
    presence_penalty: 0.6,
    frequency_penalty: 0.8,
  });

  return response.choices[0].message.content || '';
};