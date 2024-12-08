import React from 'react';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { BacklinkConfig } from '../types';
import { generateAnchorTexts } from '../utils/openai';
import toast from 'react-hot-toast';
import Button from './Button';
import Card from './Card';

interface BacklinkFormProps {
  backlink: BacklinkConfig;
  setBacklink: (backlink: BacklinkConfig) => void;
  language: string;
}

export default function BacklinkForm({ backlink, setBacklink, language }: BacklinkFormProps) {
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

  const generateSuggestions = async () => {
    if (!backlink.url) {
      toast.error('Please enter a URL first');
      return;
    }

    try {
      const suggestions = await generateAnchorTexts(backlink.url, language);
      setBacklink({
        ...backlink,
        anchorTexts: suggestions
      });
      toast.success('Anchor texts generated successfully');
    } catch (error) {
      console.error('Error generating anchor texts:', error);
      toast.error('Failed to generate anchor texts');
    }
  };

  return (
    <Card className="bg-gray-50 border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Backlink URL</label>
          <input
            type="url"
            value={backlink.url}
            onChange={(e) => setBacklink({ ...backlink, url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Anchor Texts</label>
            <Button
              type="button"
              variant="secondary"
              icon={Wand2}
              onClick={generateSuggestions}
            >
              Generate Suggestions
            </Button>
          </div>
          {backlink.anchorTexts.map((text, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={text}
                onChange={(e) => handleAnchorTextChange(index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter anchor text"
                required
              />
              {backlink.anchorTexts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAnchorText(index)}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            icon={Plus}
            onClick={addAnchorText}
          >
            Add Anchor Text
          </Button>
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
    </Card>
  );
}