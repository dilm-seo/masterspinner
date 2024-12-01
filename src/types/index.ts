export interface Settings {
  apiKey: string;
  model: string;
  writingStyle: WritingStyle;
  language: string;
}

export interface WritingStyle {
  tone: 'professional' | 'casual' | 'academic' | 'persuasive';
  expertise: 'beginner' | 'intermediate' | 'expert';
}

export interface Article {
  keyword: string;
  originalContent: string;
  masterSpin: string;
  wordCount: number;
}

export interface GenerateArticleParams {
  keyword: string;
  wordCount: number;
  writingStyle: WritingStyle;
  model: string;
  language: string;
  backlink?: BacklinkConfig;
}

export interface BacklinkConfig {
  url: string;
  anchorTexts: string[];
  minOccurrences?: number;
  maxOccurrences?: number;
}

export const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português',
  'nl': 'Nederlands',
  'ru': 'Русский',
  'zh': '中文',
  'ja': '日本語'
} as const;