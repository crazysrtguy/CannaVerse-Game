import { Environment, OrbitControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import GradientScene from "./GradientScene"; // Use default import here
import ScrollingText from "./ScrollingText"; // Adjust the path as needed

export const Experience = () => {
  return (
    <>
      <OrbitControls maxPolarAngle={degToRad(80)} />
      <Environment preset="park" />
      
      {/* Adjusted Directional Light */}
      <directionalLight
        intensity={.4}
        position={[3, 5, 3]} // Higher position to ensure better coverage
        castShadow
        shadow-normalBias={0.1} // Adjusted bias for better shadow quality
      />
      
      <GradientScene scale={3.5} /> {/* Adjusted scale for better fit */}
      
      <mesh rotation-x={-Math.PI / 2} position-y={-50}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color="skyblue" />
      </mesh>
      
      {/* Add ScrollingText to the scene */}
      <ScrollingText />
    </>
  );
};
