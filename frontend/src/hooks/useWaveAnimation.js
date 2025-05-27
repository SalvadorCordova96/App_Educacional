// frontend/src/hooks/useWaveAnimation.js
import { useRef, useEffect } from 'react';

const MAX_FPS = 60;
const FRAME_TIME = 1000 / MAX_FPS;

export const useWaveAnimation = ({
  canvasRef,
  isListening,
  isSpeaking,
  amplitudeMultiplier,
  width,
  height,
  waveColor,
  listeningColor,
  speakingColor,
}) => {
  const animationFrameIdRef = useRef(null);
  const phaseRef = useRef(0);
  const lastRenderTimeRef = useRef(0);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctxRef.current = ctx;

    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = width * dpr;
    const canvasHeight = height * dpr;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let currentBaseAmplitude = 20;
    let currentFrequency = 0.02;
    let currentLineThickness = 2;
    let currentNumWaves = 3;
    let currentColor = waveColor;
    let phaseSpeed = 0.03;

    const draw = (timestamp) => {
      if (lastRenderTimeRef.current) {
        const progress = timestamp - lastRenderTimeRef.current;
        if (progress < FRAME_TIME) {
          animationFrameIdRef.current = requestAnimationFrame(draw);
          return;
        }
      }
      lastRenderTimeRef.current = timestamp;

      const ctx = ctxRef.current;
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      // Update wave parameters based on state
      if (isListening) {
        currentBaseAmplitude = 35 * amplitudeMultiplier;
        currentFrequency = 0.03;
        currentLineThickness = 2.5;
        currentColor = listeningColor;
        currentNumWaves = 4;
        phaseSpeed = 0.05;
      } else if (isSpeaking) {
        currentBaseAmplitude = 45 * amplitudeMultiplier;
        currentFrequency = 0.025 + Math.sin(phaseRef.current * 5) * 0.005;
        currentLineThickness = 3;
        currentColor = speakingColor;
        currentNumWaves = 2;
        phaseSpeed = 0.07;
      } else {
        currentBaseAmplitude = 20 * amplitudeMultiplier;
        currentFrequency = 0.02;
        currentLineThickness = 2;
        currentColor = waveColor;
        currentNumWaves = 3;
        phaseSpeed = 0.03;
      }

      // Draw multiple waves with varying opacity
      for (let i = 0; i < currentNumWaves; i++) {
        ctx.beginPath();
        ctx.lineWidth = currentLineThickness / (i * 0.5 + 1);

        // Calculate color with smooth transition
        const alphaMatch = currentColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (alphaMatch) {
          const r = alphaMatch[1];
          const g = alphaMatch[2];
          const b = alphaMatch[3];
          const baseAlpha = alphaMatch[4] !== undefined ? parseFloat(alphaMatch[4]) : 1;
          const newAlpha = Math.max(0, baseAlpha * (1 - i * 0.35));
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${newAlpha.toFixed(2)})`;
        } else {
          ctx.globalAlpha = 1 - i * 0.35;
          ctx.strokeStyle = currentColor;
        }

        const waveAmplitude = currentBaseAmplitude * (1 - i * 0.3);
        const wavePhaseOffset = (i * Math.PI) / (currentNumWaves * 0.8);

        // Add subtle glow effect
        ctx.shadowBlur = i === 0 ? 5 : 0;
        ctx.shadowColor = currentColor;

        for (let x = 0; x < width; x++) {
          const noiseFactor =
            isSpeaking || isListening
              ? 0
              : Math.sin(phaseRef.current * 1.5 + x * 0.05) * (i === 0 ? 2 : 1);
          const y =
            height / 2 +
            waveAmplitude * Math.sin(x * currentFrequency + phaseRef.current + wavePhaseOffset) +
            noiseFactor;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      phaseRef.current += phaseSpeed;
      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    draw(performance.now());

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [
    isListening,
    isSpeaking,
    amplitudeMultiplier,
    width,
    height,
    waveColor,
    listeningColor,
    speakingColor,
  ]);
};
