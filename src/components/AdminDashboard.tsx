import React, { useState } from 'react';
import { UserProfile, UserRole, AuditLogEntry } from '../types';
import { 
  ShieldAlert, 
  Users, 
  Cpu, 
  FileText, 
  UserPlus, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Search,
  Activity,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  users: UserProfile[];
  currentUser: UserProfile;
  auditLogs: AuditLogEntry[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onAddUser: (newUser: UserProfile) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  currentUser,
  auditLogs,
  onUpdateUserRole,
  onAddUser
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'ai' | 'audit'>('users');
  const [searchUser, setSearchUser] = useState('');
  const [auditFilter, setAuditFilter] = useState<string>('ALL');
  
  // Add user modal state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('AGENT');
  const [newUserTeam, setNewUserTeam] = useState('Tier-3 Support');
  const [userFormError, setUserFormError] = useState<string | null>(null);

  const isAdmin = currentUser.role === 'ADMIN';

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.team.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredAudit = auditLogs.filter(a => 
    auditFilter === 'ALL' || a.severity === auditFilter
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setUserFormError('Access Denied: Only ADMIN users can register new team members.');
      return;
    }
    if (!newUserName.trim() || !newUserEmail.trim()) {
      setUserFormError('Name and email are required fields.');
      return;
    }
    if (!newUserEmail.includes('@')) {
      setUserFormError('Please enter a valid enterprise email address.');
      return;
    }

    const created: UserProfile = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      team: newUserTeam.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      activeSince: 'Just joined'
    };

    onAddUser(created);
    setNewUserName('');
    setNewUserEmail('');
    setUserFormError(null);
    setIsAddUserOpen(false);
  };

  const handleExportAudit = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-indigo-100 text-[#3525cd]">
                <Lock className="w-5 h-5 text-[#3525cd]" />
              </span>
              <h2 className="text-lg font-bold text-[#131b2e]">
                Enterprise Governance & Administration
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#464555]">
              Role-based access control (RBAC), immutable operational audit logs, and AI cognitive model guardrails.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center space-x-2 bg-[#f2f3ff] p-1.5 rounded-lg border border-[#c7c4d8]">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center space-x-1.5 ${
                activeTab === 'users' ? 'bg-white text-[#3525cd] shadow-xs' : 'text-[#464555]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User Directory ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center space-x-1.5 ${
                activeTab === 'ai' ? 'bg-white text-[#3525cd] shadow-xs' : 'text-[#464555]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Model Guardrails</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center space-x-1.5 ${
                activeTab === 'audit' ? 'bg-white text-[#3525cd] shadow-xs' : 'text-[#464555]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Audit Trail</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role notice banner if not admin */}
      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              You are currently viewing as <strong>{currentUser.role}</strong>. Administrative mutation operations require an <strong>ADMIN</strong> role.
            </span>
          </div>
          <span className="font-mono text-[11px] bg-amber-100 px-2 py-0.5 rounded text-amber-800">
            Read-Only Mode
          </span>
        </div>
      )}

      {/* TAB 1: USERS & RBAC */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777587]" />
              <input
                type="text"
                placeholder="Search team members by name or email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] placeholder-[#777587] font-mono"
              />
            </div>

            {isAdmin && (
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#3525cd] text-white text-xs font-semibold rounded-lg hover:bg-[#4f46e5] shadow-xs transition-colors shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Team Member</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#eaedff] text-[#777587]">
                  <th className="pb-2 font-semibold">User</th>
                  <th className="pb-2 font-semibold">Email</th>
                  <th className="pb-2 font-semibold">Team Assignment</th>
                  <th className="pb-2 font-semibold">Assigned Role (RBAC)</th>
                  <th className="pb-2 font-semibold">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f3ff]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#faf8ff]">
                    <td className="py-3 flex items-center space-x-2.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#dae2fd]"
                      />
                      <span className="font-bold text-[#131b2e] font-sans">{user.name}</span>
                    </td>
                    <td className="py-3 text-[#464555]">{user.email}</td>
                    <td className="py-3 text-[#131b2e] font-sans">{user.team}</td>
                    <td className="py-3">
                      {isAdmin ? (
                        <select
                          value={user.role}
                          onChange={(e) => onUpdateUserRole(user.id, e.target.value as UserRole)}
                          className={`text-[11px] font-mono font-bold px-2 py-1 rounded border ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-50 text-[#7c3aed] border-purple-200'
                              : user.role === 'MANAGER'
                              ? 'bg-indigo-50 text-[#3525cd] border-indigo-200'
                              : user.role === 'AGENT'
                              ? 'bg-emerald-50 text-[#059669] border-emerald-200'
                              : 'bg-slate-100 text-[#464555] border-slate-300'
                          }`}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="AGENT">AGENT</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                      ) : (
                        <div className="flex items-center space-x-1.5" title="Role modification locked: Requires ADMIN privileges">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : user.role === 'MANAGER' ? 'bg-indigo-100 text-indigo-800' : user.role === 'AGENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {user.role}
                          </span>
                          <Lock className="w-3 h-3 text-[#777587]" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-[#777587]">{user.activeSince}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AI MODEL MONITORING & GUARDRAILS */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#dae2fd] shadow-xs space-y-1">
              <span className="text-xs font-semibold text-[#464555] uppercase font-mono">
                Hallucination Guardrail
              </span>
              <div className="text-2xl font-bold font-mono text-[#059669]">99.8%</div>
              <p className="text-[11px] text-[#464555]">Ungrounded claims intercepted prior to display.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#dae2fd] shadow-xs space-y-1">
              <span className="text-xs font-semibold text-[#464555] uppercase font-mono">
                Mean Inference Latency
              </span>
              <div className="text-2xl font-bold font-mono text-[#3525cd]">14.2ms</div>
              <p className="text-[11px] text-[#464555]">Local quantized tensor runtime cache.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#dae2fd] shadow-xs space-y-1">
              <span className="text-xs font-semibold text-[#464555] uppercase font-mono">
                Prompt Injection Defenses
              </span>
              <div className="text-2xl font-bold font-mono text-[#0891b2]">100%</div>
              <p className="text-[11px] text-[#464555]">Zero jailbreak escapes recorded.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#dae2fd] shadow-xs space-y-1">
              <span className="text-xs font-semibold text-[#464555] uppercase font-mono">
                Memory Grounding Ratio
              </span>
              <div className="text-2xl font-bold font-mono text-[#7c3aed]">98.4%</div>
              <p className="text-[11px] text-[#464555]">Citations linked to immutable spans.</p>
            </div>
          </div>

          {/* Model Config Details */}
          <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs space-y-3 font-mono text-xs">
            <h3 className="font-bold text-[#131b2e] text-sm font-sans">
              Active Cognitive Model Architecture
            </h3>
            <div className="p-4 rounded-lg bg-[#faf8ff] border border-[#eaedff] space-y-2 text-[#464555]">
              <div className="flex justify-between">
                <span>Model Pipeline:</span>
                <strong className="text-[#131b2e]">CaseMind RCA Specialist (Hybrid Vector + LLM)</strong>
              </div>
              <div className="flex justify-between">
                <span>Telemetry Ingestion Context Window:</span>
                <strong className="text-[#131b2e]">128,000 Tokens (Active: 38,420 tokens)</strong>
              </div>
              <div className="flex justify-between">
                <span>Safety Verification Gate:</span>
                <strong className="text-[#059669]">Enforced (No Automated Prod Write Mutations Without Human Gate)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-[#464555] mr-1">Filter by Severity:</span>
              {['ALL', 'MUTATION', 'OVERRIDE', 'SECURITY', 'INFO'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setAuditFilter(sev)}
                  className={`px-2.5 py-1 text-xs font-mono rounded ${
                    auditFilter === sev ? 'bg-[#131b2e] text-white' : 'bg-[#f2f3ff] text-[#464555]'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportAudit}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#eaedff] text-[#3525cd] text-xs font-semibold rounded-md hover:bg-[#dad7ff] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit JSON</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#eaedff] text-[#777587]">
                  <th className="pb-2 font-semibold">Timestamp</th>
                  <th className="pb-2 font-semibold">Actor</th>
                  <th className="pb-2 font-semibold">Role</th>
                  <th className="pb-2 font-semibold">Action</th>
                  <th className="pb-2 font-semibold">Target</th>
                  <th className="pb-2 font-semibold">Details</th>
                  <th className="pb-2 font-semibold">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f3ff]">
                {filteredAudit.map((log) => (
                  <tr key={log.id} className="hover:bg-[#faf8ff]">
                    <td className="py-2.5 text-[#777587] whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 font-bold text-[#131b2e] font-sans">{log.actor}</td>
                    <td className="py-2.5">
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#f2f3ff] text-[#464555]">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-2.5 font-semibold text-[#3525cd]">{log.action}</td>
                    <td className="py-2.5 text-[#131b2e]">{log.target}</td>
                    <td className="py-2.5 text-[#464555] max-w-xs truncate">{log.details}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'MUTATION'
                          ? 'bg-purple-100 text-purple-800'
                          : log.severity === 'SECURITY'
                          ? 'bg-red-100 text-red-800'
                          : log.severity === 'OVERRIDE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#dae2fd] space-y-4">
            <h3 className="text-base font-bold text-[#131b2e]">Add Team Member</h3>
            {userFormError && (
              <p className="text-xs text-[#ba1a1a] font-mono">{userFormError}</p>
            )}
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#464555] block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g., Alex Mercer"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#464555] block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="e.g., alex.mercer@enterprise.corp"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#464555] block mb-1">Role (RBAC)</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs font-mono"
                >
                  <option value="AGENT">AGENT (Can execute safe runbooks and triage)</option>
                  <option value="MANAGER">MANAGER (Can approve safety gates and lead incidents)</option>
                  <option value="ADMIN">ADMIN (Full governance, user roles, security)</option>
                  <option value="VIEWER">VIEWER (Read-only observation)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#464555] block mb-1">Team Assignment</label>
                <input
                  type="text"
                  placeholder="e.g., Cloud Ingress Reliability"
                  value={newUserTeam}
                  onChange={(e) => setNewUserTeam(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#464555] hover:bg-[#f2f3ff] rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#3525cd] hover:bg-[#4f46e5] rounded-md shadow-xs"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
