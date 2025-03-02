"use client";
import React from "react";
import { Weights } from "./types";

interface AdvancedSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;

  /** 
   * Current set of weight values 
   */
  weights: Weights;

  /**
   * Callback to update the entire Weights object
   */
  setWeights: (updated: Weights) => void;
}

/**
 * A right-side drawer that slides in when `isOpen = true`,
 * containing advanced weighting sliders for power users.
 */
export default function AdvancedSettingsDrawer({
  isOpen,
  onClose,
  weights,
  setWeights,
}: AdvancedSettingsDrawerProps) {
  /** Handler for updating any single field in `weights` */
  const handleSliderChange = (key: keyof Weights, value: number) => {
    setWeights({ ...weights, [key]: value });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40"
          onClick={onClose}
          style={{ zIndex: 9998 }}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full bg-white border-l
                    shadow-xl p-4 overflow-y-auto transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                    md:w-80 w-full`}
        style={{ zIndex: 9999 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Advanced Settings</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            ✕
          </button>
        </div>

        {/* Rate Factors */}
        <h3 className="text-md font-semibold mb-2">Rate Factors</h3>
        <SliderRow
          label="CAGR Weight"
          value={weights.cagrWeight}
          onChange={(val) => handleSliderChange("cagrWeight", val)}
        />
        <SliderRow
          label="ROI Weight"
          value={weights.roiWeight}
          onChange={(val) => handleSliderChange("roiWeight", val)}
        />
        <SliderRow
          label="Disruption Weight"
          value={weights.disruptionWeight}
          onChange={(val) => handleSliderChange("disruptionWeight", val)}
        />
        <SliderRow
          label="USD Savings/Year"
          value={weights.usdSavingsPerYearWeight}
          onChange={(val) => handleSliderChange("usdSavingsPerYearWeight", val)}
        />
        <SliderRow
          label="Novelty Weight"
          value={weights.noveltyWeight}
          onChange={(val) => handleSliderChange("noveltyWeight", val)}
        />
        <SliderRow
          label="Improvement Weight"
          value={weights.improvementWeight}
          onChange={(val) => handleSliderChange("improvementWeight", val)}
        />
        <SliderRow
          label="Success Probability"
          value={weights.comSuccessProbWeight}
          onChange={(val) => handleSliderChange("comSuccessProbWeight", val)}
        />
        <SliderRow
          label="Standalone Comm. Weight"
          value={weights.standaloneCommWeight}
          onChange={(val) => handleSliderChange("standaloneCommWeight", val)}
        />

        {/* Longevity Factors */}
        <h3 className="text-md font-semibold mt-6 mb-2">Longevity Factors</h3>
        <SliderRow
          label="Years to 50% Penetration"
          value={weights.yearsPenetrationWeight}
          onChange={(val) => handleSliderChange("yearsPenetrationWeight", val)}
        />
        <SliderRow
          label="Adoption Risk"
          value={weights.adoptionRiskWeight}
          onChange={(val) => handleSliderChange("adoptionRiskWeight", val)}
        />
        <SliderRow
          label="Tech Risk"
          value={weights.techRiskWeight}
          onChange={(val) => handleSliderChange("techRiskWeight", val)}
        />
        <SliderRow
          label="TRL Weight"
          value={weights.TRLWeight}
          onChange={(val) => handleSliderChange("TRLWeight", val)}
        />
        <SliderRow
          label="Time to TRL7"
          value={weights.timeToTRL7YearsWeight}
          onChange={(val) => handleSliderChange("timeToTRL7YearsWeight", val)}
        />
        <SliderRow
          label="Break-even Time"
          value={weights.breakEvenTimeWeight}
          onChange={(val) => handleSliderChange("breakEvenTimeWeight", val)}
        />
        <SliderRow
          label="Distinct Patents"
          value={weights.numPatentsWeight}
          onChange={(val) => handleSliderChange("numPatentsWeight", val)}
        />

        {/* Market Factors */}
        <h3 className="text-md font-semibold mt-6 mb-2">Market Factors</h3>
        <SliderRow
          label="Competitors Count"
          value={weights.competitorsCountWeight}
          onChange={(val) => handleSliderChange("competitorsCountWeight", val)}
        />
        <SliderRow
          label="5-Year Market Share"
          value={weights.marketShareWeight}
          onChange={(val) => handleSliderChange("marketShareWeight", val)}
        />
        <SliderRow
          label="Enables/Reshapes Market"
          value={weights.enablesMarketWeight}
          onChange={(val) => handleSliderChange("enablesMarketWeight", val)}
        />
        <SliderRow
          label="Global Market (log)"
          value={weights.globalMarketLogWeight}
          onChange={(val) => handleSliderChange("globalMarketLogWeight", val)}
        />
        <SliderRow
          label="Annual Revenue (log)"
          value={weights.annualRevenueLogWeight}
          onChange={(val) => handleSliderChange("annualRevenueLogWeight", val)}
        />
        <SliderRow
          label="R&D Investment (log)"
          value={weights.rndInvestmentLogWeight}
          onChange={(val) => handleSliderChange("rndInvestmentLogWeight", val)}
        />
      </div>
    </>
  );
}

function SliderRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1">
        {label}: {value.toFixed(2)}
      </label>
      <input
        className="w-full"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
