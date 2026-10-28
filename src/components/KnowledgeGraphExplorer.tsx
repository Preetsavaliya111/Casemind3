import React, { useState } from 'react';
import { MOCK_GRAPH_NODES, MOCK_GRAPH_EDGES } from '../data/mockIncidents';
import { GraphNode, GraphEdge } from '../types';
import { 
  Network, 
  Search, 
  Layers, 
  GitBranch, 
  Database, 
  FileText, 
  Sparkles,
  Zap,
  Info,
  Box
} from 'lucide-react';
import { ThreeMemoryScene } from './ThreeMemoryScene';

export const KnowledgeGraphExplorer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(MOCK_GRAPH_NODES[0]);
  const [nodeFilter, setNodeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [graphMode, setGraphMode] = useState<'3D' | '2D'>('3D');

  const filteredNodes = MOCK_GRAPH_NODES.filter(node => {
    const matchesFilter = nodeFilter === 'ALL' || node.type === nodeFilter;
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.metadata && node.metadata.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getNodeColor = (node: GraphNode) => {
    if (node.type === 'INCIDENT') return '#ba1a1a';
    if (node.type === 'DATABASE') return '#0891b2';
    if (node.type === 'RUNBOOK') return '#059669';
    return '#4f46e5';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-cyan-100 text-[#006077]">
                <Network className="w-5 h-5 text-[#0891b2]" />
              </span>
              <h2 className="text-lg font-bold text-[#131b2e]">
                Organizational Memory & Dependency Topology Graph
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#464555]">
              Real-time causal graph linking live telemetry, historical incidents (vector embeddings), service mesh dependencies, and verified runbooks.
            </p>
          </div>

          {/* View mode switcher and Filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 bg-[#eaedff] rounded-lg border border-[#c3c0ff]">
              <button
                onClick={() => setGraphMode('3D')}
                className={`px-3 py-1 text-xs font-mono font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  graphMode === '3D'
                    ? 'bg-[#3525cd] text-white shadow-xs'
                    : 'text-[#464555] hover:text-[#131b2e]'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                3D Spatial Graph
              </button>
              <button
                onClick={() => setGraphMode('2D')}
                className={`px-3 py-1 text-xs font-mono font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  graphMode === '2D'
                    ? 'bg-[#3525cd] text-white shadow-xs'
                    : 'text-[#464555] hover:text-[#131b2e]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                2D Topo Schema
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {['ALL', 'SERVICE', 'DATABASE', 'INCIDENT', 'RUNBOOK'].map(type => (
                <button
                  key={type}
                  onClick={() => setNodeFilter(type)}
                  className={`px-2 py-1 text-xs font-mono rounded-md transition-colors ${
                    nodeFilter === type 
                      ? 'bg-[#131b2e] text-white' 
                      : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777587]" />
          <input
            type="text"
            placeholder="Search organizational memory by microservice, failure pattern, or runbook..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd] focus:bg-white transition-all font-mono"
          />
        </div>
      </div>

      {/* Main Graph Canvas and Inspector Layout */}
      {graphMode === '3D' ? (
        <ThreeMemoryScene
          heightClass="h-[640px]"
          onSelectNode={(nodeId) => {
            const match = MOCK_GRAPH_NODES.find(n => n.id === nodeId);
            if (match) setSelectedNode(match);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SVG Graph Viewport */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#dae2fd] p-4 shadow-xs relative overflow-hidden min-h-[480px]">
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 text-xs font-mono bg-[#131b2e] text-[#dad7ff] px-3 py-1.5 rounded-lg shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Interactive 2D Schema · Click node to inspect</span>
            </div>

          {/* SVG Canvas */}
          <svg className="w-full h-[450px] select-none" viewBox="0 0 850 420">
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#777587" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#7c3aed" />
              </marker>
            </defs>

            {/* Background grid pattern */}
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f2f3ff" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Edges */}
            {MOCK_GRAPH_EDGES.map((edge, idx) => {
              const sourceNode = MOCK_GRAPH_NODES.find(n => n.id === edge.from);
              const targetNode = MOCK_GRAPH_NODES.find(n => n.id === edge.to);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted = edge.highlighted || (selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to));

              return (
                <g key={idx}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHighlighted ? '#7c3aed' : '#c7c4d8'}
                    strokeWidth={isHighlighted ? '2.5' : '1.5'}
                    strokeDasharray={edge.label.includes('similarity') ? '4 4' : undefined}
                    markerEnd={isHighlighted ? 'url(#arrow-active)' : 'url(#arrow)'}
                    className="transition-all"
                  />
                  {/* Label */}
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2 - 6}
                    fill={isHighlighted ? '#5c00ca' : '#777587'}
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                    className="bg-white px-1"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const nodeColor = getNodeColor(node);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Pulse ring if critical */}
                  {node.severity === 'CRITICAL' && (
                    <circle
                      r="24"
                      fill="none"
                      stroke="#ba1a1a"
                      strokeWidth="1.5"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer circle */}
                  <circle
                    r="18"
                    fill={isSelected ? nodeColor : '#ffffff'}
                    stroke={nodeColor}
                    strokeWidth={isSelected ? '3' : '2'}
                    className="transition-all group-hover:scale-110 shadow-md"
                  />

                  {/* Inner icon symbol */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill={isSelected ? '#ffffff' : nodeColor}
                    fontSize="11"
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                  >
                    {node.type[0]}
                  </text>

                  {/* Node Name Label */}
                  <text
                    textAnchor="middle"
                    y="32"
                    fill="#131b2e"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    fontWeight="600"
                    className="bg-white/80"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Inspector Drawer */}
        <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
            <h3 className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono flex items-center">
              <Info className="w-4 h-4 mr-1 text-[#3525cd]" />
              Memory Node Inspector
            </h3>
            {selectedNode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#eaedff] text-[#3525cd]">
                {selectedNode.type}
              </span>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-[#131b2e]">
                  {selectedNode.name}
                </h4>
                <p className="text-xs font-mono text-[#464555] mt-1">
                  ID: <code className="text-[#3525cd] font-semibold">{selectedNode.id}</code>
                </p>
              </div>

              {selectedNode.metadata && (
                <div className="p-3 rounded-lg bg-[#faf8ff] border border-[#dae2fd] text-xs font-mono text-[#131b2e]">
                  <span className="text-[10px] text-[#777587] block uppercase">Live Telemetry State</span>
                  <span className="font-semibold text-[#7c3aed] mt-0.5 block">{selectedNode.metadata}</span>
                </div>
              )}

              {/* Connected edges list */}
              <div>
                <span className="text-xs font-bold text-[#464555] uppercase tracking-wider font-mono block mb-2">
                  Active Dependencies & Links
                </span>
                <div className="space-y-2">
                  {MOCK_GRAPH_EDGES.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((e, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#f2f3ff] border border-[#eaedff] text-xs font-mono flex items-center justify-between">
                      <span className="text-[#131b2e]">
                        {e.from === selectedNode.id ? `→ ${e.to}` : `← ${e.from}`}
                      </span>
                      <span className="text-[10px] text-[#7c3aed] bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                        {e.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cognitive recommendation for this node */}
              <div className="p-3 rounded-lg bg-[#f0fdfa] border border-[#76dcff] text-xs space-y-1">
                <span className="font-bold text-[#006077] flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-[#0891b2]" />
                  Organizational Memory Note
                </span>
                <p className="text-[#004e61] text-[11px] leading-relaxed">
                  Node exhibits tight coupling with auth-gateway-v2 during high-throughput JWT validation. Recommended runbook: <strong className="font-mono">RB-AUTH-FAILOVER-09</strong>.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#777587] italic">Select a node from the canvas to inspect dependencies and past incidents.</p>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
