import React from 'react';
import { Sparkles, Settings, RefreshCw } from 'lucide-react';
import { AIModel } from '../types';

interface HeaderProps {
  model: AIModel;
  onModelChange: (model: AIModel) => void;
  onNewProject: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  model,
  onModelChange,
  onNewProject,
  onOpenSettings,
}) => {
  return (
    <header className="h-14 border-b border-slate-800/80 bg-slate-950 px-3 sm:px-5 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Brand Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-[1px] shadow-md shadow-amber-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
            Rolls <span className="text-amber-400 font-extrabold">Studio</span>
          </span>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            En direct
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Model Selector (Desktop) */}
        <div className="hidden md:flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          <select
            value={model}
            onChange={(e) => onModelChange(e.target.value as AIModel)}
            className="bg-transparent text-xs text-slate-300 font-medium px-2.5 py-1.5 rounded-md outline-none cursor-pointer hover:text-white transition-colors"
          >
            <option value="gemini-3.1-flash-lite" className="bg-slate-900 text-white">Gemini 3.1 Flash Lite (Recommandé)</option>
            <option value="gemini-flash-latest" className="bg-slate-900 text-white">Gemini Flash</option>
            <option value="gemini-3.8-flash" className="bg-slate-900 text-white">Gemini 3.8 Flash</option>
            <option value="gemini-3.1-pro-preview" className="bg-slate-900 text-white">Gemini Pro Preview</option>
          </select>
        </div>

        {/* New Project Button */}
        <button
          onClick={onNewProject}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Réinitialiser le projet"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Nouveau</span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors cursor-pointer"
          title="Paramètres & Options"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
