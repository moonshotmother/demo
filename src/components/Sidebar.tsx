"use client";

import React from "react";

interface SidebarProps {
  // Sliders for various key metrics
  cagrWeight: number;
  setCagrWeight: (val: number) => void;

  yearsPenetrationWeight: number;
  setYearsPenetrationWeight: (val: number) => void;

  adoptionRiskWeight: number;
  setAdoptionRiskWeight: (val: number) => void;

  techRiskWeight: number;
  setTechRiskWeight: (val: number) => void;

  disruptionWeight: number;
  setDisruptionWeight: (val: number) => void;

  roiWeight: number;
  setRoiWeight: (val: number) => void;

  pinnedCount: number;

  TRLWeight: number;
  setTRLWeight: (val: number) => void;
  timeToTRL7YearsWeight: number;
  setTimeToTRL7YearsWeight: (val: number) => void;
  usdSavingsPerYearWeight: number;
  setUsdSavingsPerYearWeight: (val: number) => void;
  noveltyWeight: number;
  setNoveltyWeight: (val: number) => void;
  numPatentsWeight: number;
  setNumPatentsWeight: (val: number) => void;
  comSuccessProbWeight: number;
  setComSuccessProbWeight: (val: number) => void;
  breakEvenTimeWeight: number;
  setBreakEvenTimeWeight: (val: number) => void;
  competitorsCountWeight: number;
  setCompetitorsCountWeight: (val: number) => void;
  marketShareWeight: number;
  setMarketShareWeight: (val: number) => void;
  standaloneCommWeight: number;
  setStandaloneCommWeight: (val: number) => void;
  improvementWeight: number;
  setImprovementWeight: (val: number) => void;
  enablesMarketWeight: number;
  setEnablesMarketWeight: (val: number) => void;
  globalMarketLogWeight: number;
  setGlobalMarketLogWeight: (val: number) => void;
  annualRevenueLogWeight: number;
  setAnnualRevenueLogWeight: (val: number) => void;
  rndInvestmentLogWeight: number;
  setRndInvestmentLogWeight: (val: number) => void;

  scoreThreshold: number;
  setScoreThreshold: (val: number) => void;

}

export default function Sidebar({
  cagrWeight,
  setCagrWeight,
  yearsPenetrationWeight,
  setYearsPenetrationWeight,
  adoptionRiskWeight,
  setAdoptionRiskWeight,
  techRiskWeight,
  setTechRiskWeight,
  disruptionWeight,
  setDisruptionWeight,
  roiWeight,
  setRoiWeight,
  pinnedCount,
  TRLWeight,
  setTRLWeight,
  timeToTRL7YearsWeight,
  setTimeToTRL7YearsWeight,
  usdSavingsPerYearWeight,
  setUsdSavingsPerYearWeight,
  noveltyWeight,
  setNoveltyWeight,
  numPatentsWeight,
  setNumPatentsWeight,
  comSuccessProbWeight,
  setComSuccessProbWeight,
  breakEvenTimeWeight,
  setBreakEvenTimeWeight,
  competitorsCountWeight,
  setCompetitorsCountWeight,
  marketShareWeight,
  setMarketShareWeight,
  standaloneCommWeight,
  setStandaloneCommWeight,
  improvementWeight,
  setImprovementWeight,
  enablesMarketWeight,
  setEnablesMarketWeight,
  globalMarketLogWeight,
  setGlobalMarketLogWeight,
  annualRevenueLogWeight,
  setAnnualRevenueLogWeight,
  rndInvestmentLogWeight,
  setRndInvestmentLogWeight,
  scoreThreshold,
  setScoreThreshold
}: SidebarProps) {
  return (
    <div className="w-64 bg-white p-4 shadow flex flex-col">
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Score Threshold: {scoreThreshold.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={scoreThreshold}
          onChange={(e) => setScoreThreshold(parseFloat(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-gray-600">
          Only show articles with a composite score above this value.
        </p>
      </div>

            {/* Pinned Articles */}
      <div className="border-t pt-4 mt-auto">
        <p className="text-sm text-gray-600">
          Pinned Articles: <strong>{pinnedCount}</strong>
        </p>
      </div>

      <h2 className="text-lg font-bold mb-2">Adjust Weights</h2>

      {/* CAGR */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          CAGR Weight: {cagrWeight.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={cagrWeight}
          onChange={(e) => setCagrWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Years to 50% Penetration */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          (Years to 50% Penetration) Weight: {yearsPenetrationWeight.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={yearsPenetrationWeight}
          onChange={(e) => setYearsPenetrationWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Adoption Risk (1 - adoption_risk_1_to_10) */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          (Adoption Risk): {adoptionRiskWeight.toFixed(2)}
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

      {/* Tech Risk (1 - technological_risk_1_to_10) */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          (Tech Risk): {techRiskWeight.toFixed(2)}
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

      {/* Disruption (disruption_score_1_to_10) */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Disruption Weight: {disruptionWeight.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={disruptionWeight}
          onChange={(e) => setDisruptionWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* ROI (ROI_percent) */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          ROI Weight: {roiWeight.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={roiWeight}
          onChange={(e) => setRoiWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* TRL */}
      <div className="mb-4">
        <label className="block text-sm mb-1">TRL Weight: {TRLWeight.toFixed(2)}</label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={TRLWeight}
          onChange={(e) => setTRLWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Time to TRL 7 */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Time to TRL 7 Weight: {timeToTRL7YearsWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={timeToTRL7YearsWeight}
          onChange={(e) => setTimeToTRL7YearsWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* USD Savings Per Year */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          USD Savings Weight: {usdSavingsPerYearWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={usdSavingsPerYearWeight}
          onChange={(e) => setUsdSavingsPerYearWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Novelty */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Novelty Weight: {noveltyWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={noveltyWeight}
          onChange={(e) => setNoveltyWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Distinct Patents */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Distinct Patents Weight: {numPatentsWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={numPatentsWeight}
          onChange={(e) => setNumPatentsWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Commercialisation Success Probability */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Success Prob. Weight: {comSuccessProbWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={comSuccessProbWeight}
          onChange={(e) => setComSuccessProbWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Break-even Time */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Break-even Time Weight: {breakEvenTimeWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={breakEvenTimeWeight}
          onChange={(e) => setBreakEvenTimeWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Competitors Count */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Competitors Count Weight: {competitorsCountWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={competitorsCountWeight}
          onChange={(e) => setCompetitorsCountWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* 5-year Market Share */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Market Share Weight: {marketShareWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={marketShareWeight}
          onChange={(e) => setMarketShareWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Standalone Commerciality */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Standalone Comm. Weight: {standaloneCommWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={standaloneCommWeight}
          onChange={(e) => setStandaloneCommWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Improvement Over Existing */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Improvement Weight: {improvementWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={improvementWeight}
          onChange={(e) => setImprovementWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Enables or Reshapes Market */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Enables/Reshapes Weight: {enablesMarketWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={enablesMarketWeight}
          onChange={(e) => setEnablesMarketWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Global Market Log */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Global Market Log Weight: {globalMarketLogWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={globalMarketLogWeight}
          onChange={(e) => setGlobalMarketLogWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Annual Revenue Log */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          Annual Revenue Log Weight: {annualRevenueLogWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={annualRevenueLogWeight}
          onChange={(e) => setAnnualRevenueLogWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* RnD Investment Log */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
          RnD Investment Log Weight: {rndInvestmentLogWeight.toFixed(2)}
        </label>
        <input
          type="range" min="0" max="1" step="0.05"
          value={rndInvestmentLogWeight}
          onChange={(e) => setRndInvestmentLogWeight(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>


    </div>
  );
}
