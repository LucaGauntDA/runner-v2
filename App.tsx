
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from './components/World/Environment';
import { Player } from './components/World/Player';
import { LevelManager } from './components/World/LevelManager';
import { Effects } from './components/World/Effects';
import { HUD } from './components/UI/HUD';
import { useStore } from './store';

// Dynamic Camera Controller
const CameraController = () => {
  const { camera, size } = useThree();
  const { laneCount } = useStore();
  
  useFrame((state, delta) => {
    // Determine screen aspect ratio
    const aspect = size.width / size.height;
    
    // Smoothly scale camera parameters based on aspect ratio
    // In portrait (aspect < 1), we need to be higher and further back.
    // In landscape (aspect > 1), we can be lower and closer.
    const portraitFactor = Math.max(0, (1.2 - aspect) * 2.5);
    
    const extraLanes = Math.max(0, laneCount - 3);
    const laneScaling = extraLanes * 0.8;

    // Base target positions adjusted by both lane count and screen orientation
    const targetY = 5.5 + laneScaling + (portraitFactor * 2.5);
    const targetZ = 8.0 + laneScaling + (portraitFactor * 4.0);

    const targetPos = new THREE.Vector3(0, targetY, targetZ);
    
    // Smoothly interpolate camera position
    camera.position.lerp(targetPos, delta * 3.0);
    
    // Look further down the track to maintain visibility of oncoming obstacles
    camera.lookAt(0, 0, -35); 
  });
  
  return null;
};

function Scene() {
  return (
    <>
        <Environment />
        <group>
            <group userData={{ isPlayer: true }} name="PlayerGroup">
                 <Player />
            </group>
            <LevelManager />
        </group>
        <Effects />
    </>
  );
}

function App() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      <HUD />
      <Canvas
        shadows
        dpr={[1, 2]} // Higher fidelity for high-res tablets/monitors
        gl={{ antialias: false, stencil: false, depth: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 6, 10], fov: 60 }}
      >
        <CameraController />
        <Suspense fallback={null}>
            <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
