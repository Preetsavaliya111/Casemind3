import React, { useState } from 'react';
import { Incident } from '../types';
import { Sparkles, X, AlertTriangle, Play, Database, Layers, CheckCircle2 } from 'lucide-react';

interface SimulateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectIncident: (newIncident: Incident) => void;
}

export const SimulateIncidentModal: React.FC<SimulateIncidentModalProps> = ({
  isOpen,
  onClose,
  onInjectIncident
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('scenario-1');

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'scenario-1',
      title: 'Redis Cluster Primary OOM & Split-Brain Failover in eu-central-1',
      service: 'session-cache-v3',
      cluster: 'eu-central-prod',
      severity: 'P0 - CRITICAL' as const,
      summary: 'Primary Redis node evicted 80,000 keys in 12 seconds following uncompressed session object burst. Replication buffer overflow triggered an ungraceful failover.',
      rootCause: 'Replication buffer exhaustion (repl-backlog-size=64MB exceeded by 140MB delta) causing replica disconnection loop.',
      confidence: 96.2,
      runbookId: 'RB-REDIS-FAILOVER-04'
    },
    {
      id: 'scenario-2',
      title: 'DynamoDB Hot Key Throttle on checkout-cart Partition Key #US-EAST',
      service: 'checkout-cart-svc',
      cluster: 'aws-us-east-prod',
      severity: 'P1 - HIGH' as const,
      summary: 'Flash sale promotion directed 22,000 writes/sec to a single un-salted partition key "PROMO_FALL_26", exceeding the 1,000 WCU single partition threshold.',
      rootCause: 'Monolithic partition key hash skew without random suffix salting during flash sale traffic surge.',
      confidence: 93.8,
      runbookId: 'RB-DYNAMO-SALT-02'
    },
    {
      id: 'scenario-3',
      title: 'API Gateway TLS Handshake Timeout Flood from Misconfigured SDK v3.2',
      service: 'api-edge-router',
      cluster: 'global-ingress',
      severity: 'P1 - HIGH' as const,
      summary: 'Legacy mobile client rollout initiated TLS renegotiation loop without session resumption, saturating Envoy worker crypto cores.',
      rootCause: 'Client SDK v3.2 disabled TLS session tickets, triggering full RSA/ECDHE renegotiation on every 5-second polling request.',
      confidence: 91.5,
      runbookId: 'RB-ENVOY-TLS-POLICY'
    }
  ];

  const handleTrigger = () => {
    const scenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0];
    const newIncidentId = `INC-${Math.floor(8950 + Math.random() * 50)}`;

    const newIncident: Incident = {
      id: newIncidentId,
      title: scenario.title,
      severity: scenario.severity,
      status: 'INVESTIGATING',
      service: scenario.service,
      cluster: scenario.cluster,
      blastRadius: {
        affectedUsers: 84000,
        pctTraffic: 18.5,
        region: scenario.cluster,
        revenueImpactPerHour: '$26,500/hr',
        downstreamServices: ['api-gateway', 'user-portal', 'payment-v2']
      },
      slaRemainingMinutes: 28,
      openedAt: 'Just now (Telemetry Ingested)',
      assignee: {
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: 'Staff Incident Commander',
        email: 'e.rostova@enterprise.corp'
      },
      cognitiveSynthesis: {
        summary: scenario.summary,
        probableRootCause: scenario.rootCause,
        confidenceScore: scenario.confidence,
        confidenceBreakdown: {
          rootCause: scenario.confidence,
          blastRadius: 92.0,
          remediation: 90.0,
          evidenceGrounded: 95.0
        },
        hypotheses: [
          {
            id: 'sim-hyp-1',
            title: scenario.rootCause,
            likelihood: scenario.confidence,
            evidence: 'Telemetry anomaly detected across 42 ingress nodes matching vector memory pattern.',
            refuted: false,
            status: 'CONFIRMED'
          }
        ],
        machineSuggestedRemediations: [
          {
            id: 'sim-rem-1',
            title: `Execute Verified ${scenario.runbookId}`,
            risk: 'LOW',
            runbookId: scenario.runbookId,
            expectedRecoveryTime: '< 2 minutes',
            autoExecutable: true,
            confidence: scenario.confidence
          }
        ],
        causalityFlow: [
          { step: 1, actor: 'Client Workload', action: 'Traffic surge hit target cluster', impact: 'Throughput spike' },
          { step: 2, actor: scenario.service, action: 'Resource threshold breached', impact: 'P99 Latency surge' },
          { step: 3, actor: 'CaseMind Ingestion', action: 'Synthesized telemetry and queried organizational memory', impact: 'Root cause verified in 12s' }
        ]
      },
      evidenceProvenance: {
        memoryMatches: [
          {
            incidentId: 'INC-7810',
            title: 'Previous Cluster Partition Surge',
            resolvedDate: '45 days ago',
            similarityScore: 92.4,
            keyResolution: 'Dynamic buffer scale and partition retuning.',
            author: 'Marcus Vance',
            link: '#INC-7810',
            timeToResolve: '3m 40s'
          }
        ],
        groundedCitations: [
          {
            id: 'sim-cit-1',
            type: 'METRIC_ALERT',
            title: `Prometheus Critical Alert: ${scenario.service} error spike`,
            source: 'Prometheus AlertManager',
            snippet: `alert: HighErrorRate\nservice: ${scenario.service}\nrate > 15%`,
            timestamp: 'Just now',
            confidenceWeight: 96.0
          }
        ],
        kbArticles: []
      },
      telemetryStream: [
        {
          id: 'sim-t-1',
          timestamp: 'Just now',
          source: 'PROMETHEUS',
          level: 'FATAL',
          message: `Threshold breached on ${scenario.service}. Error rate 18.2%.`,
          aiCorrelated: true
        }
      ],
      metricsTimeline: [
        { time: '10:00', errorRate: 0.05, latencyP99: 40, tokenLossPct: 0.0, cpuLoad: 25 },
        { time: '10:05', errorRate: 18.2, latencyP99: 3800, tokenLossPct: 18.5, cpuLoad: 95 }
      ],
      runbook: {
        id: scenario.runbookId,
        name: `Automated Mitigation for ${scenario.service}`,
        version: 'v1.4',
        estimatedMinutes: 2,
        riskLevel: 'LOW',
        steps: [
          {
            id: 'sim-s1',
            stepNumber: 1,
            label: 'Inspect Buffer & Cluster Health',
            command: `clusterctl inspect --service=${scenario.service}`,
            description: 'Verifies node availability prior to reconfiguration.',
            safetyGate: false,
            status: 'COMPLETED',
            durationMs: 240
          },
          {
            id: 'sim-s2',
            stepNumber: 2,
            label: 'Apply Dynamic Mitigation Patch',
            command: `kubectl patch configmap ${scenario.service}-config --type merge -p '{"data":{"ACTIVE_BUFFER_MAX":"4096"}}'`,
            description: 'Broadens allocation bounds to clear the backlog.',
            safetyGate: true,
            status: 'PENDING',
            durationMs: 0
          }
        ]
      },
      humanNotes: []
    };

    onInjectIncident(newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#dae2fd] space-y-5">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-[#7c3aed]">
              <Sparkles className="w-5 h-5 text-[#7c3aed]" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#131b2e]">
                Simulate Synthetic Incident Scenario
              </h3>
              <p className="text-xs text-[#464555]">
                Inject realistic telemetry to test CaseMind autonomous RCA, memory matching, and runbook proposal.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-[#777587] hover:bg-[#f2f3ff]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario selection */}
        <div className="space-y-3">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedScenario === sc.id
                  ? 'border-[#3525cd] bg-[#eaedff]/40 ring-2 ring-[#c3c0ff]'
                  : 'border-[#dae2fd] bg-[#faf8ff] hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      sc.severity.startsWith('P0') ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sc.severity}
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#3525cd]">
                      {sc.service}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#131b2e] mt-1.5">
                    {sc.title}
                  </h4>
                  <p className="text-xs text-[#464555] mt-1 line-clamp-2">
                    {sc.summary}
                  </p>
                </div>

                <div className="shrink-0 text-right font-mono text-xs">
                  <span className="text-[#059669] font-bold">{sc.confidence}%</span>
                  <span className="text-[10px] text-[#777587] block">Sim. Conf</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#eaedff]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#464555] hover:bg-[#f2f3ff] rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleTrigger}
            className="px-5 py-2 text-xs font-bold text-white bg-linear-to-r from-[#7c3aed] to-[#4f46e5] hover:opacity-95 rounded-lg shadow-sm flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Inject Scenario & Trigger RCA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
