import React, { useState } from 'react';
import { 
  Incident, 
  GroundedCitation, 
  MemoryMatch,
  RunbookStep
} from '../types';
import { 
  BrainCircuit, 
  GitBranch, 
  FileText, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Sparkles, 
  Layers, 
  Database, 
  ShieldCheck, 
  Terminal, 
  ChevronRight, 
  ExternalLink, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Check, 
  Share2, 
  Download, 
  MessageSquare, 
  Send,
  Zap,
  Maximize2
} from 'lucide-react';

interface CaseWorkspaceProps {
  incident: Incident;
  onBackToTriage: () => void;
  onInspectCitation: (citation: GroundedCitation) => void;
  onOpenPostMortemModal: () => void;
  onUpdateIncident: (updated: Incident) => void;
}

export const CaseWorkspace: React.FC<CaseWorkspaceProps> = ({
  incident,
  onBackToTriage,
  onInspectCitation,
  onOpenPostMortemModal,
  onUpdateIncident
}) => {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'evidence' | 'telemetry' | 'runbook' | 'postmortem'>('synthesis');
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [showAiOnly, setShowAiOnly] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>('');
  
  // Runbook interactive execution state
  const [runbookMode, setRunbookMode] = useState<'DRY_RUN' | 'EXECUTE'>('DRY_RUN');
  const [executingStepId, setExecutingStepId] = useState<string | null>(null);
  const [safetyGateModalStep, setSafetyGateModalStep] = useState<RunbookStep | null>(null);

  const isResolved = incident.status === 'RESOLVED';

  // Handler to run a runbook step
  const handleExecuteStep = (step: RunbookStep) => {
    if (step.safetyGate && runbookMode === 'EXECUTE') {
      setSafetyGateModalStep(step);
      return;
    }
    proceedStepExecution(step.id);
  };

  const proceedStepExecution = (stepId: string) => {
    setExecutingStepId(stepId);
    setSafetyGateModalStep(null);

    // Update status to RUNNING
    const updatedSteps = incident.runbook.steps.map(s => 
      s.id === stepId ? { ...s, status: 'RUNNING' as const } : s
    );
    onUpdateIncident({
      ...incident,
      runbook: { ...incident.runbook, steps: updatedSteps }
    });

    // Simulate realistic execution timing
    setTimeout(() => {
      const simulatedOutput = [
        `[${new Date().toISOString()}] Initiated execution on cluster ${incident.cluster}`,
        `[COMMAND] Verified target node security context`,
        `[STDOUT] Response code: 200 OK. Dynamic parameters verified.`,
        `[SUCCESS] Step completed with 0 errors.`
      ];

      const completedSteps = incident.runbook.steps.map(s => 
        s.id === stepId 
          ? { 
              ...s, 
              status: 'COMPLETED' as const, 
              durationMs: 840,
              outputLog: s.outputLog?.length ? [...s.outputLog, ...simulatedOutput] : simulatedOutput 
            } 
          : s
      );

      // Check if all steps are completed
      const allDone = completedSteps.every(s => s.status === 'COMPLETED');
      
      onUpdateIncident({
        ...incident,
        status: allDone ? 'RESOLVED' : 'MITIGATING',
        runbook: { ...incident.runbook, steps: completedSteps }
      });
      setExecutingStepId(null);
    }, 1800);
  };

  // Handler to add a human operator note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const newNoteObj = {
      id: `note-${Date.now()}`,
      author: 'Elena Rostova',
      role: 'Staff Incident Commander',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      time: 'Just now',
      text: newNote.trim()
    };

    onUpdateIncident({
      ...incident,
      humanNotes: [...incident.humanNotes, newNoteObj]
    });
    setNewNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status Ribbon */}
      <div className="bg-white rounded-xl border border-[#dae2fd] p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <button 
              onClick={onBackToTriage}
              className="text-[#3525cd] hover:underline font-semibold"
            >
              Incidents
            </button>
            <span className="text-[#c7c4d8]">/</span>
            <span className="text-[#131b2e] font-bold">{incident.id}</span>
            <span className="text-[#c7c4d8]">/</span>
            <span className="text-[#7c3aed] font-medium">Cognitive Diagnosis</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick status change */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#464555] font-semibold">Status:</span>
              <select
                value={incident.status}
                onChange={(e) => onUpdateIncident({ ...incident, status: e.target.value as any })}
                className="text-xs font-mono font-semibold bg-[#f2f3ff] border border-[#c7c4d8] rounded-md px-2.5 py-1 text-[#131b2e] focus:outline-hidden focus:ring-1 focus:ring-[#3525cd]"
              >
                <option value="INVESTIGATING">INVESTIGATING</option>
                <option value="MITIGATING">MITIGATING</option>
                <option value="MONITORING">MONITORING</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>

            <button
              onClick={onOpenPostMortemModal}
              className="flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-md bg-[#eaedff] text-[#3525cd] hover:bg-[#dad7ff] border border-[#c3c0ff] transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Post-Mortem</span>
            </button>
          </div>
        </div>

        {/* Case Title & High-Level Metadata */}
        <div className="mt-3 pt-3 border-t border-[#eaedff] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                incident.severity.startsWith('P0') 
                  ? 'bg-[#ffdad6] text-[#93000a] border border-[#ffb4ab]'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {incident.severity}
              </span>
              <h1 className="text-xl font-bold text-[#131b2e] tracking-tight">
                {incident.title}
              </h1>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[#464555]">
              <span>Cluster: <strong className="text-[#131b2e]">{incident.cluster}</strong></span>
              <span>Service: <strong className="text-[#3525cd]">{incident.service}</strong></span>
              <span>Opened: <strong className="text-[#131b2e]">{incident.openedAt}</strong></span>
              <span className="flex items-center">
                Commander: 
                <img 
                  src={incident.assignee.avatar} 
                  alt={incident.assignee.name} 
                  className="w-4 h-4 rounded-full ml-1.5 mr-1" 
                />
                <strong className="text-[#131b2e]">{incident.assignee.name}</strong>
              </span>
            </div>
          </div>

          {/* Blast Radius & SLA Card */}
          <div className="flex items-center space-x-4 bg-[#faf8ff] p-3 rounded-lg border border-[#dae2fd]">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#464555] block">
                Impacted Users
              </span>
              <span className="text-base font-mono font-bold text-[#ba1a1a]">
                {incident.blastRadius.affectedUsers.toLocaleString()} ({incident.blastRadius.pctTraffic}%)
              </span>
            </div>
            <div className="h-8 w-px bg-[#dae2fd]" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#464555] block">
                Revenue Run-Rate
              </span>
              <span className="text-base font-mono font-bold text-amber-600">
                {incident.blastRadius.revenueImpactPerHour}
              </span>
            </div>
            <div className="h-8 w-px bg-[#dae2fd]" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#464555] block">
                SLA Countdown
              </span>
              <span className={`text-base font-mono font-bold ${
                incident.slaRemainingMinutes < 30 ? 'text-[#ba1a1a] animate-pulse' : 'text-[#059669]'
              }`}>
                {incident.slaRemainingMinutes}m left
              </span>
            </div>
          </div>
        </div>

        {/* Diagnostic Sub-navigation Tabs */}
        <div className="mt-4 pt-2 border-t border-[#eaedff] flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('synthesis')}
            className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'synthesis'
                ? 'bg-[#7c3aed] text-white shadow-xs'
                : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            <span>Cognitive Synthesis & RCA</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20">
              {incident.cognitiveSynthesis.confidenceScore}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'evidence'
                ? 'bg-[#0891b2] text-white shadow-xs'
                : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 mr-1.5" />
            <span>Evidence & Provenance</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20">
              {incident.evidenceProvenance.groundedCitations.length + incident.evidenceProvenance.memoryMatches.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'telemetry'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 mr-1.5" />
            <span>Telemetry & Spans</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20">
              {incident.telemetryStream.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('runbook')}
            className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'runbook'
                ? 'bg-[#131b2e] text-white shadow-xs'
                : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 mr-1.5" />
            <span>Runbook Studio ({incident.runbook.id})</span>
            {incident.runbook.steps.some(s => s.status === 'RUNNING') && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('postmortem')}
            className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'postmortem'
                ? 'bg-[#4f46e5] text-white shadow-xs'
                : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            <span>Notes & Blameless Review ({incident.humanNotes.length})</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: COGNITIVE SYNTHESIS & RCA (Synthesis Violet) */}
      {activeTab === 'synthesis' && (
        <div className="space-y-6">
          {/* Main Autonomous RCA Banner */}
          <div className="bg-white rounded-xl border border-[#dae2fd] shadow-xs overflow-hidden">
            <div className="bg-linear-to-r from-[#7c3aed] to-[#4f46e5] p-4 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#e4d4ff]" />
                  <h2 className="text-base font-bold tracking-tight">
                    Machine Root-Cause Synthesis
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white/20 text-white">
                    CONFIDENCE: {incident.cognitiveSynthesis.confidenceScore}%
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono text-[#dad7ff]">
                  <span>Telemetry Window: 30m</span>
                  <span>·</span>
                  <span>Correlated Spans: 14,280</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Executive Summary */}
              <div>
                <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono">
                  Executive Incident Briefing
                </h3>
                <p className="mt-2 text-sm text-[#131b2e] leading-relaxed font-sans bg-[#faf8ff] p-4 rounded-lg border border-[#e4d4ff]">
                  {incident.cognitiveSynthesis.summary}
                </p>
              </div>

              {/* Confidence Telemetry Breakdown Matrix */}
              <div>
                <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono mb-3">
                  Explainability & Confidence Telemetry
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#f2f3ff] p-3 rounded-lg border border-[#dae2fd]">
                    <span className="text-[11px] text-[#464555] font-mono block">Root Cause Match</span>
                    <span className="text-lg font-bold font-mono text-[#7c3aed]">
                      {incident.cognitiveSynthesis.confidenceBreakdown.rootCause}%
                    </span>
                    <div className="w-full bg-[#dae2fd] h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="bg-[#7c3aed] h-full rounded-full" 
                        style={{ width: `${incident.cognitiveSynthesis.confidenceBreakdown.rootCause}%` }} 
                      />
                    </div>
                  </div>

                  <div className="bg-[#f2f3ff] p-3 rounded-lg border border-[#dae2fd]">
                    <span className="text-[11px] text-[#464555] font-mono block">Blast Radius Precision</span>
                    <span className="text-lg font-bold font-mono text-[#0891b2]">
                      {incident.cognitiveSynthesis.confidenceBreakdown.blastRadius}%
                    </span>
                    <div className="w-full bg-[#dae2fd] h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="bg-[#0891b2] h-full rounded-full" 
                        style={{ width: `${incident.cognitiveSynthesis.confidenceBreakdown.blastRadius}%` }} 
                      />
                    </div>
                  </div>

                  <div className="bg-[#f2f3ff] p-3 rounded-lg border border-[#dae2fd]">
                    <span className="text-[11px] text-[#464555] font-mono block">Remediation Safety</span>
                    <span className="text-lg font-bold font-mono text-[#059669]">
                      {incident.cognitiveSynthesis.confidenceBreakdown.remediation}%
                    </span>
                    <div className="w-full bg-[#dae2fd] h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="bg-[#059669] h-full rounded-full" 
                        style={{ width: `${incident.cognitiveSynthesis.confidenceBreakdown.remediation}%` }} 
                      />
                    </div>
                  </div>

                  <div className="bg-[#f2f3ff] p-3 rounded-lg border border-[#dae2fd]">
                    <span className="text-[11px] text-[#464555] font-mono block">Evidence Grounded</span>
                    <span className="text-lg font-bold font-mono text-[#3525cd]">
                      {incident.cognitiveSynthesis.confidenceBreakdown.evidenceGrounded}%
                    </span>
                    <div className="w-full bg-[#dae2fd] h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="bg-[#3525cd] h-full rounded-full" 
                        style={{ width: `${incident.cognitiveSynthesis.confidenceBreakdown.evidenceGrounded}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Causality Propagation Chain */}
              {incident.cognitiveSynthesis.causalityFlow.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono mb-3">
                    Incident Causality & Propagation Chain
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {incident.cognitiveSynthesis.causalityFlow.map((flow, index) => (
                      <div 
                        key={flow.step}
                        className="bg-[#faf8ff] p-3.5 rounded-lg border border-[#dae2fd] relative hover:border-[#7c3aed] transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#7c3aed] mb-1.5">
                          <span>STEP 0{flow.step}</span>
                          <span className="text-[10px] text-[#464555]">{flow.actor}</span>
                        </div>
                        <p className="text-xs font-semibold text-[#131b2e] leading-snug">
                          {flow.action}
                        </p>
                        <div className="mt-2 pt-2 border-t border-[#eaedff] text-[11px] text-[#ba1a1a] font-mono">
                          Impact: {flow.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hypothesis Testing Matrix */}
              {incident.cognitiveSynthesis.hypotheses.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono mb-3">
                    Hypothesis Testing Matrix (Autonomous Verification)
                  </h3>
                  <div className="space-y-3">
                    {incident.cognitiveSynthesis.hypotheses.map((hyp) => (
                      <div 
                        key={hyp.id}
                        className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          hyp.status === 'CONFIRMED'
                            ? 'bg-purple-50/50 border-[#7c3aed]/40'
                            : 'bg-[#f2f3ff] border-[#dae2fd] opacity-75'
                        }`}
                      >
                        <div className="space-y-1 max-w-2xl">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              hyp.status === 'CONFIRMED'
                                ? 'bg-[#7c3aed] text-white'
                                : 'bg-[#777587] text-white'
                            }`}>
                              {hyp.status} ({hyp.likelihood}%)
                            </span>
                            <h4 className="text-sm font-bold text-[#131b2e]">
                              {hyp.title}
                            </h4>
                          </div>
                          <p className="text-xs text-[#464555] font-mono">
                            Evidence: {hyp.evidence}
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center space-x-2">
                          {hyp.status === 'CONFIRMED' ? (
                            <span className="flex items-center text-xs font-bold text-[#059669]">
                              <CheckCircle2 className="w-4 h-4 mr-1 text-[#059669]" />
                              Corroborated
                            </span>
                          ) : (
                            <span className="flex items-center text-xs text-[#777587]">
                              <AlertOctagon className="w-4 h-4 mr-1" />
                              Refuted by Telemetry
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Machine-Suggested Remediation Actions */}
              <div>
                <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono mb-3">
                  Autonomous Remediation Vectors
                </h3>
                <div className="space-y-3">
                  {incident.cognitiveSynthesis.machineSuggestedRemediations.map((rem) => (
                    <div
                      key={rem.id}
                      className="p-4 rounded-lg bg-linear-to-r from-[#faf8ff] to-[#f2f3ff] border border-[#c3c0ff] flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            rem.risk === 'LOW'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {rem.risk} RISK
                          </span>
                          <span className="text-xs font-mono text-[#059669] font-bold">
                            {rem.confidence}% Confidence
                          </span>
                          <span className="text-xs font-mono text-[#464555]">
                            Recovery ETA: <strong>{rem.expectedRecoveryTime}</strong>
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#131b2e]">
                          {rem.title}
                        </h4>
                      </div>

                      <div className="shrink-0 flex items-center space-x-2">
                        <button
                          onClick={() => setActiveTab('runbook')}
                          className="flex items-center px-4 py-2 bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                          <span>Open Runbook Studio</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: EVIDENCE & PROVENANCE EXPLORER (Evidence Cyan) */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          {/* Top Lineage Info Banner */}
          <div className="bg-[#f0fdfa] rounded-xl border border-[#76dcff] p-4 text-[#006077]">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-[#0891b2]" />
              <h3 className="text-sm font-bold tracking-tight">
                Inspectable Provenance & Organizational Memory Linkages
              </h3>
            </div>
            <p className="mt-1 text-xs text-[#004e61] leading-relaxed">
              Every machine assertion in CaseMind is tied directly to grounded organizational artifacts: historical incident resolutions, commit logs, APM spans, and verified runbook procedures.
            </p>
          </div>

          {/* Organizational Memory Matches */}
          <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono mb-4 flex items-center">
              <Database className="w-4 h-4 mr-1.5 text-[#0891b2]" />
              Organizational Memory Matches (Semantic Vector Distance)
            </h3>

            {incident.evidenceProvenance.memoryMatches.length === 0 ? (
              <p className="text-xs text-[#777587] italic">No historical memory matches recorded for this pattern.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incident.evidenceProvenance.memoryMatches.map((match) => (
                  <div
                    key={match.incidentId}
                    className="p-4 rounded-xl bg-[#faf8ff] border border-[#76dcff] hover:shadow-md transition-shadow space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs bg-cyan-100 text-[#006077] px-2 py-0.5 rounded">
                            {match.incidentId}
                          </span>
                          <span className="text-xs text-[#464555] font-mono">
                            {match.resolvedDate}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#131b2e] mt-1.5">
                          {match.title}
                        </h4>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-bold font-mono text-[#0891b2]">
                          {match.similarityScore}%
                        </span>
                        <span className="text-[10px] text-[#464555] block font-mono">Similarity</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-[#eaedff] text-xs space-y-1">
                      <span className="font-semibold text-[#131b2e] block">Historical Resolution:</span>
                      <p className="text-[#464555] leading-relaxed font-mono text-[11px]">
                        {match.keyResolution}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#464555] pt-1">
                      <span>Resolved by: <strong className="text-[#131b2e]">{match.author}</strong></span>
                      <span className="font-mono text-[#059669]">MTTR: {match.timeToResolve}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grounded Citations Drawer / Grid */}
          <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono mb-4 flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-[#0891b2]" />
              Grounded Evidence Breadcrumbs ({incident.evidenceProvenance.groundedCitations.length} Citations)
            </h3>

            <div className="space-y-3">
              {incident.evidenceProvenance.groundedCitations.map((cit) => (
                <div
                  key={cit.id}
                  className="p-4 rounded-xl bg-[#faf8ff] border border-[#dae2fd] hover:border-[#0891b2] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-100 text-[#006077]">
                        {cit.type}
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#131b2e]">
                        {cit.source}
                      </span>
                      <span className="text-[11px] text-[#777587] font-mono">
                        {cit.timestamp}
                      </span>
                      <span className="text-[10px] font-mono text-[#059669] font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {cit.confidenceWeight}% Weight
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-[#131b2e]">
                      {cit.title}
                    </h4>

                    {/* Code snippet preview */}
                    <pre className="p-2.5 rounded-md bg-[#131b2e] text-[#eaedff] text-xs font-mono overflow-x-auto leading-relaxed">
                      {cit.snippet}
                    </pre>
                  </div>

                  <div className="shrink-0 flex items-center space-x-2">
                    <button
                      onClick={() => onInspectCitation(cit)}
                      className="flex items-center px-3 py-1.5 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006780] border border-[#76dcff] text-xs font-semibold rounded-md transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
                      <span>Inspect Raw Trace</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: TELEMETRY & SPANS */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          {/* Metrics Line Chart Simulation */}
          <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono">
                  Telemetry Correlation (Incident Window)
                </h3>
                <p className="text-xs text-[#777587]">
                  P99 Latency vs Error Rate % across auth-gateway-v2 ingress fleet
                </p>
              </div>

              <div className="flex items-center space-x-4 text-xs font-mono">
                <span className="flex items-center text-[#ba1a1a]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] mr-1.5" />
                  Latency P99 (ms)
                </span>
                <span className="flex items-center text-[#7c3aed]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] mr-1.5" />
                  Error Rate %
                </span>
              </div>
            </div>

            {/* Metric Chart Visualization */}
            <div className="h-44 w-full flex items-end space-x-2 pt-6 pb-2 border-b border-[#dae2fd]">
              {incident.metricsTimeline.map((pt, i) => {
                const heightPct = Math.min(100, Math.max(10, (pt.latencyP99 / 5200) * 100));
                return (
                  <div key={pt.time} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-12 bg-[#131b2e] text-white text-[10px] font-mono p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      {pt.time}: P99={pt.latencyP99}ms | Err={pt.errorRate}%
                    </div>

                    {/* Bar */}
                    <div 
                      className="w-full rounded-t transition-all group-hover:brightness-110"
                      style={{ 
                        height: `${heightPct}%`, 
                        backgroundColor: pt.latencyP99 > 2000 ? '#ba1a1a' : pt.latencyP99 > 500 ? '#d97706' : '#4f46e5'
                      }}
                    />
                    <span className="text-[10px] font-mono text-[#777587] mt-2">{pt.time}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#464555]">
              <span>T-0 Deploy: 10:24 UTC (v4.12.8)</span>
              <span>Peak Anomaly: 10:30 UTC (5,100ms P99)</span>
            </div>
          </div>

          {/* Chronological Event Stream */}
          <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono">
                Multi-Source Chronological Log Stream
              </h3>

              <div className="flex items-center space-x-2">
                <label className="flex items-center text-xs text-[#3525cd] font-medium cursor-pointer mr-2">
                  <input
                    type="checkbox"
                    checked={showAiOnly}
                    onChange={(e) => setShowAiOnly(e.target.checked)}
                    className="mr-1.5 rounded text-[#3525cd] focus:ring-[#3525cd]"
                  />
                  AI Correlated Spans Only
                </label>

                {['ALL', 'FATAL', 'ERROR', 'WARN', 'INFO'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLogFilter(lvl)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded ${
                      logFilter === lvl ? 'bg-[#131b2e] text-white' : 'bg-[#f2f3ff] text-[#464555]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Event list */}
            <div className="space-y-2">
              {incident.telemetryStream
                .filter(ev => logFilter === 'ALL' || ev.level === logFilter)
                .filter(ev => !showAiOnly || ev.aiCorrelated)
                .map((ev) => (
                  <div
                    key={ev.id}
                    className={`p-3 rounded-lg border font-mono text-xs flex items-start space-x-3 ${
                      ev.aiCorrelated 
                        ? 'bg-purple-50/70 border-[#7c3aed]/40' 
                        : 'bg-[#faf8ff] border-[#eaedff]'
                    }`}
                  >
                    <span className="text-[#777587] text-[11px] whitespace-nowrap">{ev.timestamp}</span>

                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold whitespace-nowrap ${
                      ev.level === 'FATAL' 
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : ev.level === 'ERROR'
                        ? 'bg-red-100 text-red-800'
                        : ev.level === 'WARN'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-[#eaedff] text-[#3525cd]'
                    }`}>
                      {ev.level}
                    </span>

                    <span className="text-[#464555] font-semibold text-[11px] whitespace-nowrap">
                      [{ev.source}]
                    </span>

                    <div className="flex-1">
                      <p className="text-[#131b2e]">{ev.message}</p>
                      {ev.rawPayload && (
                        <p className="mt-1 text-[10px] text-[#777587] break-all">
                          Payload: {ev.rawPayload}
                        </p>
                      )}
                    </div>

                    {ev.aiCorrelated && (
                      <span className="text-[10px] font-bold text-[#7c3aed] uppercase bg-[#e4d4ff] px-2 py-0.5 rounded whitespace-nowrap">
                        ★ RCA Signal
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: RUNBOOK STUDIO */}
      {activeTab === 'runbook' && (
        <div className="space-y-6">
          {/* Runbook Header */}
          <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-sm bg-[#eaedff] text-[#3525cd] px-2.5 py-0.5 rounded border border-[#c3c0ff]">
                    {incident.runbook.id}
                  </span>
                  <span className="text-xs font-mono text-[#059669] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {incident.runbook.version}
                  </span>
                  <span className="text-xs text-[#464555] font-mono">
                    Estimated Time: {incident.runbook.estimatedMinutes}m
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#131b2e] mt-1.5">
                  {incident.runbook.name}
                </h3>
              </div>

              {/* Mode switch */}
              <div className="flex items-center space-x-2 bg-[#f2f3ff] p-1.5 rounded-lg border border-[#c7c4d8]">
                <button
                  onClick={() => setRunbookMode('DRY_RUN')}
                  className={`px-3 py-1 text-xs font-mono font-semibold rounded-md transition-all ${
                    runbookMode === 'DRY_RUN'
                      ? 'bg-white text-[#3525cd] shadow-xs'
                      : 'text-[#464555] hover:text-[#131b2e]'
                  }`}
                >
                  Dry-Run Simulation
                </button>
                <button
                  onClick={() => setRunbookMode('EXECUTE')}
                  className={`px-3 py-1 text-xs font-mono font-semibold rounded-md transition-all ${
                    runbookMode === 'EXECUTE'
                      ? 'bg-[#ba1a1a] text-white shadow-xs'
                      : 'text-[#464555] hover:text-[#131b2e]'
                  }`}
                >
                  Live Cluster Execute
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Steps List */}
          <div className="space-y-4">
            {incident.runbook.steps.map((step) => {
              const isStepRunning = executingStepId === step.id || step.status === 'RUNNING';
              const isCompleted = step.status === 'COMPLETED';

              return (
                <div
                  key={step.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                    isCompleted
                      ? 'border-[#059669]/40 bg-emerald-50/10'
                      : isStepRunning
                      ? 'border-[#3525cd] ring-2 ring-[#c3c0ff]'
                      : 'border-[#dae2fd]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#f2f3ff] text-[#3525cd] font-mono font-bold text-xs flex items-center justify-center border border-[#c3c0ff]">
                          {step.stepNumber}
                        </span>

                        <h4 className="text-sm font-bold text-[#131b2e]">
                          {step.label}
                        </h4>

                        {step.safetyGate && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            SAFETY GATE REQUIRED
                          </span>
                        )}

                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isStepRunning
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-[#eaedff] text-[#3525cd]'
                        }`}>
                          {step.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#464555] font-sans">
                        {step.description}
                      </p>

                      {/* Command box */}
                      <pre className="p-3 rounded-lg bg-[#131b2e] text-[#eaedff] text-xs font-mono overflow-x-auto">
                        <code>{step.command}</code>
                      </pre>

                      {/* Execution Terminal Output Log */}
                      {step.outputLog && step.outputLog.length > 0 && (
                        <div className="mt-2 p-3 rounded-lg bg-[#0f172a] border border-[#283044] text-[11px] font-mono text-emerald-400 space-y-1">
                          {step.outputLog.map((line, idx) => (
                            <div key={idx} className="leading-relaxed">
                              {line}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Step Action Button */}
                    <div className="shrink-0 flex items-center space-x-2">
                      {isCompleted ? (
                        <span className="flex items-center text-xs font-mono font-bold text-[#059669] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 mr-1 text-[#059669]" />
                          Executed ({step.durationMs}ms)
                        </span>
                      ) : (
                        <button
                          disabled={isStepRunning}
                          onClick={() => handleExecuteStep(step)}
                          className={`flex items-center px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                            isStepRunning
                              ? 'bg-[#c7c4d8] text-[#464555] cursor-not-allowed'
                              : runbookMode === 'EXECUTE'
                              ? 'bg-[#ba1a1a] hover:bg-red-700 text-white shadow-xs'
                              : 'bg-[#3525cd] hover:bg-[#4f46e5] text-white shadow-xs'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                          <span>
                            {isStepRunning 
                              ? 'Executing...' 
                              : runbookMode === 'EXECUTE' 
                              ? 'Execute Step in Prod' 
                              : 'Simulate Step'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: POST-MORTEM & HUMAN NOTES */}
      {activeTab === 'postmortem' && (
        <div className="space-y-6">
          {/* Post Mortem Document Card */}
          {incident.postMortemDraft && (
            <div className="bg-white rounded-xl border border-[#dae2fd] p-6 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#eaedff]">
                <div>
                  <span className="text-xs font-mono font-bold text-[#7c3aed] uppercase tracking-wider block">
                    Automated Blameless Post-Mortem
                  </span>
                  <h3 className="text-lg font-bold text-[#131b2e] mt-1">
                    Post-Incident Review: {incident.id}
                  </h3>
                </div>

                <button
                  onClick={onOpenPostMortemModal}
                  className="flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[#eaedff] text-[#3525cd] hover:bg-[#dad7ff] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Export Report (Markdown / PDF)</span>
                </button>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-[#464555]">
                  Root Cause Summary
                </h4>
                <p className="mt-1.5 text-xs text-[#131b2e] leading-relaxed bg-[#faf8ff] p-3 rounded-lg border border-[#eaedff]">
                  {incident.postMortemDraft.rootCauseAnalysis}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-[#464555]">
                  Chronological Incident Timeline
                </h4>
                <p className="mt-1.5 text-xs font-mono text-[#464555] bg-[#f2f3ff] p-3 rounded-lg border border-[#dae2fd]">
                  {incident.postMortemDraft.timelineSummary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-[#464555] mb-2">
                  Systemic Action Items & Architectural Remediation
                </h4>
                <div className="space-y-2">
                  {incident.postMortemDraft.preventionItems.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-[#131b2e]">
                      <span className="w-5 h-5 rounded-full bg-[#eaedff] text-[#3525cd] font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Collaborative Human Notes Feed */}
          <div className="bg-white rounded-xl border border-[#dae2fd] p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono">
              Human-in-the-Loop Operator Journal
            </h3>

            {/* Existing notes */}
            <div className="space-y-3">
              {incident.humanNotes.map((note) => (
                <div key={note.id} className="p-3.5 rounded-lg bg-[#faf8ff] border border-[#eaedff] flex items-start space-x-3">
                  <img
                    src={note.avatar}
                    alt={note.author}
                    className="w-8 h-8 rounded-full border border-[#dae2fd] object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#131b2e]">{note.author}</span>
                      <span className="text-[#777587]">{note.time}</span>
                    </div>
                    <p className="text-xs text-[#464555] font-sans leading-relaxed">
                      {note.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Note input */}
            <form onSubmit={handleAddNote} className="pt-2 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Log an observation, runbook verification, or override..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] placeholder-[#777587] focus:outline-hidden focus:ring-2 focus:ring-[#3525cd]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#3525cd] text-white font-semibold text-xs rounded-lg hover:bg-[#4f46e5] flex items-center space-x-1.5 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Log Note</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Safety Gate Confirmation Modal */}
      {safetyGateModalStep && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-center space-x-3 text-[#ba1a1a]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold">Safety Gate Approval Required</h3>
            </div>
            
            <p className="text-xs text-[#464555] leading-relaxed">
              Step <strong className="text-[#131b2e]">{safetyGateModalStep.stepNumber}: {safetyGateModalStep.label}</strong> executes a live cluster mutation on production infrastructure.
            </p>

            <div className="p-3 rounded-lg bg-[#0f172a] text-[#eaedff] font-mono text-xs overflow-x-auto">
              <code>{safetyGateModalStep.command}</code>
            </div>

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 font-medium">
              Verified by CaseMind Autonomous Safety Check: Risk level is <strong>LOW</strong> (Zero pod drops guaranteed by maxSurge=25%, maxUnavailable=0).
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setSafetyGateModalStep(null)}
                className="px-4 py-2 text-xs font-semibold text-[#464555] hover:bg-[#f2f3ff] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => proceedStepExecution(safetyGateModalStep.id)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#ba1a1a] hover:bg-red-700 rounded-lg shadow-sm"
              >
                Confirm & Execute in Production
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
