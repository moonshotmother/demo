"use client";

import React from "react";
import { ArticleData } from "./types";
import ChatGPTButton from "./ChatGPTButton";

interface ArticleTableProps {
  articles: ArticleData[];
  onRowClick: (article: ArticleData) => void;
}

/**
 * This table now only displays:
 * - Title
 * - ChatGPT link
 * - Composite Score
 * - Rate (rateBase)
 * - Longevity (longevityBase)
 * - Market (marketBase)
 */
export default function ArticleTable({
  articles,
  onRowClick
}: ArticleTableProps) {
  // Sort by composite score descending
  const sortedArticles = React.useMemo(() => {
    return [...articles].sort((a, b) => (b.compositeScore ?? 0) - (a.compositeScore ?? 0));
  }, [articles]);

  return (
    <div className="overflow-x-auto bg-white shadow mt-4">
      <table className="min-w-full text-left text-sm md:text-base table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Open in ChatGPT</th>
            <th className="px-4 py-2">Composite</th>
            <th className="px-4 py-2">Rate</th>
            <th className="px-4 py-2">Longevity</th>
            <th className="px-4 py-2">Market</th>
          </tr>
        </thead>
        <tbody>
          {sortedArticles.map((a, i) => {
            // Prepare chatgpt prompt as before
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
                  <ChatGPTButton query={prompt} />
                </td>
                <td className="px-4 py-2">
                  {a.compositeScore !== undefined
                    ? a.compositeScore.toFixed(3)
                    : "--"}
                </td>
                <td className="px-4 py-2">
                  {a.rateBase !== undefined
                    ? a.rateBase.toFixed(2)
                    : "--"}
                </td>
                <td className="px-4 py-2">
                  {a.longevityBase !== undefined
                    ? a.longevityBase.toFixed(2)
                    : "--"}
                </td>
                <td className="px-4 py-2">
                  {a.marketBase !== undefined
                    ? a.marketBase.toFixed(2)
                    : "--"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
