import React, { useState } from 'react';
import { Copy, Check, Plus, Trash2, Code2, FileText, FileCode, Braces, Sparkles, Download } from 'lucide-react';
import { getLanguageFromName } from '../utils/fileExtractor';

interface CodeEditorPanelProps {
  files: Record<string, string>;
  activeFile: string;
  onSelectFile: (filename: string) => void;
  onUpdateFileContent: (filename: string, content: string) => void;
  onCreateFile: (filename: string) => void;
  onDeleteFile: (filename: string) => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  files,
  activeFile,
  onSelectFile,
  onUpdateFileContent,
  onCreateFile,
  onDeleteFile,
}) => {
  const [copied, setCopied] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const filenames = Object.keys(files);
  const currentContent = files[activeFile] || '';
  const lines = currentContent.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const name = newFileName.trim();
    onCreateFile(name);
    setNewFileName('');
    setIsCreatingFile(false);
  };

  const getFileIcon = (filename: string) => {
    const lang = getLanguageFromName(filename);
    if (lang === 'html') return <Code2 className="w-3.5 h-3.5 text-orange-400" />;
    if (lang === 'css') return <Braces className="w-3.5 h-3.5 text-sky-400" />;
    if (lang === 'javascript') return <FileCode className="w-3.5 h-3.5 text-yellow-400" />;
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 font-mono text-xs select-none">
      {/* File Tabs bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-2 overflow-x-auto shrink-0 scrollbar-none">
        <div className="flex items-center gap-1 py-1">
          {filenames.map((name) => {
            const isActive = name === activeFile;
            return (
              <button
                key={name}
                onClick={() => onSelectFile(name)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {getFileIcon(name)}
                <span>{name}</span>
                {filenames.length > 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Supprimer ${name} ?`)) {
                        onDeleteFile(name);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 rounded transition-opacity ml-1"
                    title="Supprimer ce fichier"
                  >
                    ×
                  </span>
                )}
              </button>
            );
          })}

          {/* New file button */}
          {isCreatingFile ? (
            <form onSubmit={handleCreateSubmit} className="flex items-center gap-1">
              <input
                type="text"
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="nom.ext"
                className="bg-slate-900 text-slate-100 border border-amber-500/60 rounded px-2 py-1 outline-none text-xs w-28"
                onBlur={() => {
                  if (!newFileName.trim()) setIsCreatingFile(false);
                }}
              />
            </form>
          ) : (
            <button
              onClick={() => setIsCreatingFile(true)}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Ajouter un nouveau fichier"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 pl-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Copier le contenu du fichier"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Télécharger ce fichier individuellement"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line numbers column */}
        <div className="w-12 py-3 bg-slate-950/80 border-r border-slate-800/80 text-right pr-2 text-slate-600 font-mono text-[11px] select-none overflow-hidden shrink-0">
          {lines.map((_, i) => (
            <div key={i} className="leading-5">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          value={currentContent}
          onChange={(e) => onUpdateFileContent(activeFile, e.target.value)}
          spellCheck={false}
          className="flex-1 py-3 px-3 bg-transparent text-slate-200 font-mono text-[11px] leading-5 outline-none resize-none overflow-auto whitespace-pre tab-4 select-text selection:bg-amber-500/30"
        />
      </div>

      {/* Editor Footer Bar */}
      <div className="h-7 px-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
        <div className="flex items-center gap-3">
          <span>{activeFile}</span>
          <span>{lines.length} lignes</span>
          <span>{(new Blob([currentContent]).size / 1024).toFixed(1)} Ko</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="uppercase text-[10px] text-amber-500/80 font-semibold tracking-wider">
            {getLanguageFromName(activeFile)}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Modifiable en direct</span>
        </div>
      </div>
    </div>
  );
};
