import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { SettingsModal } from './components/SettingsModal';
import {
  ChatMessage,
  AIModel,
} from './types';
import { streamAIChat } from './services/aiService';
import { extractFilesFromResponse } from './utils/fileExtractor';
import { exportFilesToZip, downloadBlob } from './utils/zipExporter';
import { MessageSquare, Eye, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [projectName, setProjectName] = useState<string>('Rolls Studio');
  const [files, setFiles] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [model, setModel] = useState<AIModel>('gemini-3.1-flash-lite');
  const [activeTabMobile, setActiveTabMobile] = useState<'chat' | 'preview'>('preview');
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Custom API key override (optional)
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem('APP_CUSTOM_API_KEY') || '';
  });

  // Notification toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCustomApiKeyChange = (key: string) => {
    setCustomApiKey(key);
    if (key) {
      localStorage.setItem('APP_CUSTOM_API_KEY', key);
      showToast('Clé API personnalisée enregistrée', 'success');
    } else {
      localStorage.removeItem('APP_CUSTOM_API_KEY');
      showToast('Utilisation du moteur par défaut', 'info');
    }
  };

  // ZIP Export handler
  const handleExportZip = async () => {
    if (Object.keys(files).length === 0) {
      showToast("Aucun fichier à télécharger pour l'instant. Décrivez ou générez d'abord un site !", 'info');
      return;
    }
    try {
      setIsExportingZip(true);
      const blob = await exportFilesToZip(files, projectName);
      downloadBlob(blob, `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`);

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.2 },
        colors: ['#f59e0b', '#f97316', '#3b82f6', '#10b981'],
      });

      showToast(`Archive .ZIP téléchargée avec succès (${Object.keys(files).length} fichiers) !`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Erreur lors de la compression ZIP : ' + err.message, 'error');
    } finally {
      setIsExportingZip(false);
    }
  };

  // View Project handler
  const handleViewProject = () => {
    setActiveTabMobile('preview');
    if (Object.keys(files).length === 0) {
      showToast("L'espace d'aperçu est prêt. Vous pouvez demander à l'IA de concevoir votre site !", 'info');
    } else {
      showToast('Affichage du site en direct', 'info');
    }
  };

  // New Project
  const handleNewProject = () => {
    if (confirm('Voulez-vous réinitialiser le projet et la discussion ?')) {
      setFiles({});
      setProjectName('Rolls Studio');
      setMessages([]);
      showToast('Espace de travail réinitialisé', 'info');
    }
  };

  // Send message to AI
  const handleSendMessage = async (text: string) => {
    const userMsgId = Math.random().toString(36).substring(2, 9);
    const assistantMsgId = Math.random().toString(36).substring(2, 9);

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const initialAssistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let accumulatedResponse = '';

    try {
      // Build conversation history for AI
      const conversationHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      await streamAIChat({
        messages: conversationHistory,
        model,
        customApiKey: customApiKey.trim() || undefined,
        currentFiles: files,
        signal: abortController.signal,
        onChunk: (chunk: string) => {
          accumulatedResponse += chunk;

          // Incrementally extract files while streaming
          const currentExtracted = extractFilesFromResponse(accumulatedResponse);
          if (Object.keys(currentExtracted).length > 0) {
            setFiles((prev) => ({ ...prev, ...currentExtracted }));
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: accumulatedResponse,
                    extractedFiles:
                      Object.keys(currentExtracted).length > 0
                        ? currentExtracted
                        : msg.extractedFiles,
                  }
                : msg
            )
          );
        },
      });

      // Final pass file extraction
      const finalExtracted = extractFilesFromResponse(accumulatedResponse);
      const hasExtractedFiles = Object.keys(finalExtracted).length > 0;

      if (hasExtractedFiles) {
        setFiles((prev) => ({ ...prev, ...finalExtracted }));
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: accumulatedResponse,
                extractedFiles: hasExtractedFiles ? finalExtracted : msg.extractedFiles,
                isStreaming: false,
              }
            : msg
        )
      );

      if (hasExtractedFiles) {
        showToast(`La génération du site est complète !`, 'success');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: accumulatedResponse + '\n\n*(Génération interrompue)*',
                  isStreaming: false,
                }
              : msg
          )
        );
        showToast('Génération interrompue', 'info');
      } else {
        console.error('Erreur streaming chat:', err);
        let errorMsg = err.message || 'Une erreur est survenue lors de la communication avec le serveur IA.';

        // Strip raw JSON if present
        if (typeof errorMsg === 'string' && errorMsg.includes('{') && errorMsg.includes('}')) {
          try {
            const start = errorMsg.indexOf('{');
            const end = errorMsg.lastIndexOf('}');
            const parsed = JSON.parse(errorMsg.slice(start, end + 1));
            if (parsed.error?.message) errorMsg = parsed.error.message;
            else if (parsed.message) errorMsg = parsed.message;
          } catch {
            // keep errorMsg
          }
        }

        if (errorMsg.includes('503') || errorMsg.includes('high demand') || errorMsg.includes('UNAVAILABLE')) {
          errorMsg = "Le modèle IA subit une forte affluence momentanée. Le système bascule automatiquement, veuillez patienter ou réessayer dans un instant.";
        } else if (errorMsg.includes('429') || errorMsg.includes('Quota') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
          errorMsg = "Le quota journalier de requêtes de ce modèle est atteint. Vous pouvez utiliser Gemini 3.1 Flash Lite ou configurer votre clé API personnelle dans les Paramètres.";
        }

        showToast(errorMsg, 'error');

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content:
                    accumulatedResponse ||
                    `⚠️ **Information de génération :**\n\n${errorMsg}\n\n*Vous pouvez relancer la demande en cliquant sur Générer.*`,
                  isStreaming: false,
                }
              : msg
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
  };

  const handleClearChat = () => {
    setMessages([]);
    showToast('Discussion effacée', 'info');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header without ZIP and without editable project name */}
      <Header
        model={model}
        onModelChange={setModel}
        onNewProject={handleNewProject}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row min-h-0 relative overflow-hidden">
        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden border-b border-slate-800 bg-slate-900 shrink-0">
          <button
            onClick={() => setActiveTabMobile('chat')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTabMobile === 'chat'
                ? 'bg-amber-500/10 text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat IA</span>
            {isStreaming && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
          </button>
          <button
            onClick={() => setActiveTabMobile('preview')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTabMobile === 'preview'
                ? 'bg-amber-500/10 text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu du site</span>
          </button>
        </div>

        {/* Left Side: Chat Panel */}
        <div
          className={`w-full md:w-[420px] lg:w-[460px] xl:w-[500px] h-full flex flex-col shrink-0 ${
            activeTabMobile === 'chat' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isStreaming={isStreaming}
            onStopStreaming={handleStopStreaming}
            onClearChat={handleClearChat}
            onExportZip={handleExportZip}
            onViewProject={handleViewProject}
            isExportingZip={isExportingZip}
          />
        </div>

        {/* Right Side: Live Preview Panel */}
        <div
          className={`flex-1 h-full flex flex-col min-w-0 ${
            activeTabMobile === 'preview' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <PreviewPanel
            files={files}
            onExportZip={handleExportZip}
          />
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        model={model}
        onModelChange={setModel}
        customApiKey={customApiKey}
        onCustomApiKeyChange={handleCustomApiKeyChange}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-none">
          <div
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl border text-xs font-medium backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
