"use client";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";
import { Loader3D } from "./Loader3D";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ProductModel } from "@/lib/types";

interface RotatingModelProps {
  model: ProductModel;
  reducedMotion: boolean;
}

function RotatingModel({ model, reducedMotion }: RotatingModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(model.glb);

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) return;
    groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} scale={model.scale} position={model.position}>
      <primitive object={scene} />
    </group>
  );
}

interface HeroSceneProps {
  model: ProductModel;
}

export function HeroScene({ model }: HeroSceneProps) {
  const reducedMotion = useReducedMotion();
  useGLTF.preload(model.glb);

  return (
    <div className="relative h-full w-full">
      <Canvas
        frameloop="demand"
        camera={{ position: model.cameraPosition, fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)]}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <RotatingModel model={model} reducedMotion={reducedMotion} />
          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.4}
            scale={4}
            blur={2}
          />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <Loader3D />
    </div>
  );
}
