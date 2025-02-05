"use client";

import React from "react";
import { ArticleData } from "./types";

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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>Composite: {article.compositeScore?.toFixed(3)}</p>
            <p>Tech Risk: {article.tech_risk?.toFixed(2)}</p>
            <p>Adoption Risk: {article.adoption_risk?.toFixed(2)}</p>
            <p>Market Size: {article.market_size?.toFixed(2)}</p>
          </div>
          <div>
            <p>TRL: {article.trl}</p>
            <p>IP Activity: {article.ip_activity}</p>
            <p>Disruption Potential: {article.disruption_potential?.toFixed(2)}</p>
            <p>Cluster: {article.cluster}</p>
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
