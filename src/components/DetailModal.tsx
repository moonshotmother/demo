"use client";

import React from "react";
import { ArticleData } from "./types";
import ChatGPTButton from "./ChatGPTButton";

interface DetailModalProps {
  article: ArticleData | null;
  onClose: () => void;
  onPin: (article: ArticleData) => void;
  pinned: boolean;
}

export default function DetailModal({
  article,
  onClose,
  onPin,
  pinned
}: DetailModalProps) {
  if (!article) return null;

  const prompt = `Help me understand the applications of the article titled: "${article.title}"
  
  Abstract: ${article.abstract}

  Arxiv Categories: ${article.categories}

  First provide a summary of the article for someone highly intelligent but non-technical.

  Explain different commercial applications that could be derived from this research. Consider different industries.
  `;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-2/3 relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-xl font-bold mb-2">{article.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{article.abstract}</p>
        <p className="text-sm text-gray-600 mb-4">{article.categories}</p>

        <ChatGPTButton query={prompt}/>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>Composite: {article.compositeScore?.toFixed(3)}</p>
            <p>CAGR: {article.CAGR.toFixed(2)}</p>
            <p>Years to 50% Penetration: {article.years_to_50pct_penetration.toFixed(2)}</p>
            <p>TRL: {article.TRL.toFixed(2)}</p>
            <p>Savings / Year: {article.usd_savings_per_year.toFixed(2)}</p>
            <p>ROI %: {article.ROI_percent.toFixed(2)}</p>
            <p>Novelty: {article.novelty_1_to_10.toFixed(2)}</p>
            <p>Patents: {article.number_distinct_patents.toFixed(2)}</p>
            <p>Commercial Chance %: {article.commercialisation_success_probability_percent.toFixed(2)}</p>
            <p>Break Even Years: {article.break_even_time_years.toFixed(2)}</p>
            <p>Adoption Risk: {article.adoption_risk_1_to_10.toFixed(2)}</p>
            <p>Tech Risk: {article.technological_risk_1_to_10.toFixed(2)}</p>
            <p>Competitiors: {article.competitors_count.toFixed(2)}</p>
            <p>Disruption: {article.disruption_score_1_to_10.toFixed(2)}</p>
            <p>Standalone Commerciality: {article.standalone_commericality_1_to_10.toFixed(2)}</p>
            <p>Improvement Score: {article.improvement_compared_to_existing_1_to_10.toFixed(2)}</p>
            <p>Market Impact: {article.enables_or_reshapes_market_1_to_10.toFixed(2)}</p>
            <p>Global Market Size logged: {article.global_market_size_USD_log.toFixed(2)}</p>
            <p>Annual Revenue logged: {article.annual_revenue_USD_log.toFixed(2)}</p>
            <p>Investment Required logged: {article.rnd_investment_required_log.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-4">
          {!pinned ? (
            <button
              onClick={() => onPin(article)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Pin
            </button>
          ) : (
            <button
              onClick={() => onPin(article)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Unpin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
