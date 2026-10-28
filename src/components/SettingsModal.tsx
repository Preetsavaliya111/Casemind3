import React from 'react';
import { UserProfile, UserRole } from '../types';
import { TEAM_USERS } from '../data/mockIncidents';
import { Settings, X, Shield, Clock, Eye, Play, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onChangeUser: (user: UserProfile) => void;
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
  onChangeUser,
  telemetryInterval,
  onChangeTelemetryInterval,
  reducedMotion,
  onToggleReducedMotion,
  onReplayIntro
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dae2fd] space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#eaedff] text-[#3525cd]">
              <Settings className="w-5 h-5 text-[#3525cd]" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#131b2e]">
                Platform Settings & Role Switcher
              </h3>
              <p className="text-xs text-[#464555]">
                Configure operator profile, RBAC permissions, and telemetry preferences.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-[#777587] hover:bg-[#f2f3ff]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher */}
        <div className="space-y-3">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#464555] uppercase font-mono">
            <Shield className="w-3.5 h-3.5 text-[#3525cd]" />
            <span>Switch Active Role (RBAC Simulation)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TEAM_USERS.map((usr) => {
              const isSelected = currentUser.id === usr.id;
              return (
                <div
                  key={usr.id}
                  onClick={() => onChangeUser(usr)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    isSelected
                      ? 'border-[#3525cd] bg-[#eaedff]/40 ring-2 ring-[#c3c0ff]'
                      : 'border-[#dae2fd] bg-[#faf8ff] hover:bg-white'
                  }`}
                >
                  <img
                    src={usr.avatar}
                    alt={usr.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#dae2fd]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#131b2e] truncate">{usr.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#3525cd]" />}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#7c3aed] block">
                      {usr.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Telemetry Ingestion Polling Interval */}
        <div className="space-y-2 pt-2 border-t border-[#eaedff]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#464555] font-mono uppercase">
              Telemetry Refresh Polling
            </span>
            <span className="text-xs font-mono font-semibold text-[#3525cd]">
              {telemetryInterval === 0 ? 'Paused' : `Every ${telemetryInterval}s`}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {[5, 15, 30, 0].map((sec) => (
              <button
                key={sec}
                onClick={() => onChangeTelemetryInterval(sec)}
                className={`flex-1 py-1.5 text-xs font-mono rounded-md border transition-colors ${
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

        {/* Accessibility & Motion */}
        <div className="space-y-3 pt-2 border-t border-[#eaedff]">
          <span className="text-xs font-bold text-[#464555] font-mono uppercase block">
            Accessibility & Motion
          </span>

          <label className="flex items-center justify-between p-3 rounded-lg bg-[#faf8ff] border border-[#eaedff] cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-[#131b2e] block">Reduced Motion</span>
              <span className="text-[11px] text-[#464555]">Disables high-velocity animation pulses.</span>
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
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-xs font-semibold text-[#3525cd] border border-[#c3c0ff] transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Replay Initial Boot Animation</span>
          </button>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-[#eaedff]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#131b2e] bg-[#f2f3ff] hover:bg-[#eaedff] rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
