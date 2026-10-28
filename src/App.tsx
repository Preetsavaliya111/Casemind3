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
import { Sparkles, CheckCircle, Bell } from 'lucide-react';

export default function App() {
  // Navigation & Incidents state
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-8942');
  const [currentTab, setCurrentTab] = useState<'triage' | 'workspace' | 'graph' | 'knowledge' | 'analytics' | 'admin'>('triage');

  // RBAC & Users state
  const [users, setUsers] = useState<UserProfile[]>(TEAM_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(TEAM_USERS[0]); // Elena Rostova (ADMIN)

  // Knowledge & Ingestion state
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>(INITIAL_KNOWLEDGE_ARTICLES);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Copilot messages state
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>(INITIAL_COPILOT_MESSAGES);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Modals state
  const [inspectingCitation, setInspectingCitation] = useState<GroundedCitation | null>(null);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState<boolean>(false);
  const [isPostMortemOpen, setIsPostMortemOpen] = useState<boolean>(false);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

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
      actor: 'Simulation Engine',
      role: 'ADMIN',
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
    handleAddAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      actor: currentUser.name,
      role: currentUser.role,
      action: 'INCIDENT_CREATED',
      target: newIncident.id,
      details: `Created new incident on service ${newIncident.service}: ${newIncident.title}`,
      severity: 'MUTATION'
    });
  };

  const handleUpdateIncident = (updated: Incident) => {
    setIncidents(incidents.map(inc => inc.id === updated.id ? updated : inc));
    if (updated.status === 'RESOLVED' && selectedIncident.status !== 'RESOLVED') {
      showToast(`Incident ${updated.id} successfully resolved and verified.`);
      handleAddAuditLog({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        actor: currentUser.name,
        role: currentUser.role,
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
      actor: currentUser.name,
      role: currentUser.role,
      action: 'DOCUMENT_INGESTED',
      target: newArticle.id,
      details: `Vectorized and linked ${newArticle.title} to memory graph index.`,
      severity: 'MUTATION'
    });
  };

  const handleSendMessageCopilot = (text: string) => {
    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString() + ' UTC'
    };

    setCopilotMessages(prev => [...prev, userMsg]);

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
          `"[INC-8942 Update] P0 Latency Spike on auth-gateway-v2. Blast radius: ~142.5k users (24.8% of us-east-1 traffic). Root cause identified as Redis pool starvation triggered by JWT TTL reduction in deploy v4.12.8. Mitigating via dynamic pool expansion (RB-AUTH-FAILOVER-09). Target resolution within 8 minutes."`;
      }

      const assistantMsg: CopilotMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        citations: [
          { title: `${selectedIncident.id} Root Cause Trace`, source: 'OpenTelemetry APM', confidence: 94.6 },
          { title: 'Historical Match INC-7102', source: 'Organizational Memory', confidence: 96.4 }
        ]
      };

      setCopilotMessages(prev => [...prev, assistantMsg]);
    }, 1100);
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }
    showToast(`Updated user role to ${newRole}.`);
    handleAddAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      actor: currentUser.name,
      role: currentUser.role,
      action: 'USER_ROLE_UPDATED',
      target: userId,
      details: `Changed role to ${newRole}.`,
      severity: 'SECURITY'
    });
  };

  const handleAddUser = (newUser: UserProfile) => {
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

  return (
    <div className={`min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans selection:bg-[#4f46e5] selection:text-white ${reducedMotion ? 'motion-reduce' : ''}`}>
      {/* Intro Animation (First-time or replayed) */}
      {showIntro && (
        <IntroAnimation onComplete={handleIntroComplete} />
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
        selectedIncidentId={selectedIncidentId}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'triage' && (
          <TriageCommandBoard
            incidents={incidents}
            onSelectIncident={handleSelectIncident}
            onOpenSimulate={() => setIsSimulateModalOpen(true)}
            onOpenCreateTicket={() => setIsCreateTicketOpen(true)}
            onQuickRunbook={handleQuickRunbook}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'workspace' && (
          <CaseWorkspace
            incident={selectedIncident}
            currentUser={currentUser}
            onBackToTriage={() => setCurrentTab('triage')}
            onInspectCitation={(cit) => setInspectingCitation(cit)}
            onOpenPostMortemModal={() => setIsPostMortemOpen(true)}
            onUpdateIncident={handleUpdateIncident}
            onAddAuditLog={handleAddAuditLog}
          />
        )}

        {currentTab === 'graph' && (
          <KnowledgeGraphExplorer />
        )}

        {currentTab === 'knowledge' && (
          <KnowledgeBaseView
            articles={knowledgeArticles}
            onIngestArticle={handleIngestArticle}
            onOpenIncident={handleSelectIncident}
          />
        )}

        {currentTab === 'analytics' && (
          <OperationsAnalytics />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            users={users}
            currentUser={currentUser}
            auditLogs={auditLogs}
            onUpdateUserRole={handleUpdateUserRole}
            onAddUser={handleAddUser}
          />
        )}
      </main>

      {/* Floating Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeIncident={selectedIncident}
        messages={copilotMessages}
        onSendMessage={handleSendMessageCopilot}
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
        currentUser={currentUser}
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
        currentUser={currentUser}
        onChangeUser={setCurrentUser}
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
