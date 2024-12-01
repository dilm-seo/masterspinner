import React, { useState, useEffect } from 'react';
import { Wand2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { initializeOpenAI, generateArticle, generateMasterSpin } from '../utils/openai';
import { validateWordCount, validateSettings } from '../utils/validation';
import { Settings, Article, BacklinkConfig } from '../types';

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

  const handleAnchorTextChange = (index: number, value: string) => {
    const newAnchorTexts = [...backlink.anchorTexts];
    newAnchorTexts[index] = value;
    setBacklink({ ...backlink, anchorTexts: newAnchorTexts });
  };

  const addAnchorText = () => {
    setBacklink({
      ...backlink,
      anchorTexts: [...backlink.anchorTexts, '']
    });
  };

  const removeAnchorText = (index: number) => {
    if (backlink.anchorTexts.length > 1) {
      const newAnchorTexts = backlink.anchorTexts.filter((_, i) => i !== index);
      setBacklink({ ...backlink, anchorTexts: newAnchorTexts });
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blog Article Generator</h1>
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
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Backlink URL</label>
                  <input
                    type="url"
                    value={backlink.url}
                    onChange={(e) => setBacklink({ ...backlink, url: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://example.com"
                    required={useBacklink}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Anchor Texts</label>
                  {backlink.anchorTexts.map((text, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => handleAnchorTextChange(index, e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter anchor text"
                        required={useBacklink}
                      />
                      {backlink.anchorTexts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAnchorText(index)}
                          className="p-2 text-gray-500 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAnchorText}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Anchor Text
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Occurrences</label>
                    <input
                      type="number"
                      value={backlink.minOccurrences}
                      onChange={(e) => setBacklink({
                        ...backlink,
                        minOccurrences: Math.max(1, parseInt(e.target.value))
                      })}
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Occurrences</label>
                    <input
                      type="number"
                      value={backlink.maxOccurrences}
                      onChange={(e) => setBacklink({
                        ...backlink,
                        maxOccurrences: Math.max(
                          backlink.minOccurrences || 1,
                          parseInt(e.target.value)
                        )
                      })}
                      min={backlink.minOccurrences}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {loading ? 'Generating...' : 'Generate Article'}
          </button>
        </form>
      </div>

      {article && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Original Article</h2>
            <div dangerouslySetInnerHTML={{ __html: article.originalContent }} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Master Spin Version</h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded-lg overflow-auto">
                {article.masterSpin}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}