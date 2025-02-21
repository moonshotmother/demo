"use client";
import React, { useRef, useState, useEffect, PointerEvent } from "react";

interface TernaryPlotProps {
  initialRate: number;      // 0..1
  initialLongevity: number; // 0..1
  initialMarket: number;    // 0..1
  onFinish?: (rate: number, longevity: number, market: number) => void;
}

/**
 * This version does NOT call parent on every pointer move.
 * It only calls `onFinish(...)` on pointer up, with the final barycentric values.
 */
export default function TernaryPlot({ initialRate, initialLongevity, initialMarket, onFinish }: TernaryPlotProps) {
  const [localR, setLocalR] = useState(initialRate);
  const [localL, setLocalL] = useState(initialLongevity);
  const [localM, setLocalM] = useState(initialMarket);

  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const A = { x: 0,   y: 0 };
  const B = { x: 100, y: 0 };
  const C = { x: 50,  y: 86.6 };

  const svgRef = useRef<SVGSVGElement>(null);

  // Convert barycentric -> XY in local <g> space
  function barycentricToXY(r: number, l: number, m: number) {
    return {
      x: A.x * r + B.x * l + C.x * m,
      y: A.y * r + B.y * l + C.y * m,
    };
  }

  // Convert XY -> barycentric
  function xyToBarycentric(x: number, y: number) {
    const denom =
      (B.y - C.y) * (A.x - C.x) +
      (C.x - B.x) * (A.y - C.y);
    const wA =
      ((B.y - C.y) * (x - C.x) + (C.x - B.x) * (y - C.y)) / denom;
    const wB =
      ((C.y - A.y) * (x - C.x) + (A.x - C.x) * (y - C.y)) / denom;
    const wC = 1 - wA - wB;
    return { r: wA, l: wB, m: wC };
  }

  // Clamp barycentric so r/l/m remain [0..1] and sum to 1
  function clamp(r: number, l: number, m: number) {
    let rr = Math.max(r, 0);
    let ll = Math.max(l, 0);
    let mm = Math.max(m, 0);
    const sum = rr + ll + mm;
    if (sum < 1e-9) {
      // Fallback if all are 0
      return { r: 1 / 3, l: 1 / 3, m: 1 / 3 };
    }
    rr /= sum;
    ll /= sum;
    mm /= sum;
    return { r: rr, l: ll, m: mm };
  }

  // Initialize local position from initial r/l/m
  useEffect(() => {
    const { x, y } = barycentricToXY(localR, localL, localM);
    setPos({ x, y });
  }, []); // run once

  function handlePointerDown(e: PointerEvent<SVGSVGElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  }

  function handlePointerUp(e: PointerEvent<SVGSVGElement>) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);

    // On pointer up, let the parent know the final r/l/m
    if (onFinish) {
      onFinish(localR, localL, localM);
    }
  }

  function handlePointerMove(e: PointerEvent<SVGSVGElement>) {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Our <g> is shifted by (50, 40)
    const localX = offsetX - 50;
    const localY = offsetY - 40;

    const { r, l, m } = xyToBarycentric(localX, localY);
    const { r: rr, l: ll, m: mm } = clamp(r, l, m);
    const { x, y } = barycentricToXY(rr, ll, mm);

    setPos({ x, y });
    setLocalR(rr);
    setLocalL(ll);
    setLocalM(mm);
  }

  // If parent updates initialRate/initialLongevity/initialMarket from outside,
  // you can sync it inside. But that might lead to re-renders while dragging
  // so we typically skip it. If you do want it, you'd do a useEffect to setLocalR here.

  return (
    <svg
      ref={svgRef}
      width={200}
      height={180}
      style={{ touchAction: "none", cursor: isDragging ? "grabbing" : "grab" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <g transform="translate(50,40)">
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          fill="none"
          stroke="gray"
          strokeWidth={1}
        />
        <text x={A.x} y={A.y - 5} textAnchor="middle" fontSize={10}>
          Rate
        </text>
        <text x={B.x} y={B.y - 5} textAnchor="middle" fontSize={10}>
          Longevity
        </text>
        <text x={C.x} y={C.y + 12} textAnchor="middle" fontSize={10}>
          Market
        </text>
        <circle cx={pos.x} cy={pos.y} r={4} fill="red" />
      </g>
    </svg>
  );
}
