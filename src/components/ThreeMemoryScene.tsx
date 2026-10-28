import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  Maximize2, 
  RotateCcw, 
  Filter, 
  Layers, 
  Play, 
  Pause, 
  Sparkles, 
  ExternalLink, 
  Info,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Activity
} from 'lucide-react';
import { Incident } from '../types';

export interface MemoryNodeData {
  id: string;
  name: string;
  type: 'TICKET' | 'HISTORICAL_CASE' | 'ROOT_CAUSE' | 'EVIDENCE' | 'RUNBOOK';
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  similarity?: number;
  description: string;
  metadata?: string;
  category?: string;
  pos: [number, number, number];
}

interface MemoryLinkData {
  source: string;
  target: string;
  label: string;
  confidence: number;
}

interface ThreeMemorySceneProps {
  activeIncident?: Incident | null;
  onSelectNode?: (nodeId: string, nodeType: string) => void;
  heightClass?: string;
}

export const ThreeMemoryScene: React.FC<ThreeMemorySceneProps> = ({
  activeIncident,
  onSelectNode,
  heightClass = 'h-[600px]',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<MemoryNodeData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MemoryNodeData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  // Transform incident into rich 3D nodes & links
  const { nodes, links } = useMemo(() => {
    const rawNodes: MemoryNodeData[] = [
      {
        id: activeIncident?.id || 'INC-7102',
        name: activeIncident?.title || 'Gateway 504 Timeout Cascade',
        type: 'TICKET',
        severity: 'CRITICAL',
        description: activeIncident?.cognitiveSynthesis?.summary || 'Active production outage with 240,000 affected users and Redis connection exhaustion.',
        category: activeIncident?.service || 'checkout-gateway',
        metadata: 'Current Incident (P0)',
        pos: [0, 0, 0],
      },
      {
        id: 'RC-1',
        name: 'Redis ConnPool Depletion',
        type: 'ROOT_CAUSE',
        severity: 'CRITICAL',
        description: 'Exhaustion of socket pool max_connections=50 under flash traffic spike.',
        category: 'Infrastructural Defect',
        metadata: 'Confidence 96.4%',
        pos: [-3.5, 2.2, 1.2],
      },
      {
        id: 'INC-6819',
        name: 'INC-6819: Payment Broker Lockout',
        type: 'HISTORICAL_CASE',
        severity: 'HIGH',
        similarity: 0.94,
        description: 'Historical outage resolved by adjusting TCP keep-alive and increasing Redis connection queue.',
        category: 'Resolved 14 days ago',
        metadata: 'Author: Elena Rostova',
        pos: [3.8, 1.8, -1.5],
      },
      {
        id: 'INC-5541',
        name: 'INC-5541: Auth Cluster Throttling',
        type: 'HISTORICAL_CASE',
        severity: 'MEDIUM',
        similarity: 0.88,
        description: 'High thread contention resolved via dynamic cluster rebalance.',
        category: 'Resolved 45 days ago',
        metadata: 'Author: David Kim',
        pos: [2.5, -2.8, 2.0],
      },
      {
        id: 'EVD-SPAN-901',
        name: 'Span [checkout_redis_checkout]',
        type: 'EVIDENCE',
        description: 'Distributed trace showing 12.8s wait duration on client connection checkout.',
        category: 'Telemetry Trace',
        metadata: 'Source: OpenTelemetry OTLP',
        pos: [-2.8, -2.2, -1.8],
      },
      {
        id: 'EVD-LOG-404',
        name: 'Log: dial tcp connection timed out',
        type: 'EVIDENCE',
        description: 'Correlated pod log event occurring 48 times across us-east-2.',
        category: 'Log Cluster',
        metadata: 'Source: Datadog / FluentBit',
        pos: [-4.2, 0.4, -2.2],
      },
      {
        id: 'RBK-AUTONOMOUS',
        name: 'Automated Pool Drain & Scale',
        type: 'RUNBOOK',
        description: 'Drain starved instances and dynamically expand Redis proxy worker pool to 120.',
        category: 'Executable Runbook',
        metadata: 'Target Recovery: 3.5 min',
        pos: [0.8, 3.8, -2.4],
      },
      {
        id: 'KB-882',
        name: 'Confluence SRE-109: Redis Triage',
        type: 'HISTORICAL_CASE',
        similarity: 0.82,
        description: 'Operational standard procedure for Redis sentinel failover and client pooling.',
        category: 'Knowledge Base',
        metadata: 'Verified SOP',
        pos: [4.4, -0.6, 1.6],
      },
    ];

    const rawLinks: MemoryLinkData[] = [
      { source: activeIncident?.id || 'INC-7102', target: 'RC-1', label: 'Inferred Root Cause', confidence: 0.96 },
      { source: activeIncident?.id || 'INC-7102', target: 'INC-6819', label: 'Semantic Topology Match', confidence: 0.94 },
      { source: activeIncident?.id || 'INC-7102', target: 'INC-5541', label: 'Secondary Match', confidence: 0.88 },
      { source: 'RC-1', target: 'EVD-SPAN-901', label: 'Correlated Metric Trace', confidence: 0.98 },
      { source: 'RC-1', target: 'EVD-LOG-404', label: 'Log Corroboration', confidence: 0.95 },
      { source: 'RC-1', target: 'RBK-AUTONOMOUS', label: 'Autonomous Remediation', confidence: 0.92 },
      { source: 'INC-6819', target: 'KB-882', label: 'Documented Post-Mortem', confidence: 0.91 },
    ];

    return { nodes: rawNodes, links: rawLinks };
  }, [activeIncident]);

  // Three.js Canvas Engine
  useEffect(() => {
    if (viewMode === '2D') return;

    const container = containerRef.current;
    if (!container) return;

    // Detect WebGL capability & software rendering
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep obsidian slate
    scene.fog = new THREE.FogExp2(0x0f172a, 0.05);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(0, 3, 11);

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x818cf8, 2.2); // Indigo key
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.8); // Cyan rim
    rimLight.position.set(-10, -6, -8);
    scene.add(rimLight);

    const violetAccent = new THREE.PointLight(0xa855f7, 2.5, 30);
    violetAccent.position.set(0, 0, 0);
    scene.add(violetAccent);

    // 4. Background Constellation particles
    const bgCount = 450;
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount * 3; i += 3) {
      bgPos[i] = (Math.random() - 0.5) * 40;
      bgPos[i + 1] = (Math.random() - 0.5) * 40;
      bgPos[i + 2] = (Math.random() - 0.5) * 40;
    }
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    const bgMat = new THREE.PointsMaterial({
      color: 0x475569,
      size: 0.12,
      transparent: true,
      opacity: 0.5,
    });
    const bgPoints = new THREE.Points(bgGeo, bgMat);
    scene.add(bgPoints);

    // 5. Generate Procedural Nodes
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeMap = new Map<string, THREE.Vector3>();

    // Geometries
    const sphereGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const octaGeo = new THREE.OctahedronGeometry(0.65, 0);
    const icosaGeo = new THREE.IcosahedronGeometry(0.6, 0);
    const boxGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    const diamondGeo = new THREE.ConeGeometry(0.6, 1.0, 4);

    // Filter nodes
    const filteredNodes = nodes.filter(n => {
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'TICKET' && n.type === 'TICKET') return true;
      if (activeFilter === 'HISTORICAL' && n.type === 'HISTORICAL_CASE') return true;
      if (activeFilter === 'ROOT_CAUSE' && n.type === 'ROOT_CAUSE') return true;
      if (activeFilter === 'RUNBOOK' && n.type === 'RUNBOOK') return true;
      if (activeFilter === 'EVIDENCE' && n.type === 'EVIDENCE') return true;
      return false;
    });

    filteredNodes.forEach((node) => {
      const posVec = new THREE.Vector3(...node.pos);
      nodeMap.set(node.id, posVec);

      let geo: THREE.BufferGeometry = sphereGeo;
      let color = 0x6366f1; // Indigo default
      let emissive = 0x312e81;

      if (node.type === 'TICKET') {
        geo = sphereGeo;
        color = 0xef4444; // Red pulse
        emissive = 0x7f1d1d;
      } else if (node.type === 'ROOT_CAUSE') {
        geo = icosaGeo;
        color = 0xa855f7; // Violet
        emissive = 0x581c87;
      } else if (node.type === 'HISTORICAL_CASE') {
        geo = octaGeo;
        color = 0x06b6d4; // Cyan
        emissive = 0x164e63;
      } else if (node.type === 'RUNBOOK') {
        geo = diamondGeo;
        color = 0x10b981; // Emerald
        emissive = 0x064e3b;
      } else if (node.type === 'EVIDENCE') {
        geo = boxGeo;
        color = 0x3b82f6; // Blue
        emissive = 0x1e3a8a;
      }

      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.6,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(posVec);
      mesh.userData = node;

      // Add ambient glow ring for root cause & active ticket
      if (node.type === 'TICKET' || node.type === 'ROOT_CAUSE') {
        const ringGeo = new THREE.RingGeometry(0.85, 1.05, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: node.type === 'TICKET' ? 0xf87171 : 0xc084fc,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        mesh.add(ringMesh);
      }

      scene.add(mesh);
      nodeMeshes.push(mesh);
    });

    // 6. Connective Energy Lines & Dynamic Pulses
    const lineGroup = new THREE.Group();
    const pulsePackets: Array<{ mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; progress: number; speed: number }> = [];

    links.forEach((link) => {
      const p1 = nodeMap.get(link.source);
      const p2 = nodeMap.get(link.target);
      if (!p1 || !p2) return;

      // Bezier arching curve for organic cognitive look
      const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      midPoint.y += 0.6; // subtle arched sag/rise
      const curve = new THREE.CatmullRomCurve3([p1, midPoint, p2]);

      const points = curve.getPoints(30);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.4,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      lineGroup.add(line);

      // Energy Pulse traveling along edge
      const pulseGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        transparent: true,
        opacity: 0.9,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      scene.add(pulseMesh);

      pulsePackets.push({
        mesh: pulseMesh,
        curve,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
      });
    });
    scene.add(lineGroup);

    // 7. Interactive Raycaster (Hover and Selection)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const target = intersects[0].object as THREE.Mesh;
        setHoveredNode(target.userData as MemoryNodeData);
        container.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        container.style.cursor = 'default';
      }
    };

    const onPointerClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const clickedData = intersects[0].object.userData as MemoryNodeData;
        setSelectedNode(clickedData);
        if (onSelectNode) {
          onSelectNode(clickedData.id, clickedData.type);
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('click', onPointerClick);

    // 8. Orbit Dragging Controls (Damped manual rotation)
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let spherical = { radius: 11, theta: 0, phi: Math.PI / 2.3 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseDrag = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - deltaY * 0.008));

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(5, Math.min(22, spherical.radius + e.deltaY * 0.01));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseDrag);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Camera auto-orbit when not dragging and rotation enabled
      if (isRotating && !isDragging) {
        spherical.theta += delta * 0.15;
      }

      // Update camera spherical pos
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);

      // Animate background starfield
      bgPoints.rotation.y = elapsed * 0.02;

      // Animate node breathing & rotation
      nodeMeshes.forEach((mesh) => {
        mesh.rotation.y += delta * 0.4;
        mesh.rotation.x += delta * 0.2;
        // Subtle floating bob
        mesh.position.y = mesh.userData.pos[1] + Math.sin(elapsed * 1.5 + mesh.userData.pos[0]) * 0.08;
      });

      // Animate energy pulses along connections
      pulsePackets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;
        const pt = p.curve.getPoint(p.progress);
        p.mesh.position.copy(pt);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 11. Cleanup Lifecycle
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('click', onPointerClick);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseDrag);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);

      // Dispose Three.js memory to prevent leaks
      nodeMeshes.forEach((m) => {
        m.geometry.dispose();
        if (Array.isArray(m.material)) {
          m.material.forEach((mat) => mat.dispose());
        } else {
          m.material.dispose();
        }
      });
      pulsePackets.forEach((p) => {
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
      });
      bgGeo.dispose();
      bgMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [viewMode, activeFilter, nodes, links, isRotating]);

  return (
    <div className={`relative w-full ${heightClass} bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col select-none`}>
      {/* Top Bar Status / Metrics */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-white tracking-wide uppercase flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            3D Organizational Memory Network
          </span>
          <span className="text-[11px] text-slate-400 font-mono border-l border-slate-700 pl-2">
            {nodes.length} Nodes &bull; {links.length} Neural Synapses
          </span>
        </div>

        {/* View Mode & Orbit Controls */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
          <button
            onClick={() => setViewMode(viewMode === '3D' ? '2D' : '3D')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === '3D' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {viewMode === '3D' ? '3D Spatial' : '2D Topo'}
          </button>
          <button
            onClick={() => setIsRotating(!isRotating)}
            title={isRotating ? 'Pause auto-orbit' : 'Resume auto-orbit'}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas or 2D Accessible Fallback */}
      {viewMode === '3D' && webGlSupported ? (
        <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />
      ) : (
        /* 2D Accessible Alternative */
        <div className="w-full h-full p-6 overflow-y-auto bg-slate-900 flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-cyan-400" />
              2D Topographic Knowledge Graph View
            </h4>
            <p className="text-xs text-slate-400">
              Deterministic list and relation tree of active incident nodes, historical evidence, and remediation paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nodes.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  setSelectedNode(n);
                  if (onSelectNode) onSelectNode(n.id, n.type);
                }}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedNode?.id === n.id
                    ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-lg shadow-indigo-500/10'
                    : 'border-slate-800 bg-slate-800/50 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700 text-cyan-300">
                    {n.type}
                  </span>
                  {n.similarity && (
                    <span className="text-[10px] font-mono text-emerald-400">
                      {Math.round(n.similarity * 100)}% Match
                    </span>
                  )}
                </div>
                <h5 className="text-xs font-semibold text-white truncate mb-1">{n.name}</h5>
                <p className="text-[11px] text-slate-400 line-clamp-2">{n.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hover Info Tooltip (Only when hovering 3D node) */}
      {hoveredNode && viewMode === '3D' && !selectedNode && (
        <div className="absolute top-16 left-4 z-20 pointer-events-none bg-slate-900/95 border border-indigo-500/50 p-3 rounded-xl shadow-2xl max-w-xs backdrop-blur-md animate-fade-in">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              {hoveredNode.type}
            </span>
            {hoveredNode.severity && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                {hoveredNode.severity}
              </span>
            )}
          </div>
          <h4 className="text-xs font-semibold text-white truncate">{hoveredNode.name}</h4>
          <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">{hoveredNode.description}</p>
          <div className="text-[10px] text-indigo-300 font-mono mt-1.5 flex items-center gap-1">
            <span>Click node to lock companion inspector</span>
          </div>
        </div>
      )}

      {/* Selected Node Companion Details Panel */}
      {selectedNode && (
        <div className="absolute bottom-16 right-4 z-30 w-80 bg-slate-900/95 border border-indigo-500/80 p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-scale-in">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-slate-800">
                {selectedNode.type}
              </span>
              <h4 className="text-sm font-bold text-white mt-1 leading-snug">{selectedNode.name}</h4>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              &times;
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">{selectedNode.description}</p>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] space-y-1.5 mb-3 font-mono">
            {selectedNode.metadata && (
              <div className="flex justify-between text-slate-400">
                <span>Signal:</span>
                <span className="text-indigo-300 font-semibold">{selectedNode.metadata}</span>
              </div>
            )}
            {selectedNode.category && (
              <div className="flex justify-between text-slate-400">
                <span>Scope:</span>
                <span className="text-cyan-300">{selectedNode.category}</span>
              </div>
            )}
            {selectedNode.similarity && (
              <div className="flex justify-between text-slate-400">
                <span>Memory Score:</span>
                <span className="text-emerald-400">{Math.round(selectedNode.similarity * 100)}% Grounded</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onSelectNode) onSelectNode(selectedNode.id, selectedNode.type);
              }}
              className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition shadow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Focus in CaseMind
            </button>
            <button
              onClick={() => setSelectedNode(null)}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Bottom Controls Dock (Filter Pills & Legend) */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto overflow-x-auto max-w-full">
          {[
            { id: 'ALL', label: 'All Layers' },
            { id: 'TICKET', label: 'Active Outages' },
            { id: 'ROOT_CAUSE', label: 'Root Causes' },
            { id: 'HISTORICAL', label: 'Historical Cases' },
            { id: 'RUNBOOK', label: 'Runbooks' },
            { id: 'EVIDENCE', label: 'Evidence Spans' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg text-[10px] font-mono text-slate-300 pointer-events-auto">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Ticket
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> Root Cause
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Historical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Runbook
          </span>
        </div>
      </div>
    </div>
  );
};
