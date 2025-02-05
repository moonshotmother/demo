"use client";

import React from "react";

interface SidebarProps {
  techRiskWeight: number;
  setTechRiskWeight: (val: number) => void;
  adoptionRiskWeight: number;
  setAdoptionRiskWeight: (val: number) => void;
  marketSizeWeight: number;
  setMarketSizeWeight: (val: number) => void;
  trlWeight: number;
  setTrlWeight: (val: number) => void;
  pinnedCount: number;
}

export default function Sidebar({
  techRiskWeight,
  setTechRiskWeight,
  adoptionRiskWeight,
  setAdoptionRiskWeight,
  marketSizeWeight,
  setMarketSizeWeight,
  trlWeight,
  setTrlWeight,
  pinnedCount
}: SidebarProps) {
  return (
    <div className="w-64 bg-white p-4 shadow flex flex-col">
      <h2 className="text-lg font-bold mb-2">Adjust Weights</h2>

      <div className="mb-4">
        <label className="block text-sm mb-1">
          (1 - Tech Risk): {techRiskWeight.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={techRiskWeight}
          onChange={(e) => setTechRiskWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">
          (1 - Adoption Risk): {adoptionRiskWeight.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={adoptionRiskWeight}
          onChange={(e) => setAdoptionRiskWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">
          Market Size: {marketSizeWeight.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={marketSizeWeight}
          onChange={(e) => setMarketSizeWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">TRL: {trlWeight.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={trlWeight}
          onChange={(e) => setTrlWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="border-t pt-4 mt-auto">
        <p className="text-sm text-gray-600">
          Pinned Articles: <strong>{pinnedCount}</strong>
        </p>
      </div>
    </div>
  );
}
