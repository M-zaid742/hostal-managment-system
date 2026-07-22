import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import "../styles/heroIsometric.css";

function Room({ x, y, status, index, timePhase }) {
  const ref = useRef();
  const colorMap = {
    available: new THREE.Color("#00ff88"),
    occupied: new THREE.Color("#ff416c"),
    checkout: new THREE.Color("#ffd166"),
    reserved: new THREE.Color("#00f5ff"),
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.8 + 0.2 * Math.sin(t * 3 + index * 0.2 + timePhase * Math.PI * 2);
    if (ref.current) {
      ref.current.scale.y = 0.9 + 0.15 * pulse;
      ref.current.material.emissiveIntensity = 0.6 * pulse;
    }
  });

  return (
    <mesh ref={ref} position={[x, 0, y]} rotation-x={-Math.PI / 8} receiveShadow castShadow>
      <boxGeometry args={[0.9, 0.6, 0.6]} />
      <meshStandardMaterial
        color={new THREE.Color("#0f1724")}
        emissive={colorMap[status] || new THREE.Color("#00ff88")}
        emissiveIntensity={0.6}
        metalness={0.1}
        roughness={0.3}
      />
    </mesh>
  );
}

function Building({ rows = 6, cols = 8, statuses, timePhase }) {
  const rooms = useMemo(() => {
    const arr = [];
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * 1.05;
        const y = (r - rows / 2) * 0.85;
        arr.push({ x, y, status: statuses[idx] || "occupied", index: idx });
        idx++;
      }
    }
    return arr;
  }, [rows, cols, statuses]);

  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      {rooms.map((r) => (
        <Room key={r.index} x={r.x} y={r.y} status={r.status} index={r.index} timePhase={timePhase} />
      ))}
    </group>
  );
}

export default function HeroIsometric({ className = "hero-iso" }) {
  const total = 48;
  const statuses = useMemo(() => {
    const arr = new Array(total).fill("occupied");
    let i = 0;
    for (; i < 6; i++) arr[i] = "available";
    for (; i < 44; i++) arr[i] = "occupied";
    arr[44] = "reserved";
    arr[45] = "reserved";
    arr[46] = "checkout";
    arr[47] = "reserved";
    return arr;
  }, []);

  const timeRef = useRef(0);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    timeRef.current = (t % 10) / 10;
  });

  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [10, 8, 10], fov: 35 }}>
        <color attach="background" args={["#0a0a1a"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <spotLight position={[-10, 8, -6]} angle={0.3} penumbra={0.5} intensity={0.5} />

        <PerspectiveCamera makeDefault position={[8, 7, 9]} />

        <group position={[0, -0.8, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.31, 0]}>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#061024" metalness={0.6} roughness={0.1} transparent opacity={0.9} />
          </mesh>

          <group position={[0, 0.6, 0]}>
            <Building rows={6} cols={8} statuses={statuses} timePhase={timeRef.current} />
          </group>
        </group>

        <Html center style={{ pointerEvents: "none" }}>
          <div className="hero-iso-ui">
            <div className="brand">
              <h1>RoomFlow</h1>
              <p>Manage Smarter. Host Better.</p>
            </div>
            <div className="stats">
              <div className="glass card">
                <strong>Occupancy</strong>
                <div className="big">87% Occupied</div>
              </div>
              <div className="glass card">
                <strong>Rooms</strong>
                <div className="big">48 total • 6 available</div>
              </div>
            </div>
          </div>
        </Html>

        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 6} />
      </Canvas>
    </div>
  );
}
