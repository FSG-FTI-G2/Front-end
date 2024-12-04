import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { Text, Environment, Sky,  } from "@react-three/drei";
import { Chatbot } from "../../../Robot_playground";
// import Background from "../landingPage/background"

// Hàm tạo giá trị ngẫu nhiên trong khoảng
const randomInRange = (min, max) => Math.random() * (max - min) + min;

function TornadoScene() {
  const texts = ["Hello", "React", "Three.js", "Fiber", "Animation", "Helloworld"];
  const groupRef = useRef();
  const [visibleTexts, setVisibleTexts] = useState(texts.map(() => true)); // Trạng thái hiển thị của từng text

  // Animation cho mỗi text
  const springs = texts.map((_, i) =>
    useSpring({
      from: {
        position: [
          randomInRange(-5, 5), // Vị trí ngẫu nhiên ban đầu
          randomInRange(0, 10),    // Vị trí ngẫu nhiên trên trục Y
          randomInRange(-5, 5),  // Vị trí ngẫu nhiên trên trục Z
        ],
        scale: [25,25,25],  // Kích thước ban đầu
        opacity: 1,        // Hiển thị rõ ràng
      },
      to: async (next) => {
        // Di chuyển qua lại ngẫu nhiên
        await next({
          position: [
            randomInRange(-5, 5),
            randomInRange(0, 10),
            randomInRange(-5, 5),
          ],
          opacity: 1,
          scale: [1, 1, 1],
        });
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Dừng 5 giây cho user đọc

        // Cuốn vào tornado (di chuyển vào trung tâm)
        await next({
          position: [0, -7, 0],  // Di chuyển vào trung tâm
          scale: [0.3, 0.3, 0.3], // Thu nhỏ text
          opacity: 0, // Mờ dần
        });

        // Ẩn text sau khi hoàn tất
        setVisibleTexts((prev) => {
          const updated = [...prev];
          updated[i] = false; // Ẩn text khi hoàn tất
          return updated;
        });
      },
      config: { tension: 120, friction: 20 },
    })
  );

  // Quay group để tạo hiệu ứng "vòi rồng"
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 2; // Quay group để tạo hiệu ứng vòi rồng
    }
  });

  return (
    <group ref={groupRef}>
      {texts.map((text, i) =>
        visibleTexts[i] ? ( // Chỉ render text nếu nó chưa biến mất
          <animated.group key={i} position={springs[i].position} scale={springs[i].scale}>
            <animated.mesh>
              <Text fontSize={1} color="black" opacity={springs[i].opacity}>
                {text}
              </Text>
            </animated.mesh>
          </animated.group>
        ) : null
      )}
      {/* Vật thể trung tâm */}
      <group position={[0, -7, 0]}>
        <Chatbot scale={[3, 3, 3]} /> {/* Sử dụng vật thể từ Chatbot */}
      </group>
    </group>
  );
}

export default function TornadoEffect() {
    return (
      <Canvas camera={{ position: [0, 0, 15] }}>
        
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} />
        <TornadoScene />
        {/* <Sky sunPosition={[100, 20, 100]} /> */}
        {/* <Environment files="P:\FA24\Dev\Front-end\public\models\749-hdri-skies-com.hdr" background /> */}
        {/* <Environment preset="apartment" background /> */}
     </Canvas>
    );
  }
