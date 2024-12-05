import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Chatbot } from "./Robot_playground";
import CanvasAnimation from "./Backgroundanimation";
import { useNavigate } from "react-router-dom";

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
  const texts = ["Hello", "React", "Helloworld"];
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
  const navigate = useNavigate();
  const [showBackup, setShowBackup] = useState(false); // Trạng thái hiển thị nút Backup

  const onTextClick = (text) => {
    setShowBackup(true); // Hiển thị nút Backup khi nhấp vào văn bản
    const element = document.getElementById(text);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const BackupPage = () => {
    window.location.reload();
  };

  // Function to handle login button click
  const handleLoginClick = () => {
    navigate("/login"); // Navigate to the login page
  };

  const center = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100vh",
    color: "blue",
    fontSize: 40
  };
  
  const section1 = useRef();
  const section2 = useRef();
  const section3 = useRef();
  const section4 = useRef();

  const scrollHandler = (elmRef) => {
    console.log(elmRef.current);
    window.scrollTo({ top: elmRef.current.offsetTop, behavior: "smooth" });
  };

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      {/* Background Animation */}
      <CanvasAnimation />

      {/* BackupPage button */}
      {showBackup && (
        <button
          onClick={BackupPage}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: "10px 20px",
            backgroundColor: "#aed581",
            color: "#333",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          Backup
        </button>
      )}

      {/* Login Button */}
      <button
        onClick={handleLoginClick}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#aed581",
          color: "#333",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          zIndex: 1000,
        }}
      >
        Login
      </button>

      {/* Canvas Tornado */}
      <Canvas camera={{ position: [0, 0, 15] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} />
        <TornadoScene onTextClick={onTextClick} />
      </Canvas>


      {/* Các phần nội dung cuộn */}
      <div id="Hello" style={{ height:"100vh", backgroundColor: "rgba(255,255,255,0.9)", overflow:"scroll" }}>
        <h1 style={{ textAlign: "center", padding: "50px" }}>Hello</h1>
        <p style={{ textAlign: "center" }}>This is the Hello section.</p>
      </div>
      <div id="React" style={{ height: "100vh", backgroundColor: "rgba(240,240,240,0.9)", overflow:"scroll" }}>
        <h1 style={{ textAlign: "center", padding: "50px" }}>React</h1>
        <p style={{ textAlign: "center" }}>This is the React section.</p>
      </div>
      <div id="Helloworld" style={{ height: "100vh", backgroundColor: "rgba(200,200,200,0.9)", overflow:"scroll" }}>
        <h1 style={{ textAlign: "center", padding: "50px" }}>Helloworld</h1>
        <p style={{ textAlign: "center" }}>This is the Helloworld section.</p>
      </div>
    </div>
  );
}


// import React from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei"; // Import OrbitControls
// import Chatbot from "../LandingPage/model.jsx";

// export default function TornadoEffect() {
//   return (
//     <Canvas
//       camera={{ position: [0, 1, 10], fov: 45 }}
//       style={{ height: "100vh", background: "lightblue" }}
//     >
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[10, 10, 5]} intensity={1} />

//       <Chatbot scale={[3, 3, 3]} position={[0, 0, 0]} />

//       {/* Add OrbitControls here */}
//       <OrbitControls />
//     </Canvas>
//   );
// }
