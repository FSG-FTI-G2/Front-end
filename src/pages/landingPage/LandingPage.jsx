// import  TornadoEffect  from "../pages/landingPage/threejsLP"

import React, { useEffect, useRef } from "react";
import "P:\\FA24\\Dev\\Front-end\\src\\pages\\landingPage\\style.css"

const H = 800;
const W = 800;

const DOT = {
  color: "rgb(256,256,256,0.7)",
  colorLine: "rgb(256,256,256,0.5)",
  count: 40,
  vX: 3,
  vY: 3,
  range: 150
};

const gradient = context.createLinearGradient(0, 0, W, H);
gradient.addColorStop(0, "#92fe9d");
gradient.addColorStop(1, "#00c9ff");

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const dots = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = W;
    canvas.height = H;

    class Dot {
      constructor(x, y, vx, vy, r) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = r;
        this.dotsNears = [];
      }

      draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        context.fillStyle = DOT.color;
        context.fill();
        this.dotsNears.forEach((dotNear) => {
          context.beginPath();
          context.moveTo(this.x, this.y);
          context.lineTo(dotNear.x, dotNear.y);
          context.lineWidth = (DOT.range - dotNear.d) * (2 / DOT.range);
          context.strokeStyle = DOT.colorLine;
          context.stroke();
        });
      }

      update(dots) {
        if (this.x - this.r >= W) {
          this.x = 0 - this.r;
          this.vy = (Math.random() - 0.5) * DOT.vY;
        }
        if (this.x + this.r < 0) {
          this.x = W + this.r;
          this.vy = (Math.random() - 0.5) * DOT.vY;
        }
        if (this.y - this.r >= H) {
          this.y = 0 - this.r;
          this.vx = (Math.random() - 0.5) * DOT.vX;
        }
        if (this.y + this.r < 0) {
          this.y = H + this.r;
          this.vx = (Math.random() - 0.5) * DOT.vX;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.dotsNears = [];
        dots.forEach((dot) => {
          if (dot === this) return;
          const d = Math.sqrt((this.x - dot.x) ** 2 + (this.y - dot.y) ** 2);
          if (d < DOT.range) {
            this.dotsNears.push({ x: dot.x, y: dot.y, d: d });
          }
        });
        this.draw();
      }
    }

    const init = () => {
      for (let i = 0; i < DOT.count; i++) {
        const r = Math.random() * 3 + 3;
        const positionX = Math.random() * W;
        const positionY = Math.random() * H;
        const vx = (Math.random() - 0.5) * DOT.vX;
        const vy = (Math.random() - 0.5) * DOT.vY;
        dots.current.push(new Dot(positionX, positionY, vx, vy, r));
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      if (dots.current.length > DOT.count) {
        dots.current = dots.current.filter(
          (dot) =>
            dot.x + dot.r > 0 &&
            dot.x - dot.r < W &&
            dot.y + dot.r > 0 &&
            dot.y - dot.r < H
        );
      }
      dots.current.forEach((dot) => {
        dot.update(dots.current);
      });
    };

    init();
    animate();

    canvas.addEventListener("click", function (event) {
      for (let i = 0; i < 3; i++) {
        const r = Math.random() * 3 + 3;
        const positionX = event.offsetX;
        const positionY = event.offsetY;
        const vx = (Math.random() - 0.5) * DOT.vX;
        const vy = (Math.random() - 0.5) * DOT.vY;
        dots.current.push(new Dot(positionX, positionY, vx, vy, r));
      }
    });
  }, []);

  // New function that we will add to the landing page
  const showAlert = () => {
    alert("Hello! You've clicked the button.");
  };

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      sfasdfdg
      {/* <TornadoEffect /> */}
    </div>
  );
};

export default  CanvasComponent;
