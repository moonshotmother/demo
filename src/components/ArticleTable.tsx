"use client";

import React from "react";
import { ArticleData } from "./types";
import ChatGPTButton from "./ChatGPTButton";

interface ArticleTableProps {
  articles: ArticleData[];
  onRowClick: (article: ArticleData) => void;
}

export default function ArticleTable({
  articles,
  onRowClick
}: ArticleTableProps) {
  const sortedArticles = React.useMemo(() => {
    return [...articles].sort((a, b) => (b.compositeScore ?? 0) - (a.compositeScore ?? 0));
  }, [articles]);

  return (
    <div className="overflow-x-auto bg-white shadow mt-4">
      <table className="min-w-full text-left">
        <thead className="bg-gray-200">
          <tr>
          <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Open in ChatGPT</th>
            <th className="px-4 py-2">Composite</th>
            <th className="px-4 py-2">CAGR</th>
            <th className="px-4 py-2">Years to 50% Penetration</th>
            <th className="px-4 py-2">TRL</th>
            <th className="px-4 py-2">Time TRL 7</th>
            <th className="px-4 py-2">Savings / Year</th>
            <th className="px-4 py-2">ROI %</th>
            <th className="px-4 py-2">Novelty</th>
            <th className="px-4 py-2">Patents</th>
            <th className="px-4 py-2">Commercial Chance %</th>
            <th className="px-4 py-2">Break Even Years</th>
            <th className="px-4 py-2">Adoption Risk</th>
            <th className="px-4 py-2">Tech Risk</th>
            <th className="px-4 py-2">Competitiors</th>
            <th className="px-4 py-2">5 Year Mark etshare</th>
            <th className="px-4 py-2">Disruption</th>
            <th className="px-4 py-2">Standalone Commerciality</th>
            <th className="px-4 py-2">Improvement Score</th>
            <th className="px-4 py-2">Market Impact</th>
            <th className="px-4 py-2">Global Market Size logged</th>
            <th className="px-4 py-2">Annual Revenue logged</th>
            <th className="px-4 py-2">Investment Required logged</th>
            <th className="px-4 py-2">Categories</th>
            <th className="px-4 py-2">Cluster</th>
          </tr>
        </thead>
        <tbody>
          {sortedArticles.map((a, i) => {
            
            const prompt = `Help me understand the applications of the article titled: "${a.title}"
  
            Abstract: ${a.abstract}
          
            Arxiv Categories: ${a.categories}
          
            First provide a summary of the article for someone highly intelligent but non-technical.
          
            Explain different commercial applications that could be derived from this research. Consider different industries.
            `;
          

            return (
            <tr
              key={i}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => onRowClick(a)}
            >
              <td className="px-4 py-2">{a.title}</td>
              <td className="px-4 py-2">
            <ChatGPTButton query={prompt}/>

              </td>
              <td className="px-4 py-2">
                {a.compositeScore?.toFixed(3) ?? "--"}
              </td>
              <td className="px-4 py-2">
                {a.CAGR.toFixed(2)}
              </td>
              <td className="px-4 py-2">
                {a.years_to_50pct_penetration.toFixed(2)}
              </td>
              <td className="px-4 py-2">{a.TRL.toFixed(2)}</td>
              <td className="px-4 py-2">{a.time_to_TRL_7_years.toFixed(2)}</td>
              <td className="px-4 py-2">{a.usd_savings_per_year.toFixed(2)}</td>
              <td className="px-4 py-2">{a.ROI_percent.toFixed(2)}</td>
              <td className="px-4 py-2">{a.novelty_1_to_10.toFixed(2)}</td>
              <td className="px-4 py-2">{a.number_distinct_patents.toFixed(2)}</td>
              <td className="px-4 py-2">{a.commercialisation_success_probability_percent.toFixed(2)}</td>
              <td className="px-4 py-2">{a.break_even_time_years.toFixed(2)}</td>
              <td className="px-4 py-2">{a.adoption_risk_1_to_10.toFixed(2)}</td>
              <td className="px-4 py-2">{a.technological_risk_1_to_10.toFixed(2)}</td>
              <td className="px-4 py-2">{a.competitors_count.toFixed(2)}</td>
              <td className="px-4 py-2">{a.five_year_market_share_percent.toFixed(2)}</td>
              <td className="px-4 py-2">{a.disruption_score_1_to_10.toFixed(2)}</td>
              <td className="px-4 py-2">{a.standalone_commericality_1_to_10.toFixed(2)}</td>
              <td className="px-4 py-2">{a.improvement_compared_to_existing_1_to_10.toFixed(2)}</td>
              <td className="px-4 py-2">{a.enables_or_reshapes_market_1_to_10.toFixed(2)}</td>
              <td className="px-4 py-2">{a.global_market_size_USD_log.toFixed(2)}</td>
              <td className="px-4 py-2">{a.annual_revenue_USD_log.toFixed(2)}</td>
              <td className="px-4 py-2">{a.rnd_investment_required_log.toFixed(2)}</td>
              <td className="px-4 py-2">{a.categories}</td>
              <td className="px-4 py-2">{a.cluster !== undefined ? a.cluster : "--"}</td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}
