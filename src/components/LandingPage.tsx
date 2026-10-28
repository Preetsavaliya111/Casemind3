import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  GitBranch, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Cpu, 
  Database, 
  Layers, 
  Users, 
  Radio, 
  Zap, 
  ChevronRight,
  TrendingDown,
  FileText,
  ShieldCheck,
  UserCheck,
  LogIn
} from 'lucide-react';
import { UserProfile } from '../types';
import { TEAM_USERS } from '../data/mockIncidents';
import { LandingThreeHero } from './LandingThreeHero';

interface LandingPageProps {
  onEnterConsole: () => void;
  onOpenAuth: () => void;
  currentUser: UserProfile | null;
  onSelectIncident: (id: string) => void;
  onQuickLogin?: (user: UserProfile) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterConsole,
  onOpenAuth,
  currentUser,
  onSelectIncident,
  onQuickLogin
}) => {
  const [pulseCount, setPulseCount] = useState<number>(42810);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'rca' | 'memory' | 'runbooks' | 'security'>('rca');

  // Realistic telemetry ticker animation
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCount(prev => prev + Math.floor(Math.random() * 45) - 20);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-16 py-6 font-sans selection:bg-[#4f46e5] selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-[#131b2e] via-[#1a233d] to-[#0f172a] text-white p-8 sm:p-12 lg:p-16 border border-[#283044] shadow-2xl">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Glowing atmospheric orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#3525cd]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#7c3aed]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Status pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono text-[#76dcff]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Autonomous Cognitive Ingestion: {pulseCount.toLocaleString()} spans/sec</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Enterprise Cognitive Incident Operations Grounded on{' '}
            <span className="bg-linear-to-r from-[#76dcff] via-[#c3c0ff] to-[#e4d4ff] bg-clip-text text-transparent">
              Organizational Memory
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#cbd5e1] max-w-2xl mx-auto font-sans leading-relaxed">
            CaseMind correlates distributed telemetry across microservices, synthesizes root cause hypotheses with inspectable confidence metrics, and generates zero-downtime verified runbooks for Tier-3 SREs.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onEnterConsole}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-linear-to-r from-[#3525cd] via-[#4f46e5] to-[#7c3aed] text-white hover:opacity-95 shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{currentUser ? 'Launch Incident Command Console' : 'Explore Incident Command Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!currentUser ? (
              <button
                onClick={onOpenAuth}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-xs flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#76dcff]" />
                <span>Sign In / Select Demo Role</span>
              </button>
            ) : (
              <div className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xs flex items-center space-x-2 font-mono text-xs">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-[#76dcff]"
                />
                <span className="text-[#dad7ff]">Authenticated:</span>
                <span className="font-bold text-white">{currentUser.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/30 text-[#76dcff] font-bold">
                  {currentUser.role}
                </span>
              </div>
            )}
          </div>

          {/* Unauthenticated Quick-Login Switcher */}
          {!currentUser ? (
            <div className="mx-auto max-w-2xl p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-md text-left space-y-3 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-mono font-semibold text-slate-200">
                    Unauthenticated Session &bull; Protected Tabs Enforce RBAC
                  </span>
                </div>
                <button
                  onClick={onOpenAuth}
                  className="text-[11px] font-mono text-[#76dcff] hover:underline flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Custom Sign-In / Google</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-300 font-sans">
                Sensitive tabs (Admin Governance, Telemetry Analytics) require authorized enterprise credentials. Fast-switch to an authorized demo role:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {(['ADMIN', 'MANAGER', 'AGENT', 'VIEWER'] as const).map((role) => {
                  const user = TEAM_USERS.find(u => u.role === role);
                  if (!user) return null;
                  return (
                    <button
                      key={user.id}
                      onClick={() => onQuickLogin ? onQuickLogin(user) : onOpenAuth()}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-indigo-400 text-left transition-all flex items-center space-x-2 group cursor-pointer"
                      title={`Switch to ${user.name} (${user.role})`}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-600 group-hover:border-indigo-400 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-white truncate">{user.name.split(' ')[0]}</div>
                        <div className={`text-[9px] font-mono font-bold uppercase ${
                          user.role === 'ADMIN' ? 'text-purple-400' :
                          user.role === 'MANAGER' ? 'text-indigo-400' :
                          user.role === 'AGENT' ? 'text-emerald-400' : 'text-slate-400'
                        }`}>
                          {user.role}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl px-4 py-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Trust RBAC Active &bull; Role permissions strictly bound to {currentUser.role}</span>
              </span>
              <button
                onClick={onOpenAuth}
                className="text-[#76dcff] hover:underline text-[11px] font-semibold"
              >
                Switch Role
              </button>
            </div>
          )}

          {/* 3D Organizational Memory Network Preview */}
          <div className="relative my-4 p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/30 shadow-2xl backdrop-blur-md overflow-hidden max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono font-semibold text-slate-300">
                  Interactive 3D Organizational Memory Engine &bull; Live Synaptic Flow
                </span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400">Three.js WebGL</span>
            </div>
            <LandingThreeHero className="w-full h-[280px]" />
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Active Incidents
                <span className="w-2 h-2 rounded-full bg-cyan-400 ml-2" /> Historical Cases
                <span className="w-2 h-2 rounded-full bg-purple-500 ml-2" /> Root Causes
                <span className="w-2 h-2 rounded-full bg-emerald-400 ml-2" /> Verified Runbooks
              </span>
              <span className="text-slate-400">Move mouse to tilt perspective</span>
            </div>
          </div>

          {/* Live telemetry teaser */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-white/10 max-w-3xl mx-auto font-mono text-xs">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[#94a3b8] block uppercase text-[10px]">MTTD Reduction</span>
              <span className="text-xl font-bold text-[#76dcff]">-68.4%</span>
              <span className="text-[10px] text-[#059669] block">3.2m vs 24m baseline</span>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[#94a3b8] block uppercase text-[10px]">RCA Precision</span>
              <span className="text-xl font-bold text-[#c3c0ff]">94.6%</span>
              <span className="text-[10px] text-[#dad7ff] block">Vector Grounded</span>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[#94a3b8] block uppercase text-[10px]">Human Override Rate</span>
              <span className="text-xl font-bold text-[#e4d4ff]">1.9%</span>
              <span className="text-[10px] text-emerald-400 block">Ultra-High Trust</span>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[#94a3b8] block uppercase text-[10px]">SRE Hours Saved</span>
              <span className="text-xl font-bold text-emerald-400">428h</span>
              <span className="text-[10px] text-[#94a3b8] block">Per Month</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Case Showcase Card */}
      <section className="max-w-5xl mx-auto space-y-4">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#3525cd] bg-[#eaedff] px-3 py-1 rounded-full border border-[#c3c0ff]">
            Live Case Demonstration
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#131b2e] tracking-tight">
            Explainable AI in Action: No Black Boxes
          </h2>
          <p className="text-sm text-[#464555] max-w-xl mx-auto">
            Inspect how CaseMind correlates an active P0 Auth Gateway failure with commit logs, Redis telemetry, and 94-day-old organizational memory.
          </p>
        </div>

        {/* Live Card */}
        <div 
          onClick={() => onSelectIncident('INC-8942')}
          className="bg-white rounded-2xl border-2 border-[#4f46e5]/30 hover:border-[#4f46e5] p-6 shadow-xl transition-all cursor-pointer group"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eaedff] pb-4">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ba1a1a] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ba1a1a]" />
              </span>
              <span className="font-mono font-bold text-sm bg-[#ffdad6] text-[#ba1a1a] px-2.5 py-0.5 rounded">
                INC-8942 · P0 - CRITICAL
              </span>
              <span className="font-mono text-xs text-[#3525cd] font-semibold bg-[#eaedff] px-2 py-0.5 rounded">
                auth-gateway-v2
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-[#059669]">
              <span className="bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-bold">
                94.6% Cognitive Confidence
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left 2 cols */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-base font-bold text-[#131b2e] group-hover:text-[#3525cd] transition-colors">
                Cross-Region Latency Spike & Token Invalidation in Auth Gateway
              </h3>
              <p className="text-xs text-[#464555] leading-relaxed">
                Following deploy v4.12.8, client token refreshes surged 12x after JWT TTL was reduced from 3600s to 300s. Lettuce Redis client connection pool starved at 500/500 maximum connections, generating 504 Gateway Timeouts.
              </p>

              {/* Memory Match citation */}
              <div className="p-3 rounded-lg bg-[#f0fdfa] border border-[#76dcff] flex items-center justify-between text-xs font-mono text-[#006077]">
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-4 h-4 text-[#0891b2]" />
                  <span>Matched Memory: <strong>INC-7102 (Black Friday Spike)</strong></span>
                </div>
                <span className="font-bold text-[#0891b2]">96.4% Similarity</span>
              </div>
            </div>

            {/* Right col: Runbook preview */}
            <div className="bg-[#faf8ff] p-4 rounded-xl border border-[#dae2fd] space-y-2.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#7c3aed] block">
                  Autonomous Remediation Vector
                </span>
                <h4 className="text-xs font-bold text-[#131b2e] mt-1">
                  RB-AUTH-FAILOVER-09
                </h4>
                <p className="text-[11px] text-[#464555] mt-1">
                  Trip Ingress Circuit Breaker & Hot-Patch Redis Max Pool to 2,000 connections.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#3525cd]">
                <span>Inspect Full RCA Workspace</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Tabs */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#131b2e]">
            Core Architecture Principles
          </h2>
          <p className="text-xs text-[#464555]">
            Engineered for high-pressure incident rooms where black box guesses are unacceptable.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: 'rca', label: 'Explainable RCA', icon: Sparkles },
            { id: 'memory', label: 'Organizational Memory', icon: Database },
            { id: 'runbooks', label: 'Verified Runbooks', icon: Terminal },
            { id: 'security', label: 'Strict RBAC Security', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFeatureTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#3525cd] text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white text-[#464555] hover:bg-[#f2f3ff] border border-[#dae2fd]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Detail Card */}
        <div className="bg-white rounded-2xl border border-[#dae2fd] p-8 shadow-xs">
          {activeFeatureTab === 'rca' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#7c3aed] uppercase">
                  Synthesis Violet Protocol
                </span>
                <h3 className="text-xl font-bold text-[#131b2e]">
                  Root Cause Hypotheses Corroborated with Real Spans
                </h3>
                <p className="text-xs text-[#464555] leading-relaxed">
                  CaseMind generates explicit hypothesis testing matrices. Each theory is ranked by likelihood, corroborated against live Prometheus alerts and OpenTelemetry traces, or proven unlikely through refuting evidence.
                </p>
                <ul className="space-y-2 text-xs text-[#131b2e] font-medium">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    <span>Four-step causality chain mapping deploy actions to downstream failures</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    <span>Independent confidence breakdown for Root Cause, Blast Radius, and Safety</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#faf8ff] p-5 rounded-xl border border-[#e4d4ff] font-mono text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#eaedff]">
                  <span className="text-[#7c3aed] font-bold">Hypothesis Testing Matrix</span>
                  <span className="text-[#059669] text-[10px]">Active Ingestion</span>
                </div>
                <div className="p-2.5 rounded bg-white border border-purple-200 text-[#131b2e]">
                  <span className="text-[10px] bg-[#7c3aed] text-white px-1.5 py-0.2 rounded font-bold">CONFIRMED (94.6%)</span>
                  <p className="mt-1 text-[11px]">Redis Connection Pool Starvation via Token TTL reduction</p>
                </div>
                <div className="p-2.5 rounded bg-white border border-[#dae2fd] opacity-60 text-[#777587]">
                  <span className="text-[10px] bg-[#777587] text-white px-1.5 py-0.2 rounded font-bold">REFUTED (14.2%)</span>
                  <p className="mt-1 text-[11px]">AWS DirectConnect packet drop (CloudWatch 0.002% normal)</p>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'memory' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#0891b2] uppercase">
                  Evidence Cyan Protocol
                </span>
                <h3 className="text-xl font-bold text-[#131b2e]">
                  Instant Vector Recall Across 4.2 Million Past Incidents
                </h3>
                <p className="text-xs text-[#464555] leading-relaxed">
                  Support engineers should never solve the same outage twice. CaseMind maintains a high-dimensional vector memory graph linking microservice dependencies, architectural runbooks, and historical incident post-mortems.
                </p>
                <ul className="space-y-2 text-xs text-[#131b2e] font-medium">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0891b2]" />
                    <span>Matches historical resolution steps and time-to-recovery (MTTR)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0891b2]" />
                    <span>Indexes ingested engineering architecture documents, PDFs, and SOPs</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#faf8ff] p-5 rounded-xl border border-[#76dcff] font-mono text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#eaedff]">
                  <span className="text-[#0891b2] font-bold">Vector Memory Linkage</span>
                  <span className="text-[#006077] text-[10px]">Cosine Metric</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-cyan-200">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-[#006077]">INC-7102 Match</span>
                    <span className="font-bold text-[#0891b2]">96.4% Match</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#464555]">
                    Resolved by Marcus Vance (Principal SRE): Scaled REDIS_MAX_POOL from 500 to 2000.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'runbooks' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#3525cd] uppercase">
                  Intelligence Indigo Protocol
                </span>
                <h3 className="text-xl font-bold text-[#131b2e]">
                  Verified Step-by-Step Runbook Execution Hub
                </h3>
                <p className="text-xs text-[#464555] leading-relaxed">
                  Safely execute production remediations with dry-run verification, parameter injection, safety approval checkpoints, and full ANSI terminal replay logging.
                </p>
                <ul className="space-y-2 text-xs text-[#131b2e] font-medium">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3525cd]" />
                    <span>Simulated Dry-Run mode to verify parameters before cluster mutation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3525cd]" />
                    <span>Explicit safety gates required for pod rollouts and DB failovers</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#0f172a] p-4 rounded-xl border border-[#283044] text-[#eaedff] font-mono text-xs space-y-2">
                <div className="flex justify-between text-[11px] text-[#76dcff]">
                  <span>RB-AUTH-FAILOVER-09 Execution</span>
                  <span>Cluster: us-east-prod</span>
                </div>
                <div className="p-2.5 rounded bg-[#1e293b] text-emerald-400 text-[11px]">
                  [SUCCESS] Step 1: Redis memory headroom: 25.58 GB available.
                </div>
                <div className="p-2.5 rounded bg-[#1e293b] text-emerald-400 text-[11px]">
                  [SUCCESS] Step 2: ConfigMap patched: REDIS_MAX_POOL=2000.
                </div>
                <div className="p-2.5 rounded bg-amber-950/40 border border-amber-600/50 text-amber-300 text-[11px]">
                  [GATE] Step 3: Rolling Pod Restart requires Manager Approval.
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'security' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#5c00ca] uppercase">
                  Enterprise Governance
                </span>
                <h3 className="text-xl font-bold text-[#131b2e]">
                  Strict Role-Based Access Control & Immutable Auditing
                </h3>
                <p className="text-xs text-[#464555] leading-relaxed">
                  Only authorized roles can perform mutations. Viewers are strictly read-only, Agents require safety approvals, and only Administrators can modify directory roles and security policies.
                </p>
                <ul className="space-y-2 text-xs text-[#131b2e] font-medium">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5c00ca]" />
                    <span>Role isolation: ADMIN, MANAGER, AGENT, and VIEWER roles</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5c00ca]" />
                    <span>Immutable audit log trail of all command executions and role updates</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#faf8ff] p-5 rounded-xl border border-[#dae2fd] font-mono text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#eaedff]">
                  <span className="text-[#3525cd] font-bold">RBAC Enforcement Matrix</span>
                  <span className="text-[#059669] text-[10px]">Strict Mode</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between p-1.5 rounded bg-white border border-[#eaedff]">
                    <span className="font-bold text-[#7c3aed]">ADMIN</span>
                    <span className="text-[#059669]">Full Governance & Role Mutation</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-white border border-[#eaedff]">
                    <span className="font-bold text-[#3525cd]">MANAGER</span>
                    <span className="text-[#131b2e]">Approve Safety Gates & Incident Lead</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-white border border-[#eaedff]">
                    <span className="font-bold text-[#0891b2]">AGENT</span>
                    <span className="text-[#131b2e]">Triage & Dry-Run Execution Only</span>
                  </div>
                  <div className="flex justify-between p-1.5 rounded bg-white border border-[#eaedff]">
                    <span className="font-bold text-[#777587]">VIEWER</span>
                    <span className="text-[#ba1a1a]">Strict Read-Only Observation</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-linear-to-r from-[#3525cd] to-[#7c3aed] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Ready to reduce Tier-3 Incident MTTD by 68%?
        </h2>
        <p className="text-sm text-[#dad7ff] max-w-xl mx-auto">
          Enter the CaseMind Intelligence operations environment with pre-loaded enterprise scenarios and organizational memory.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <button
            onClick={onEnterConsole}
            className="px-6 py-3 bg-white text-[#3525cd] font-bold text-xs rounded-xl shadow-md hover:bg-[#f2f3ff] transition-colors"
          >
            Open Incident Command Console
          </button>
          {!currentUser && (
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl border border-white/30 transition-colors"
            >
              Sign In / Choose Role
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
