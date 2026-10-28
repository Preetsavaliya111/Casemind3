import React from 'react';
import { UserProfile } from '../types';
import { Settings, X, Shield, Clock, Play, Check, Lock, LogOut, UserCheck, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  telemetryInterval: number;
  onChangeTelemetryInterval: (sec: number) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: (val: boolean) => void;
  onReplayIntro: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
  onLogout,
  telemetryInterval,
  onChangeTelemetryInterval,
  reducedMotion,
  onToggleReducedMotion,
  onReplayIntro
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 selection:bg-[#4f46e5] selection:text-white">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#dae2fd] space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-4">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-[#eaedff] text-[#3525cd]">
              <Settings className="w-5 h-5 text-[#3525cd]" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#131b2e]">
                Platform Settings & Security Profile
              </h3>
              <p className="text-xs text-[#464555]">
                Active identity, role-based capabilities, and telemetry preferences.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-[#777587] hover:bg-[#f2f3ff]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Authenticated Profile & RBAC Security */}
        <div className="p-4 rounded-2xl bg-[#faf8ff] border border-[#c3c0ff] space-y-3">
          {currentUser ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#3525cd] flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  Authenticated Security Principal
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                    : currentUser.role === 'MANAGER'
                    ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                    : currentUser.role === 'AGENT'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-100 text-slate-800 border border-slate-300'
                }`}>
                  {currentUser.role} ROLE
                </span>
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#3525cd] shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-[#131b2e] leading-snug truncate">
                    {currentUser.name}
                  </h4>
                  <p className="text-xs text-[#464555] font-mono truncate">{currentUser.email}</p>
                  <p className="text-[11px] text-[#777587]">{currentUser.team}</p>
                </div>
              </div>

              {/* Role Permission Matrix */}
              <div className="pt-2 border-t border-[#eaedff] text-[11px] font-mono space-y-1 text-[#464555]">
                <div className="flex justify-between">
                  <span>Runbook Execution:</span>
                  <strong className={currentUser.role === 'VIEWER' ? 'text-[#ba1a1a]' : 'text-[#059669]'}>
                    {currentUser.role === 'VIEWER' ? 'Disabled (Read-Only)' : currentUser.role === 'AGENT' ? 'Dry-Run & Safe Steps' : 'Authorized'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Safety Gate Approval:</span>
                  <strong className={currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER' ? 'text-[#059669]' : 'text-[#ba1a1a]'}>
                    {currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER' ? 'Authorized' : 'Requires Manager/Admin'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Role Directory Mutation:</span>
                  <strong className={currentUser.role === 'ADMIN' ? 'text-[#7c3aed]' : 'text-[#ba1a1a]'}>
                    {currentUser.role === 'ADMIN' ? 'Authorized (ADMIN)' : 'Locked'}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Switch Account / Sign In</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#c7c4d8] text-[#ba1a1a] hover:bg-red-50 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#464555] flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-1 text-[#ba1a1a]" />
                  Session State
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                  Unauthenticated Guest
                </span>
              </div>
              <p className="text-xs text-[#464555]">
                You are currently unauthenticated. Privileged tabs such as Governance Admin and Executive Telemetry are protected and require sign-in.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-[#3525cd] to-[#4f46e5] text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity flex items-center justify-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In / Choose Demo Role</span>
              </button>
            </div>
          )}
        </div>

        {/* Telemetry Polling Interval */}
        <div className="space-y-2 pt-2 border-t border-[#eaedff]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464555] font-mono uppercase">
              Telemetry Ingestion Polling Rate
            </span>
            <span className="text-xs font-mono font-semibold text-[#3525cd]">
              {telemetryInterval === 0 ? 'Manual' : `Every ${telemetryInterval}s`}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {[5, 15, 30, 0].map((sec) => (
              <button
                key={sec}
                onClick={() => onChangeTelemetryInterval(sec)}
                className={`flex-1 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                  telemetryInterval === sec
                    ? 'bg-[#3525cd] text-white border-[#3525cd]'
                    : 'bg-[#f2f3ff] text-[#464555] border-[#c7c4d8]'
                }`}
              >
                {sec === 0 ? 'Manual' : `${sec}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility & Intro Replay */}
        <div className="space-y-3 pt-2 border-t border-[#eaedff]">
          <span className="text-xs font-bold text-[#464555] font-mono uppercase block">
            Interface Preferences
          </span>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#faf8ff] border border-[#eaedff] cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-[#131b2e] block">Reduced Motion</span>
              <span className="text-[11px] text-[#464555]">Suppresses pulse and radar animations.</span>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => onToggleReducedMotion(e.target.checked)}
              className="w-4 h-4 text-[#3525cd] rounded"
            />
          </label>

          <button
            onClick={() => {
              onReplayIntro();
              onClose();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-semibold text-[#3525cd] border border-[#c3c0ff] transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Replay Initial Boot Sequence Animation</span>
          </button>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-[#eaedff]">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-[#131b2e] bg-[#f2f3ff] hover:bg-[#eaedff] rounded-xl"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
