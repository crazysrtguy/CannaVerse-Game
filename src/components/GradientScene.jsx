import { useAnimations, useGLTF, Stars, Text } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import {
  TextureLoader,
  DoubleSide,
  VideoTexture,
  MeshBasicMaterial,
} from "three";
import { useThree, useFrame } from "@react-three/fiber";

export default function GradientScene(props) {
  const group = useRef();
  const { scene } = useThree();
  const { nodes, materials, animations } = useGLTF("/models/GradientScene.glb");
  const { actions } = useAnimations(animations, group);
  const textRefs = useRef([]);

  const { scene: rocketScene } = useGLTF("/models/rocket.glb");
  const rocketRef = useRef();
  const [rocketSpeed, setRocketSpeed] = useState(0.06);
  const [stopIndex, setStopIndex] = useState(0); // To track which cube stop

  const textureLoader = new TextureLoader();
  const planetRefs = useRef([]);
  const cubeRefs = [useRef(), useRef(), useRef()]; // Refs for the cubes
  const videoRefs = [useRef(), useRef(), useRef()]; // Refs for video textures

  // Load planet textures
  const planetTextures = [];
  for (let i = 1; i <= 6; i++) {
    const texture = textureLoader.load(
      `/textures/${i}.jpg`,
      (texture) => console.log(`Texture ${i}.jpg loaded`),
      undefined,
      (err) => console.error(`Error loading texture ${i}.jpg: `, err)
    );
    planetTextures.push(texture);
  }

  useEffect(() => {
    actions["CharacterArmature|Wave"].play();

    Object.values(materials).forEach((material) => {
      material.side = DoubleSide;
    });

    textureLoader.load(
      "/textures/space.jpg",
      (texture) => {
        scene.background = texture;
        console.log("Space background texture loaded");
      },
      undefined,
      (err) => console.error("Error loading space background texture: ", err)
    );

    // Load videos for cubes
    const videoFiles = ["/videos/CannaVerse.mp4", "/videos/game.mp4","/videos/space.mp4"];
    videoFiles.forEach((file, index) => {
      const video = document.createElement("video");
      video.src = file;
      video.crossOrigin = "Anonymous";
      video.loop = true;
      video.muted = true;
      video.play();
      videoRefs[index].current = video;

      const videoTexture = new VideoTexture(video);
      if (cubeRefs[index].current) {
        cubeRefs[index].current.material.map = videoTexture;
        cubeRefs[index].current.material.needsUpdate = true;
      }
    });

    return () => {
      // Cleanup video elements
      videoRefs.forEach((ref) => ref.current?.pause());
    };
  }, [actions, materials, scene, textureLoader]);

  // Function to create random planets
  const createRandomPlanets = () => {
    const planets = [];
    const sceneWidth = 150; // Scene width
    const sceneHeight = 100; // Scene height
    const sceneDepth = 200; // Scene depth
    const modelPlaneHeight = 150; // Height of the plane of the model, adjust as needed

    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 15 + 2; // Adjusted size range
      const positionX = (Math.random() - 0.5) * sceneWidth;
      const positionY =
        (Math.random() - 0.5) * (sceneHeight - modelPlaneHeight) +
        modelPlaneHeight; // Ensures planets are above the plane
      const positionZ = (Math.random() - 0.5) * sceneDepth;

      const texture =
        planetTextures[Math.floor(Math.random() * planetTextures.length)];

      planets.push(
        <mesh
          key={i}
          position={[positionX, positionY, positionZ]}
          ref={(el) => (planetRefs.current[i] = el)}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial map={texture} />
        </mesh>
      );
    }

    return planets;
  };

  // Explode cube function
  const explodeCube = (cubeRef) => {
    const explodeSpeed = 0.1;
    if (cubeRef.current) {
      cubeRef.current.scale.x += explodeSpeed;
      cubeRef.current.scale.y += explodeSpeed;
      cubeRef.current.scale.z += explodeSpeed;
      if (cubeRef.current.scale.x > 5) {
        cubeRef.current.visible = false;
      }
    }
  };

  let delay = 0;

  useFrame((state, delta) => {
  planetRefs.current.forEach((planet) => {
    if (planet) {
      planet.rotation.y += 0.01;
    }
  });

  if (rocketRef.current) {
    // Update stop positions to match cube positions
    const stopPositions = [35, 75, 120]; // These are the Y-positions of the cubes

    // Handle rocket stop at each cube
    if (stopIndex < stopPositions.length) {
      if (rocketRef.current.position.y >= stopPositions[stopIndex]) {
        if (delay < 5) {
          delay += delta;
          // Explode cube after 5 seconds
          if (delay >= 2.5) {
            explodeCube(cubeRefs[stopIndex]);
          }
        } else {
          delay = 0;
          setStopIndex((prev) => prev + 1);
        }
        return; // Stop the rocket at each position
      }
    }

    // Rocket keeps moving upward
    rocketRef.current.position.y += rocketSpeed;
  }

  cubeRefs.forEach((cube) => {
    if (cube.current) {
      cube.current.rotation.x += 0.001;
      cube.current.rotation.y += 0.001;
    }
  });
});


  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <group name="Scene">
          <group name="RootNode" position={[0, -0.33, 0]}>
            <group
              name="CharacterArmature"
              rotation={[-Math.PI / 2, 0, 0]}
              scale={100}
            >
              <primitive object={nodes.Root} />
              <skinnedMesh
                castShadow
                name="Arms"
                geometry={nodes.Arms.geometry}
                material={materials.GradientsMaterial}
                skeleton={nodes.Arms.skeleton}
              />
              <group name="Body_1">
                <skinnedMesh
                  castShadow
                  name="Body_2"
                  geometry={nodes.Body_2.geometry}
                  material={materials.GradientsMaterial}
                  skeleton={nodes.Body_2.skeleton}
                />
                <skinnedMesh
                  castShadow
                  name="Body_3"
                  geometry={nodes.Body_3.geometry}
                  material={materials.Main2}
                  skeleton={nodes.Body_3.skeleton}
                />
              </group>
              <skinnedMesh
                castShadow
                name="Ears"
                geometry={nodes.Ears.geometry}
                material={materials.GradientsMaterial}
                skeleton={nodes.Ears.skeleton}
              />
              <group name="Head_1">
                <skinnedMesh
                  castShadow
                  name="Head_2"
                  geometry={nodes.Head_2.geometry}
                  material={materials.GradientsMaterial}
                  skeleton={nodes.Head_2.skeleton}
                />
                <skinnedMesh
                  castShadow
                  name="Head_3"
                  geometry={nodes.Head_3.geometry}
                  material={materials.EyeColor}
                  skeleton={nodes.Head_3.skeleton}
                />
                <skinnedMesh
                  castShadow
                  name="Head_4"
                  geometry={nodes.Head_4.geometry}
                  material={materials.White}
                  skeleton={nodes.Head_4.skeleton}
                />
                <skinnedMesh
                  castShadow
                  name="Head_5"
                  geometry={nodes.Head_5.geometry}
                  material={materials.Black}
                  skeleton={nodes.Head_5.skeleton}
                />
              </group>
            </group>
          </group>
        </group>
        <mesh
          name="Cube003_Cube002"
          receiveShadow
          castShadow
          geometry={nodes.Cube003_Cube002.geometry}
          material={materials.GradientsMaterial}
        />
      </group>

      <Stars radius={100} depth={50} count={5000} factor={20} fade speed={2} />

      {/* Randomized planets */}
      {createRandomPlanets()}

      {/* Rocket model */}
      <primitive
        object={rocketScene}
        position={[0, 5, -70]}
        scale={[5, 5, 5]}
        ref={rocketRef}
      />

      {/* Cubes with videos */}
      <mesh ref={cubeRefs[0]} position={[70, 35, -120]}>
        <boxGeometry args={[30, 20, 30]} />
        <meshStandardMaterial />
      </mesh>
      <mesh ref={cubeRefs[1]} position={[-90, 75, -70]}>
        <boxGeometry args={[40, 40, 40]} />
        <meshStandardMaterial />
      </mesh>
      <mesh ref={cubeRefs[2]} position={[50, 120, -90]}>
        <boxGeometry args={[40, 40, 40]} />
        <meshStandardMaterial />
      </mesh>

      {/* Glowing text */}
      <Text
        ref={(el) => (textRefs.current[0] = el)}
        position={[0, 100, -500]}
        fontSize={40}
        color="#1ee317"
        outlineWidth={0.7}
        outlineColor="#ff8d00"
      >
        CANNAVERSE will NEVER STOP!!
      </Text>

      {/* Second text */}
      <Text
        ref={(el) => (textRefs.current[1] = el)}
        position={[0, 60, -500]}
        fontSize={30}
        color="#ff8d00"
        outlineWidth={0.5}
        outlineColor="#1ee317"
      >
        WE are going to the moon!!
      </Text>

      {/* Third text */}
      <Text
        ref={(el) => (textRefs.current[2] = el)}
        position={[0, 20, -500]}
        fontSize={25}
        color="#ff0000"
        outlineWidth={0.3}
        outlineColor="#ffffff"
      >
        Its all about community to send a coin and thats what we do!!!
      </Text>
    </>
  );
}

useGLTF.preload("/models/GradientScene.glb");
useGLTF.preload("/models/rocket.glb");
