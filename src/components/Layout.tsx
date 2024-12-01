import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FileText, Settings } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900">
                <FileText className="w-6 h-6 mr-2" />
                <span className="font-medium">Blog Generator</span>
              </Link>
              <Link to="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900">
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