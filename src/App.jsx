import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  return (
    <Canvas shadows camera={{ position: [2, 4, 25], fov: 65 }}>
      <color attach="background" args={["#eeeeff"]} />
      <Experience />
    </Canvas>
  );
}

export default App;
