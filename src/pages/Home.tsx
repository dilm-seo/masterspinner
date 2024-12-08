import React, { useState, useEffect } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { initializeOpenAI, generateArticle, generateMasterSpin } from '../utils/openai';
import { validateWordCount, validateSettings } from '../utils/validation';
import { Settings, Article, BacklinkConfig } from '../types';
import BacklinkForm from '../components/BacklinkForm';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [wordCount, setWordCount] = useState(800);
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [backlink, setBacklink] = useState<BacklinkConfig>({
    url: '',
    anchorTexts: [''],
    minOccurrences: 1,
    maxOccurrences: 3
  });
  const [useBacklink, setUseBacklink] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const settings = localStorage.getItem('settings');
    if (validateSettings(settings)) {
      const { apiKey } = JSON.parse(settings);
      initializeOpenAI(apiKey);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const settings = localStorage.getItem('settings');
    if (!validateSettings(settings)) {
      toast.error('Please configure your API settings first');
      return;
    }

    const { model, writingStyle, language } = JSON.parse(settings) as Settings;
    
    try {
      setLoading(true);
      const originalContent = await generateArticle({
        keyword,
        wordCount,
        writingStyle,
        model,
        language,
        backlink: useBacklink ? backlink : undefined
      });
      const masterSpin = await generateMasterSpin(originalContent, model, language);
      
      setArticle({
        keyword,
        originalContent,
        masterSpin,
        wordCount
      });
    } catch (error) {
      toast.error('Error generating article');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWordCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = validateWordCount(parseInt(e.target.value));
    setWordCount(newCount);
  };

  const copyToClipboard = async () => {
    if (!article) return;
    
    try {
      await navigator.clipboard.writeText(article.masterSpin);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const settings = localStorage.getItem('settings');
  const language = settings ? (JSON.parse(settings) as Settings).language : 'en';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Blog Article Generator</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Keyword</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your keyword..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Word Count</label>
              <input
                type="number"
                value={wordCount}
                onChange={handleWordCountChange}
                min="100"
                max="3000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Min: 100, Max: 3000 words</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useBacklink"
                  checked={useBacklink}
                  onChange={(e) => setUseBacklink(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="useBacklink" className="ml-2 text-sm font-medium text-gray-700">
                  Include Backlink
                </label>
              </div>

              {useBacklink && (
                <BacklinkForm 
                  backlink={backlink} 
                  setBacklink={setBacklink}
                  language={language}
                />
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              icon={Wand2}
            >
              {loading ? 'Generating...' : 'Generate Article'}
            </Button>
          </form>
        </Card>
      </div>

      {article && (
        <div className="max-w-4xl mx-auto mt-8 space-y-8">
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Original Article</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.originalContent }} />
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Master Spin Version</h2>
              <Button
                type="button"
                variant="secondary"
                icon={copied ? Check : Copy}
                onClick={copyToClipboard}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded-lg overflow-auto border border-gray-200">
                {article.masterSpin}
              </pre>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}