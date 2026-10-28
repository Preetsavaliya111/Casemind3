import React from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Activity,
  Layers
} from 'lucide-react';

export const OperationsAnalytics: React.FC = () => {
  const serviceFleet = [
    { name: 'auth-gateway-v2', status: 'DEGRADED', uptime: '99.42%', p99: '4,820ms', incidents30d: 3, tier: 'Tier-1' },
    { name: 'billing-checkout', status: 'HEALTHY', uptime: '99.99%', p99: '84ms', incidents30d: 1, tier: 'Tier-1' },
    { name: 'user-profile-svc', status: 'HEALTHY', uptime: '99.98%', p99: '42ms', incidents30d: 0, tier: 'Tier-2' },
    { name: 'payment-consumer', status: 'DEGRADED', uptime: '99.85%', p99: '1,850ms', incidents30d: 2, tier: 'Tier-1' },
    { name: 'order-fulfillment', status: 'HEALTHY', uptime: '99.95%', p99: '110ms', incidents30d: 1, tier: 'Tier-1' },
    { name: 'pg-replica-eu-03', status: 'DEGRADED', uptime: '99.70%', p99: '480ms', incidents30d: 2, tier: 'Tier-2' },
    { name: 'cdn-ingress-api', status: 'HEALTHY', uptime: '100.00%', p99: '18ms', incidents30d: 1, tier: 'Tier-1' },
    { name: 'elasticsearch-logs', status: 'HEALTHY', uptime: '99.92%', p99: '65ms', incidents30d: 1, tier: 'Tier-3' }
  ];

  const vulnerabilityClusters = [
    { title: 'Token Cache Expiration Thundering Herds', count: 5, risk: 'HIGH', avgMTTD: '2.8m', service: 'auth-gateway-v2', status: 'Remediation in Progress' },
    { title: 'PostgreSQL Read-Replica WAL Lock Starvation', count: 4, risk: 'HIGH', avgMTTD: '3.4m', service: 'pg-replica-eu-03', status: 'Runbook Verified' },
    { title: 'Kafka Consumer Heartbeat Timeout Poison Pills', count: 3, risk: 'MEDIUM', avgMTTD: '4.1m', service: 'payment-consumer', status: 'DLQ Bypass Applied' },
    { title: 'Kubernetes Pod CPU Throttling Under Burst', count: 2, risk: 'LOW', avgMTTD: '1.9m', service: 'order-fulfillment', status: 'Auto-scaled' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-[#eaedff] text-[#3525cd]">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-[#131b2e]">
                Operations Executive & Cognitive Telemetry
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#464555]">
              Real-time measurement of CaseMind RCA accuracy, MTTD reduction, engineering cognitive load, and systemic failure clusters.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono bg-[#f2f3ff] px-3 py-1.5 rounded-lg border border-[#dae2fd]">
            <Clock className="w-3.5 h-3.5 text-[#3525cd]" />
            <span>Reporting Interval: Last 30 Days</span>
          </div>
        </div>
      </div>

      {/* 4 KPI Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#dae2fd] shadow-xs space-y-2">
          <span className="text-xs font-semibold text-[#464555] uppercase tracking-wider block">
            MTTD Reduction
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-[#3525cd]">-68.4%</span>
            <span className="text-xs font-semibold text-[#059669] flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              3.2m avg
            </span>
          </div>
          <p className="text-xs text-[#464555]">
            Down from 24.1 mins industry baseline before CaseMind deployment.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#dae2fd] shadow-xs space-y-2">
          <span className="text-xs font-semibold text-[#464555] uppercase tracking-wider block">
            Auto-Triage Precision
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-[#0891b2]">94.6%</span>
            <span className="text-xs font-semibold text-[#059669] flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +2.1% MoM
            </span>
          </div>
          <p className="text-xs text-[#464555]">
            Benchmarked against 1,240 post-incident engineer reviews.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#dae2fd] shadow-xs space-y-2">
          <span className="text-xs font-semibold text-[#464555] uppercase tracking-wider block">
            Operator Override Rate
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-[#7c3aed]">1.9%</span>
            <span className="text-xs font-semibold text-[#059669]">Ultra-Low</span>
          </div>
          <p className="text-xs text-[#464555]">
            98.1% of machine hypotheses accepted without human correction.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#dae2fd] shadow-xs space-y-2">
          <span className="text-xs font-semibold text-[#464555] uppercase tracking-wider block">
            Tier-3 Hours Saved
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-[#059669]">428h</span>
            <span className="text-xs font-mono text-[#464555]">this month</span>
          </div>
          <p className="text-xs text-[#464555]">
            Equivalent to 2.4 full-time staff SREs on investigation toil.
          </p>
        </div>
      </div>

      {/* Systemic Vulnerability Clusters & Microservice Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recurring Systemic Failure Clusters */}
        <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono">
              Recurring Systemic Vulnerability Clusters
            </h3>
            <span className="text-xs text-[#3525cd] font-mono">4 Detected</span>
          </div>

          <div className="space-y-3">
            {vulnerabilityClusters.map((cluster, i) => (
              <div key={i} className="p-3.5 rounded-lg bg-[#faf8ff] border border-[#eaedff] space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#131b2e]">{cluster.title}</h4>
                    <p className="text-[11px] font-mono text-[#464555] mt-0.5">
                      Service: <code className="text-[#3525cd]">{cluster.service}</code> · Recurrence: {cluster.count}x
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    cluster.risk === 'HIGH' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {cluster.risk}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[#464555] border-t border-[#f2f3ff]">
                  <span>Avg MTTD: <strong>{cluster.avgMTTD}</strong></span>
                  <span className="text-[#059669]">{cluster.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Microservice Fleet Reliability Grid */}
        <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono">
              Production Service Fleet Reliability
            </h3>
            <span className="text-xs text-[#059669] font-mono">8 Monitored</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#eaedff] text-[#777587]">
                  <th className="pb-2 font-semibold">Service</th>
                  <th className="pb-2 font-semibold">Tier</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">P99</th>
                  <th className="pb-2 font-semibold">SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f3ff]">
                {serviceFleet.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#faf8ff]">
                    <td className="py-2.5 font-bold text-[#131b2e]">{s.name}</td>
                    <td className="py-2.5 text-[#777587]">{s.tier}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'HEALTHY' 
                          ? 'bg-emerald-50 text-[#059669]' 
                          : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-[#464555]">{s.p99}</td>
                    <td className="py-2.5 font-bold text-[#131b2e]">{s.uptime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
