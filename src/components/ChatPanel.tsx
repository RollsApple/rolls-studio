import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Square,
  Sparkles,
  Bot,
  User,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Circle,
  Eye,
  Download,
  MessageSquare,
  ListChecks,
  FileText,
  LayoutGrid,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { PROMPT_SUGGESTIONS } from '../data/templates';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  onClearChat: () => void;
  onExportZip: () => void;
  onViewProject: () => void;
  isExportingZip?: boolean;
}

interface ProgressStep {
  level: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'waiting';
}

// Detect if a message is an actual website code generation / update
function isCodeGenerationMessage(rawContent: string, extractedFiles?: Record<string, string>): boolean {
  if (extractedFiles && Object.keys(extractedFiles).length > 0) return true;
  if (!rawContent) return false;
  return (
    rawContent.includes('```html') ||
    rawContent.includes('```css') ||
    rawContent.includes('```javascript') ||
    (rawContent.includes('index.html') && rawContent.includes('<!DOCTYPE')) ||
    (rawContent.includes('style.css') && rawContent.includes('{'))
  );
}

function calculateProgressSteps(
  rawContent: string,
  isStreaming: boolean,
  hasFiles: boolean
): ProgressStep[] {
  const hasIndex = rawContent.includes('index.html');
  const hasStyle = rawContent.includes('style.css');
  const hasScript = rawContent.includes('script.js');

  // If generation is complete and files exist (or completed response)
  if (!isStreaming && (hasFiles || hasIndex)) {
    return [
      { level: 1, title: 'Analyse & Conception', description: 'Architecture & wireframe du site', status: 'completed' },
      { level: 2, title: 'Structure HTML5', description: 'Balisage sémantique (index.html)', status: 'completed' },
      { level: 3, title: 'Design & Responsive CSS', description: 'Styles, palettes et typographies (style.css)', status: 'completed' },
      { level: 4, title: 'Logique & Interactions JS', description: 'Animations et dynamique interactive (script.js)', status: 'completed' },
      { level: 5, title: 'Assemblage & Finalisation', description: 'Intégration complète et optimisation du site', status: 'completed' },
    ];
  }

  // During active streaming of code
  let s1: 'completed' | 'in_progress' | 'waiting' = 'in_progress';
  let s2: 'completed' | 'in_progress' | 'waiting' = 'waiting';
  let s3: 'completed' | 'in_progress' | 'waiting' = 'waiting';
  let s4: 'completed' | 'in_progress' | 'waiting' = 'waiting';
  let s5: 'completed' | 'in_progress' | 'waiting' = 'waiting';

  if (rawContent.length > 25) {
    s1 = 'completed';
    s2 = 'in_progress';
  }
  if (hasIndex) {
    s1 = 'completed';
    if (hasStyle) {
      s2 = 'completed';
      s3 = 'in_progress';
    } else {
      s2 = 'in_progress';
    }
  }
  if (hasStyle) {
    s2 = 'completed';
    if (hasScript) {
      s3 = 'completed';
      s4 = 'in_progress';
    } else {
      s3 = 'in_progress';
    }
  }
  if (hasScript) {
    s3 = 'completed';
    const scriptIdx = rawContent.lastIndexOf('script.js');
    const afterScript = rawContent.slice(scriptIdx);
    if (afterScript.includes('```') && afterScript.indexOf('```') !== afterScript.lastIndexOf('```')) {
      s4 = 'completed';
      s5 = 'in_progress';
    } else {
      s4 = 'in_progress';
    }
  }

  return [
    { level: 1, title: 'Analyse & Conception', description: 'Architecture & wireframe du site', status: s1 },
    { level: 2, title: 'Structure HTML5', description: 'Balisage sémantique (index.html)', status: s2 },
    { level: 3, title: 'Design & Responsive CSS', description: 'Styles, palettes et typographies (style.css)', status: s3 },
    { level: 4, title: 'Logique & Interactions JS', description: 'Animations et dynamique interactive (script.js)', status: s4 },
    { level: 5, title: 'Assemblage & Finalisation', description: 'Intégration complète et optimisation du site', status: s5 },
  ];
}

// Strip out any code blocks so the user never sees raw code on the site
function cleanMessageContent(raw: string): string {
  if (!raw) return '';
  const stripped = raw
    .replace(/```[\s\S]*?(?:```|$)/g, '')
    .replace(/```[a-zA-Z0-9_:.-]*/g, '')
    .trim();
  return stripped;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isStreaming,
  onStopStreaming,
  onClearChat,
  onExportZip,
  onViewProject,
  isExportingZip = false,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Adjust textarea height automatically
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim() || isStreaming) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleSuggestionClick = (promptText: string) => {
    if (isStreaming) return;
    onSendMessage(promptText);
  };

  const getSuggestionIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'ListChecks':
        return <ListChecks className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'FileText':
        return <FileText className="w-4 h-4 text-blue-400 shrink-0" />;
      case 'LayoutGrid':
      case 'LayoutKanban':
        return <LayoutGrid className="w-4 h-4 text-purple-400 shrink-0" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border-r border-slate-800/80 relative">
      {/* Panel Header */}
      <div className="h-12 px-4 border-b border-slate-800/80 bg-slate-950 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-amber-400" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200">Conseiller & Développeur IA</span>
            <span className="hidden sm:inline-block text-[9px] font-medium text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-full">
              Échange • Plan • Code
            </span>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-900 cursor-pointer"
            title="Effacer la conversation"
          >
            <Trash2 className="w-3 h-3" />
            <span>Effacer</span>
          </button>
        )}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 text-sm scrollbar-thin scrollbar-thumb-slate-800">
        {messages.length === 0 ? (
          <div className="py-6 px-2 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">Discuter, planifier ou concevoir un site</h2>
            <p className="text-xs text-slate-400 max-w-sm mb-6">
              Posez vos questions, échangez sur votre idée, préparez un plan d'action ou demandez à l'IA de coder votre site web.
            </p>

            {/* Suggestions */}
            <div className="w-full space-y-2 text-left">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">
                Suggestions de départ :
              </span>
              {PROMPT_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(item.prompt)}
                  className="w-full p-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 text-left transition-all group flex items-start justify-between gap-2.5 cursor-pointer"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 p-1 rounded-lg bg-slate-800/70 border border-slate-700/50">
                      {getSuggestionIcon(item.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                        {item.prompt}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 shrink-0 mt-1 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            const hasExtractedFiles = !!(msg.extractedFiles && Object.keys(msg.extractedFiles).length > 0);
            const isMsgStreaming = !!msg.isStreaming;

            if (isUser) {
              return (
                <div key={msg.id} className="flex flex-col items-end max-w-full">
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-medium text-slate-400">Vous</span>
                    <User className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="rounded-2xl px-3.5 py-2.5 max-w-[90%] break-words bg-amber-500/15 border border-amber-500/30 text-amber-50 text-xs sm:text-sm">
                    {msg.content}
                  </div>
                </div>
              );
            }

            // Assistant message
            const isCodeGen = isCodeGenerationMessage(msg.content, msg.extractedFiles);
            const cleanContent = isCodeGen ? cleanMessageContent(msg.content) : msg.content;
            const steps = calculateProgressSteps(msg.content, isMsgStreaming, hasExtractedFiles);
            const allStepsCompleted = steps.every((s) => s.status === 'completed');

            return (
              <div key={msg.id} className="flex flex-col items-start max-w-full">
                <div className="flex items-center justify-between w-full px-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] font-semibold text-amber-400">Assistant IA</span>
                  </div>
                  {isCodeGen && (
                    <span className="text-[9px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Génération de site
                    </span>
                  )}
                </div>

                <div className="w-full max-w-full rounded-2xl p-3.5 sm:p-4 bg-slate-900 border border-slate-800 text-slate-200 space-y-3">
                  {/* Clean text description / conversation (NO code blocks) */}
                  {cleanContent ? (
                    <div className="prose prose-invert prose-xs max-w-none text-slate-300 leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {cleanContent}
                      </ReactMarkdown>
                    </div>
                  ) : isMsgStreaming ? (
                    <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Réflexion en cours...</span>
                    </div>
                  ) : null}

                  {/* Progressive Generation Steps (ONLY rendered if message is a code generation) */}
                  {isCodeGen && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                        <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Étapes de génération progressive</span>
                        </span>
                        {isMsgStreaming && (
                          <span className="text-[10px] font-medium text-amber-400 flex items-center gap-1 animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" /> En cours...
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {steps.map((step) => {
                          let statusIcon;
                          let textColor = 'text-slate-400';
                          let statusBadge;

                          if (step.status === 'completed') {
                            statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
                            textColor = 'text-slate-200';
                            statusBadge = (
                              <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                Terminé
                              </span>
                            );
                          } else if (step.status === 'in_progress') {
                            statusIcon = <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0 mt-0.5" />;
                            textColor = 'text-amber-300 font-medium';
                            statusBadge = (
                              <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded animate-pulse">
                                En cours
                              </span>
                            );
                          } else {
                            statusIcon = <Circle className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />;
                            textColor = 'text-slate-500';
                            statusBadge = (
                              <span className="text-[9px] font-medium text-slate-600 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                                En attente
                              </span>
                            );
                          }

                          return (
                            <div
                              key={step.level}
                              className="flex items-start justify-between gap-2 text-xs py-1"
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                {statusIcon}
                                <div>
                                  <div className={`text-xs font-medium leading-tight ${textColor}`}>
                                    Niveau {step.level} : {step.title}
                                  </div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">
                                    {step.description}
                                  </div>
                                </div>
                              </div>
                              <div className="shrink-0">{statusBadge}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Completion Card with "Télécharger" and "Voir" buttons (ONLY for code generation) */}
                  {isCodeGen && (allStepsCompleted || hasExtractedFiles) && !isMsgStreaming && (
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-md">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>La génération du site est complète !</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mb-3">
                        Votre site web est prêt et opérationnel. Vous pouvez le visualiser directement ou télécharger le projet complet.
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={onViewProject}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Voir le projet</span>
                        </button>

                        <button
                          onClick={onExportZip}
                          disabled={isExportingZip}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                          title="Télécharger le code sous forme d'archive .ZIP"
                        >
                          <Download className="w-4 h-4 text-amber-400" />
                          <span>{isExportingZip ? 'Téléchargement...' : 'Télécharger'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/95 shrink-0">
        <div className="relative bg-slate-900 border border-slate-800 rounded-xl focus-within:border-amber-500/50 transition-all p-2 shadow-inner">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Discutez, demandez un plan, des conseils ou dites 'Génère le site'..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none resize-none max-h-36 pr-10"
          />

          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 mt-1">
            <div className="text-[10px] text-slate-500 hidden sm:block">
              <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">Entrée</kbd> pour envoyer
            </div>

            <div className="flex items-center gap-1 ml-auto">
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopStreaming}
                  className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Square className="w-3 h-3 fill-rose-400" />
                  <span>Arrêter</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!inputText.trim()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  <span>Envoyer</span>
                  <Send className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
