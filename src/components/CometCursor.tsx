"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1 -> 0, giảm dần theo thời gian
  size: number;
}

export default function CometCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationId: number;
    let mouseX = -100;
    let mouseY = -100;
    let lastX = mouseX;
    let lastY = mouseY;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const spawnParticles = () => {
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Chuột di chuyển càng nhanh thì sinh càng nhiều hạt, đứng yên thì không sinh gì
      const count = Math.min(Math.floor(dist / 4), 6);

      for (let i = 0; i < count; i++) {
        const t = i / count;
        particles.push({
          x: lastX + dx * t + (Math.random() - 0.5) * 4,
          y: lastY + dy * t + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          life: 1,
          size: Math.random() * 2.5 + 1.5,
        });
      }
      lastX = mouseX;
      lastY = mouseY;
    };

    const render = () => {
      spawnParticles();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;

        const alpha = Math.max(p.life, 0);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `rgba(180, 220, 255, ${alpha})`);
        gradient.addColorStop(0.4, `rgba(120, 170, 255, ${alpha * 0.5})`);
        gradient.addColorStop(1, "rgba(120, 170, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      particles = particles.filter((p) => p.life > 0);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none", // để không chặn thao tác kéo/click phía dưới
        zIndex: 9999,
      }}
    />
  );
}