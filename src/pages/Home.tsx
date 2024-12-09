import React, { useState, useEffect } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { initializeOpenAI, generateArticle, generateMasterSpin } from '../utils/openai';
import { validateWordCount, validateSettings } from '../utils/validation';
import { Settings, Article, BacklinkConfig } from '../types';
import BacklinkForm from '../components/BacklinkForm';
import Button from '../components/Button';
import Card from '../components/Card';
import Preloader from '../components/Preloader';

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
      toast.success('Article generated successfully!');
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
    <>
      {loading && <Preloader />}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <h1 className="text-3xl font-bold mb-8 text-cyan-400 animate-glow">
              Blog Article Generator
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Keyword</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full"
                  placeholder="Enter your keyword..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Word Count</label>
                <input
                  type="number"
                  value={wordCount}
                  onChange={handleWordCountChange}
                  min="100"
                  max="3000"
                  className="w-full"
                  required
                />
                <p className="mt-1 text-sm text-gray-400">Min: 100, Max: 3000 words</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useBacklink"
                    checked={useBacklink}
                    onChange={(e) => setUseBacklink(e.target.checked)}
                    className="rounded border-gray-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <label htmlFor="useBacklink" className="ml-2 text-sm font-medium">
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
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Original Article</h2>
              <div className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: article.originalContent }} />
            </Card>

            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">Master Spin Version</h2>
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
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {article.masterSpin}
                </pre>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}