import React, { useState } from 'react';
import { Incident, Severity, UserProfile } from '../types';
import { TEAM_USERS } from '../data/mockIncidents';
import { PlusCircle, X, AlertCircle, Sparkles, Check, Users, Server, ShieldAlert } from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateIncident: (incident: Incident) => void;
  currentUser: UserProfile;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onCreateIncident,
  currentUser
}) => {
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<Severity>('P1 - HIGH');
  const [service, setService] = useState('auth-gateway-v2');
  const [cluster, setCluster] = useState('us-east-prod-k8s');
  const [affectedUsers, setAffectedUsers] = useState<number>(25000);
  const [assigneeId, setAssigneeId] = useState<string>(currentUser.id);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // VIEWER permission check
  const isViewer = currentUser.role === 'VIEWER';

  const validate = () => {
    const errs: { title?: string; description?: string } = {};
    if (!title.trim() || title.trim().length < 8) {
      errs.title = 'Title is required and must be at least 8 characters long.';
    }
    if (!description.trim() || description.trim().length < 15) {
      errs.description = 'Incident symptoms description must be at least 15 characters long.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const selectedAssignee = TEAM_USERS.find(u => u.id === assigneeId) || TEAM_USERS[0];
      const newId = `INC-${Math.floor(8960 + Math.random() * 39)}`;

      const newIncident: Incident = {
        id: newId,
        title: title.trim(),
        severity,
        status: 'TRIAGING',
        service,
        cluster,
        blastRadius: {
          affectedUsers,
          pctTraffic: Math.min(40, Math.max(2, Math.round(affectedUsers / 6000))),
          region: cluster.includes('us-east') ? 'us-east-1' : cluster.includes('eu') ? 'eu-west-1' : 'us-west-2',
          revenueImpactPerHour: severity.startsWith('P0') ? '$42,000/hr' : '$12,500/hr',
          downstreamServices: ['api-gateway', 'user-profile-svc']
        },
        slaRemainingMinutes: severity.startsWith('P0') ? 20 : 60,
        openedAt: 'Just now (Operator Created)',
        assignee: {
          name: selectedAssignee.name,
          avatar: selectedAssignee.avatar,
          role: selectedAssignee.team,
          email: selectedAssignee.email
        },
        cognitiveSynthesis: {
          summary: `CaseMind autonomously ingested ticket ${newId}: ${description.trim()}. Telemetry correlates with active deployment patterns in ${cluster}.`,
          probableRootCause: `Automated preliminary synthesis indicates potential resource contention or configuration drift on ${service}.`,
          confidenceScore: 89.4,
          confidenceBreakdown: {
            rootCause: 89.4,
            blastRadius: 91.0,
            remediation: 86.5,
            evidenceGrounded: 93.0
          },
          hypotheses: [
            {
              id: 'h-init-1',
              title: `Service degradation on ${service}`,
              likelihood: 89.4,
              evidence: `Reported symptoms: ${description.trim().slice(0, 80)}...`,
              refuted: false,
              status: 'CONFIRMED'
            }
          ],
          machineSuggestedRemediations: [
            {
              id: 'r-init-1',
              title: `Run health diagnostic suite on ${service}`,
              risk: 'LOW',
              runbookId: 'RB-HEALTH-DIAG-01',
              expectedRecoveryTime: '< 2 minutes',
              autoExecutable: true,
              confidence: 91.0
            }
          ],
          causalityFlow: [
            { step: 1, actor: 'Operator Intake', action: `Filed incident for ${service}`, impact: 'Active triage triggered' },
            { step: 2, actor: 'CaseMind Ingestion', action: 'Queried vector memory across 4.2M historical incidents', impact: 'Lineage established' }
          ]
        },
        evidenceProvenance: {
          memoryMatches: [
            {
              incidentId: 'INC-7102',
              title: 'Prior Service Degradation Pattern',
              resolvedDate: '94 days ago',
              similarityScore: 88.5,
              keyResolution: 'Dynamic pool tuning and health check verification.',
              author: 'Marcus Vance',
              link: '#INC-7102',
              timeToResolve: '4m 12s'
            }
          ],
          groundedCitations: [
            {
              id: `cit-new-${Date.now()}`,
              type: 'METRIC_ALERT',
              title: `Intake Alert: ${service} anomaly`,
              source: 'Operator Console',
              snippet: description.trim(),
              timestamp: 'Just now',
              confidenceWeight: 92.0
            }
          ],
          kbArticles: []
        },
        telemetryStream: [
          {
            id: `tel-new-1`,
            timestamp: 'Just now',
            source: 'K8S_POD',
            level: 'WARN',
            message: `Ticket ${newId} initialized for ${service} in ${cluster}`,
            aiCorrelated: true
          }
        ],
        metricsTimeline: [
          { time: '10:00', errorRate: 0.05, latencyP99: 45, tokenLossPct: 0.0, cpuLoad: 30 },
          { time: '10:05', errorRate: 3.2, latencyP99: 1200, tokenLossPct: 4.5, cpuLoad: 85 }
        ],
        runbook: {
          id: 'RB-HEALTH-DIAG-01',
          name: `Diagnostic Verification for ${service}`,
          version: 'v1.0',
          estimatedMinutes: 2,
          riskLevel: 'LOW',
          steps: [
            {
              id: 's-diag-1',
              stepNumber: 1,
              label: 'Inspect Service Pod Health',
              command: `kubectl get pods -n prod -l app=${service}`,
              description: 'Checks replica health and restarts.',
              safetyGate: false,
              status: 'COMPLETED',
              durationMs: 180
            },
            {
              id: 's-diag-2',
              stepNumber: 2,
              label: 'Verify Downstream Endpoints',
              command: `curl -f -m 2 http://${service}.prod.svc.cluster.local/healthz`,
              description: 'Verifies health probe endpoint status.',
              safetyGate: false,
              status: 'PENDING',
              durationMs: 0
            }
          ]
        },
        humanNotes: [
          {
            id: `note-init`,
            author: currentUser.name,
            role: currentUser.team,
            avatar: currentUser.avatar,
            time: 'Just now',
            text: `Created ticket from intake console: ${description.trim()}`
          }
        ]
      };

      onCreateIncident(newIncident);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#dae2fd] space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#eaedff] text-[#3525cd]">
              <PlusCircle className="w-5 h-5 text-[#3525cd]" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#131b2e]">
                Create Incident / Support Ticket
              </h3>
              <p className="text-xs text-[#464555]">
                Ingest a new case into CaseMind cognitive pipeline with instant RCA correlation.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-[#777587] hover:bg-[#f2f3ff]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isViewer && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Viewer role is read-only. Switch to Agent, Manager, or Admin in Settings to create cases.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono block mb-1">
              Incident Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Cross-Region Connection Timeouts on auth-gateway"
              value={title}
              disabled={isViewer}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd] focus:bg-white"
            />
            {errors.title && (
              <p className="text-[11px] text-[#ba1a1a] mt-1 font-mono">{errors.title}</p>
            )}
          </div>

          {/* Severity & Service */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono block mb-1">
                Severity Level *
              </label>
              <select
                value={severity}
                disabled={isViewer}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] font-mono focus:ring-2 focus:ring-[#3525cd]"
              >
                <option value="P0 - CRITICAL">P0 - CRITICAL (Outage / Data Loss)</option>
                <option value="P1 - HIGH">P1 - HIGH (Severe Degradation)</option>
                <option value="P2 - MEDIUM">P2 - MEDIUM (Performance Anomaly)</option>
                <option value="P3 - LOW">P3 - LOW (Minor Issue)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono block mb-1">
                Target Service *
              </label>
              <select
                value={service}
                disabled={isViewer}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] font-mono focus:ring-2 focus:ring-[#3525cd]"
              >
                <option value="auth-gateway-v2">auth-gateway-v2</option>
                <option value="billing-checkout">billing-checkout</option>
                <option value="user-profile-svc">user-profile-svc</option>
                <option value="payment-consumer-worker">payment-consumer-worker</option>
                <option value="pg-replica-eu-03">pg-replica-eu-03</option>
                <option value="order-fulfillment">order-fulfillment</option>
                <option value="cdn-ingress-api">cdn-ingress-api</option>
              </select>
            </div>
          </div>

          {/* Cluster & Impacted Users */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono block mb-1">
                Production Cluster
              </label>
              <select
                value={cluster}
                disabled={isViewer}
                onChange={(e) => setCluster(e.target.value)}
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] font-mono focus:ring-2 focus:ring-[#3525cd]"
              >
                <option value="us-east-prod-k8s">us-east-prod-k8s</option>
                <option value="aws-us-west-prod">aws-us-west-prod</option>
                <option value="aws-eu-west-db">aws-eu-west-db</option>
                <option value="global-edge-cloudflare">global-edge-cloudflare</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono block mb-1">
                Estimated Users Impacted
              </label>
              <input
                type="number"
                value={affectedUsers}
                disabled={isViewer}
                onChange={(e) => setAffectedUsers(Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] font-mono focus:ring-2 focus:ring-[#3525cd]"
              />
            </div>
          </div>

          {/* Assignee selection */}
          <div>
            <label className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono block mb-1">
              Assign Lead Engineer
            </label>
            <select
              value={assigneeId}
              disabled={isViewer}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] font-sans focus:ring-2 focus:ring-[#3525cd]"
            >
              {TEAM_USERS.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role} — {user.team})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono block mb-1">
              Observed Symptoms & Context *
            </label>
            <textarea
              rows={3}
              placeholder="Describe error codes, spike timelines, trace IDs, or recent git commits..."
              value={description}
              disabled={isViewer}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd] focus:bg-white"
            />
            {errors.description && (
              <p className="text-[11px] text-[#ba1a1a] mt-1 font-mono">{errors.description}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#eaedff]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#464555] hover:bg-[#f2f3ff] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isViewer || isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-[#3525cd] hover:bg-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#dad7ff]" />
              <span>{isSubmitting ? 'Synthesizing RCA...' : 'Ingest & Trigger CaseMind'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
