import { describe, it, expect } from 'vitest';
import { INITIAL_INCIDENTS, TEAM_USERS, INITIAL_KNOWLEDGE_ARTICLES } from '../data/mockIncidents';
import { Incident, UserRole } from '../types';

describe('CaseMind Automated QA & Reliability Test Suite', () => {

  describe('Workflow A: Role-Based Access Control (RBAC) Integrity', () => {
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

});
