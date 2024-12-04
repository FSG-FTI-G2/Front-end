import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Chatbot } from "../../../Robot_playground"; // Thay bằng đường dẫn đến Chatbot của bạn

// Hàm tính toán vị trí đồng đều trên hình cầu
const generateSpherePositions = (count, radius) => {
  const positions = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Góc vàng để phân bố đều

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // Giá trị y từ -1 đến 1
    const radiusAtY = Math.sqrt(1 - y * y) * radius; // Bán kính tại mỗi y
    const theta = i * goldenAngle; // Góc xoay

    positions.push([
      Math.cos(theta) * radiusAtY, // X
      y * radius,                  // Y
      Math.sin(theta) * radiusAtY, // Z
    ]);
  }

  return positions;
};

// Tornado Scene
function TornadoScene({ onTextClick }) {
  const texts = ["Hello", "React", "Three.js", "Fiber", "Animation", "Helloworld"];
  const positions = generateSpherePositions(texts.length, 8); // Bán kính 6 đơn vị
  const groupRef = useRef();

  // Quay nhóm để tạo hiệu ứng chuyển động
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.5; // Quay chậm
    }
  });

  return (
    <group ref={groupRef}>
      {texts.map((text, i) => (
        <group
          key={i}
          position={positions[i]}
          onClick={() => onTextClick(text)} // Sự kiện click
        >
          <mesh>
            <Text
              fontSize={1}
              color="white"
              outlineWidth={0.05}
              outlineColor="black"
              anchorX="center"
              anchorY="middle"
            >
              {text}
            </Text>
          </mesh>
        </group>
      ))}
      {/* Vật thể trung tâm */}
      <group position={[0, -3, 0]}>
        <Chatbot scale={[3, 3, 3]} /> {/* Sử dụng vật thể từ Chatbot */}
      </group>
    </group>
  );
}

// Tornado Effect
export default function TornadoEffect() {
  // Hàm xử lý click vào text
  const onTextClick = (text) => {
    const element = document.getElementById(text); // Tìm phần tử với ID tương ứng
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" }); // Cuộn đến phần tử
    }
  };

  // Refresh lại trang
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #74ebd5, #ACB6E5)",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Nút refresh */}
      <button
        onClick={refreshPage}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 20px",
          backgroundColor: "#ffffff",
          color: "#333",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        Refresh
      </button>

      {/* Canvas Tornado */}
      <Canvas camera={{ position: [0, 0, 15] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} />
        <TornadoScene onTextClick={onTextClick} />
      </Canvas>

      {/* Sections trên trang */}
      <div id="Hello" style={{ height: "100vh", backgroundColor: "rgba(255,255,255,0.9)" }}>
        <h1 style={{ textAlign: "center", padding: "50px" }}>Hello</h1>
        <p style={{ textAlign: "center" }}>This is the Hello section.</p>
      </div>
      <div id="React" style={{ height: "100vh", backgroundColor: "rgba(240,240,240,0.9)" }}>
        <h1 style={{ textAlign: "center", padding: "50px" }}>React</h1>
        <p style={{ textAlign: "center" }}>This is the React section.</p>
      </div>
      <div id="Three.js" style={{ height: "100vh", backgroundColor: "rgba(230,230,230,0.9)" }}>
        <h1 style={{ textAlign: "center", padding: "50px" }}>Three.js</h1>
        <p style={{ textAlign: "center" }}>This is the Three.js section.</p>
      </div>
      <div id="Fiber" style={{ height: "100vh", backgroundColor: "rgba(220,220,220,0.9)" }}>
        <h1 style={{ textAlign: "center", padding: "50px" }}>Fiber</h1>
        <p style={{ textAlign: "center" }}>This is the Fiber section.</p>
      </div>
      <div id="Animation" style={{ height: "100vh", backgroundColor: "rgba(210,210,210,0.9)" }}>
        <h1 style={{ textAlign: "center", padding: "50px" }}>Animation</h1>
        <p style={{ textAlign: "center" }}>This is the Animation section.</p>
      </div>
      <div id="Helloworld" style={{ height: "100vh", backgroundColor: "rgba(200,200,200,0.9)" }}>
        <h1 style={{ textAlign: "center", padding: "50px" }}>Helloworld</h1>
        <p style={{ textAlign: "center" }}>This is the Helloworld section.</p>
      </div>
    </div>
  );
}
