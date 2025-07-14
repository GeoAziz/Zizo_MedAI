import React, { useRef, useState } from "react";
import { VitalsSidebar } from "../components/VitalsSidebar";
import { useMockVitals } from "../components/VitalsEngine";
import { OrganPanel } from "../components/OrganPanel";
import { AIChat } from "../components/AIChat";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";

// Mock paths for male/female layers
const MODEL_PATHS = {
  male: {
    skin: "/models/male/skin.glb",
    muscle: "/models/male/muscle.glb",
    skeleton: "/models/male/skeleton.glb",
    organs: "/models/male/organs.glb",
  },
  female: {
    skin: "/models/female/skin.glb",
    muscle: "/models/female/muscle.glb",
    skeleton: "/models/female/skeleton.glb",
    organs: "/models/female/organs.glb",
  },
};

export type BodyLayer = "skin" | "muscle" | "skeleton" | "organs";
export type Gender = "male" | "female";

interface HumanBodyProps {
  gender: Gender;
  layer: BodyLayer;
  onOrganClick?: (organ: string) => void;
}

// Simple GLTF loader wrapper
function GLTFModel({ url, visible, onClick }: { url: string; visible: boolean; onClick?: (name: string) => void }) {
  const ref = useRef<any>();
  const [gltf, setGltf] = useState<any>(null);
  React.useEffect(() => {
    if (!visible) return;
    const loader = new GLTFLoader();
    loader.load(url, (gltf: any) => {
      setGltf(gltf);
    });
  }, [url, visible]);
  if (!visible || !gltf) return null;
  return (
    <primitive
      object={gltf.scene}
      ref={ref}
      onClick={(e: { object: { name?: string } }) => {
        if (onClick && e.object.name) onClick(e.object.name);
      }}
    />
  );
}

export const HumanBody: React.FC<HumanBodyProps> = ({ gender, layer }) => {
  const vitals = useMockVitals();
  const [organModal, setOrganModal] = useState<{ open: boolean; organ: string | null }>({ open: false, organ: null });
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Handler for organ click
  const handleOrganClick = (organ: string) => {
    setOrganModal({ open: true, organ });
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }} style={{ height: "500px", width: "100%" }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 5, 2]} intensity={1.2} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        {/* Render layers */}
        <GLTFModel url={MODEL_PATHS[gender].skin} visible={layer === "skin"} />
        <GLTFModel url={MODEL_PATHS[gender].muscle} visible={layer === "muscle"} />
        <GLTFModel url={MODEL_PATHS[gender].skeleton} visible={layer === "skeleton"} />
        <GLTFModel url={MODEL_PATHS[gender].organs} visible={layer === "organs"} onClick={handleOrganClick} />
        {/* Overlay UI */}
        {/* Floating vitals panels near organs */}
        {vitals && (
          <Html position={[0.2, 1.3, 0.5]} center>
            <div style={{ background: "rgba(0, 255, 255, 0.15)", borderRadius: 8, padding: 8, color: "#fff", boxShadow: "0 0 12px #0ff" }}>
              <strong>❤️ {vitals.heartRate} bpm</strong>
            </div>
          </Html>
        )}
        {vitals && (
          <Html position={[-0.3, 1.1, 0.4]} center>
            <div style={{ background: "rgba(0, 255, 255, 0.15)", borderRadius: 8, padding: 8, color: "#fff", boxShadow: "0 0 12px #0ff" }}>
              <strong>🩸 {vitals.bloodPressure} mmHg</strong>
            </div>
          </Html>
        )}
        {vitals && (
          <Html position={[0.1, 1.6, 0.2]} center>
            <div style={{ background: "rgba(0, 255, 255, 0.15)", borderRadius: 8, padding: 8, color: "#fff", boxShadow: "0 0 12px #0ff" }}>
              <strong>💨 {vitals.respiration} rpm</strong>
            </div>
          </Html>
        )}
        {vitals && (
          <Html position={[0, 2, 0]} center>
            <div style={{ background: "rgba(30,40,80,0.7)", borderRadius: 8, padding: 8, color: "#fff" }}>
              <span>Sci-Fi Overlay</span>
            </div>
          </Html>
        )}
      </Canvas>
      {/* Floating sidebar dashboard for vitals */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        <VitalsSidebar vitals={vitals} />
      </div>
      {/* Organ info modal */}
      {organModal.open && organModal.organ && (
        <OrganPanel organ={organModal.organ} vitals={vitals} onClose={() => setOrganModal({ open: false, organ: null })} />
      )}
      {/* Floating AI assistant button */}
      <button
        style={{ position: "fixed", bottom: 32, right: 32, zIndex: 50, background: "#0ff", color: "#222", borderRadius: "50%", width: 64, height: 64, boxShadow: "0 0 24px #0ff", fontSize: 32, border: "none", cursor: "pointer" }}
        onClick={() => setAiChatOpen(true)}
        aria-label="Open AI Assistant"
      >
        🤖
      </button>
      {aiChatOpen && <AIChat onClose={() => setAiChatOpen(false)} />}
    </div>
  );
};
