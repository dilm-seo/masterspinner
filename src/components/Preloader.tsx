import React from 'react';
import { Loader2 } from 'lucide-react';

interface PreloaderProps {
  text?: string;
}

export default function Preloader({ text = 'Generating...' }: PreloaderProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto 
          drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]" />
        <p className="text-cyan-400 text-lg font-medium animate-pulse
          drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">
          {text}
        </p>
      </div>
    </div>
  );
}