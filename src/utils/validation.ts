export const validateWordCount = (count: number): number => {
  const MIN_WORDS = 100;
  const MAX_WORDS = 3000;
  return Math.max(MIN_WORDS, Math.min(MAX_WORDS, count));
};

export const validateSettings = (settings: string | null): boolean => {
  if (!settings) return false;
  try {
    const parsed = JSON.parse(settings);
    return Boolean(parsed.apiKey && parsed.model && parsed.writingStyle);
  } catch {
    return false;
  }
};