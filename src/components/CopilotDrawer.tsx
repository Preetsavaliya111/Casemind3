import React, { useState } from 'react';
import { CopilotMessage, Incident } from '../types';
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  GitBranch, 
  X, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  Terminal, 
  ExternalLink,
  Globe,
  Search,
  BookOpen,
  ShieldCheck
} from 'lucide-react';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeIncident: Incident;
  messages: CopilotMessage[];
  onSendMessage: (text: string, useSearchGrounding?: boolean) => void;
  isGenerating?: boolean;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  activeIncident,
  messages,
  onSendMessage,
  isGenerating = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    { text: 'Why did Redis connection pool exhaust on v4.12.8?', search: false },
    { text: 'Compare current incident with historical match INC-7102', search: false },
    { text: 'Search Web: Redis Lettuce connection pool starvation known issues', search: true },
    { text: 'Search Web: Kubernetes somaxconn TCP queue drops troubleshooting', search: true },
    { text: 'Draft an executive Slack update with current blast radius', search: false },
  ];

  const handleSend = (textToSend?: string, forceSearch?: boolean) => {
    const query = textToSend || inputText;
    if (!query.trim() || isGenerating) return;

    const shouldSearch = forceSearch !== undefined ? forceSearch : useSearchGrounding;
    onSendMessage(query.trim(), shouldSearch);
    setInputText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl border-l border-[#dae2fd] flex flex-col font-sans selection:bg-[#4f46e5] selection:text-white">
      {/* Drawer Header */}
      <div className="p-4 bg-linear-to-r from-[#131b2e] to-[#283044] text-white flex items-center justify-between border-b border-[#283044]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-[#3525cd] to-[#7c3aed] flex items-center justify-center text-white shadow-xs">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-sm font-bold tracking-tight">CaseMind AI Copilot</h3>
              <span className="text-[10px] font-mono bg-[#4f46e5] text-white px-1.5 py-0.5 rounded">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-[#dad7ff] font-mono">
              Target Context: {activeIncident.id} &bull; {activeIncident.service}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#dad7ff] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close CaseMind Copilot"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mode Sub-banner */}
      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          Context: Telemetry + Memory Graph
        </span>
        <button
          type="button"
          onClick={() => setUseSearchGrounding(!useSearchGrounding)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
            useSearchGrounding
              ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          {useSearchGrounding ? 'Google Search Active' : 'Enable Web Search'}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#faf8ff]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#3525cd] text-white rounded-br-none shadow-xs'
                  : 'bg-white text-[#131b2e] border border-[#dae2fd] rounded-bl-none shadow-xs'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Citations if assistant */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#eaedff] space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#0891b2] flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-[#0891b2]" />
                    Evidence & Grounding Provenance:
                  </span>
                  {msg.citations.map((cit, idx) => {
                    const isExternalUrl = cit.source.startsWith('http');
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between text-[10px] font-mono p-1.5 rounded border ${
                          isExternalUrl
                            ? 'bg-cyan-50 text-cyan-900 border-cyan-200'
                            : 'bg-[#f0fdfa] text-[#006077] border-[#76dcff]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {isExternalUrl ? (
                            <Globe className="w-3 h-3 shrink-0 text-cyan-600" />
                          ) : (
                            <GitBranch className="w-3 h-3 shrink-0 text-indigo-600" />
                          )}
                          {isExternalUrl ? (
                            <a
                              href={cit.source}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline flex items-center gap-1 truncate text-cyan-700 font-semibold"
                            >
                              <span>{cit.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          ) : (
                            <span className="truncate">{cit.title}</span>
                          )}
                        </div>
                        <span className="font-bold shrink-0 ml-1 text-slate-500">
                          {Math.round(cit.confidence * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <span className="text-[10px] text-[#777587] font-mono mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* Generating / Thinking indicator */}
        {isGenerating && (
          <div className="flex items-center space-x-2 text-xs font-mono text-[#7c3aed] bg-purple-50 p-3 rounded-lg border border-purple-200 w-fit animate-pulse">
            <Sparkles className="w-4 h-4 text-[#7c3aed]" />
            <span>
              {useSearchGrounding 
                ? 'Grounding with Google Search & CaseMind organizational memory...' 
                : 'Synthesizing with Gemini 3.8 and telemetry graph...'}
            </span>
          </div>
        )}
      </div>

      {/* Suggested Queries */}
      <div className="p-3 bg-white border-t border-[#eaedff] overflow-x-auto">
        <div className="flex items-center space-x-1.5 text-xs text-[#464555] font-semibold mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" />
          <span>Recommended Investigation Prompts:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.text, p.search)}
              disabled={isGenerating}
              className={`text-left text-[11px] font-mono px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1 ${
                p.search
                  ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200'
                  : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3525cd] border-[#c3c0ff]'
              }`}
            >
              {p.search && <Globe className="w-2.5 h-2.5 text-cyan-600 shrink-0" />}
              <span>{p.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="p-3 bg-white border-t border-[#dae2fd]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={useSearchGrounding ? "Search web & vendor advisories for this outage..." : "Ask Copilot about root causes, telemetry, or runbooks..."}
              value={inputText}
              disabled={isGenerating}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd] focus:bg-white transition-all font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="p-2 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-colors shrink-0"
            aria-label="Send query to Copilot"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
