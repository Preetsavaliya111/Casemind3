import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const LandingThreeHero: React.FC<{ className?: string }> = ({ className = 'w-full h-[460px]' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
    } catch {
      return; // Graceful WebGL fallback
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 2.5); // Indigo
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 2.0); // Cyan
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Procedural Node cluster representing organizational knowledge
    const nodeCount = 28;
    const nodes: THREE.Mesh[] = [];
    const nodeCoords: THREE.Vector3[] = [];

    const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const octaGeo = new THREE.OctahedronGeometry(0.38, 0);
    const icosaGeo = new THREE.IcosahedronGeometry(0.32, 0);

    const colors = [0x4f46e5, 0x0891b2, 0x7c3aed, 0x10b981, 0xef4444];

    for (let i = 0; i < nodeCount; i++) {
      const geo = i % 3 === 0 ? sphereGeo : i % 3 === 1 ? octaGeo : icosaGeo;
      const color = colors[i % colors.length];
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.7,
        emissive: color,
        emissiveIntensity: 0.4,
      });

      const mesh = new THREE.Mesh(geo, mat);
      // Ellipsoidal distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.5 + Math.random() * 4.5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = (r * Math.sin(phi) * Math.sin(theta)) * 0.7; // slight vertical flattening
      const z = (r * Math.cos(phi)) * 0.8;

      mesh.position.set(x, y, z);
      scene.add(mesh);
      nodes.push(mesh);
      nodeCoords.push(mesh.position);
    }

    // Connect nearest nodes with dynamic glowing neural filaments
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.28,
    });

    const linesGroup = new THREE.Group();
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodeCoords[i].distanceTo(nodeCoords[j]);
        if (dist < 4.2) {
          const pts = [nodeCoords[i], nodeCoords[j]];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
          const line = new THREE.Line(lineGeo, lineMat);
          linesGroup.add(line);
        }
      }
    }
    scene.add(linesGroup);

    // Mouse parallax tracking
    let targetRotX = 0;
    let targetRotY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotY = nx * 0.5;
      targetRotX = ny * 0.3;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Slow organic rotation
      scene.rotation.y += delta * 0.12;
      scene.rotation.x += (targetRotX - scene.rotation.x) * 0.05;
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.05;

      nodes.forEach((node, idx) => {
        node.rotation.y += delta * 0.6;
        node.rotation.x += delta * 0.4;
        // subtle pulsating scale
        const scale = 1 + Math.sin(elapsed * 2 + idx) * 0.08;
        node.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      nodes.forEach((n) => {
        n.geometry.dispose();
        if (Array.isArray(n.material)) n.material.forEach((m) => m.dispose());
        else n.material.dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative ${className} flex items-center justify-center overflow-hidden`}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
