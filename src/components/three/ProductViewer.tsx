"use client";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { Loader3D } from "./Loader3D";
import { Hotspot } from "./Hotspot";
import type { Product, ProductVariant } from "@/lib/types";

class ModelErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(_: Error, __: ErrorInfo) {}
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

interface ModelProps {
  glbPath: string;
  scale: [number, number, number];
  position: [number, number, number];
  variantColor: string;
}

function Model({ glbPath, scale, position, variantColor }: ModelProps) {
  const { scene } = useGLTF(glbPath);
  const targetColor = useRef(new THREE.Color(variantColor));
  const currentColor = useRef(new THREE.Color(variantColor));

  useEffect(() => {
    targetColor.current.set(variantColor);
  }, [variantColor]);

  useEffect(() => {
    const interval = setInterval(() => {
      currentColor.current.lerp(targetColor.current, 0.1);
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat?.color) mat.color.copy(currentColor.current);
        }
      });
      if (currentColor.current.distanceTo(targetColor.current) < 0.001) {
        clearInterval(interval);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [variantColor, scene]);

  return (
    <group scale={scale} position={position}>
      <primitive object={scene} />
    </group>
  );
}

function FallbackModel() {
  return (
    <mesh>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="#aaaaaa" roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

interface ProductViewerProps {
  product: Product;
  selectedVariant: ProductVariant;
}

export function ProductViewer({ product, selectedVariant }: ProductViewerProps) {
  const [isDragging, setIsDragging] = useState(false);
  useGLTF.preload(product.model.glb);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[var(--color-card)]">
      <Canvas
        frameloop="demand"
        camera={{ position: product.model.cameraPosition, fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[
          1,
          Math.min(
            typeof window !== "undefined" ? window.devicePixelRatio : 1,
            1.5
          ),
        ]}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <ModelErrorBoundary fallback={<FallbackModel />}>
            <Model
              glbPath={product.model.glb}
              scale={product.model.scale}
              position={product.model.position}
              variantColor={selectedVariant.color}
            />
          </ModelErrorBoundary>
          {product.hotspots.map((hotspot) => (
            <Hotspot key={hotspot.id} hotspot={hotspot} visible={!isDragging} />
          ))}
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.4}
            scale={5}
            blur={2}
          />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={1}
          maxDistance={6}
          onStart={() => setIsDragging(true)}
          onEnd={() => setIsDragging(false)}
        />
      </Canvas>
      <Loader3D />
    </div>
  );
}
