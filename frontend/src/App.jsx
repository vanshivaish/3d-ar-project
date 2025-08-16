import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import axios from 'axios';

// Spinning cube component
function SpinningCube() {
  const meshRef = useRef();
  useFrame(() => {
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [modelUrl, setModelUrl] = useState('');

  const generateModel = async () => {
    try {
      // Call backend placeholder
      const res = await axios.post('http://localhost:5000/generate', { prompt });
      setModelUrl(res.data.url); // currently a placeholder
    } catch (err) {
      console.error(err);
      setModelUrl('Error generating model');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [3, 3, 3] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <SpinningCube />
        <OrbitControls />
      </Canvas>

      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt"
        />
        <button onClick={generateModel}>Generate</button>

        {modelUrl && (
          <div>
            <p>Model URL: {modelUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
}
