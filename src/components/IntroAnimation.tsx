import React, { useState, useEffect } from 'react';
import { BrainCircuit, Radio, Terminal, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [bootStep, setBootStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(15);

  const bootMessages = [
    'Initializing CaseMind Cognitive Operations Engine v4.8...',
    'Mounting OpenTelemetry v1.28 distributed span ingestion...',
    'Connecting to Organizational Memory Graph (4.2M historical vectors)...',
    'Ingesting active incident telemetry across 6 production clusters...',
    'Cognitive inference pipeline online. Zero ungrounded actions enforced.'
  ];

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const timer1 = setTimeout(() => { setBootStep(1); setProgress(35); }, 400);
    const timer2 = setTimeout(() => { setBootStep(2); setProgress(60); }, 900);
    const timer3 = setTimeout(() => { setBootStep(3); setProgress(85); }, 1400);
    const timer4 = setTimeout(() => { setBootStep(4); setProgress(100); }, 1900);
    const timer5 = setTimeout(() => { onComplete(); }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] text-[#eaedff] flex flex-col items-center justify-center p-4 selection:bg-[#4f46e5] selection:text-white">
      {/* Skip button always available in top right */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-xs font-mono text-[#c7c4d8] hover:text-white border border-[#475569] flex items-center space-x-1.5 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]"
        aria-label="Skip introduction animation"
      >
        <span>Skip Boot Sequence</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="max-w-md w-full space-y-6 text-center">
        {/* Animated Brand Core */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-[#3525cd] via-[#4f46e5] to-[#7c3aed] blur-md opacity-75 animate-pulse" />
          <div className="relative w-16 h-16 rounded-xl bg-[#1e293b] border border-[#6366f1] flex items-center justify-center text-white shadow-xl">
            <BrainCircuit className="w-8 h-8 text-[#a5b4fc] animate-spin-slow" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans flex items-center justify-center space-x-2">
            <span>CaseMind</span>
            <span className="text-xs px-2 py-0.5 rounded-sm bg-[#3525cd] text-[#dad7ff] font-mono uppercase font-semibold">
              Intelligence
            </span>
          </h1>
          <p className="text-xs text-[#94a3b8] font-mono mt-1">
            Enterprise Cognitive Tier-3 Incident Operations
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden border border-[#334155]">
          <div 
            className="bg-linear-to-r from-[#4f46e5] via-[#0891b2] to-[#7c3aed] h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Console step output */}
        <div className="bg-[#090d16] border border-[#1e293b] rounded-xl p-4 text-left font-mono text-xs space-y-2 h-36 overflow-hidden shadow-inner">
          {bootMessages.slice(0, bootStep + 1).map((msg, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-[11px] leading-relaxed">
              <span className="text-[#059669] shrink-0">✓</span>
              <span className={idx === bootStep ? 'text-[#76dcff] font-semibold' : 'text-[#64748b]'}>
                {msg}
              </span>
            </div>
          ))}
          {bootStep < 4 && (
            <div className="flex items-center space-x-2 text-[11px] text-[#818cf8] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8]" />
              <span>Synthesizing cognitive context...</span>
            </div>
          )}
        </div>

        <p className="text-[10px] text-[#64748b] font-mono">
          Press [Skip] or wait 2 seconds to enter command workspace.
        </p>
      </div>
    </div>
  );
};
