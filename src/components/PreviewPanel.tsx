import React, { useState, useEffect, useRef } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  ExternalLink,
  Terminal,
  Eye,
  Trash2,
  AlertTriangle,
  XCircle,
  Info,
} from 'lucide-react';
import { DeviceMode, ConsoleLog } from '../types';
import { bundleProjectForPreview } from '../utils/previewBundler';

interface PreviewPanelProps {
  files: Record<string, string>;
  onExportZip?: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  files,
}) => {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate bundled HTML for iframe
  const bundledHtml = React.useMemo(() => {
    return bundleProjectForPreview(files);
  }, [files, refreshKey]);

  // Listen for console logs posted from preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_CONSOLE' && event.data?.log) {
        const log: ConsoleLog = {
          id: Math.random().toString(36).substring(2, 9),
          type: event.data.log.type || 'log',
          message: event.data.log.message || '',
          timestamp: event.data.log.timestamp || Date.now(),
        };
        setConsoleLogs((prev) => [...prev.slice(-100), log]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const hasSite = Boolean(files && files['index.html'] && files['index.html'].trim().length > 0);

  const handleRefresh = () => {
    if (!hasSite) return;
    setRefreshKey((k) => k + 1);
  };

  const handleOpenInNewTab = () => {
    if (!hasSite) return;
    const blob = new Blob([bundledHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const errorCount = consoleLogs.filter((l) => l.type === 'error').length;

  const getDeviceWidth = () => {
    if (device === 'mobile') return 'max-w-[375px] h-[667px] my-auto shadow-2xl';
    if (device === 'tablet') return 'max-w-[768px] h-[92%] my-auto shadow-2xl';
    return 'w-full h-full';
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-12 px-3 sm:px-4 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between shrink-0 select-none">
        {/* Left: View label */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-xs font-semibold">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Aperçu en direct</span>
          </div>
        </div>

        {/* Center: Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              device === 'desktop' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Format Ordinateur (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bureau</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              device === 'tablet' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Format Tablette (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablette</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              device === 'mobile' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Format Mobile (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            disabled={!hasSite}
            className={`p-1.5 rounded-lg transition-colors ${
              hasSite
                ? 'text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                : 'text-slate-600 opacity-40 cursor-not-allowed'
            }`}
            title={hasSite ? "Actualiser la prévisualisation" : "Aucun site actif"}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenInNewTab}
            disabled={!hasSite}
            className={`p-1.5 rounded-lg transition-colors ${
              hasSite
                ? 'text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                : 'text-slate-600 opacity-40 cursor-not-allowed'
            }`}
            title={hasSite ? "Ouvrir dans un nouvel onglet" : "Aucun site actif"}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Console Drawer Button */}
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
              showConsole
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Afficher la console JavaScript"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Console</span>
            {errorCount > 0 && (
              <span className="px-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded text-[10px] font-bold">
                {errorCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div className="flex-1 bg-slate-900/60 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
          {!hasSite ? (
            <div className="w-full h-full max-w-sm mx-auto flex flex-col items-center justify-center p-6 text-center select-none">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3.5 text-slate-500 shadow-inner">
                <Monitor className="w-7 h-7 text-slate-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300 mb-1">
                Espace de prévisualisation
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Aucun site n'est chargé pour le moment. Discutez de vos idées ou demandez à l'IA de concevoir votre projet pour voir le résultat en direct ici.
              </p>
            </div>
          ) : (
            <div
              className={`w-full transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-slate-800/80 bg-white ${getDeviceWidth()}`}
            >
              <iframe
                key={refreshKey}
                ref={iframeRef}
                srcDoc={bundledHtml}
                title="Site Preview"
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                className="w-full h-full border-0 bg-white"
              />
            </div>
          )}
        </div>

        {/* Live Console Drawer */}
        {showConsole && (
          <div className="h-44 border-t border-slate-800 bg-slate-950 flex flex-col shrink-0 font-mono text-xs z-10">
            <div className="h-8 px-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-slate-200">Console du site généré</span>
                <span className="text-[10px] text-slate-500">({consoleLogs.length} messages)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConsoleLogs([])}
                  className="hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Vider la console"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="text-[10px]">Vider</span>
                </button>
                <button
                  onClick={() => setShowConsole(false)}
                  className="hover:text-white px-1 text-slate-500 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {consoleLogs.length === 0 ? (
                <div className="text-slate-600 text-center py-4">
                  Aucun log émis par le site. Les erreurs et `console.log` s'afficheront ici en direct.
                </div>
              ) : (
                consoleLogs.map((log) => {
                  let color = 'text-slate-300';
                  let icon = <Info className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />;
                  if (log.type === 'warn') {
                    color = 'text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded';
                    icon = <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />;
                  } else if (log.type === 'error') {
                    color = 'text-rose-300 bg-rose-500/10 px-1 py-0.5 rounded';
                    icon = <XCircle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />;
                  }
                  return (
                    <div key={log.id} className={`flex items-start gap-2 text-[11px] leading-4 ${color}`}>
                      {icon}
                      <span className="text-slate-600 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="font-mono break-all">{log.message}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
