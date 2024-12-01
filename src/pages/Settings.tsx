import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Settings as SettingsType, WritingStyle, SUPPORTED_LANGUAGES } from '../types';

const defaultWritingStyle: WritingStyle = {
  tone: 'professional',
  expertise: 'intermediate'
};

const defaultSettings: SettingsType = {
  apiKey: '',
  model: 'gpt-3.5-turbo',
  writingStyle: defaultWritingStyle,
  language: 'en'
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({
          ...defaultSettings,
          ...parsed,
          writingStyle: {
            ...defaultWritingStyle,
            ...parsed.writingStyle
          }
        });
      } catch (error) {
        console.error('Error parsing settings:', error);
        toast.error('Error loading settings');
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('settings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">OpenAI API Key</label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            value={settings.model}
            onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Writing Tone</label>
          <select
            value={settings.writingStyle.tone}
            onChange={(e) => setSettings({
              ...settings,
              writingStyle: { ...settings.writingStyle, tone: e.target.value as WritingStyle['tone'] }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="academic">Academic</option>
            <option value="persuasive">Persuasive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Expertise Level</label>
          <select
            value={settings.writingStyle.expertise}
            onChange={(e) => setSettings({
              ...settings,
              writingStyle: { ...settings.writingStyle, expertise: e.target.value as WritingStyle['expertise'] }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </button>
      </form>
    </div>
  );
}