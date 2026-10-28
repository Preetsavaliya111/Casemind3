import React from 'react';
import { GroundedCitation } from '../types';
import { X, ExternalLink, GitBranch, Terminal, ShieldCheck, Check } from 'lucide-react';

interface CitationModalProps {
  citation: GroundedCitation | null;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#dae2fd] space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-100 text-[#006077]">
              <GitBranch className="w-4 h-4 text-[#0891b2]" />
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#0891b2] tracking-wider block">
                Evidence Lineage Inspector
              </span>
              <h3 className="text-sm font-bold text-[#131b2e] leading-snug">
                {citation.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777587] hover:text-[#131b2e] hover:bg-[#f2f3ff]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff]">
            <span className="text-[10px] text-[#777587] block uppercase">Citation Type</span>
            <span className="font-bold text-[#131b2e]">{citation.type}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff]">
            <span className="text-[10px] text-[#777587] block uppercase">Confidence Weight</span>
            <span className="font-bold text-[#059669]">{citation.confidenceWeight}%</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff]">
            <span className="text-[10px] text-[#777587] block uppercase">Timestamp</span>
            <span className="font-bold text-[#131b2e]">{citation.timestamp}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff]">
            <span className="text-[10px] text-[#777587] block uppercase">Source</span>
            <span className="font-bold text-[#3525cd] truncate block">{citation.source}</span>
          </div>
        </div>

        {/* Raw payload or snippet */}
        <div>
          <span className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono block mb-1.5">
            Raw Lineage Extract / Code Span
          </span>
          <pre className="p-4 rounded-xl bg-[#0f172a] text-[#eaedff] font-mono text-xs overflow-x-auto leading-relaxed border border-[#283044]">
            <code>{citation.snippet}</code>
          </pre>
        </div>

        {/* Explanatory note */}
        <div className="bg-[#f0fdfa] p-3 rounded-lg border border-[#76dcff] text-xs text-[#006077] flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#0891b2] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            This artifact was autonomously retrieved from the telemetry bus and corroborated against the commit log. It confirms the correlation used in the machine root-cause hypothesis.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#eaedff]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#131b2e] bg-[#f2f3ff] hover:bg-[#eaedff] rounded-lg"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
