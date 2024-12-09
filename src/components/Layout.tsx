import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FileText, Settings } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-cyan-500/20
        shadow-[0_0_15px_rgba(34,211,238,0.2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-4">
              <Link to="/" className="flex items-center px-4 py-2 text-cyan-400 hover:text-cyan-300
                transition-colors duration-300">
                <FileText className="w-6 h-6 mr-2" />
                <span className="font-medium">Blog Generator</span>
              </Link>
              <Link to="/settings" className="flex items-center px-4 py-2 text-cyan-400 hover:text-cyan-300
                transition-colors duration-300">
                <Settings className="w-6 h-6 mr-2" />
                <span className="font-medium">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}