import React, { useState } from 'react';
import { INITIAL_INCIDENTS } from './data/mockIncidents';
import { Incident, GroundedCitation } from './types';
import { Header } from './components/Header';
import { TriageCommandBoard } from './components/TriageCommandBoard';
import { CaseWorkspace } from './components/CaseWorkspace';
import { KnowledgeGraphExplorer } from './components/KnowledgeGraphExplorer';
import { OperationsAnalytics } from './components/OperationsAnalytics';
import { CitationModal } from './components/CitationModal';
import { SimulateIncidentModal } from './components/SimulateIncidentModal';
import { PostMortemModal } from './components/PostMortemModal';
import { Sparkles, CheckCircle, Bell } from 'lucide-react';

export default function App() {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-8942');
  const [currentTab, setCurrentTab] = useState<'triage' | 'workspace' | 'graph' | 'analytics'>('triage');
  
  // Modals state
  const [inspectingCitation, setInspectingCitation] = useState<GroundedCitation | null>(null);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState<boolean>(false);
  const [isPostMortemOpen, setIsPostMortemOpen] = useState<boolean>(false);

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
    showToast(`Autonomous ingestion complete: ${newIncident.id} synthesized with ${newIncident.cognitiveSynthesis.confidenceScore}% confidence.`);
  };

  const handleUpdateIncident = (updated: Incident) => {
    setIncidents(incidents.map(inc => inc.id === updated.id ? updated : inc));
    if (updated.status === 'RESOLVED' && selectedIncident.status !== 'RESOLVED') {
      showToast(`Incident ${updated.id} successfully resolved and verified.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans selection:bg-[#4f46e5] selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeIncidentsCount={activeIncidentsCount}
        onOpenSimulate={() => setIsSimulateModalOpen(true)}
        selectedIncidentId={selectedIncidentId}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'triage' && (
          <TriageCommandBoard
            incidents={incidents}
            onSelectIncident={handleSelectIncident}
            onOpenSimulate={() => setIsSimulateModalOpen(true)}
            onQuickRunbook={handleQuickRunbook}
          />
        )}

        {currentTab === 'workspace' && (
          <CaseWorkspace
            incident={selectedIncident}
            onBackToTriage={() => setCurrentTab('triage')}
            onInspectCitation={(cit) => setInspectingCitation(cit)}
            onOpenPostMortemModal={() => setIsPostMortemOpen(true)}
            onUpdateIncident={handleUpdateIncident}
          />
        )}

        {currentTab === 'graph' && (
          <KnowledgeGraphExplorer />
        )}

        {currentTab === 'analytics' && (
          <OperationsAnalytics />
        )}
      </main>

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

      <PostMortemModal
        incident={selectedIncident}
        isOpen={isPostMortemOpen}
        onClose={() => setIsPostMortemOpen(false)}
      />

      {/* Real-time Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131b2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#4f46e5] flex items-center space-x-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#76dcff] shrink-0" />
          <span className="text-xs font-mono font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Subtle enterprise footer */}
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
