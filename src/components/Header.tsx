import React from 'react';
import { 
  ShieldAlert, 
  BrainCircuit, 
  Network, 
  BarChart3, 
  Sparkles, 
  Bell, 
  Radio, 
  Terminal,
  Cpu,
  BookOpen,
  Lock,
  PlusCircle,
  Settings,
  MessageSquare
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentTab: 'triage' | 'workspace' | 'graph' | 'knowledge' | 'analytics' | 'admin';
  onSelectTab: (tab: 'triage' | 'workspace' | 'graph' | 'knowledge' | 'analytics' | 'admin') => void;
  activeIncidentsCount: number;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenCreateTicket: () => void;
  onOpenCopilot: () => void;
  onOpenSettings: () => void;
  selectedIncidentId: string;
  currentUser: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  activeIncidentsCount,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenCreateTicket,
  onOpenCopilot,
  onOpenSettings,
  selectedIncidentId,
  currentUser
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-[#dae2fd] shadow-xs">
      {/* Top operational alert ticker */}
      <div className="bg-[#131b2e] text-[#eaedff] px-4 py-1 text-xs font-mono flex items-center justify-between border-b border-[#283044]">
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="flex items-center text-[#76dcff] font-semibold tracking-wide shrink-0">
            <Radio className="w-3.5 h-3.5 mr-1 text-[#0891b2] animate-pulse" />
            CASEMIND INGESTION ENGINE
          </span>
          <span className="text-[#c7c4d8] hidden sm:inline">|</span>
          <span className="text-[#c3c0ff] truncate hidden sm:inline">
            Active Telemetry Feed: 42,810 spans/sec · OpenTelemetry v1.28 · K8s Clusters: 6/6 Healthy
          </span>
        </div>
        <div className="flex items-center space-x-4 text-[#dad7ff]">
          <span className="hidden md:flex items-center">
            <Cpu className="w-3 h-3 mr-1 text-[#059669]" />
            Cognitive Inference: <strong className="ml-1 text-white">Online (12ms)</strong>
          </span>
          <span className="text-[#c7c4d8] hidden md:inline">|</span>
          <span className="text-emerald-400 font-semibold flex items-center text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
            99.98% SLA
          </span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand logo & status */}
          <div className="flex items-center space-x-3 shrink-0">
            <div 
              onClick={() => onSelectTab('triage')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-[#3525cd] via-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-base tracking-tight text-[#131b2e] group-hover:text-[#3525cd] transition-colors">
                    CaseMind
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-[#eaedff] text-[#3525cd] font-semibold uppercase tracking-wider font-mono border border-[#c3c0ff]">
                    AI
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => onSelectTab('triage')}
              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentTab === 'triage'
                  ? 'bg-[#eaedff] text-[#3525cd] border-b-2 border-[#3525cd]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 mr-1 text-[#ba1a1a]" />
              <span>Incidents</span>
              {activeIncidentsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#ba1a1a] text-white">
                  {activeIncidentsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('workspace')}
              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentTab === 'workspace'
                  ? 'bg-[#eaedff] text-[#3525cd] border-b-2 border-[#3525cd]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 mr-1 text-[#7c3aed]" />
              <span>Workspace</span>
              <span className="ml-1 text-[10px] font-mono text-[#7c3aed] bg-[#e4d4ff] px-1 rounded">
                {selectedIncidentId}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('graph')}
              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentTab === 'graph'
                  ? 'bg-[#eaedff] text-[#3525cd] border-b-2 border-[#3525cd]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <Network className="w-3.5 h-3.5 mr-1 text-[#0891b2]" />
              <span>Memory Graph</span>
            </button>

            <button
              onClick={() => onSelectTab('knowledge')}
              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentTab === 'knowledge'
                  ? 'bg-[#eaedff] text-[#3525cd] border-b-2 border-[#3525cd]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1 text-[#059669]" />
              <span>Knowledge Base</span>
            </button>

            <button
              onClick={() => onSelectTab('analytics')}
              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentTab === 'analytics'
                  ? 'bg-[#eaedff] text-[#3525cd] border-b-2 border-[#3525cd]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 mr-1 text-[#006780]" />
              <span>Telemetry</span>
            </button>

            <button
              onClick={() => onSelectTab('admin')}
              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentTab === 'admin'
                  ? 'bg-[#eaedff] text-[#3525cd] border-b-2 border-[#3525cd]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <Lock className="w-3.5 h-3.5 mr-1 text-[#5c00ca]" />
              <span>Admin & Audit</span>
            </button>
          </nav>

          {/* Action triggers & profile */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Create ticket */}
            <button
              onClick={onOpenCreateTicket}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-[#3525cd] text-white hover:bg-[#4f46e5] shadow-xs transition-colors"
              title="Create new incident or support ticket"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Ticket</span>
            </button>

            {/* AI Copilot trigger */}
            <button
              onClick={onOpenCopilot}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-linear-to-r from-[#7c3aed] to-[#4f46e5] text-white hover:opacity-95 shadow-xs transition-opacity"
              title="Open CaseMind Investigation Copilot"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Copilot</span>
            </button>

            {/* Notification bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff] transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse" />
              )}
            </button>

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff] transition-colors"
              aria-label="Platform settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User profile with role badge */}
            <div 
              onClick={onOpenSettings}
              className="flex items-center space-x-1.5 pl-1 cursor-pointer group"
              title={`Logged in as ${currentUser.name} (${currentUser.role}). Click to switch role.`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full border border-[#3525cd] object-cover"
              />
              <span className={`hidden xl:inline text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                currentUser.role === 'ADMIN'
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : currentUser.role === 'MANAGER'
                  ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                  : currentUser.role === 'AGENT'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-slate-100 text-slate-800 border-slate-300'
              }`}>
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="lg:hidden flex items-center space-x-1 py-2 overflow-x-auto border-t border-[#eaedff] text-xs">
          {[
            { id: 'triage', label: 'Incidents' },
            { id: 'workspace', label: 'Workspace' },
            { id: 'graph', label: 'Memory Graph' },
            { id: 'knowledge', label: 'Knowledge Base' },
            { id: 'analytics', label: 'Telemetry' },
            { id: 'admin', label: 'Admin & Audit' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as any)}
              className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
                currentTab === item.id 
                  ? 'bg-[#eaedff] text-[#3525cd] font-bold' 
                  : 'text-[#464555]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
