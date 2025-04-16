// // components/StatusToggle.jsx
// import { PowerIcon } from 'lucide-react';

// interface StatusToggleProps {
//   isOnline: boolean;
//   toggleStatus: () => void;
// }

// export default function StatusToggle({ isOnline, toggleStatus }: StatusToggleProps) {
//   return (
//     <div className="absolute bottom-4 left-4 right-4">
//       <div className={`flex items-center justify-between rounded-full py-2 px-4 ${isOnline ? 'bg-green-500' : 'bg-gray-700'} text-white`}>
//         <div className="flex items-center">
//           <PowerIcon className="w-5 h-5 mr-2" />
//           <span>{isOnline ? 'Online' : 'Offline'}</span>
//         </div>
//         <button
//           onClick={toggleStatus}
//           className="bg-white text-gray-800 px-4 py-1 rounded-full text-sm font-medium"
//         >
//           {isOnline ? 'Go Offline' : 'Go Online'}
//         </button>
//       </div>
//     </div>
//   );
// }

// components/StatusToggle.tsx
import React, { useState, useEffect, useRef } from 'react';
import { PowerIcon, BoltIcon, ShieldIcon } from 'lucide-react';
import * as THREE from 'three';

interface StatusToggleProps {
  isOnline: boolean;
  toggleStatus: () => void;
}

export default function StatusToggle({ isOnline, toggleStatus }: StatusToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const threeContainerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  const handleToggleClick = () => {
    setIsAnimating(true);
    setShowRipple(true);

    if (sceneRef.current) {
      const particles = sceneRef.current.children.filter(obj => obj.type === "Points") as THREE.Points[];

      particles.forEach(particle => {
        const material = particle.material as THREE.PointsMaterial;
        const currentColor = isOnline ? 0x4ade80 : 0x1f2937;
        const targetColor = isOnline ? 0x1f2937 : 0x4ade80;

        const tempColor = new THREE.Color(currentColor);

        const animateColor = () => {
          const targetThreeColor = new THREE.Color(targetColor);
          tempColor.lerp(targetThreeColor, 0.05);
          material.color = tempColor;

          if (tempColor.getHexString() !== targetThreeColor.getHexString()) {
            requestAnimationFrame(animateColor);
          }
        };

        animateColor();
      });
    }

    setTimeout(() => {
      toggleStatus();
      setTimeout(() => setShowRipple(false), 400);
    }, 300);

    setTimeout(() => setIsAnimating(false), 800);
  };

  useEffect(() => {
    if (!threeContainerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      threeContainerRef.current.clientWidth / threeContainerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(threeContainerRef.current.clientWidth, threeContainerRef.current.clientHeight);
    threeContainerRef.current.appendChild(renderer.domElement);

    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 40;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: isOnline ? 0x4ade80 : 0x1f2937,
      size: 0.5,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const lineCount = 5;
    for (let i = 0; i < lineCount; i++) {
      const lineGeometry = new THREE.BufferGeometry();
      const linePoints: THREE.Vector3[] = [];

      for (let j = 0; j < 20; j++) {
        const point = new THREE.Vector3(
          (j - 10) * 2,
          Math.sin(j * 0.2 + i) * 2,
          0
        );
        linePoints.push(point);
      }

      lineGeometry.setFromPoints(linePoints);

      const lineMaterial = new THREE.LineBasicMaterial({
        color: isOnline ? 0x4ade80 : 0x1f2937,
        transparent: true,
        opacity: 0.3
      });

      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.position.y = (i - 2) * 1.5;
      scene.add(line);
    }

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particles.rotation.x += 0.0005;
      particles.rotation.y += 0.001;

      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.01;
        positions[i + 1] += Math.cos(Date.now() * 0.001 + i) * 0.01;
      }

      particleGeometry.attributes.position.needsUpdate = true;

      scene.children
        .filter(obj => obj.type === "Line")
        .forEach((line, i) => {
          line.position.x = Math.sin(Date.now() * 0.0005 + i) * 2;
        });

      renderer.render(scene, camera);
    };

    animate();

    // Initial coloring
    scene.children.forEach(obj => {
      const mat = obj.material as THREE.Material;
      if (mat && 'color' in mat) {
        (mat as THREE.Material & { color: THREE.Color }).color = new THREE.Color(isOnline ? 0x4ade80 : 0x1f2937);
      }
    });

    const handleResize = () => {
      if (!threeContainerRef.current) return;

      camera.aspect = threeContainerRef.current.clientWidth / threeContainerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(threeContainerRef.current.clientWidth, threeContainerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (threeContainerRef.current && renderer.domElement) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }

      scene.children.forEach(child => {
        if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
        if ((child as THREE.Mesh).material) {
          const material = (child as THREE.Mesh).material;
          if (Array.isArray(material)) {
            material.forEach(mat => mat.dispose());
          } else {
            material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    sceneRef.current.children.forEach(obj => {
      const mat = obj.material as THREE.Material;
      if (mat && 'color' in mat) {
        (mat as THREE.Material & { color: THREE.Color }).color = new THREE.Color(isOnline ? 0x4ade80 : 0x1f2937);
      }
    });
  }, [isOnline]);

  return (
    <div className="fixed bottom-4 left-4 right-4 z-10">
      <div className={`
        relative overflow-hidden shadow-lg transition-all duration-500 transform
        ${isAnimating ? 'scale-105' : ''}
        rounded-2xl backdrop-blur-sm
        ${isOnline
          ? 'bg-gradient-to-r from-green-500/90 to-emerald-600/90 shadow-green-500/20'
          : 'bg-gradient-to-r from-gray-700/90 to-gray-800/90 shadow-gray-700/20'}
      `}>
        <div
          ref={threeContainerRef}
          className="absolute inset-0 opacity-60"
          style={{ pointerEvents: 'none' }}
        />

        <div className="relative flex items-center justify-between py-3 px-5">
          <div className="flex items-center space-x-3">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full 
              ${isOnline
                ? 'bg-green-400 text-white'
                : 'bg-gray-600 text-gray-300'}
              transition-all duration-500
            `}>
              <PowerIcon className={`
                w-5 h-5 transition-all duration-500
                ${isOnline ? 'animate-pulse' : ''}
              `} />
            </div>

            <div>
              <div className="flex items-center">
                <span className={`
                  font-bold text-white text-lg transition-all duration-300
                  ${isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100'}
                `}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>

                {isOnline && (
                  <div className="ml-2 flex items-center bg-green-400/30 text-white text-xs px-2 py-0.5 rounded-full">
                    <BoltIcon className="w-3 h-3 mr-1" />
                    <span>Active</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-white/70">
                {isOnline
                  ? 'You are receiving delivery requests'
                  : 'You are not receiving any requests'}
              </p>
            </div>
          </div>

          <div className="relative">
            {showRipple && (
              <span className="absolute inset-0 rounded-full animate-ripple bg-white/30"></span>
            )}

            <button
              onClick={handleToggleClick}
              disabled={isAnimating}
              className={`
                relative flex items-center space-x-2 border border-white/20
                px-5 py-2 rounded-full font-medium transition-all duration-300
                ${isOnline
                  ? 'bg-white text-green-600 hover:bg-green-50 shadow-lg shadow-green-500/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg shadow-gray-700/10'}
                ${isAnimating ? 'scale-95' : 'hover:scale-105'}
              `}
            >
              <ShieldIcon className="w-4 h-4" />
              <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
            </button>
          </div>
        </div>

        <div className={`
          absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 transform
          ${isOnline
            ? 'bg-gradient-to-r from-green-300 to-green-500'
            : 'bg-gradient-to-r from-gray-500 to-gray-600'}
        `}>
          {isOnline && (
            <div className="h-full bg-white/30 animate-statusPulse"></div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }

        @keyframes statusPulse {
          0% {
            opacity: 0;
            transform: translateX(-100%);
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .animate-ripple {
          animation: ripple 0.8s ease-out;
        }

        .animate-statusPulse {
          animation: statusPulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
