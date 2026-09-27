import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NODE_COUNT = 80;
const CONNECTION_THRESHOLD = 2.8;

function createNodes(count) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: (Math.random() - 0.5) * 22,
      y: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 0.004,
      vy: (Math.random() - 0.5) * 0.004,
      vz: (Math.random() - 0.5) * 0.002,
      baseX: 0,
      baseY: 0,
      baseZ: 0,
      size: Math.random() * 0.05 + 0.02,
      pulse: Math.random() * Math.PI * 2,
    });
    nodes[i].baseX = nodes[i].x;
    nodes[i].baseY = nodes[i].y;
    nodes[i].baseZ = nodes[i].z;
  }
  return nodes;
}

export default function NeuralCanvas() {
  const mountRef = useRef(null);
  const stateRef = useRef({
    mouse: { x: 0, y: 0 },
    scroll: 0,
    frameId: null,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth || window.innerWidth;
    const H = mount.clientHeight || window.innerHeight;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene / Camera ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 0, 10);

    // ── Nodes geometry ──
    const nodes = createNodes(NODE_COUNT);
    const nodePositions = new Float32Array(NODE_COUNT * 3);
    const nodeSizes = new Float32Array(NODE_COUNT);

    nodes.forEach((n, i) => {
      nodePositions[i * 3]     = n.x;
      nodePositions[i * 3 + 1] = n.y;
      nodePositions[i * 3 + 2] = n.z;
      nodeSizes[i] = n.size;
    });

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute('size', new THREE.BufferAttribute(nodeSizes, 1));

    const nodeMat = new THREE.PointsMaterial({
      color: 0xffffff,
      sizeAttenuation: true,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
    });

    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodePoints);

    // ── Connections (Line Segments) ──
    const maxConnections = NODE_COUNT * 4;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      vertexColors: false,
    });

    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    // ── Accent Nodes (slightly larger, pulsing) ──
    const accentGeo = new THREE.BufferGeometry();
    const accentPositions = new Float32Array(12 * 3);
    for (let i = 0; i < 12; i++) {
      accentPositions[i * 3]     = (Math.random() - 0.5) * 18;
      accentPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      accentPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    accentGeo.setAttribute('position', new THREE.BufferAttribute(accentPositions, 3));
    const accentMat = new THREE.PointsMaterial({
      color: 0xffffff,
      sizeAttenuation: true,
      size: 0.18,
      transparent: true,
      opacity: 0.5,
    });
    const accentPoints = new THREE.Points(accentGeo, accentMat);
    scene.add(accentPoints);

    // ── Event Handlers ──
    const onMouseMove = (e) => {
      stateRef.current.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      stateRef.current.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      stateRef.current.scroll = window.scrollY;
    };

    const onResize = () => {
      if (!mountRef.current) return;
      const W2 = mountRef.current.clientWidth || window.innerWidth;
      const H2 = mountRef.current.clientHeight || window.innerHeight;
      if (!H2) return;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // ── Animation Loop ──
    let time = 0;
    let frameId;

    function animate() {
      frameId = requestAnimationFrame(animate);
      time += 0.008;

      const { mouse, scroll } = stateRef.current;

      // Camera parallax on mouse
      camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.04;

      // Camera dolly on scroll (zoom into graph)
      const scrollZ = 10 - (scroll / window.innerHeight) * 4;
      camera.position.z += (scrollZ - camera.position.z) * 0.06;
      camera.lookAt(0, 0, 0);

      // Update node positions
      let lineIdx = 0;
      nodes.forEach((n, i) => {
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;

        // Gentle boundary bounce
        if (Math.abs(n.x) > 11) n.vx *= -1;
        if (Math.abs(n.y) > 7)  n.vy *= -1;
        if (Math.abs(n.z) > 6)  n.vz *= -1;

        // Subtle mouse repulsion
        const mx = mouse.x * 8;
        const my = -mouse.y * 5;
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 3) {
          n.x += (dx / dist) * 0.02;
          n.y += (dy / dist) * 0.02;
        }

        // Pulsing size
        n.pulse += 0.02;
        const pulseFactor = 0.06 + Math.sin(n.pulse) * 0.02;
        nodeSizes[i] = pulseFactor;

        nodePositions[i * 3]     = n.x;
        nodePositions[i * 3 + 1] = n.y;
        nodePositions[i * 3 + 2] = n.z;
      });

      nodeGeo.attributes.position.needsUpdate = true;
      nodeGeo.attributes.size.needsUpdate = true;

      // Rebuild connections
      lineIdx = 0;
      for (let i = 0; i < nodes.length && lineIdx < maxConnections - 1; i++) {
        for (let j = i + 1; j < nodes.length && lineIdx < maxConnections - 1; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dz = nodes[i].z - nodes[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < CONNECTION_THRESHOLD) {
            linePositions[lineIdx * 6]     = nodes[i].x;
            linePositions[lineIdx * 6 + 1] = nodes[i].y;
            linePositions[lineIdx * 6 + 2] = nodes[i].z;
            linePositions[lineIdx * 6 + 3] = nodes[j].x;
            linePositions[lineIdx * 6 + 4] = nodes[j].y;
            linePositions[lineIdx * 6 + 5] = nodes[j].z;
            lineIdx++;
          }
        }
      }
      lineGeo.setDrawRange(0, lineIdx * 2);
      lineGeo.attributes.position.needsUpdate = true;

      // Accent nodes pulse
      accentMat.opacity = 0.3 + Math.sin(time * 1.5) * 0.2;

      // Scene rotation
      scene.rotation.y = time * 0.04 + mouse.x * 0.05;
      scene.rotation.x = mouse.y * 0.03;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      accentGeo.dispose();
      accentMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="canvas-container"
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}
    />
  );
}
