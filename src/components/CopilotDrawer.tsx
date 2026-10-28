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
  ExternalLink 
} from 'lucide-react';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeIncident: Incident;
  messages: CopilotMessage[];
  onSendMessage: (text: string) => void;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  activeIncident,
  messages,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Why did Redis connection pool exhaust on v4.12.8?',
    'Compare current incident with historical match INC-7102',
    'What is the safety risk of rolling restart step 3?',
    'Draft an executive Slack update with current blast radius'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isThinking) return;

    onSendMessage(query.trim());
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
    }, 1200);
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
              <h3 className="text-sm font-bold tracking-tight">CaseMind Copilot</h3>
              <span className="text-[10px] font-mono bg-[#4f46e5] text-white px-1.5 py-0.2 rounded">
                Grounded RCA
              </span>
            </div>
            <p className="text-[11px] text-[#dad7ff] font-mono">
              Target Context: {activeIncident.id} ({activeIncident.service})
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

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#faf8ff]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#3525cd] text-white rounded-br-none shadow-xs'
                  : 'bg-white text-[#131b2e] border border-[#dae2fd] rounded-bl-none shadow-xs'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Citations if assistant */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#eaedff] space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#0891b2] block">
                    Grounded Citations:
                  </span>
                  {msg.citations.map((cit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-[10px] font-mono bg-[#f0fdfa] text-[#006077] p-1.5 rounded border border-[#76dcff]"
                    >
                      <span className="truncate">{cit.title}</span>
                      <span className="font-bold shrink-0 ml-1">{cit.confidence}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-[#777587] font-mono mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex items-center space-x-2 text-xs font-mono text-[#7c3aed] bg-purple-50 p-3 rounded-lg border border-purple-200 w-fit animate-pulse">
            <Sparkles className="w-4 h-4 text-[#7c3aed]" />
            <span>Consulting organizational memory & telemetry spans...</span>
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      <div className="p-3 bg-white border-t border-[#eaedff] overflow-x-auto">
        <div className="flex items-center space-x-1.5 text-xs text-[#464555] font-semibold mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" />
          <span>Suggested Investigation Queries:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isThinking}
              className="text-left text-[11px] font-mono bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3525cd] px-2.5 py-1 rounded-md border border-[#c3c0ff] transition-colors"
            >
              {p}
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
          <input
            type="text"
            placeholder="Ask Copilot about root causes, runbook steps, or telemetry..."
            value={inputText}
            disabled={isThinking}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd] focus:bg-white transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
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
