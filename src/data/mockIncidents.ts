import { 
  Incident, 
  GraphNode, 
  GraphEdge, 
  UserProfile, 
  KnowledgeArticle, 
  AuditLogEntry, 
  NotificationItem,
  CopilotMessage
} from '../types';

export const TEAM_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Elena Rostova',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'e.rostova@enterprise.corp',
    team: 'Tier-3 Command & Core SRE',
    activeSince: '3 years'
  },
  {
    id: 'usr-2',
    name: 'Carlos Mendez',
    role: 'MANAGER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'c.mendez@enterprise.corp',
    team: 'Payments & Streaming Reliability',
    activeSince: '2 years'
  },
  {
    id: 'usr-3',
    name: 'Priya Sharma',
    role: 'AGENT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'p.sharma@enterprise.corp',
    team: 'Data Platform Reliability',
    activeSince: '1.5 years'
  },
  {
    id: 'usr-4',
    name: 'David Tanaka',
    role: 'AGENT',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'd.tanaka@enterprise.corp',
    team: 'Database Reliability',
    activeSince: '2 years'
  },
  {
    id: 'usr-5',
    name: 'Liam Zhang',
    role: 'AGENT',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    email: 'l.zhang@enterprise.corp',
    team: 'Edge Ingress & Envoy',
    activeSince: '1 year'
  },
  {
    id: 'usr-6',
    name: 'Auditor Guest',
    role: 'VIEWER',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    email: 'auditor.guest@enterprise.corp',
    team: 'Compliance & Read-Only Audit',
    activeSince: '3 months'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'SLA Breach Warning: INC-8942',
    message: 'Auth Gateway P0 incident has 18 minutes remaining until 99.9% monthly SLA breach threshold.',
    timestamp: '2 mins ago',
    unread: true,
    type: 'CRITICAL',
    linkIncidentId: 'INC-8942'
  },
  {
    id: 'notif-2',
    title: 'Runbook Step 2 Auto-Verified',
    message: 'RB-AUTH-FAILOVER-09 step 2 applied ConfigMap REDIS_MAX_POOL=2000 successfully.',
    timestamp: '6 mins ago',
    unread: true,
    type: 'SUCCESS',
    linkIncidentId: 'INC-8942'
  },
  {
    id: 'notif-3',
    title: 'New Memory Match Identified',
    message: 'CaseMind vector engine discovered 96.4% cosine similarity match with historical INC-7102.',
    timestamp: '11 mins ago',
    unread: false,
    type: 'INFO',
    linkIncidentId: 'INC-8942'
  },
  {
    id: 'notif-4',
    title: 'Kafka Consumer Lag Spike in us-west-2',
    message: 'Partition 12 lag exceeded 45,000 messages on payment-consumer-worker fleet.',
    timestamp: '35 mins ago',
    unread: false,
    type: 'WARN',
    linkIncidentId: 'INC-8939'
  }
];

export const INITIAL_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-204',
    title: 'Architectural Guide: Handling Thundering Herds in Distributed Token Caches',
    category: 'ARCHITECTURAL',
    tags: ['Redis', 'JWT', 'Architecture', 'Caching', 'Thundering Herd'],
    snippet: 'Always pair short TTL tokens with probabilistic early expiration (XFetch algorithm) and connection pool sizing >= 3x peak concurrent requests.',
    fullContent: `## Executive Overview
When migrating session tokens to tighter lifetimes (e.g. PCI-DSS 4.0 mandate reducing TTL from 3600s to 300s), synchronous client token refreshes can synchronize.

### Problem Dynamics
1. Synchronous expiration triggers concurrent token generation requests.
2. Ingress worker pools saturate Redis max_connections.
3. TCP socket queues hang, leading to 504 Gateway Timeouts on edge reverse proxies.

### Grounded Mitigations
- **Probabilistic Early Expiration (XFetch):** Client refreshes asynchronously at \`ttl - beta * delta * ln(random())\`.
- **Dynamic Pool Sizing:** Scale Lettuce/Jedis pools dynamically with connection headroom >= 2000 connections.
- **In-Memory Cache Jitter:** Cache validated public keys locally in node worker memory for 60 seconds with ±15s jitter.`,
    author: 'Marcus Vance (Principal SRE)',
    updatedAt: '2026-09-12',
    relatedIncidents: ['INC-7102', 'INC-8942'],
    documentType: 'MARKDOWN'
  },
  {
    id: 'kb-118',
    title: 'Kubernetes ConfigMap Dynamic Reload Patterns for Gateway Proxies',
    category: 'RUNBOOK_GUIDE',
    tags: ['K8s', 'ConfigMap', 'Zero-Downtime', 'Envoy'],
    snippet: 'How to trigger hot-reloads of Envoy and Node.js gateway connection poolers without dropping in-flight HTTP connections.',
    fullContent: `## Zero-Downtime Reload SOP
To patch connection bounds without dropping in-flight sessions:
1. Apply ConfigMap merge with kubectl patch.
2. Verify updated values in /etc/config/app.json.
3. Execute graceful rolling restart with maxSurge=25% and maxUnavailable=0.
4. Verify HTTP 200 return code on synthetic canary endpoints.`,
    author: 'Sarah Chen (Staff Infra)',
    updatedAt: '2026-08-04',
    relatedIncidents: ['INC-8942'],
    documentType: 'RUNBOOK'
  },
  {
    id: 'kb-309',
    title: 'PostgreSQL Read-Replica WAL Lock Starvation Remediation',
    category: 'REPLICATION',
    tags: ['PostgreSQL', 'WAL', 'Replication Lag', 'Locks'],
    snippet: 'Resolving standby streaming delay conflicts caused by long-running analytical queries blocking recovery replay.',
    fullContent: `## Background
Long-running queries on standby read-replicas hold AccessShareLock on tables that have pending DDL or VACUUM modifications waiting to be replayed by the WAL receiver.

### Resolution Steps
1. Identify the blocking process PID using pg_stat_activity.
2. Cancel backend gently using \`SELECT pg_cancel_backend(pid)\`.
3. If unyielding within 15 seconds, terminate via \`SELECT pg_terminate_backend(pid)\`.
4. Configure \`statement_timeout = '60s'\` for all analytical read-only roles.`,
    author: 'Priya Sharma (Lead Data SRE)',
    updatedAt: '2026-07-20',
    relatedIncidents: ['INC-8931', 'INC-5219'],
    documentType: 'INCIDENT_SOP'
  },
  {
    id: 'kb-412',
    title: 'Kafka Consumer Rebalance Storm Isolation & Poison Pill Offset Bypass',
    category: 'INCIDENT_SOP',
    tags: ['Kafka', 'Rebalance', 'Poison Pill', 'DLQ'],
    snippet: 'Standard operating procedure for dumping poisoned unparseable Kafka offsets to S3 and committing offset + 1 to unblock consumer groups.',
    fullContent: `## Protocol for Deserialization Poison Pills
When an unparseable or corrupted payload stalls worker consumer loops:
1. Dump raw payload from target topic and partition offset to S3 dead-letter bucket for forensics.
2. Seek consumer group partition offset to current_offset + 1.
3. Verify heartbeat recovery in ConsumerGroupDescribe API.`,
    author: 'Carlos Mendez (Senior Payments SRE)',
    updatedAt: '2026-10-02',
    relatedIncidents: ['INC-8939', 'INC-6401'],
    documentType: 'RUNBOOK'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: '10:32:15 UTC',
    actor: 'Elena Rostova',
    role: 'ADMIN',
    action: 'RUNBOOK_EXECUTE_STEP',
    target: 'RB-AUTH-FAILOVER-09 / Step 1',
    details: 'Verified Redis Cluster Primary Memory Headroom (79.9% available). Output code: 0.',
    severity: 'MUTATION'
  },
  {
    id: 'aud-2',
    timestamp: '10:33:02 UTC',
    actor: 'Elena Rostova',
    role: 'ADMIN',
    action: 'RUNBOOK_EXECUTE_STEP',
    target: 'RB-AUTH-FAILOVER-09 / Step 2',
    details: 'Patched K8s ConfigMap auth-gateway-config: REDIS_MAX_POOL=2000, REDIS_CONN_TIMEOUT_MS=1500.',
    severity: 'MUTATION'
  },
  {
    id: 'aud-3',
    timestamp: '10:28:40 UTC',
    actor: 'CaseMind Autonomous Engine',
    role: 'ADMIN',
    action: 'AI_SYNTHESIS_GENERATED',
    target: 'INC-8942',
    details: 'Correlated commit #a98f12b with Redis connection exhaustion. Confidence: 94.6%.',
    severity: 'INFO'
  },
  {
    id: 'aud-4',
    timestamp: '10:24:10 UTC',
    actor: 'CI/CD GitHub Actions',
    role: 'AGENT',
    action: 'DEPLOYMENT_ROLLED_OUT',
    target: 'auth-gateway-v2',
    details: 'Image sha256:4a8c9e rolled out to 18 replicas in cluster us-east-prod-k8s.',
    severity: 'INFO'
  },
  {
    id: 'aud-5',
    timestamp: '10:18:22 UTC',
    actor: 'Carlos Mendez',
    role: 'MANAGER',
    action: 'RUNBOOK_DRY_RUN',
    target: 'RB-KAFKA-DLQ-SKIP',
    details: 'Executed dry-run on Kafka partition 12 offset bypass. Simulation status: SUCCESS.',
    severity: 'INFO'
  }
];

export const INITIAL_COPILOT_MESSAGES: CopilotMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Hello, I am CaseMind Copilot. I have analyzed active incident **INC-8942** and correlated live telemetry with enterprise memory. How can I assist with your investigation or runbook execution?',
    timestamp: '10:30 UTC',
    citations: [
      { title: 'Incident INC-8942 Diagnosis', source: 'CaseMind Engine', confidence: 94.6 },
      { title: 'Historical Match INC-7102', source: 'Organizational Memory', confidence: 96.4 }
    ]
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-8942',
    title: 'Cross-Region Latency Spike & Token Invalidation in Auth Gateway',
    severity: 'P0 - CRITICAL',
    status: 'INVESTIGATING',
    service: 'auth-gateway-v2',
    cluster: 'us-east-prod-k8s',
    blastRadius: {
      affectedUsers: 142500,
      pctTraffic: 24.8,
      region: 'us-east-1 (N. Virginia)',
      revenueImpactPerHour: '$38,400/hr',
      downstreamServices: ['billing-checkout', 'user-profile-svc', 'api-edge-router', 'oauth-token-store']
    },
    slaRemainingMinutes: 18,
    openedAt: '12 mins ago (10:28 UTC)',
    assignee: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Staff Incident Commander',
      email: 'e.rostova@enterprise.corp'
    },
    cognitiveSynthesis: {
      summary: 'Auth Gateway ingress instances experiencing cascading connection timeouts (P99 > 4.8s) and 504 Gateway Timeouts following rollout of v4.12.8 (commit #a98f12b). An unindexed JWT signature cache eviction triggered a thundering herd against the Redis cluster pool, saturating max_connections (500/500).',
      probableRootCause: 'Redis connection pool exhaustion caused by concurrent token renewal thundering herd after deploy v4.12.8 reduced JWT TTL from 3600s to 300s without connection pool auto-scaling.',
      confidenceScore: 94.6,
      confidenceBreakdown: {
        rootCause: 94.6,
        blastRadius: 96.2,
        remediation: 92.4,
        evidenceGrounded: 98.0
      },
      hypotheses: [
        {
          id: 'hyp-1',
          title: 'Redis Connection Pool Starvation via Token TTL reduction',
          likelihood: 94.6,
          evidence: 'Metric redis_pool_wait_duration_ms surged to 4800ms coincident with commit #a98f12b deploy at 10:24 UTC.',
          refuted: false,
          status: 'CONFIRMED'
        },
        {
          id: 'hyp-2',
          title: 'Cross-region AWS DirectConnect packet degradation',
          likelihood: 14.2,
          evidence: 'AWS CloudWatch network health telemetry reports nominal packet loss (<0.002%) across us-east-1 and us-west-2.',
          refuted: true,
          status: 'UNLIKELY'
        },
        {
          id: 'hyp-3',
          title: 'Distributed credential stuffing / Layer-7 DDoS attack',
          likelihood: 8.5,
          evidence: 'WAF incoming request volume matches standard baseline diurnal curve (±4.1% standard deviation).',
          refuted: true,
          status: 'UNLIKELY'
        }
      ],
      machineSuggestedRemediations: [
        {
          id: 'rem-1',
          title: 'Execute RB-AUTH-FAILOVER-09: Trip Ingress Circuit Breaker & Hot-Patch Pool Size to 2000',
          risk: 'LOW',
          runbookId: 'RB-AUTH-FAILOVER-09',
          expectedRecoveryTime: '< 3 minutes',
          autoExecutable: true,
          confidence: 94.2
        },
        {
          id: 'rem-2',
          title: 'Rollback Deployment auth-gateway-v2 to build v4.12.7',
          risk: 'MEDIUM',
          runbookId: 'RB-KUBE-ROLLBACK-02',
          expectedRecoveryTime: '6-8 minutes',
          autoExecutable: false,
          confidence: 89.0
        }
      ],
      causalityFlow: [
        { step: 1, actor: 'CI/CD Pipeline', action: 'Deployed auth-gateway v4.12.8 with 5m JWT TTL (commit a98f12b)', impact: 'TTL halved, token refresh requests x12' },
        { step: 2, actor: 'Token Refresher', action: 'Concurrent client refresh flood hit Redis primary nodes', impact: 'Redis pool max_connections reached (500/500)' },
        { step: 3, actor: 'Worker Pods', action: 'TCP socket queue saturated; threads blocked on socket read', impact: 'P99 Latency exploded from 42ms to 4,820ms' },
        { step: 4, actor: 'Ingress Gateway', action: 'Emitted HTTP 504 Gateway Timeout on 24.8% of user traffic', impact: 'User checkout and login failures in us-east-1' }
      ]
    },
    evidenceProvenance: {
      memoryMatches: [
        {
          incidentId: 'INC-7102',
          title: 'Redis Pool Starvation during Black Friday Auth Spike',
          resolvedDate: '94 days ago (Nov 24)',
          similarityScore: 96.4,
          keyResolution: 'Scaled REDIS_MAX_POOL from 500 to 2000 and enabled local in-memory token cache fallback with 60s jitter.',
          author: 'Marcus Vance (Principal SRE)',
          link: '#INC-7102',
          timeToResolve: '4m 12s'
        },
        {
          incidentId: 'INC-6540',
          title: 'JWT Expiration Cascade in EU Gateway Cluster',
          resolvedDate: '162 days ago (Sep 18)',
          similarityScore: 88.1,
          keyResolution: 'Implemented token refresh jitter to prevent synchronous re-auth thundering herds.',
          author: 'Sarah Chen (Staff Infra)',
          link: '#INC-6540',
          timeToResolve: '8m 45s'
        }
      ],
      groundedCitations: [
        {
          id: 'cit-1',
          type: 'GIT_COMMIT',
          title: 'Commit a98f12b: feat(auth): tighten JWT session lifetime for PCI-DSS 4.0 compliance',
          source: 'github.com/corp/auth-gateway/commit/a98f12b',
          snippet: '- const TOKEN_EXPIRY = 3600; // 1 hour\n+ const TOKEN_EXPIRY = 300;  // 5 mins (PCI-DSS compliance)',
          timestamp: '10:21:40 UTC',
          confidenceWeight: 99.4,
          meta: { committer: 'dev-team-alpha', branch: 'release-4.12.8' }
        },
        {
          id: 'cit-2',
          type: 'LOG_SPAN',
          title: 'OpenTelemetry Trace #8f42e9a0c1: auth-gateway-pod-7x2d',
          source: 'Elastic Observability / OTel APM',
          snippet: 'ERROR [io.lettuce.core.RedisConnectionException]: Pool exhausted! Unable to acquire connection within 4000ms. Active: 500, Max: 500, Pending: 1,420',
          timestamp: '10:28:14 UTC',
          confidenceWeight: 98.6,
          meta: { traceId: '8f42e9a0c1', pod: 'auth-gateway-7f89d-4kx2' }
        },
        {
          id: 'cit-3',
          type: 'METRIC_ALERT',
          title: 'Datadog Alert: redis.pool.utilization > 99% (Host: redis-auth-cluster-01)',
          source: 'Datadog Monitor #482910',
          snippet: 'Critical threshold breached: redis.clients.connected = 500 [duration > 3m]. Latency spike correlated with auth-gateway-v2 service error rate.',
          timestamp: '10:27:00 UTC',
          confidenceWeight: 96.0,
          meta: { threshold: '90%', current: '100%' }
        },
        {
          id: 'cit-4',
          type: 'RUNBOOK',
          title: 'Confluence Runbook RB-AUTH-FAILOVER-09: Ingress Redis Pool Recovery',
          source: 'docs.corp.internal/runbooks/auth-pool-failover',
          snippet: 'Runbook validated by SRE team on 2026-08-14. Step 1: Trip circuit breaker. Step 2: Apply dynamic configmap REDIS_POOL_MAX=2000. Step 3: Rolling restart.',
          timestamp: 'Validated 2026-08-14',
          confidenceWeight: 94.0,
          meta: { author: 'Marcus Vance', testStatus: 'Automated Verified' }
        }
      ],
      kbArticles: [
        {
          id: 'kb-204',
          title: 'Architectural Guide: Handling Thundering Herds in Distributed Token Caches',
          tags: ['Redis', 'JWT', 'Architecture', 'Caching'],
          snippet: 'Always pair short TTL tokens with probabilistic early expiration (XFetch algorithm) and connection pool sizing >= 3x peak concurrent requests.'
        },
        {
          id: 'kb-118',
          title: 'Kubernetes ConfigMap Dynamic Reload Patterns for Gateway Proxies',
          tags: ['K8s', 'ConfigMap', 'Zero-Downtime'],
          snippet: 'How to trigger hot-reloads of Envoy and Node.js gateway connection poolers without dropping in-flight HTTP connections.'
        }
      ]
    },
    telemetryStream: [
      {
        id: 'tel-1',
        timestamp: '10:24:02 UTC',
        source: 'K8S_POD',
        level: 'INFO',
        message: 'Deployment auth-gateway-v2 rolled out replica 1..18 to image sha256:4a8c9e... (build v4.12.8)',
        rawPayload: '{"event": "ReplicaSetUpdated", "deployment": "auth-gateway-v2", "ready": 18}'
      },
      {
        id: 'tel-2',
        timestamp: '10:26:15 UTC',
        source: 'PROMETHEUS',
        level: 'WARN',
        message: 'Metric alert fired: auth_gateway_token_refresh_rate_per_sec increased 1,180% (210 -> 2,680 req/s)',
        aiCorrelated: true
      },
      {
        id: 'tel-3',
        timestamp: '10:27:44 UTC',
        source: 'DATADOG',
        level: 'ERROR',
        message: 'Redis pool wait duration exceeded threshold: P99 wait duration 4,820ms. Pool state: 500/500 active.',
        rawPayload: '{"cluster": "redis-auth-primary", "connected_clients": 500, "blocked_clients": 1420}',
        aiCorrelated: true
      },
      {
        id: 'tel-4',
        timestamp: '10:28:10 UTC',
        source: 'TRACING',
        level: 'FATAL',
        message: 'Span timeout in /api/v2/auth/verify: RedisConnectionException. HTTP 504 returned to ingress envoy proxy.',
        rawPayload: '{"http_status": 504, "path": "/api/v2/auth/verify", "span_duration_ms": 5002}',
        aiCorrelated: true
      },
      {
        id: 'tel-5',
        timestamp: '10:29:05 UTC',
        source: 'PAGERDUTY',
        level: 'FATAL',
        message: 'PagerDuty Incident triggered: [P0] Auth Gateway Error Rate > 15% for 3 consecutive minutes.',
        rawPayload: '{"service": "auth-gateway-v2", "urgency": "high", "incident_key": "auth-gate-504"}'
      },
      {
        id: 'tel-6',
        timestamp: '10:31:20 UTC',
        source: 'SLACK',
        level: 'WARN',
        message: '#incident-war-room: Elena Rostova: "CaseMind flagged Redis pool exhaustion on v4.12.8. Checking memory match INC-7102."',
        aiCorrelated: false
      }
    ],
    metricsTimeline: [
      { time: '10:20', errorRate: 0.04, latencyP99: 38, tokenLossPct: 0.0, cpuLoad: 32 },
      { time: '10:22', errorRate: 0.05, latencyP99: 42, tokenLossPct: 0.0, cpuLoad: 35 },
      { time: '10:24', errorRate: 0.12, latencyP99: 85, tokenLossPct: 0.2, cpuLoad: 48 },
      { time: '10:26', errorRate: 4.80, latencyP99: 1420, tokenLossPct: 6.4, cpuLoad: 72 },
      { time: '10:28', errorRate: 18.4, latencyP99: 4820, tokenLossPct: 24.8, cpuLoad: 94 },
      { time: '10:30', errorRate: 22.1, latencyP99: 5100, tokenLossPct: 26.2, cpuLoad: 96 },
      { time: '10:32', errorRate: 24.8, latencyP99: 4950, tokenLossPct: 24.8, cpuLoad: 95 }
    ],
    runbook: {
      id: 'RB-AUTH-FAILOVER-09',
      name: 'Dynamic Redis Pool Expansion & Ingress Circuit Breaker',
      version: 'v2.4 (Verified)',
      estimatedMinutes: 3,
      riskLevel: 'LOW',
      steps: [
        {
          id: 'step-1',
          stepNumber: 1,
          label: 'Verify Redis Cluster Primary Health & Memory Headroom',
          command: 'redis-cli -h redis-auth-primary.corp info memory | grep used_memory_human',
          description: 'Ensures Redis node is not running out of system RAM before increasing client connection limits.',
          safetyGate: false,
          status: 'COMPLETED',
          outputLog: [
            '[CMD] Executing: redis-cli -h redis-auth-primary.corp info memory',
            'used_memory_human: 6.42G',
            'maxmemory_human: 32.00G',
            'mem_fragmentation_ratio: 1.04',
            '[SUCCESS] 25.58 GB RAM available (Headroom: 79.9%). Safe to expand pool.'
          ],
          durationMs: 420
        },
        {
          id: 'step-2',
          stepNumber: 2,
          label: 'Apply K8s ConfigMap: Expand REDIS_MAX_POOL to 2000 & Set Connection Timeout to 1500ms',
          command: 'kubectl patch configmap auth-gateway-config -n prod --type merge -p \'{"data":{"REDIS_MAX_POOL":"2000","REDIS_CONN_TIMEOUT_MS":"1500"}}\'',
          description: 'Triples the max pool size so concurrent token requests do not starve worker threads.',
          safetyGate: false,
          status: 'COMPLETED',
          outputLog: [
            '[CMD] kubectl patch configmap auth-gateway-config -n prod...',
            'configmap/auth-gateway-config patched',
            '[VERIFY] Checked active keys: REDIS_MAX_POOL=2000, REDIS_CONN_TIMEOUT_MS=1500',
            '[SUCCESS] ConfigMap updated across all 3 availability zones.'
          ],
          durationMs: 780
        },
        {
          id: 'step-3',
          stepNumber: 3,
          label: 'Rolling Reload of Auth Gateway Pods (maxSurge=25%, maxUnavailable=0)',
          command: 'kubectl rollout restart deployment/auth-gateway-v2 -n prod && kubectl rollout status deployment/auth-gateway-v2 -n prod --timeout=180s',
          description: 'Zero-downtime rolling restart to instantiate new Lettuce connection pool connections with updated limits.',
          safetyGate: true,
          status: 'PENDING',
          outputLog: [],
          durationMs: 0
        },
        {
          id: 'step-4',
          stepNumber: 4,
          label: 'Flush Expired JWT Cache Keys & Pre-warm Active Session Keys',
          command: 'python3 /opt/ops/scripts/flush_token_jitter.py --cluster redis-auth-primary --batch-size 5000',
          description: 'Applies probabilistic jitter to stored session keys so upcoming expirations do not synchronize.',
          safetyGate: false,
          status: 'PENDING',
          outputLog: [],
          durationMs: 0
        },
        {
          id: 'step-5',
          stepNumber: 5,
          label: 'Synthetic Canaries & Ingress Error Rate Verification',
          command: 'canary-runner --suite auth-smoke-v2 --requests 2000 --concurrency 50 --assert-p99-lt 80ms',
          description: 'Runs 2,000 synthetic auth requests and verifies P99 latency returns under 80ms and error rate < 0.1%.',
          safetyGate: false,
          status: 'PENDING',
          outputLog: [],
          durationMs: 0
        }
      ]
    },
    humanNotes: [
      {
        id: 'note-1',
        author: 'Elena Rostova',
        role: 'Incident Commander',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        time: '8 mins ago',
        text: 'Inspected CaseMind root-cause synthesis. The correlation between commit a98f12b TTL reduction and the 500/500 Redis connection cap is rock solid. Executing Step 1 & 2 of RB-AUTH-FAILOVER-09 now.'
      },
      {
        id: 'note-2',
        author: 'David Tanaka',
        role: 'Database Reliability Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        time: '4 mins ago',
        text: 'Redis primary node memory usage is only at 20%. Expanding to 2,000 connections will only add ~32MB of buffer overhead. Approved rolling reload for Step 3.'
      }
    ],
    postMortemDraft: {
      summary: 'On 2026-10-28 at 10:24 UTC, auth-gateway-v2 experienced degraded throughput and elevated 504 error rates following deployment v4.12.8, affecting approximately 142,500 active sessions across us-east-1.',
      timelineSummary: '10:21 Deploy v4.12.8 -> 10:26 Token refresh rate increased 12x -> 10:27 Redis pool capped at 500/500 -> 10:28 CaseMind generated 94.6% confidence synthesis matching INC-7102 -> 10:32 RB-AUTH-FAILOVER-09 initiated.',
      rootCauseAnalysis: 'A reduction in client-side JWT TTL from 3600 seconds to 300 seconds (intended for PCI-DSS compliance) drastically increased concurrent token refresh frequency by ~1200%. The application connection pool was statically configured at 500 connections, leading to complete thread blocking and HTTP 504 gateway timeouts.',
      preventionItems: [
        'Mandate automated load simulation in staging for any security PR that modifies token lifetimes or caching policies.',
        'Implement dynamic connection pooling with Lettuce client auto-scaler.',
        'Enforce probabilistic early expiration (XFetch algorithm) in auth token microservice to distribute refresh requests smoothly.'
      ],
      generatedAt: '2026-10-28 10:34 UTC'
    }
  },
  {
    id: 'INC-8939',
    title: 'Kafka Consumer Group Desync on payment-events Partition 12',
    severity: 'P1 - HIGH',
    status: 'MITIGATING',
    service: 'payment-consumer-worker',
    cluster: 'aws-us-west-prod',
    blastRadius: {
      affectedUsers: 48200,
      pctTraffic: 11.2,
      region: 'us-west-2 (Oregon)',
      revenueImpactPerHour: '$14,200/hr',
      downstreamServices: ['invoice-generator', 'webhook-dispatcher', 'stripe-settlement']
    },
    slaRemainingMinutes: 44,
    openedAt: '38 mins ago (10:02 UTC)',
    assignee: {
      name: 'Carlos Mendez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Senior Payments Infra Engineer',
      email: 'c.mendez@enterprise.corp'
    },
    cognitiveSynthesis: {
      summary: 'Payment consumer worker group experiencing heartbeat timeout rebalance storm on partition 12. A poison pill event containing corrupted UTF-16 characters exceeded deserialization buffer, stalling consumer loop.',
      probableRootCause: 'Malformed JSON payload in payment-events message offset #849201 causing Jackson parser OOM and consecutive consumer heartbeat loss.',
      confidenceScore: 91.2,
      confidenceBreakdown: {
        rootCause: 91.2,
        blastRadius: 94.0,
        remediation: 89.5,
        evidenceGrounded: 95.0
      },
      hypotheses: [
        {
          id: 'hyp-k1',
          title: 'Poison Pill Deserialization Loop on Partition 12',
          likelihood: 91.2,
          evidence: 'Consumer thread dump shows 100% CPU lock inside Jackson UTF8StreamJsonParser on partition 12 offset 849201.',
          refuted: false,
          status: 'CONFIRMED'
        },
        {
          id: 'hyp-k2',
          title: 'Zookeeper / KRaft Metadata Quorum Loss',
          likelihood: 12.0,
          evidence: 'Kafka broker health metrics report healthy KRaft quorum across all 5 controllers.',
          refuted: true,
          status: 'UNLIKELY'
        }
      ],
      machineSuggestedRemediations: [
        {
          id: 'rem-k1',
          title: 'Execute RB-KAFKA-DLQ-SKIP: Route Offset #849201 to Dead Letter Queue & Resume Partition',
          risk: 'LOW',
          runbookId: 'RB-KAFKA-DLQ-SKIP',
          expectedRecoveryTime: '< 2 minutes',
          autoExecutable: true,
          confidence: 93.0
        }
      ],
      causalityFlow: [
        { step: 1, actor: 'External Partner Webhook', action: 'Sent 14MB uncompressed JSON with corrupted unicode surrogate pair', impact: 'Payload accepted by ingestion gateway' },
        { step: 2, actor: 'Worker Consumer', action: 'Failed parsing in Jackson Stream; thread locked in infinite parse spin', impact: 'Heartbeat ping missed for > 45s' },
        { step: 3, actor: 'Kafka Coordinator', action: 'Evicted worker and triggered cluster-wide partition rebalance', impact: 'Entire consumer group paused processing' }
      ]
    },
    evidenceProvenance: {
      memoryMatches: [
        {
          incidentId: 'INC-6401',
          title: 'Corrupted Webhook Payload Causing Consumer Rebalance Loop',
          resolvedDate: '180 days ago',
          similarityScore: 94.1,
          keyResolution: 'Applied Kafka DLQ offset bypass script and added schema validator before producer emission.',
          author: 'Carlos Mendez',
          link: '#INC-6401',
          timeToResolve: '6m 10s'
        }
      ],
      groundedCitations: [
        {
          id: 'cit-k1',
          type: 'LOG_SPAN',
          title: 'Worker Pod Log: payment-consumer-9k42',
          source: 'Vector Log Aggregator',
          snippet: 'FATAL org.apache.kafka.clients.consumer.CommitFailedException: Commit cannot be completed since the group has already rebalanced and assigned the partitions to another member.',
          timestamp: '10:04:12 UTC',
          confidenceWeight: 97.0
        }
      ],
      kbArticles: []
    },
    telemetryStream: [
      {
        id: 't-k1',
        timestamp: '10:02:11 UTC',
        source: 'PROMETHEUS',
        level: 'WARN',
        message: 'Kafka consumer lag on partition 12 breached 45,000 messages (threshold: 5,000)',
        aiCorrelated: true
      },
      {
        id: 't-k2',
        timestamp: '10:03:50 UTC',
        source: 'K8S_POD',
        level: 'ERROR',
        message: 'Thread deadlock warning in Java VM: Thread "kafka-consumer-worker-12" blocked for 120,400ms',
        aiCorrelated: true
      }
    ],
    metricsTimeline: [
      { time: '09:55', errorRate: 0.01, latencyP99: 120, tokenLossPct: 0.0, cpuLoad: 25 },
      { time: '10:05', errorRate: 2.10, latencyP99: 890, tokenLossPct: 4.1, cpuLoad: 88 },
      { time: '10:15', errorRate: 5.40, latencyP99: 2100, tokenLossPct: 11.2, cpuLoad: 92 },
      { time: '10:25', errorRate: 4.80, latencyP99: 1850, tokenLossPct: 9.8, cpuLoad: 84 }
    ],
    runbook: {
      id: 'RB-KAFKA-DLQ-SKIP',
      name: 'Kafka Poison Pill Dead-Letter Isolation & Offset Seek',
      version: 'v1.8',
      estimatedMinutes: 2,
      riskLevel: 'LOW',
      steps: [
        {
          id: 'ks-1',
          stepNumber: 1,
          label: 'Dump Poison Pill Message to S3 DLQ Bucket',
          command: 'kafka-dump-offset --topic payment-events --partition 12 --offset 849201 --destination s3://corp-dlq/inc-8939/',
          description: 'Preserves the corrupted payload for engineering audit and downstream forensics.',
          safetyGate: false,
          status: 'COMPLETED',
          durationMs: 310
        },
        {
          id: 'ks-2',
          stepNumber: 2,
          label: 'Commit Offset + 1 on Consumer Group payment-processors',
          command: 'kafka-consumer-groups --bootstrap-server kafka:9092 --group payment-processors --reset-offsets --to-offset 849202 --dry-run=false --execute',
          description: 'Skips the single problematic offset so the consumer loop can resume processing the queue backlog.',
          safetyGate: true,
          status: 'RUNNING',
          durationMs: 450
        }
      ]
    },
    humanNotes: []
  },
  {
    id: 'INC-8931',
    title: 'Postgres Read-Replica Replication Lag > 450s in eu-west-1',
    severity: 'P1 - HIGH',
    status: 'INVESTIGATING',
    service: 'pg-replica-eu-03',
    cluster: 'aws-eu-west-db',
    blastRadius: {
      affectedUsers: 31000,
      pctTraffic: 8.5,
      region: 'eu-west-1 (Ireland)',
      revenueImpactPerHour: '$9,100/hr',
      downstreamServices: ['reporting-dashboard', 'inventory-lookup', 'customer-portal']
    },
    slaRemainingMinutes: 62,
    openedAt: '1h 14m ago',
    assignee: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Lead Data Platform SRE',
      email: 'p.sharma@enterprise.corp'
    },
    cognitiveSynthesis: {
      summary: 'PostgreSQL replica node eu-03 has accumulated 485 seconds of WAL replication lag. Unindexed bulk analytics query with exclusive table lock on customer_audit_log is stalling WAL replay workers.',
      probableRootCause: 'Exclusive lock held by analytical export worker PID #14809 blocking WAL recovery process from applying alter/update transactions.',
      confidenceScore: 88.4,
      confidenceBreakdown: {
        rootCause: 88.4,
        blastRadius: 85.0,
        remediation: 91.0,
        evidenceGrounded: 92.5
      },
      hypotheses: [
        {
          id: 'hyp-pg1',
          title: 'WAL Replay Blocked by Long-Running Exclusive Lock',
          likelihood: 88.4,
          evidence: 'pg_stat_activity reports PID 14809 running for 52m in state "active" waiting on query hash #9f8c12a.',
          refuted: false,
          status: 'CONFIRMED'
        }
      ],
      machineSuggestedRemediations: [
        {
          id: 'rem-pg1',
          title: 'Terminate Long-Running Analytical PID #14809 via pg_cancel_backend',
          risk: 'LOW',
          runbookId: 'RB-PG-CANCEL-QUERY',
          expectedRecoveryTime: '< 1 minute',
          autoExecutable: true,
          confidence: 95.0
        }
      ],
      causalityFlow: [
        { step: 1, actor: 'Scheduled Batch Job', action: 'Initiated full table scan on 42M row table without LIMIT', impact: 'Acquired AccessShareLock' },
        { step: 2, actor: 'WAL Receiver', action: 'Attempted to replay incoming DDL alteration from primary', impact: 'Paused replication to avoid conflict' }
      ]
    },
    evidenceProvenance: {
      memoryMatches: [
        {
          incidentId: 'INC-5219',
          title: 'Replica Stalling Due to Uncontrolled BI Query',
          resolvedDate: '240 days ago',
          similarityScore: 92.0,
          keyResolution: 'Cancelled offending backend and configured statement_timeout = 60s for read-replica user pool.',
          author: 'Priya Sharma',
          link: '#INC-5219',
          timeToResolve: '3m 30s'
        }
      ],
      groundedCitations: [
        {
          id: 'cit-pg1',
          type: 'LOG_SPAN',
          title: 'Postgres Error Log: replication conflict with recovery',
          source: 'RDS PostgreSQL Logs',
          snippet: 'LOG: terminating recovery because process 14809 took longer than max_standby_streaming_delay (30000 ms)',
          timestamp: '09:22:15 UTC',
          confidenceWeight: 95.0
        }
      ],
      kbArticles: []
    },
    telemetryStream: [],
    metricsTimeline: [
      { time: '09:20', errorRate: 0.0, latencyP99: 45, tokenLossPct: 0.0, cpuLoad: 20 },
      { time: '09:40', errorRate: 0.2, latencyP99: 110, tokenLossPct: 2.0, cpuLoad: 65 },
      { time: '10:00', errorRate: 1.1, latencyP99: 480, tokenLossPct: 5.5, cpuLoad: 78 }
    ],
    runbook: {
      id: 'RB-PG-CANCEL-QUERY',
      name: 'PostgreSQL Standby Query Conflict Resolution',
      version: 'v1.2',
      estimatedMinutes: 2,
      riskLevel: 'LOW',
      steps: [
        {
          id: 'pg-1',
          stepNumber: 1,
          label: 'Inspect Offending Process State in pg_stat_activity',
          command: 'SELECT pid, query_start, state, query FROM pg_stat_activity WHERE pid = 14809;',
          description: 'Confirms query identity and duration before termination.',
          safetyGate: false,
          status: 'COMPLETED',
          durationMs: 120
        },
        {
          id: 'pg-2',
          stepNumber: 2,
          label: 'Cancel Backend with pg_cancel_backend(14809)',
          command: 'SELECT pg_cancel_backend(14809);',
          description: 'Gently terminates the read query allowing WAL recovery to resume instantly.',
          safetyGate: true,
          status: 'PENDING',
          durationMs: 0
        }
      ]
    },
    humanNotes: []
  },
  {
    id: 'INC-8920',
    title: 'gRPC Deadline Exceeded on order-fulfillment -> inventory-sync',
    severity: 'P2 - MEDIUM',
    status: 'MONITORING',
    service: 'order-fulfillment',
    cluster: 'us-east-prod-k8s',
    blastRadius: {
      affectedUsers: 8400,
      pctTraffic: 3.1,
      region: 'us-east-1',
      revenueImpactPerHour: '$2,400/hr',
      downstreamServices: ['warehouse-courier-api']
    },
    slaRemainingMinutes: 120,
    openedAt: '2h 40m ago',
    assignee: {
      name: 'Liam Zhang',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      role: 'Backend Systems Engineer',
      email: 'l.zhang@enterprise.corp'
    },
    cognitiveSynthesis: {
      summary: 'Intermittent gRPC DEADLINE_EXCEEDED errors between order fulfillment service and inventory lock system. Mitigated via autoscaling inventory replica set to 24 pods.',
      probableRootCause: 'Transient pod CPU throttling on inventory-sync due to kubernetes cgroup quota limits during 14k req/sec peak.',
      confidenceScore: 86.0,
      confidenceBreakdown: { rootCause: 86.0, blastRadius: 88.0, remediation: 94.0, evidenceGrounded: 90.0 },
      hypotheses: [],
      machineSuggestedRemediations: [],
      causalityFlow: []
    },
    evidenceProvenance: { memoryMatches: [], groundedCitations: [], kbArticles: [] },
    telemetryStream: [],
    metricsTimeline: [],
    runbook: { id: 'RB-SCALE-01', name: 'Auto-scale Pod Quotas', version: 'v1', estimatedMinutes: 1, riskLevel: 'LOW', steps: [] },
    humanNotes: []
  },
  {
    id: 'INC-8914',
    title: 'Edge SSL Certificate Expiry Alert on cdn-ingress-api',
    severity: 'P0 - CRITICAL',
    status: 'RESOLVED',
    service: 'cdn-ingress-api',
    cluster: 'global-edge-cloudflare',
    blastRadius: {
      affectedUsers: 0,
      pctTraffic: 0.0,
      region: 'Global Anycast',
      revenueImpactPerHour: '$0/hr',
      downstreamServices: ['all-public-endpoints']
    },
    slaRemainingMinutes: 0,
    openedAt: '5h ago',
    assignee: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Staff Incident Commander',
      email: 'e.rostova@enterprise.corp'
    },
    cognitiveSynthesis: {
      summary: 'ACME certificate renewal lock hung on distributed worker. CaseMind triggered automated runbook RB-CERT-RELOAD, renewing cert and updating edge caches in 48 seconds with 0 downtime.',
      probableRootCause: 'Redis distributed lock for certbot cron had expired TTL mismatch.',
      confidenceScore: 98.2,
      confidenceBreakdown: { rootCause: 98.2, blastRadius: 100.0, remediation: 99.0, evidenceGrounded: 99.0 },
      hypotheses: [],
      machineSuggestedRemediations: [],
      causalityFlow: []
    },
    evidenceProvenance: { memoryMatches: [], groundedCitations: [], kbArticles: [] },
    telemetryStream: [],
    metricsTimeline: [],
    runbook: { id: 'RB-CERT-01', name: 'ACME Cert Refresh', version: 'v3', estimatedMinutes: 1, riskLevel: 'LOW', steps: [] },
    humanNotes: []
  },
  {
    id: 'INC-8908',
    title: 'Elasticsearch Shard Allocation Failure in observability-logs',
    severity: 'P3 - LOW',
    status: 'RESOLVED',
    service: 'elasticsearch-cluster',
    cluster: 'aws-us-east-logging',
    blastRadius: {
      affectedUsers: 0,
      pctTraffic: 0.0,
      region: 'us-east-1',
      revenueImpactPerHour: '$0/hr',
      downstreamServices: ['internal-kibana']
    },
    slaRemainingMinutes: 0,
    openedAt: '8h ago',
    assignee: {
      name: 'David Tanaka',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Database Reliability Engineer',
      email: 'd.tanaka@enterprise.corp'
    },
    cognitiveSynthesis: {
      summary: 'Disk high watermark (85%) reached on elasticsearch node-data-04. Automated ILM (Index Lifecycle Management) rollover executed successfully.',
      probableRootCause: 'High debug log ingestion from testing cluster.',
      confidenceScore: 96.5,
      confidenceBreakdown: { rootCause: 96.5, blastRadius: 98.0, remediation: 97.0, evidenceGrounded: 98.0 },
      hypotheses: [],
      machineSuggestedRemediations: [],
      causalityFlow: []
    },
    evidenceProvenance: { memoryMatches: [], groundedCitations: [], kbArticles: [] },
    telemetryStream: [],
    metricsTimeline: [],
    runbook: { id: 'RB-ES-DISK-01', name: 'Elastic Disk Rollover', version: 'v2', estimatedMinutes: 2, riskLevel: 'LOW', steps: [] },
    humanNotes: []
  }
];

export const MOCK_GRAPH_NODES: GraphNode[] = [
  { id: 'auth-gateway-v2', name: 'auth-gateway-v2', type: 'SERVICE', severity: 'CRITICAL', x: 300, y: 150, metadata: 'P99: 4.8s | Error: 24.8%' },
  { id: 'redis-auth-primary', name: 'redis-auth-primary', type: 'DATABASE', severity: 'CRITICAL', x: 550, y: 150, metadata: 'Conn: 500/500 (100%)' },
  { id: 'INC-8942', name: 'INC-8942 (Current)', type: 'INCIDENT', severity: 'CRITICAL', x: 425, y: 50, metadata: 'P0 Critical | 94.6% Conf' },
  { id: 'INC-7102', name: 'INC-7102 (Black Friday)', type: 'INCIDENT', severity: 'HEALTHY', x: 750, y: 90, metadata: '96.4% Similarity match' },
  { id: 'RB-AUTH-FAILOVER-09', name: 'RB-AUTH-FAILOVER-09', type: 'RUNBOOK', severity: 'HEALTHY', x: 425, y: 260, metadata: 'Verified Auto-Runbook' },
  { id: 'user-profile-svc', name: 'user-profile-svc', type: 'SERVICE', severity: 'WARN', x: 120, y: 240, metadata: 'Downstream Auth Dependency' },
  { id: 'billing-checkout', name: 'billing-checkout', type: 'SERVICE', severity: 'WARN', x: 140, y: 90, metadata: 'Payment Token Hangs' },
  { id: 'kafka-cluster', name: 'kafka-payment-events', type: 'SERVICE', severity: 'WARN', x: 260, y: 350, metadata: 'Partition 12 Lag: 45k' },
  { id: 'pg-replica-eu-03', name: 'pg-replica-eu-03', type: 'DATABASE', severity: 'WARN', x: 600, y: 340, metadata: 'WAL Lag: 485s' }
];

export const MOCK_GRAPH_EDGES: GraphEdge[] = [
  { from: 'auth-gateway-v2', to: 'redis-auth-primary', label: 'pool starvation (500/500)', highlighted: true },
  { from: 'INC-8942', to: 'auth-gateway-v2', label: 'targets', highlighted: true },
  { from: 'INC-8942', to: 'INC-7102', label: 'vector similarity 96.4%', highlighted: true },
  { from: 'INC-8942', to: 'RB-AUTH-FAILOVER-09', label: 'suggests remediation', highlighted: true },
  { from: 'user-profile-svc', to: 'auth-gateway-v2', label: 'depends on' },
  { from: 'billing-checkout', to: 'auth-gateway-v2', label: 'token validation' },
  { from: 'kafka-cluster', to: 'billing-checkout', label: 'event bus' },
  { from: 'pg-replica-eu-03', to: 'user-profile-svc', label: 'read replica' }
];
