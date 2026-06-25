'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Animated wireframe wave terrain for the hero section.
 * Adapted from Biztreck's Scene3D — colors swapped to TryLinqr brand rose-red.
 * Skipped on mobile + prefers-reduced-motion.
 */
export default function WaveScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    if (reduce || isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    /* Renderer — transparent bg, fits within hero section */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    /* Scene + camera */
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0003, 8, 28);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 3.2, 9);
    camera.lookAt(0, 0, -4);

    /* ── Wireframe wave plane ── */
    const geometry = new THREE.PlaneGeometry(40, 40, 80, 80);
    geometry.rotateX(-Math.PI / 2);

    /* Brand rose-red gradient: near = lighter rose, far = deep burgundy */
    const colorNear = new THREE.Color(0xc46090); // brand lighter rose
    const colorFar  = new THREE.Color(0x71304f); // brand-800 burgundy
    const positions = geometry.attributes.position;
    const colors    = new Float32Array(positions.count * 3);
    for (let i = 0; i < positions.count; i++) {
      const z = positions.getZ(i);
      const t = THREE.MathUtils.clamp((z + 20) / 40, 0, 1);
      const c = colorFar.clone().lerp(colorNear, 1 - t);
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const wireMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
    });
    const terrain = new THREE.Mesh(geometry, wireMaterial);
    terrain.position.y = -2.2;
    scene.add(terrain);

    /* Cache original positions for per-frame displacement */
    const original = positions.array.slice();

    /* ── Starfield ── */
    const starPositions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      starPositions[i * 3]     = (Math.random() - 0.5) * 60;
      starPositions[i * 3 + 1] = Math.random() * 12 + 2;
      starPositions[i * 3 + 2] = -Math.random() * 30 - 4;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x944268, size: 0.07, sizeAttenuation: true, transparent: true, opacity: 0.65, depthWrite: false });
    const stars   = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ── Input state ── */
    let mouseX = 0, mouseY = 0, tMouseX = 0, tMouseY = 0;
    const onMouse = (e) => {
      tMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      tMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* ── Animate ── */
    const clock = new THREE.Clock();
    let frameId;
    const animate = () => {
      const t = clock.getElapsedTime();
      const arr = positions.array;
      for (let i = 0; i < positions.count; i++) {
        const x = original[i * 3];
        const z = original[i * 3 + 2];
        arr[i * 3 + 1] =
          Math.sin(x * 0.35 + t * 0.6)    * 0.35 +
          Math.sin(z * 0.42 + t * 0.45)   * 0.28 +
          Math.cos((x + z) * 0.18 + t * 0.3) * 0.22 +
          Math.sin(Math.sqrt(x * x + z * z) * 0.35 - t * 0.9) * 0.18;
      }
      positions.needsUpdate = true;

      stars.position.x = Math.sin(t * 0.08) * 0.4;

      mouseX += (tMouseX - mouseX) * 0.04;
      mouseY += (tMouseY - mouseY) * 0.04;
      camera.position.x = mouseX * 0.6;
      camera.position.y = 3.2 - mouseY * 0.4;
      camera.lookAt(0, 0, -4);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      wireMaterial.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} aria-hidden className="pointer-events-none absolute inset-0 z-[2]" />;
}
