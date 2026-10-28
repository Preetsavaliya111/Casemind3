import React, { useState } from 'react';
import { 
  Incident, 
  Severity, 
  IncidentStatus 
} from '../types';
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Filter, 
  Search, 
  Sparkles, 
  Zap, 
  GitBranch, 
  Layers, 
  Activity,
  DollarSign,
  Play
} from 'lucide-react';

interface TriageCommandBoardProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onOpenSimulate: () => void;
  onQuickRunbook: (incident: Incident) => void;
}

export const TriageCommandBoard: React.FC<TriageCommandBoardProps> = ({
  incidents,
  onSelectIncident,
  onOpenSimulate,
  onQuickRunbook
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Filtered incidents
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.cluster.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = 
      selectedSeverity === 'ALL' || inc.severity.startsWith(selectedSeverity);

    const matchesStatus = 
      selectedStatus === 'ALL' || inc.status === selectedStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const p0Count = incidents.filter(i => i.severity.startsWith('P0') && i.status !== 'RESOLVED').length;
  const p1Count = incidents.filter(i => i.severity.startsWith('P1') && i.status !== 'RESOLVED').length;
  const activeCount = incidents.filter(i => i.status !== 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* Executive Telemetry & Ingestion Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-[#dae2fd] shadow-xs relative overflow-hidden group hover:border-[#4f46e5] transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#464555] uppercase tracking-wider">Active Criticals</span>
            <div className="flex space-x-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#ffdad6] text-[#ba1a1a]">
                P0: {p0Count}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-100 text-amber-800">
                P1: {p1Count}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-[#131b2e] tracking-tight font-mono">
              {activeCount} <span className="text-sm font-normal text-[#464555]">Active Cases</span>
            </div>
            <div className="flex items-center text-xs text-[#059669] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mr-1" />
              100% Ingested
            </div>
          </div>
          <div className="mt-2 text-xs text-[#464555] flex items-center">
            <span>SLA breach risk:</span>
            <span className="ml-1 font-semibold text-[#ba1a1a]">1 case &lt; 20m</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-[#dae2fd] shadow-xs relative overflow-hidden group hover:border-[#4f46e5] transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#464555] uppercase tracking-wider">Mean Time to Diagnosis</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#eaedff] text-[#3525cd]">
              -68% vs baseline
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-[#3525cd] tracking-tight font-mono">
              3.2m <span className="text-sm font-normal text-[#464555]">MTTD</span>
            </div>
            <span className="text-xs text-[#464555] font-mono">Industry: 24m</span>
          </div>
          <div className="mt-2 text-xs text-[#464555]">
            Correlating across <strong className="text-[#131b2e]">4.2M spans</strong> in memory
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-[#dae2fd] shadow-xs relative overflow-hidden group hover:border-[#4f46e5] transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#464555] uppercase tracking-wider">Cognitive RCA Accuracy</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-50 text-[#006077] border border-cyan-200">
              Verified
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-[#0891b2] tracking-tight font-mono">
              94.6%
            </div>
            <span className="text-xs text-[#059669] font-medium">+1.4% this week</span>
          </div>
          <div className="mt-2 text-xs text-[#464555]">
            Grounded by <strong className="text-[#131b2e]">Organizational Memory Graph</strong>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-[#dae2fd] shadow-xs relative overflow-hidden group hover:border-[#4f46e5] transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#464555] uppercase tracking-wider">Runbook Automation</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#e4d4ff] text-[#5c00ca]">
              Tier-3 Safe
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-[#7c3aed] tracking-tight font-mono">
              88.4%
            </div>
            <span className="text-xs text-[#464555]">1-Click Verified</span>
          </div>
          <div className="mt-2 text-xs text-[#464555]">
            Zero unauthorized write operations
          </div>
        </div>
      </div>

      {/* Filter and Command Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#dae2fd] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777587]" />
            <input
              type="text"
              placeholder="Search incidents by ID, service, trace hash, commit, or symptom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-sm text-[#131b2e] placeholder-[#777587] focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5] focus:bg-white transition-all font-sans"
            />
          </div>

          {/* Quick Simulate Trigger */}
          <button
            onClick={onOpenSimulate}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3525cd] border border-[#c3c0ff] rounded-lg text-sm font-semibold transition-colors shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#7c3aed]" />
            <span>Simulate Incident Scenario</span>
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#eaedff]">
          {/* Severity selector */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-[#464555] font-semibold mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Severity:
            </span>
            {['ALL', 'P0', 'P1', 'P2', 'P3'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono font-medium transition-all ${
                  selectedSeverity === sev
                    ? 'bg-[#3525cd] text-white shadow-xs'
                    : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-[#464555] font-semibold mr-1">Status:</span>
            {['ALL', 'INVESTIGATING', 'MITIGATING', 'MONITORING', 'RESOLVED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  selectedStatus === st
                    ? 'bg-[#131b2e] text-white shadow-xs'
                    : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-[#c7c4d8]">
            <CheckCircle2 className="w-12 h-12 text-[#059669] mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#131b2e]">No matching incidents found</h3>
            <p className="text-sm text-[#464555] mt-1 max-w-md mx-auto">
              All services matching your criteria are operating within nominal parameters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSeverity('ALL'); setSelectedStatus('ALL'); }}
              className="mt-4 px-4 py-2 bg-[#f2f3ff] text-[#3525cd] font-semibold text-xs rounded-md hover:bg-[#eaedff]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const isP0 = incident.severity.startsWith('P0');
            const isP1 = incident.severity.startsWith('P1');
            const isResolved = incident.status === 'RESOLVED';
            const hasUrgentSLA = incident.slaRemainingMinutes > 0 && incident.slaRemainingMinutes < 30;

            return (
              <div
                key={incident.id}
                className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-md ${
                  isP0 && !isResolved
                    ? 'border-l-4 border-l-[#ba1a1a] border-[#ffdad6]'
                    : isP1 && !isResolved
                    ? 'border-l-4 border-l-amber-500 border-amber-200'
                    : isResolved
                    ? 'border-l-4 border-l-[#059669] border-[#dae2fd] opacity-80 hover:opacity-100'
                    : 'border-l-4 border-l-[#4f46e5] border-[#dae2fd]'
                }`}
              >
                <div className="p-5">
                  {/* Top line: ID, Severity, Status, Service, SLA */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      {/* Pulsing indicator for active P0/P1 */}
                      {!isResolved && (isP0 || isP1) && (
                        <span className="relative flex h-3 w-3">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            isP0 ? 'bg-[#ba1a1a]' : 'bg-amber-500'
                          }`} />
                          <span className={`relative inline-flex rounded-full h-3 w-3 ${
                            isP0 ? 'bg-[#ba1a1a]' : 'bg-amber-500'
                          }`} />
                        </span>
                      )}

                      <span className="font-mono font-bold text-sm text-[#131b2e] bg-[#f2f3ff] px-2 py-0.5 rounded border border-[#dae2fd]">
                        {incident.id}
                      </span>

                      {/* Severity Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                        isP0 
                          ? 'bg-[#ffdad6] text-[#93000a] border border-[#ffb4ab]'
                          : isP1
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-[#eaedff] text-[#3525cd] border border-[#c3c0ff]'
                      }`}>
                        {incident.severity}
                      </span>

                      {/* Status */}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase font-mono ${
                        isResolved
                          ? 'bg-emerald-50 text-[#059669] border border-emerald-200'
                          : incident.status === 'MITIGATING'
                          ? 'bg-cyan-50 text-[#0891b2] border border-cyan-200'
                          : 'bg-purple-50 text-[#7c3aed] border border-purple-200'
                      }`}>
                        {incident.status}
                      </span>

                      {/* Cluster */}
                      <span className="text-xs font-mono text-[#464555] hidden sm:inline bg-[#f2f3ff] px-2 py-0.5 rounded">
                        {incident.cluster}
                      </span>
                    </div>

                    {/* Right SLA countdown */}
                    <div className="flex items-center space-x-3 text-xs">
                      {!isResolved ? (
                        <div className={`flex items-center font-mono font-semibold px-2.5 py-1 rounded-md ${
                          hasUrgentSLA
                            ? 'bg-[#ffdad6] text-[#ba1a1a] animate-pulse border border-[#ba1a1a]/30'
                            : 'bg-[#eaedff] text-[#131b2e]'
                        }`}>
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          <span>SLA Target: {incident.slaRemainingMinutes}m left</span>
                        </div>
                      ) : (
                        <div className="flex items-center font-mono text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          <span>Resolved</span>
                        </div>
                      )}
                      <span className="text-[#777587]">{incident.openedAt}</span>
                    </div>
                  </div>

                  {/* Incident Title */}
                  <div className="mt-3">
                    <h3 
                      onClick={() => onSelectIncident(incident.id)}
                      className="text-base font-bold text-[#131b2e] hover:text-[#3525cd] cursor-pointer transition-colors"
                    >
                      {incident.title}
                    </h3>
                  </div>

                  {/* Synthesis Violet Section: AI Root Cause Analysis summary */}
                  <div className="mt-3 p-3.5 rounded-lg bg-[#faf8ff] border border-[#e4d4ff] relative">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-[#7c3aed] flex items-center uppercase tracking-wider font-mono">
                            <Sparkles className="w-3.5 h-3.5 mr-1" />
                            Autonomous RCA Synthesis
                          </span>
                          <span className="text-xs font-mono text-[#059669] font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            {incident.cognitiveSynthesis.confidenceScore}% Confidence
                          </span>
                        </div>
                        <p className="text-xs text-[#131b2e] leading-relaxed">
                          {incident.cognitiveSynthesis.probableRootCause}
                        </p>
                      </div>

                      {/* Evidence citation pill (Evidence Cyan) */}
                      {incident.evidenceProvenance.memoryMatches.length > 0 && (
                        <div className="shrink-0 hidden md:block">
                          <span className="inline-flex items-center text-[11px] font-mono font-semibold bg-cyan-50 text-[#006077] border border-[#76dcff] px-2.5 py-1 rounded-md">
                            <GitBranch className="w-3 h-3 mr-1 text-[#0891b2]" />
                            Match: {incident.evidenceProvenance.memoryMatches[0].incidentId} ({incident.evidenceProvenance.memoryMatches[0].similarityScore}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Stats & Action Row */}
                  <div className="mt-4 pt-3 border-t border-[#eaedff] flex flex-wrap items-center justify-between gap-3">
                    {/* Blast Radius Telemetry */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#464555]">
                      <div className="flex items-center text-[#131b2e]">
                        <Users className="w-3.5 h-3.5 mr-1 text-[#777587]" />
                        <span>Impact: <strong>{incident.blastRadius.affectedUsers.toLocaleString()}</strong> users ({incident.blastRadius.pctTraffic}%)</span>
                      </div>
                      <div className="flex items-center text-[#131b2e]">
                        <DollarSign className="w-3.5 h-3.5 mr-0.5 text-amber-600" />
                        <span>Run-rate: <strong>{incident.blastRadius.revenueImpactPerHour}</strong></span>
                      </div>
                      <div className="hidden lg:flex items-center text-[#464555]">
                        <Layers className="w-3.5 h-3.5 mr-1 text-[#777587]" />
                        <span>Target: <code className="text-[#3525cd] font-semibold">{incident.service}</code></span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2">
                      {incident.runbook.steps.length > 0 && !isResolved && (
                        <button
                          onClick={() => onQuickRunbook(incident)}
                          className="flex items-center px-3 py-1.5 text-xs font-semibold rounded-md bg-[#eaedff] text-[#3525cd] hover:bg-[#dad7ff] border border-[#c3c0ff] transition-colors"
                        >
                          <Play className="w-3 h-3 mr-1 text-[#3525cd] fill-current" />
                          <span>Runbook ({incident.runbook.id})</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectIncident(incident.id)}
                        className="flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[#3525cd] text-white hover:bg-[#4f46e5] shadow-xs transition-colors"
                      >
                        <span>Deep Diagnostic</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
