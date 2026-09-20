import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const DottedSurface = ({ className = "" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(0, 320, 600);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Grade de pontos
    const SEPARATION = 34;
    const AMOUNTX = 55;
    const AMOUNTY = 35;
    const numParticles = AMOUNTX * AMOUNTY;

    const positions = new Float32Array(numParticles * 3);
    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        positions[i + 1] = 0;
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        i += 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Cor mais visível, combinando com sua paleta azul
    const material = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 4,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    points.position.y = 110; // quanto maior, mais a superfície "sobe" na tela
    scene.add(points);

    let animationId;
    let count = 0;

    const animate = () => {
      const posAttr = geometry.attributes.position;
      let idx = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const y =
            Math.sin((ix + count) * 0.3) * 18 +
            Math.sin((iy + count) * 0.5) * 18;
          posAttr.setY(idx, y);
          idx++;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      count += 0.12;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Limpeza obrigatória: libera memória da GPU ao desmontar o componente
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={`absolute inset-0 ${className}`} />;
};

export default DottedSurface;