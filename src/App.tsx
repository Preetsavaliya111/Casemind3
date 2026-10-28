import React, { useState, useEffect } from 'react';
import { 
  INITIAL_INCIDENTS, 
  TEAM_USERS, 
  INITIAL_KNOWLEDGE_ARTICLES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_COPILOT_MESSAGES
} from './data/mockIncidents';
import { 
  Incident, 
  GroundedCitation, 
  UserProfile, 
  UserRole, 
  KnowledgeArticle, 
  AuditLogEntry, 
  NotificationItem, 
  CopilotMessage 
} from './types';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { TriageCommandBoard } from './components/TriageCommandBoard';
import { CaseWorkspace } from './components/CaseWorkspace';
import { KnowledgeGraphExplorer } from './components/KnowledgeGraphExplorer';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { OperationsAnalytics } from './components/OperationsAnalytics';
import { AdminDashboard } from './components/AdminDashboard';
import { CitationModal } from './components/CitationModal';
import { SimulateIncidentModal } from './components/SimulateIncidentModal';
import { PostMortemModal } from './components/PostMortemModal';
import { CreateTicketModal } from './components/CreateTicketModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { CopilotDrawer } from './components/CopilotDrawer';
import { IntroAnimation } from './components/IntroAnimation';
import { AuthModal } from './components/AuthModal';
import { 
  Sparkles, 
  CheckCircle, 
  Bell, 
  AlertTriangle, 
  Lock, 
  ShieldAlert, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { 
  testFirestoreConnection, 
  saveIncidentToFirestore, 
  logAuditToFirestore, 
  syncUserProfile 
} from './lib/firebase';

interface ProtectedRouteProps {
  tabName: string;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onRedirectLanding: () => void;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  tabName,
  allowedRoles,
  requireAuth = true,
  currentUser,
  onOpenAuth,
  onRedirectLanding,
  children
}) => {
  // 1. Unauthenticated Guard
  if (requireAuth && !currentUser) {
    return (
      <div className="py-12 px-4 max-w-xl mx-auto text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#dae2fd] shadow-xl space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[#3525cd] shadow-inner">
            <Lock className="w-8 h-8 text-[#3525cd]" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Authentication Required (HTTP 401)</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#131b2e]">
              {tabName} is Protected
            </h2>
            <p className="text-xs text-[#464555] max-w-md mx-auto leading-relaxed">
              CaseMind Zero-Trust cognitive architecture restricts operational consoles and telemetry to authenticated enterprise operators.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-linear-to-r from-[#3525cd] to-[#4f46e5] text-white text-xs font-bold hover:opacity-95 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In / Select Demo Role</span>
            </button>
            <button
              onClick={onRedirectLanding}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold border border-[#c3c0ff] flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Return to Overview</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Insufficient Role Clearance Guard (e.g. non-Admin attempting to open Admin, or non-Manager/Admin attempting to open Analytics)
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="py-12 px-4 max-w-xl mx-auto text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-red-200 shadow-xl space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#ba1a1a] shadow-inner">
            <ShieldAlert className="w-8 h-8 text-[#ba1a1a]" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 border border-red-300 text-xs font-mono font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>Insufficient Clearance (HTTP 403 Forbidden)</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#131b2e]">
              Role Clearance Required
            </h2>
            <p className="text-xs text-[#464555] max-w-md mx-auto leading-relaxed">
              The <strong className="text-[#131b2e]">{tabName}</strong> console is restricted to personnel with <strong className="text-[#3525cd] font-mono">{allowedRoles.join(' or ')}</strong> clearance.
            </p>
          </div>

          {/* Current Identity & Role Details */}
          <div className="p-3.5 rounded-xl bg-[#faf8ff] border border-[#eaedff] text-left text-xs font-mono flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border" />
              <div>
                <p className="font-bold text-[#131b2e]">{currentUser.name}</p>
                <p className="text-[#64748b] text-[11px]">{currentUser.email}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">
                {currentUser.role}
              </span>
              <p className="text-[10px] text-red-600 mt-0.5">Required: {allowedRoles.join('/')}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Switch Account / Elevate Role</span>
            </button>
            <button
              onClick={onRedirectLanding}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-semibold border border-[#c3c0ff] cursor-pointer"
            >
              <span>Return to Overview</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Permitted!
  return <>{children}</>;
};

export default function App() {
  // Navigation & Incidents state
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-8942');
  const [currentTab, setCurrentTab] = useState<'landing' | 'triage' | 'workspace' | 'graph' | 'knowledge' | 'analytics' | 'admin'>('landing');

  // RBAC & Users state
  const [users, setUsers] = useState<UserProfile[]>(TEAM_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(TEAM_USERS[0]); // Default: Elena Rostova (ADMIN)

  // Knowledge & Ingestion state
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>(INITIAL_KNOWLEDGE_ARTICLES);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Copilot messages state
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>(INITIAL_COPILOT_MESSAGES);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isGeneratingCopilot, setIsGeneratingCopilot] = useState<boolean>(false);

  // Initialize and verify Firestore on boot
  useEffect(() => {
    testFirestoreConnection().then(connected => {
      if (connected) {
        console.log('CaseMind: Connected to Cloud Firestore database.');
      }
    }).catch(() => {});
  }, []);

  // Modals state
  const [inspectingCitation, setInspectingCitation] = useState<GroundedCitation | null>(null);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState<boolean>(false);
  const [isPostMortemOpen, setIsPostMortemOpen] = useState<boolean>(false);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Intro animation state
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return !sessionStorage.getItem('casemind_intro_seen');
  });

  // Settings
  const [telemetryInterval, setTelemetryInterval] = useState<number>(15);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];
  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  // Add audit log helper
  const handleAddAuditLog = (entry: AuditLogEntry) => {
    setAuditLogs(prev => [entry, ...prev]);
    logAuditToFirestore(entry).catch(() => {});
  };

  // Intro completion
  const handleIntroComplete = () => {
    sessionStorage.setItem('casemind_intro_seen', 'true');
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  const handleSelectIncident = (id: string) => {
    setSelectedIncidentId(id);
    setCurrentTab('workspace');
  };

  const handleQuickRunbook = (incident: Incident) => {
    setSelectedIncidentId(incident.id);
    setCurrentTab('workspace');
    showToast(`Loaded Runbook ${incident.runbook.id} for ${incident.id}`);
  };

  const handleInjectIncident = (newIncident: Incident) => {
    setIncidents([newIncident, ...incidents]);
    setSelectedIncidentId(newIncident.id);
    setCurrentTab('workspace');
    showToast(`Autonomous ingestion: ${newIncident.id} synthesized with ${newIncident.cognitiveSynthesis.confidenceScore}% confidence.`);
    handleAddAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      actor: currentUser ? currentUser.name : 'Simulation Engine',
      role: currentUser ? currentUser.role : 'ADMIN',
      action: 'INCIDENT_SIMULATED',
      target: newIncident.id,
      details: `Injected synthetic failure scenario: ${newIncident.title}`,
      severity: 'MUTATION'
    });
  };

  const handleCreateIncident = (newIncident: Incident) => {
    setIncidents([newIncident, ...incidents]);
    setSelectedIncidentId(newIncident.id);
    setCurrentTab('workspace');
    showToast(`Incident ${newIncident.id} successfully filed and ingested into CaseMind.`);
    saveIncidentToFirestore(newIncident).catch(() => {});
    handleAddAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      actor: currentUser ? currentUser.name : 'Anonymous',
      role: currentUser ? currentUser.role : 'AGENT',
      action: 'INCIDENT_CREATED',
      target: newIncident.id,
      details: `Created new incident on service ${newIncident.service}: ${newIncident.title}`,
      severity: 'MUTATION'
    });
  };

  const handleUpdateIncident = (updated: Incident) => {
    setIncidents(incidents.map(inc => inc.id === updated.id ? updated : inc));
    saveIncidentToFirestore(updated).catch(() => {});
    if (updated.status === 'RESOLVED' && selectedIncident.status !== 'RESOLVED') {
      showToast(`Incident ${updated.id} successfully resolved and verified.`);
      handleAddAuditLog({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        actor: currentUser ? currentUser.name : 'Operator',
        role: currentUser ? currentUser.role : 'AGENT',
        action: 'INCIDENT_RESOLVED',
        target: updated.id,
        details: `Incident marked as resolved. All synthetic canary checks returned 200 OK.`,
        severity: 'MUTATION'
      });
    }
  };

  const handleIngestArticle = (newArticle: KnowledgeArticle) => {
    setKnowledgeArticles([newArticle, ...knowledgeArticles]);
    showToast(`Document "${newArticle.title}" ingested & embedded in memory graph.`);
    handleAddAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      actor: currentUser ? currentUser.name : 'Ingestion Engine',
      role: currentUser ? currentUser.role : 'AGENT',
      action: 'DOCUMENT_INGESTED',
      target: newArticle.id,
      details: `Vectorized and linked ${newArticle.title} to memory graph index.`,
      severity: 'MUTATION'
    });
  };

  const handleSendMessageCopilot = async (text: string, useSearchGrounding: boolean = false) => {
    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString() + ' UTC'
    };

    setCopilotMessages(prev => [...prev, userMsg]);
    setIsGeneratingCopilot(true);

    try {
      if (useSearchGrounding) {
        // Call Google Search Grounding API endpoint
        const res = await fetch('/api/search-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: text,
            incidentContext: `Incident ${selectedIncident.id} (${selectedIncident.service}): ${selectedIncident.title}. Probable root cause: ${selectedIncident.cognitiveSynthesis.probableRootCause}`,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const citations = (data.webCitations || []).map((c: any) => ({
            title: c.title,
            source: c.uri,
            confidence: 0.96,
          }));

          const assistantMsg: CopilotMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            text: data.text || 'No external search results found.',
            timestamp: new Date().toLocaleTimeString() + ' UTC',
            citations: citations.length > 0 ? citations : [
              { title: 'Google Search Web Index', source: 'https://google.com', confidence: 0.92 }
            ],
          };
          setCopilotMessages(prev => [...prev, assistantMsg]);
          setIsGeneratingCopilot(false);
          return;
        }
      } else {
        // Call Context-Aware Gemini Copilot Chat API endpoint
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            activeIncident: selectedIncident,
            conversationHistory: copilotMessages,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const assistantMsg: CopilotMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: 'assistant',
            text: data.text,
            timestamp: new Date().toLocaleTimeString() + ' UTC',
            citations: data.citations || [
              { title: `${selectedIncident.id} Root Cause Trace`, source: 'OpenTelemetry APM', confidence: 0.95 },
              { title: 'Historical Match INC-7102', source: 'Organizational Memory', confidence: 0.96 }
            ],
          };
          setCopilotMessages(prev => [...prev, assistantMsg]);
          setIsGeneratingCopilot(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API call fallback to local cognitive synthesis:', err);
    }

    // Graceful Intelligent Local Fallback
    setTimeout(() => {
      let reply = `Based on telemetry spans and organizational memory for ${selectedIncident.id}:\n\n` +
        `The incident was caused by concurrent token renewal calls overwhelming the Lettuce client connection pool (capped at 500/500). ` +
        `This directly matches historical incident INC-7102 (96.4% similarity). Recommended action is executing Step 1 & 2 of runbook ${selectedIncident.runbook.id}.`;

      if (text.toLowerCase().includes('risk') || text.toLowerCase().includes('safety')) {
        reply = `Safety Assessment for Step 3 (Rolling Pod Restart):\n\n` +
          `- Pod surge policy: maxSurge=25%, maxUnavailable=0 guarantees zero in-flight drops.\n` +
          `- Redis memory headroom: 79.9% available (headroom verified in Step 1).\n` +
          `- Autonomous Risk Rating: LOW. Approved for production execution.`;
      } else if (text.toLowerCase().includes('slack') || text.toLowerCase().includes('leadership') || text.toLowerCase().includes('blast')) {
        reply = `Draft Leadership Update:\n\n` +
          `"[${selectedIncident.id} Update] P0 Latency Spike on ${selectedIncident.service}. Blast radius: ~${selectedIncident.blastRadius.affectedUsers.toLocaleString()} users (${selectedIncident.blastRadius.pctTraffic}% traffic). Root cause identified as ${selectedIncident.cognitiveSynthesis.probableRootCause}. Mitigating via verified runbook ${selectedIncident.runbook.id}."`;
      } else if (useSearchGrounding || text.toLowerCase().includes('search')) {
        reply = `[Google Search Grounding Synthesis]\n\n` +
          `Public documentation and vendor advisories confirm that Redis Lettuce client version 6.x encounters thread starvation when epoll event loops are blocked during large burst payloads. Recommended configuration fix is increasing ioThreadPoolSize and setting socketOptions.keepAlive=true.`;
      }

      const assistantMsg: CopilotMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        citations: useSearchGrounding ? [
          { title: 'Redis Lettuce Documentation: Connection Pool Tuning', source: 'https://lettuce.io/core/release/reference/#connection-pooling', confidence: 0.98 },
          { title: 'GitHub Issue: Lettuce connection checkout timeout', source: 'https://github.com/lettuce-io/lettuce-core/issues', confidence: 0.94 }
        ] : [
          { title: `${selectedIncident.id} Root Cause Trace`, source: 'OpenTelemetry APM', confidence: 0.95 },
          { title: 'Historical Match INC-7102', source: 'Organizational Memory', confidence: 0.96 }
        ]
      };

      setCopilotMessages(prev => [...prev, assistantMsg]);
      setIsGeneratingCopilot(false);
    }, 900);
  };

  // Auth Handlers
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    showToast(`Authenticated as ${user.name} (${user.role} role).`);
    syncUserProfile(user).catch(() => {});
    handleAddAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      actor: user.name,
      role: user.role,
      action: 'USER_LOGIN',
      target: user.id,
      details: `Successful single sign-on authentication with ${user.role} permissions.`,
      severity: 'SECURITY'
    });
  };

  const handleLogout = () => {
    if (currentUser) {
      handleAddAuditLog({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        actor: currentUser.name,
        role: currentUser.role,
        action: 'USER_LOGOUT',
        target: currentUser.id,
        details: `Operator signed out.`,
        severity: 'SECURITY'
      });
    }
    // Transition to unauthenticated state upon logout
    setCurrentUser(null);
    setCurrentTab('landing');
    showToast('Signed out successfully. Session is now unauthenticated.');
  };

  const handleRegister = (newUser: UserProfile) => {
    setUsers([...users, newUser]);
    handleAddAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      actor: newUser.name,
      role: newUser.role,
      action: 'USER_REGISTERED',
      target: newUser.id,
      details: `Registered new account ${newUser.email} with default AGENT role.`,
      severity: 'SECURITY'
    });
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    // Defense-in-depth: only active ADMIN can modify roles
    if (!currentUser || currentUser.role !== 'ADMIN') {
      showToast('Security Error: Only ADMIN accounts can modify user roles.');
      return;
    }

    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => prev ? ({ ...prev, role: newRole }) : null);
    }
    showToast(`Updated user role to ${newRole}.`);
    handleAddAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      actor: currentUser.name,
      role: currentUser.role,
      action: 'USER_ROLE_UPDATED',
      target: userId,
      details: `Modified RBAC role for user ${userId} to ${newRole}.`,
      severity: 'SECURITY'
    });
  };

  const handleAddUser = (newUser: UserProfile) => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      showToast('Security Error: Only ADMIN accounts can add team members.');
      return;
    }

    setUsers([...users, newUser]);
    showToast(`Added ${newUser.name} to enterprise directory.`);
    handleAddAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      actor: currentUser.name,
      role: currentUser.role,
      action: 'USER_CREATED',
      target: newUser.id,
      details: `Created user ${newUser.name} with role ${newUser.role}.`,
      severity: 'SECURITY'
    });
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    showToast('All notifications marked as read.');
  };

  const handleSelectNotification = (item: NotificationItem) => {
    setNotifications(notifications.map(n => n.id === item.id ? { ...n, unread: false } : n));
    if (item.linkIncidentId) {
      setSelectedIncidentId(item.linkIncidentId);
      setCurrentTab('workspace');
      setIsNotificationsOpen(false);
    }
  };

  // Telemetry periodic polling simulation
  useEffect(() => {
    if (telemetryInterval === 0) return;
    const interval = setInterval(() => {
      // Periodic subtle telemetry update
    }, telemetryInterval * 1000);
    return () => clearInterval(interval);
  }, [telemetryInterval]);

  // Safe fallback user for read-only if null
  const effectiveUser = currentUser || TEAM_USERS[TEAM_USERS.length - 1];

  return (
    <div className={`min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans selection:bg-[#4f46e5] selection:text-white ${reducedMotion ? 'motion-reduce' : ''}`}>
      {/* Intro Boot Animation (Fully loads and can be replayed anytime) */}
      {showIntro && (
        <IntroAnimation onComplete={handleIntroComplete} reducedMotion={reducedMotion} />
      )}

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeIncidentsCount={activeIncidentsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenCreateTicket={() => setIsCreateTicketOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        selectedIncidentId={selectedIncidentId}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'landing' && (
          <LandingPage
            onEnterConsole={() => {
              if (!currentUser) {
                setIsAuthModalOpen(true);
              } else {
                setCurrentTab('triage');
              }
            }}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            currentUser={currentUser}
            onSelectIncident={handleSelectIncident}
            onQuickLogin={handleLogin}
          />
        )}

        {currentTab === 'triage' && (
          <ProtectedRoute
            tabName="Incident Command Board"
            requireAuth={true}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onRedirectLanding={() => setCurrentTab('landing')}
          >
            <TriageCommandBoard
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
              onOpenSimulate={() => setIsSimulateModalOpen(true)}
              onOpenCreateTicket={() => {
                if (!currentUser) {
                  showToast('Authentication required: please sign in to file an incident.');
                  setIsAuthModalOpen(true);
                } else {
                  setIsCreateTicketOpen(true);
                }
              }}
              onQuickRunbook={handleQuickRunbook}
              currentUser={effectiveUser}
            />
          </ProtectedRoute>
        )}

        {currentTab === 'workspace' && (
          <ProtectedRoute
            tabName="Investigation Workspace"
            requireAuth={true}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onRedirectLanding={() => setCurrentTab('landing')}
          >
            <CaseWorkspace
              incident={selectedIncident}
              currentUser={effectiveUser}
              onBackToTriage={() => setCurrentTab('triage')}
              onInspectCitation={(cit) => setInspectingCitation(cit)}
              onOpenPostMortemModal={() => setIsPostMortemOpen(true)}
              onUpdateIncident={handleUpdateIncident}
              onAddAuditLog={handleAddAuditLog}
            />
          </ProtectedRoute>
        )}

        {currentTab === 'graph' && (
          <ProtectedRoute
            tabName="Organizational Memory Graph"
            requireAuth={true}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onRedirectLanding={() => setCurrentTab('landing')}
          >
            <KnowledgeGraphExplorer />
          </ProtectedRoute>
        )}

        {currentTab === 'knowledge' && (
          <ProtectedRoute
            tabName="Knowledge Base & Ingestion"
            requireAuth={true}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onRedirectLanding={() => setCurrentTab('landing')}
          >
            <KnowledgeBaseView
              articles={knowledgeArticles}
              onIngestArticle={handleIngestArticle}
              onOpenIncident={handleSelectIncident}
            />
          </ProtectedRoute>
        )}

        {currentTab === 'analytics' && (
          <ProtectedRoute
            tabName="Operations Analytics & Telemetry"
            requireAuth={true}
            allowedRoles={['ADMIN', 'MANAGER']}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onRedirectLanding={() => setCurrentTab('landing')}
          >
            <OperationsAnalytics />
          </ProtectedRoute>
        )}

        {currentTab === 'admin' && (
          <ProtectedRoute
            tabName="Admin & Governance Console"
            requireAuth={true}
            allowedRoles={['ADMIN']}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onRedirectLanding={() => setCurrentTab('landing')}
          >
            <AdminDashboard
              users={users}
              currentUser={effectiveUser}
              auditLogs={auditLogs}
              onUpdateUserRole={handleUpdateUserRole}
              onAddUser={handleAddUser}
            />
          </ProtectedRoute>
        )}
      </main>

      {/* Floating Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeIncident={selectedIncident}
        messages={copilotMessages}
        onSendMessage={handleSendMessageCopilot}
        isGenerating={isGeneratingCopilot}
      />

      {/* Authentication Modal (Login & Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        currentUser={currentUser}
      />

      {/* Modals */}
      <CitationModal
        citation={inspectingCitation}
        onClose={() => setInspectingCitation(null)}
      />

      <SimulateIncidentModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        onInjectIncident={handleInjectIncident}
      />

      <CreateTicketModal
        isOpen={isCreateTicketOpen}
        onClose={() => setIsCreateTicketOpen(false)}
        onCreateIncident={handleCreateIncident}
        currentUser={effectiveUser}
      />

      <PostMortemModal
        incident={selectedIncident}
        isOpen={isPostMortemOpen}
        onClose={() => setIsPostMortemOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onSelectNotification={handleSelectNotification}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={effectiveUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        telemetryInterval={telemetryInterval}
        onChangeTelemetryInterval={setTelemetryInterval}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={setReducedMotion}
        onReplayIntro={handleReplayIntro}
      />

      {/* Real-time Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131b2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#4f46e5] flex items-center space-x-3">
          <Sparkles className="w-4 h-4 text-[#76dcff] shrink-0" />
          <span className="text-xs font-mono font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#dae2fd] bg-[#ffffff] py-4 text-xs font-mono text-[#464555]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>CaseMind Cognitive Engine v4.8.2 · Zero Unvalidated Actions</span>
          </div>
          <div>
            <span>Grounded on Enterprise Organizational Memory & OpenTelemetry Traces</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
