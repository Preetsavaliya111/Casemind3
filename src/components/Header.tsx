import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  BrainCircuit, 
  Network, 
  BarChart3, 
  Sparkles, 
  Bell, 
  Radio, 
  Terminal,
  Cpu
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'triage' | 'workspace' | 'graph' | 'analytics';
  onSelectTab: (tab: 'triage' | 'workspace' | 'graph' | 'analytics') => void;
  activeIncidentsCount: number;
  onOpenSimulate: () => void;
  selectedIncidentId: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  activeIncidentsCount,
  onOpenSimulate,
  selectedIncidentId
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-[#dae2fd] shadow-xs">
      {/* Top operational alert ticker */}
      <div className="bg-[#131b2e] text-[#eaedff] px-4 py-1 text-xs font-mono flex items-center justify-between border-b border-[#283044]">
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="flex items-center text-[#76dcff] font-semibold tracking-wide">
            <Radio className="w-3.5 h-3.5 mr-1 text-[#0891b2] animate-pulse" />
            CASEMIND INGESTION ENGINE
          </span>
          <span className="text-[#c7c4d8]">|</span>
          <span className="text-[#c3c0ff] truncate">
            Active Telemetry Feed: 42,810 spans/sec · OpenTelemetry v1.28 · K8s Clusters: 6/6 Healthy
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-[#dad7ff]">
          <span className="flex items-center">
            <Cpu className="w-3 h-3 mr-1 text-[#059669]" />
            Cognitive Inference Engine: <strong className="ml-1 text-white">Online (12ms)</strong>
          </span>
          <span className="text-[#c7c4d8]">|</span>
          <span className="text-emerald-400 font-semibold flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
            99.98% Platform SLA
          </span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand logo & status */}
          <div className="flex items-center space-x-3">
            <div 
              onClick={() => onSelectTab('triage')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#3525cd] via-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg tracking-tight text-[#131b2e] group-hover:text-[#3525cd] transition-colors">
                    CaseMind
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-sm bg-[#eaedff] text-[#3525cd] font-semibold uppercase tracking-wider font-mono border border-[#c3c0ff]">
                    Intelligence
                  </span>
                </div>
                <p className="text-xs text-[#464555] font-medium hidden sm:block">
                  Cognitive Tier-3 Incident & Support Operations
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => onSelectTab('triage')}
              className={`flex items-center px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                currentTab === 'triage'
                  ? 'bg-[#eaedff] text-[#3525cd] font-semibold border-b-2 border-[#3525cd]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <ShieldAlert className="w-4 h-4 mr-1.5 text-[#ba1a1a]" />
              <span>Incident Command</span>
              {activeIncidentsCount > 0 && (
                <span className="ml-2 px-1.5 py-0.2 rounded-full text-xs font-mono font-bold bg-[#ba1a1a] text-white">
                  {activeIncidentsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('workspace')}
              className={`flex items-center px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                currentTab === 'workspace'
                  ? 'bg-[#eaedff] text-[#3525cd] font-semibold border-b-2 border-[#3525cd]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <Terminal className="w-4 h-4 mr-1.5 text-[#7c3aed]" />
              <span>Diagnostic Workspace</span>
              <span className="ml-2 text-xs font-mono text-[#7c3aed] bg-[#e4d4ff] px-1.5 py-0.2 rounded font-semibold hidden md:inline">
                {selectedIncidentId}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('graph')}
              className={`flex items-center px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                currentTab === 'graph'
                  ? 'bg-[#eaedff] text-[#3525cd] font-semibold border-b-2 border-[#3525cd]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <Network className="w-4 h-4 mr-1.5 text-[#0891b2]" />
              <span className="hidden sm:inline">Memory Graph</span>
              <span className="sm:hidden">Graph</span>
            </button>

            <button
              onClick={() => onSelectTab('analytics')}
              className={`flex items-center px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                currentTab === 'analytics'
                  ? 'bg-[#eaedff] text-[#3525cd] font-semibold border-b-2 border-[#3525cd]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-1.5 text-[#006780]" />
              <span className="hidden sm:inline">Ops Telemetry</span>
              <span className="sm:hidden">Stats</span>
            </button>
          </nav>

          {/* Action triggers & profile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenSimulate}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-linear-to-r from-[#7c3aed] to-[#4f46e5] text-white hover:opacity-95 shadow-xs transition-opacity"
              title="Inject a realistic synthetic incident to test autonomous RCA"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Incident</span>
            </button>

            <div className="h-6 w-px bg-[#c7c4d8] hidden sm:block" />

            {/* Operator info */}
            <div className="flex items-center space-x-2 pl-1">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                alt="Elena Rostova"
                className="w-8 h-8 rounded-full border border-[#4f46e5] object-cover"
              />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-[#131b2e] leading-tight">Elena Rostova</p>
                <p className="text-[10px] text-[#464555] font-mono leading-tight">Staff Commander</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
