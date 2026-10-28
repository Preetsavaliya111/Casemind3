export type Severity = 'P0 - CRITICAL' | 'P1 - HIGH' | 'P2 - MEDIUM' | 'P3 - LOW';

export type IncidentStatus = 'TRIAGING' | 'INVESTIGATING' | 'MITIGATING' | 'MONITORING' | 'RESOLVED';

export interface Assignee {
  name: string;
  avatar: string;
  role: string;
  email: string;
}

export interface BlastRadius {
  affectedUsers: number;
  pctTraffic: number;
  region: string;
  revenueImpactPerHour: string;
  downstreamServices: string[];
}

export interface ConfidenceBreakdown {
  rootCause: number;
  blastRadius: number;
  remediation: number;
  evidenceGrounded: number;
}

export interface Hypothesis {
  id: string;
  title: string;
  likelihood: number;
  evidence: string;
  refuted: boolean;
  status: 'CONFIRMED' | 'UNLIKELY' | 'INVESTIGATING';
}

export interface SuggestedRemediation {
  id: string;
  title: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  runbookId: string;
  expectedRecoveryTime: string;
  autoExecutable: boolean;
  confidence: number;
}

export interface MemoryMatch {
  incidentId: string;
  title: string;
  resolvedDate: string;
  similarityScore: number;
  keyResolution: string;
  author: string;
  link: string;
  timeToResolve: string;
}

export interface GroundedCitation {
  id: string;
  type: 'LOG_SPAN' | 'METRIC_ALERT' | 'GIT_COMMIT' | 'CONFLUENCE_KB' | 'RUNBOOK' | 'SLACK_SIGNAL';
  title: string;
  source: string;
  snippet: string;
  timestamp: string;
  confidenceWeight: number;
  meta?: Record<string, string>;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  source: 'K8S_POD' | 'PROMETHEUS' | 'DATADOG' | 'PAGERDUTY' | 'SLACK' | 'TRACING';
  level: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  message: string;
  rawPayload?: string;
  aiCorrelated?: boolean;
}

export interface MetricDataPoint {
  time: string;
  errorRate: number;
  latencyP99: number;
  tokenLossPct: number;
  cpuLoad: number;
}

export interface RunbookStep {
  id: string;
  stepNumber: number;
  label: string;
  command: string;
  description: string;
  safetyGate: boolean;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  outputLog?: string[];
  durationMs?: number;
}

export interface Runbook {
  id: string;
  name: string;
  version: string;
  estimatedMinutes: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  steps: RunbookStep[];
}

export interface HumanNote {
  id: string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  text: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  service: string;
  cluster: string;
  blastRadius: BlastRadius;
  slaRemainingMinutes: number;
  openedAt: string;
  assignee: Assignee;
  cognitiveSynthesis: {
    summary: string;
    probableRootCause: string;
    confidenceScore: number;
    confidenceBreakdown: ConfidenceBreakdown;
    hypotheses: Hypothesis[];
    machineSuggestedRemediations: SuggestedRemediation[];
    causalityFlow: Array<{
      step: number;
      actor: string;
      action: string;
      impact: string;
    }>;
  };
  evidenceProvenance: {
    memoryMatches: MemoryMatch[];
    groundedCitations: GroundedCitation[];
    kbArticles: Array<{ id: string; title: string; tags: string[]; snippet: string }>;
  };
  telemetryStream: TelemetryEvent[];
  metricsTimeline: MetricDataPoint[];
  runbook: Runbook;
  humanNotes: HumanNote[];
  postMortemDraft?: {
    summary: string;
    timelineSummary: string;
    rootCauseAnalysis: string;
    preventionItems: string[];
    generatedAt: string;
  };
}

export interface GraphNode {
  id: string;
  name: string;
  type: 'SERVICE' | 'INCIDENT' | 'RUNBOOK' | 'FAILURE_MODE' | 'DATABASE';
  severity?: 'CRITICAL' | 'WARN' | 'HEALTHY';
  x: number;
  y: number;
  metadata?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
  highlighted?: boolean;
}
