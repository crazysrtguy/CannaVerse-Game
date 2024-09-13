import React, { useRef, useEffect } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { MeshBasicMaterial, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

export default function ScrollingText() {
  const textRef = useRef();
  const font = useRef(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      '/fonts/helvetiker_bold.typeface.json', // Ensure this path is correct
      (loadedFont) => {
        font.current = loadedFont;
        console.log('Font loaded successfully');
      },
      undefined,
      (err) => console.error('An error happened loading the font.', err)
    );
  }, []);

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.rotation.y += 0.01; // Rotate text around Y-axis
      textRef.current.position.x = 20 * Math.sin(clock.getElapsedTime() * 0.5); // Move text in X-direction
      textRef.current.position.z = 20 * Math.cos(clock.getElapsedTime() * 0.5); // Move text in Z-direction
      
      console.log(`Text position: ${textRef.current.position.toArray()}`);
      console.log(`Text rotation: ${textRef.current.rotation.toArray()}`);
    }
  });

  return (
    font.current && (
      <mesh ref={textRef} position={[0, 5, 0]}>
        <TextGeometry args={["Welcome to CannaVerse", { font: font.current, size: 10, height: 1 }]} />
        <MeshBasicMaterial color={"#00ff00"} emissive={"#00ff00"} emissiveIntensity={0.5} />
      </mesh>
    )
  );
}
