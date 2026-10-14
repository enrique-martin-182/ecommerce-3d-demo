"use client";
import { useState } from "react";
import { Html } from "@react-three/drei";
import type { Hotspot as HotspotType } from "@/lib/types";

interface HotspotProps {
  hotspot: HotspotType;
  visible: boolean;
}

export function Hotspot({ hotspot, visible }: HotspotProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Html
      position={hotspot.position}
      distanceFactor={3}
      style={{
        pointerEvents: visible ? "auto" : "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
        userSelect: "none",
      }}
      zIndexRange={[10, 0]}
    >
      <div className="relative">
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label={`Hotspot: ${hotspot.label}`}
          aria-expanded={expanded}
          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white/20 text-white backdrop-blur-sm text-xs font-bold shadow-lg hover:bg-white/40 transition-colors"
          style={{ cursor: visible ? "pointer" : "default" }}
        >
          +
        </button>
        {expanded && (
          <div
            className="absolute left-8 top-0 z-50 w-48 rounded-xl bg-white/95 p-3 shadow-xl backdrop-blur"
            role="tooltip"
          >
            <p className="text-xs font-semibold text-gray-900">
              {hotspot.label}
            </p>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">
              {hotspot.description}
            </p>
          </div>
        )}
      </div>
    </Html>
  );
}
