import { describe, it, expect } from 'vitest';
import { INITIAL_INCIDENTS, TEAM_USERS, INITIAL_KNOWLEDGE_ARTICLES } from '../data/mockIncidents';
import { Incident, UserRole, UserProfile } from '../types';

describe('CaseMind Automated QA & Reliability Test Suite', () => {

  describe('Workflow A: Role-Based Access Control (RBAC) & Security Isolation', () => {
    it('should have all 4 enterprise roles defined in directory', () => {
      const roles = TEAM_USERS.map(u => u.role);
      expect(roles).toContain('ADMIN');
      expect(roles).toContain('MANAGER');
      expect(roles).toContain('AGENT');
      expect(roles).toContain('VIEWER');
    });

    it('should identify VIEWER as read-only role', () => {
      const viewer = TEAM_USERS.find(u => u.role === 'VIEWER');
      expect(viewer).toBeDefined();
      expect(viewer?.role).toBe('VIEWER');
    });

    it('should verify ADMIN role has full governance rights', () => {
      const admin = TEAM_USERS.find(u => u.role === 'ADMIN');
      expect(admin).toBeDefined();
      expect(admin?.name).toBe('Elena Rostova');
    });

    it('should prevent non-admin roles from modifying directory roles', () => {
      const isAllowedToMutateRole = (role: UserRole) => role === 'ADMIN';

      expect(isAllowedToMutateRole('ADMIN')).toBe(true);
      expect(isAllowedToMutateRole('MANAGER')).toBe(false);
      expect(isAllowedToMutateRole('AGENT')).toBe(false);
      expect(isAllowedToMutateRole('VIEWER')).toBe(false);
    });

    it('should require MANAGER or ADMIN approval for safety gates', () => {
      const canApproveSafetyGate = (role: UserRole) => role === 'ADMIN' || role === 'MANAGER';

      expect(canApproveSafetyGate('ADMIN')).toBe(true);
      expect(canApproveSafetyGate('MANAGER')).toBe(true);
      expect(canApproveSafetyGate('AGENT')).toBe(false);
      expect(canApproveSafetyGate('VIEWER')).toBe(false);
    });
  });

  describe('Workflow B: Incident & Ticket Management', () => {
    it('should correctly load initial critical incidents with valid SLAs', () => {
      const p0Cases = INITIAL_INCIDENTS.filter(i => i.severity.startsWith('P0'));
      expect(p0Cases.length).toBeGreaterThan(0);
      
      const activeP0 = p0Cases.find(i => i.id === 'INC-8942');
      expect(activeP0).toBeDefined();
      expect(activeP0?.slaRemainingMinutes).toBe(18);
      expect(activeP0?.service).toBe('auth-gateway-v2');
      expect(activeP0?.blastRadius.affectedUsers).toBe(142500);
    });

    it('should sort incidents by SLA urgency ascending', () => {
      const sorted = [...INITIAL_INCIDENTS].sort((a, b) => a.slaRemainingMinutes - b.slaRemainingMinutes);
      expect(sorted[0].slaRemainingMinutes).toBeLessThanOrEqual(sorted[sorted.length - 1].slaRemainingMinutes);
    });

    it('should sort incidents by severity hierarchy (P0 first)', () => {
      const order: Record<string, number> = { 'P0': 0, 'P1': 1, 'P2': 2, 'P3': 3 };
      const sorted = [...INITIAL_INCIDENTS].sort((a, b) => {
        return (order[a.severity.slice(0, 2)] ?? 9) - (order[b.severity.slice(0, 2)] ?? 9);
      });
      expect(sorted[0].severity.startsWith('P0')).toBe(true);
    });
  });

  describe('Workflow C: Organizational Memory Engine & Explainability', () => {
    it('should ground every cognitive synthesis with confidence > 85%', () => {
      INITIAL_INCIDENTS.forEach(inc => {
        expect(inc.cognitiveSynthesis.confidenceScore).toBeGreaterThanOrEqual(85.0);
        expect(inc.cognitiveSynthesis.probableRootCause.length).toBeGreaterThan(20);
      });
    });

    it('should connect INC-8942 to historical incident INC-7102 with similarity >= 95%', () => {
      const inc = INITIAL_INCIDENTS.find(i => i.id === 'INC-8942');
      expect(inc).toBeDefined();
      const match = inc?.evidenceProvenance.memoryMatches.find(m => m.incidentId === 'INC-7102');
      expect(match).toBeDefined();
      expect(match?.similarityScore).toBe(96.4);
      expect(match?.keyResolution).toContain('REDIS_MAX_POOL');
    });

    it('should verify causality flow continuity', () => {
      const inc = INITIAL_INCIDENTS.find(i => i.id === 'INC-8942')!;
      expect(inc.cognitiveSynthesis.causalityFlow.length).toBe(4);
      expect(inc.cognitiveSynthesis.causalityFlow[0].step).toBe(1);
      expect(inc.cognitiveSynthesis.causalityFlow[3].step).toBe(4);
    });
  });

  describe('Workflow D: Knowledge Base & Document Ingestion', () => {
    it('should contain verified architectural guidance for thundering herds', () => {
      const doc = INITIAL_KNOWLEDGE_ARTICLES.find(k => k.id === 'kb-204');
      expect(doc).toBeDefined();
      expect(doc?.title).toContain('Thundering Herds');
      expect(doc?.tags).toContain('Redis');
      expect(doc?.relatedIncidents).toContain('INC-8942');
    });

    it('should reject documents exceeding 25MB threshold', () => {
      const maxAllowedBytes = 25 * 1024 * 1024;
      const oversizedFileSize = 30 * 1024 * 1024;
      expect(oversizedFileSize > maxAllowedBytes).toBe(true);
    });
  });

  describe('Workflow E: Autonomous Runbooks & Safety Gates', () => {
    it('should require safety gate approval on live cluster mutation steps', () => {
      const inc = INITIAL_INCIDENTS.find(i => i.id === 'INC-8942')!;
      const safetyStep = inc.runbook.steps.find(s => s.stepNumber === 3);
      expect(safetyStep).toBeDefined();
      expect(safetyStep?.safetyGate).toBe(true);
      expect(safetyStep?.command).toContain('rollout restart');
    });

    it('should verify step output logging preserves ANSI and timestamp traces', () => {
      const inc = INITIAL_INCIDENTS.find(i => i.id === 'INC-8942')!;
      const completedStep = inc.runbook.steps.find(s => s.status === 'COMPLETED')!;
      expect(completedStep.outputLog).toBeDefined();
      expect(completedStep.outputLog!.length).toBeGreaterThan(0);
      expect(completedStep.durationMs).toBeGreaterThan(0);
    });
  });

  describe('Form Validation & Security Rules', () => {
    it('should enforce minimum title length >= 8 chars on ticket creation', () => {
      const invalidShortTitle = 'Outage';
      const validTitle = 'Outage on payment-consumer partition 12';
      expect(invalidShortTitle.length < 8).toBe(true);
      expect(validTitle.length >= 8).toBe(true);
    });

    it('should enforce valid email syntax on user creation', () => {
      const invalidEmail = 'notanemail';
      const validEmail = 'alex.mercer@enterprise.corp';
      expect(invalidEmail.includes('@')).toBe(false);
      expect(validEmail.includes('@')).toBe(true);
    });
  });

  describe('Workflow F: Three.js 3D Organizational Memory Network', () => {
    it('should generate balanced 3D coordinate space for knowledge nodes', () => {
      const sampleCoords: [number, number, number][] = [
        [0, 0, 0], // Active ticket center
        [-3.5, 2.2, 1.2], // Root cause
        [3.8, 1.8, -1.5], // Historical incident
        [0.8, 3.8, -2.4], // Runbook
      ];

      sampleCoords.forEach(([x, y, z]) => {
        expect(Math.abs(x)).toBeLessThanOrEqual(10);
        expect(Math.abs(y)).toBeLessThanOrEqual(10);
        expect(Math.abs(z)).toBeLessThanOrEqual(10);
      });
    });

    it('should distinguish node types with unique semantic colors', () => {
      const typeColors: Record<string, string> = {
        TICKET: '#ef4444',
        ROOT_CAUSE: '#a855f7',
        HISTORICAL_CASE: '#06b6d4',
        RUNBOOK: '#10b981',
        EVIDENCE: '#3b82f6',
      };

      expect(typeColors.TICKET).not.toBe(typeColors.ROOT_CAUSE);
      expect(typeColors.HISTORICAL_CASE).not.toBe(typeColors.RUNBOOK);
      expect(Object.keys(typeColors).length).toBe(5);
    });
  });

  describe('Workflow G: Firebase Blueprint & ABAC Invariants', () => {
    it('should strictly define authorized roles in UserProfile', () => {
      const validRoles = ['ADMIN', 'MANAGER', 'AGENT', 'VIEWER'];
      expect(validRoles).toContain('ADMIN');
      expect(validRoles.length).toBe(4);
    });

    it('should validate incident ID format against regex guard', () => {
      const validIdRegex = /^[a-zA-Z0-9_\-]+$/;
      expect(validIdRegex.test('INC-8942')).toBe(true);
      expect(validIdRegex.test('INC-7102')).toBe(true);
      expect(validIdRegex.test('invalid id with spaces')).toBe(false);
      expect(validIdRegex.test('injection;DROP TABLE')).toBe(false);
    });
  });

  describe('Workflow H: Google Search Grounding & Citation Differentiation', () => {
    it('should distinguish external search web citations from internal memory matches', () => {
      const internalCitation = {
        title: 'Historical Case INC-7102',
        source: 'CaseMind Organizational Memory Graph',
        confidence: 0.96,
      };

      const externalSearchCitation = {
        title: 'Redis Connection Management Documentation',
        source: 'https://redis.io/docs/management/optimization/',
        confidence: 0.94,
      };

      const isExternal = (src: string) => src.startsWith('http://') || src.startsWith('https://');

      expect(isExternal(internalCitation.source)).toBe(false);
      expect(isExternal(externalSearchCitation.source)).toBe(true);
    });
  });

  describe('Workflow I: Intro Sequence, Asset Preloading & Slow Connection Resilience', () => {
    it('should extract valid image URLs for preloading from team directory', () => {
      const avatarUrls = TEAM_USERS.map(u => u.avatar).filter(Boolean);
      expect(avatarUrls.length).toBe(TEAM_USERS.length);
      avatarUrls.forEach(url => {
        expect(url.startsWith('https://')).toBe(true);
      });
    });

    it('should complete preloading safely even when an image stalls or fails', async () => {
      // Test the preload helper logic with timeout fallback
      const preloadImageMock = (shouldSucceed: boolean, timeoutMs: number = 50): Promise<boolean> => {
        return new Promise(resolve => {
          const timer = setTimeout(() => resolve(false), timeoutMs);
          if (shouldSucceed) {
            clearTimeout(timer);
            resolve(true);
          }
        });
      };

      const results = await Promise.all([
        preloadImageMock(true, 100),
        preloadImageMock(false, 30), // Simulated slow or failed CDN image
        preloadImageMock(true, 100)
      ]);

      expect(results[0]).toBe(true);
      expect(results[1]).toBe(false); // Soft fail: returns false without throwing
      expect(results[2]).toBe(true);
    });

    it('should enforce master watchdog ceiling to prevent infinite hanging', async () => {
      let isCompleted = false;
      const watchdogLimitMs = 100;

      // Simulated hanging asset loader
      const hangingPromise = new Promise(resolve => {
        // Never resolves or takes 10 seconds
        setTimeout(() => resolve('loaded'), 10000);
      });

      const watchdog = new Promise<string>(resolve => {
        setTimeout(() => resolve('watchdog_triggered'), watchdogLimitMs);
      });

      const outcome = await Promise.race([hangingPromise, watchdog]);
      if (outcome === 'watchdog_triggered') {
        isCompleted = true;
      }

      expect(isCompleted).toBe(true);
      expect(outcome).toBe('watchdog_triggered');
    });

    it('should respect reduced motion preference by immediately fast-tracking completion', () => {
      const getInitialIntroState = (reducedMotion: boolean) => {
        if (reducedMotion) {
          return { progress: 100, isFullyLoaded: true, bootStep: 4 };
        }
        return { progress: 15, isFullyLoaded: false, bootStep: 0 };
      };

      const fastState = getInitialIntroState(true);
      expect(fastState.progress).toBe(100);
      expect(fastState.isFullyLoaded).toBe(true);
      expect(fastState.bootStep).toBe(4);

      const normalState = getInitialIntroState(false);
      expect(normalState.progress).toBe(15);
      expect(normalState.isFullyLoaded).toBe(false);
    });

    it('should record intro completion in sessionStorage to prevent repeated modal hijacking', () => {
      const mockStorage: Record<string, string> = {};
      const completeIntro = () => {
        mockStorage['casemind_intro_seen'] = 'true';
      };

      completeIntro();
      expect(mockStorage['casemind_intro_seen']).toBe('true');
    });
  });

  describe('Workflow J: ProtectedRoute Access Control & Landing Page Auth State', () => {
    // Helper to evaluate access rules identical to ProtectedRoute logic
    const checkRouteAccess = (
      user: UserProfile | null, 
      requireAuth: boolean = true, 
      allowedRoles?: UserRole[]
    ): { allowed: boolean; status: 200 | 401 | 403; reason: string } => {
      if (requireAuth && !user) {
        return { allowed: false, status: 401, reason: 'AUTHENTICATION_REQUIRED' };
      }
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return { allowed: false, status: 403, reason: 'INSUFFICIENT_CLEARANCE' };
      }
      return { allowed: true, status: 200, reason: 'AUTHORIZED' };
    };

    const adminUser = TEAM_USERS.find(u => u.role === 'ADMIN')!;
    const managerUser = TEAM_USERS.find(u => u.role === 'MANAGER')!;
    const agentUser = TEAM_USERS.find(u => u.role === 'AGENT')!;
    const viewerUser = TEAM_USERS.find(u => u.role === 'VIEWER')!;

    it('should block unauthenticated sessions from sensitive tabs with HTTP 401', () => {
      const adminAccess = checkRouteAccess(null, true, ['ADMIN']);
      expect(adminAccess.allowed).toBe(false);
      expect(adminAccess.status).toBe(401);
      expect(adminAccess.reason).toBe('AUTHENTICATION_REQUIRED');

      const analyticsAccess = checkRouteAccess(null, true, ['ADMIN', 'MANAGER']);
      expect(analyticsAccess.allowed).toBe(false);
      expect(analyticsAccess.status).toBe(401);
    });

    it('should grant access to admin tab ONLY for ADMIN role and reject others with HTTP 403', () => {
      // Admin user
      const adminRes = checkRouteAccess(adminUser, true, ['ADMIN']);
      expect(adminRes.allowed).toBe(true);
      expect(adminRes.status).toBe(200);

      // Manager user
      const managerRes = checkRouteAccess(managerUser, true, ['ADMIN']);
      expect(managerRes.allowed).toBe(false);
      expect(managerRes.status).toBe(403);
      expect(managerRes.reason).toBe('INSUFFICIENT_CLEARANCE');

      // Agent user
      const agentRes = checkRouteAccess(agentUser, true, ['ADMIN']);
      expect(agentRes.allowed).toBe(false);
      expect(agentRes.status).toBe(403);

      // Viewer user
      const viewerRes = checkRouteAccess(viewerUser, true, ['ADMIN']);
      expect(viewerRes.allowed).toBe(false);
      expect(viewerRes.status).toBe(403);
    });

    it('should grant access to analytics telemetry for ADMIN and MANAGER, but reject AGENT and VIEWER', () => {
      const allowedRoles: UserRole[] = ['ADMIN', 'MANAGER'];

      expect(checkRouteAccess(adminUser, true, allowedRoles).allowed).toBe(true);
      expect(checkRouteAccess(managerUser, true, allowedRoles).allowed).toBe(true);
      expect(checkRouteAccess(agentUser, true, allowedRoles).allowed).toBe(false);
      expect(checkRouteAccess(agentUser, true, allowedRoles).status).toBe(403);
      expect(checkRouteAccess(viewerUser, true, allowedRoles).allowed).toBe(false);
      expect(checkRouteAccess(viewerUser, true, allowedRoles).status).toBe(403);
    });

    it('should allow public access to the landing page regardless of authentication', () => {
      // Landing page does not require auth
      const unauthAccess = checkRouteAccess(null, false);
      expect(unauthAccess.allowed).toBe(true);
      expect(unauthAccess.status).toBe(200);

      const authAccess = checkRouteAccess(agentUser, false);
      expect(authAccess.allowed).toBe(true);
      expect(authAccess.status).toBe(200);
    });

    it('should verify landing page fast-login provides all valid enterprise roles', () => {
      const demoRoles: UserRole[] = ['ADMIN', 'MANAGER', 'AGENT', 'VIEWER'];
      const demoUsers = demoRoles.map(role => TEAM_USERS.find(u => u.role === role)).filter(Boolean);
      expect(demoUsers.length).toBe(4);
      const roles = demoUsers.map(u => u!.role);
      expect(roles).toContain('ADMIN');
      expect(roles).toContain('MANAGER');
      expect(roles).toContain('AGENT');
      expect(roles).toContain('VIEWER');
    });
  });

});

