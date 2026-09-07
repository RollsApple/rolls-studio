import React, { useState } from 'react';
import { X, Key, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { AIModel } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: AIModel;
  onModelChange: (model: AIModel) => void;
  customApiKey: string;
  onCustomApiKeyChange: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  model,
  onModelChange,
  customApiKey,
  onCustomApiKeyChange,
}) => {
  if (!isOpen) return null;

  const [apiKeyInput, setApiKeyInput] = useState(customApiKey);

  const handleSave = () => {
    onCustomApiKeyChange(apiKeyInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Paramètres & Options</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Status info */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <div>
                <p className="font-semibold text-slate-200">Moteur de génération IA actif</p>
                <p className="text-slate-400 text-[11px]">Connecté au service serveur avec streaming direct</p>
              </div>
            </div>
            <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> En ligne
            </span>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Modèle de génération IA
            </label>
            <select
              value={model}
              onChange={(e) => onModelChange(e.target.value as AIModel)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-amber-500 text-xs"
            >
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Ultra rapide & Recommandé)</option>
              <option value="gemini-flash-latest">Gemini Flash</option>
              <option value="gemini-3.8-flash">Gemini 3.8 Flash</option>
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview (Pour architectures complexes)</option>
            </select>
          </div>

          {/* Optional Custom API Key */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              Clé API personnalisée (Optionnelle)
            </label>
            <p className="text-slate-400 text-[11px]">
              Par défaut, la clé serveur configurée dans l'environnement est utilisée automatiquement.
            </p>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Clé API personnalisée..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-amber-500 text-xs font-mono placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};
