"use client";

import React from "react";
import { ArticleData } from "./types";

interface ArticleTableProps {
  articles: ArticleData[];
  onRowClick: (article: ArticleData) => void;
}

export default function ArticleTable({
  articles,
  onRowClick
}: ArticleTableProps) {
  return (
    <div className="overflow-auto bg-white shadow mt-4">
      <table className="min-w-full text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Composite</th>
            <th className="px-4 py-2">TechRisk</th>
            <th className="px-4 py-2">AdoptionRisk</th>
            <th className="px-4 py-2">TRL</th>
            <th className="px-4 py-2">Cluster</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a, i) => (
            <tr
              key={i}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => onRowClick(a)}
            >
              <td className="px-4 py-2">{a.title}</td>
              <td className="px-4 py-2">
                {a.compositeScore !== undefined ? a.compositeScore.toFixed(3) : "--"}
              </td>
              <td className="px-4 py-2">
                {a.tech_risk !== undefined ? a.tech_risk.toFixed(2) : "--"}
              </td>
              <td className="px-4 py-2">
                {a.adoption_risk !== undefined ? a.adoption_risk.toFixed(2) : "--"}
              </td>
              <td className="px-4 py-2">{a.trl}</td>
              <td className="px-4 py-2">{a.cluster !== undefined ? a.cluster : "--"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
