import React from 'react';
import { NotificationItem } from '../types';
import { Bell, X, Check, ExternalLink, AlertOctagon, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (item: NotificationItem) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dae2fd] space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#eaedff] text-[#3525cd]">
              <Bell className="w-5 h-5 text-[#3525cd]" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#131b2e]">
                Operations Alert Center
              </h3>
              <p className="text-xs text-[#464555]">
                Real-time incident updates, SLA warnings, and runbook execution signals.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-[#777587] hover:bg-[#f2f3ff]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#464555]">
            Unread: <strong>{notifications.filter(n => n.unread).length}</strong>
          </span>
          <button
            onClick={onMarkAllAsRead}
            className="text-[#3525cd] hover:underline font-semibold flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* List */}
        <div className="space-y-2.5">
          {notifications.length === 0 ? (
            <p className="text-xs text-[#777587] text-center py-6">No notifications in history.</p>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNotification(item)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  item.unread
                    ? 'bg-purple-50/40 border-[#c3c0ff] shadow-xs'
                    : 'bg-[#faf8ff] border-[#eaedff] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${item.unread ? 'bg-[#7c3aed]' : 'bg-transparent'}`} />
                      <h4 className="text-xs font-bold text-[#131b2e]">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#464555] font-sans leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono text-[#777587] shrink-0">
                    {item.timestamp}
                  </span>
                </div>

                {item.linkIncidentId && (
                  <div className="mt-2 pt-1 border-t border-[#f2f3ff] flex items-center justify-between text-[11px] font-mono text-[#3525cd]">
                    <span>Linked Case: {item.linkIncidentId}</span>
                    <span className="flex items-center font-bold">
                      Inspect <ExternalLink className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-[#eaedff]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#131b2e] bg-[#f2f3ff] hover:bg-[#eaedff] rounded-lg"
          >
            Close Alert Center
          </button>
        </div>
      </div>
    </div>
  );
};
