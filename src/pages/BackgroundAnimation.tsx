// BackgroundAnimation.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Cube extends THREE.Mesh {
  rotationSpeed: {
    x: number;
    y: number;
  };
}

const BackgroundAnimation = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    const cubes: Cube[] = [];

    const createCube = () => {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.1,
        wireframe: true,
      });

      const cube = new THREE.Mesh(geometry, material) as unknown as Cube;

      cube.position.x = (Math.random() - 0.5) * 10;
      cube.position.y = (Math.random() - 0.5) * 10;
      cube.position.z = (Math.random() - 0.5) * 10 - 5;

      cube.rotation.x = Math.random() * Math.PI;
      cube.rotation.y = Math.random() * Math.PI;

      cube.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
      };

      scene.add(cube);
      cubes.push(cube);
    };

    for (let i = 0; i < 15; i++) {
      createCube();
    }

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      cubes.forEach((cube) => {
        cube.rotation.x += cube.rotationSpeed.x;
        cube.rotation.y += cube.rotationSpeed.y;
      });

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();

      cubes.forEach((cube) => {
        cube.geometry.dispose();
        (cube.material as THREE.Material).dispose();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default BackgroundAnimation;
