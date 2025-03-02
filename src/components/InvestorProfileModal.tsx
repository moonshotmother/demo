"use client";
import React, { useState } from "react";

interface InvestorProfileModalProps {
  onClose: () => void;
  onSave: (weights: { rate: number; longevity: number; market: number }) => void;
}

export default function InvestorProfileModal({
  onClose,
  onSave,
}: InvestorProfileModalProps) {
  // Each question is rated 1..5
  // We'll have 9 questions
  const [answers, setAnswers] = useState<number[]>(Array(9).fill(3)); // default = 3 ("neutral")

  const questions = [
    // RATE vs LONGEVITY
    {
      text: "I prefer short-term high returns over long-term moderate returns.",
      factorX: "rate",
      factorY: "longevity",
    },
    {
      text: "A venture that can endure for decades matters more to me than maximizing immediate ROI.",
      factorX: "longevity",
      factorY: "rate",
    },
    {
      text: "If forced to choose, I'd take a bigger payout now even if it shortens the venture's lifespan.",
      factorX: "rate",
      factorY: "longevity",
    },

    // RATE vs MARKET
    {
      text: "I prioritize high returns even if the total market size is modest.",
      factorX: "rate",
      factorY: "market",
    },
    {
      text: "I'd rather capture a huge market share, even if ROI is uncertain.",
      factorX: "market",
      factorY: "rate",
    },
    {
      text: "A bigger total addressable market is more appealing than a guaranteed higher ROI in a niche.",
      factorX: "market",
      factorY: "rate",
    },

    // LONGEVITY vs MARKET
    {
      text: "A venture that lasts for decades is more valuable than one that quickly saturates a massive market.",
      factorX: "longevity",
      factorY: "market",
    },
    {
      text: "I prefer a large market even if the window of opportunity is short.",
      factorX: "market",
      factorY: "longevity",
    },
    {
      text: "I'd rather build something enduring in a smaller market than chase a brief wave in a huge market.",
      factorX: "longevity",
      factorY: "market",
    },
  ];

  function handleChange(questionIndex: number, value: number) {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[questionIndex] = value;
      return copy;
    });
  }

  function handleSubmit() {
    let rateScore = 0;
    let longevityScore = 0;
    let marketScore = 0;

    questions.forEach((q, idx) => {
      const ans = answers[idx];
      const offset = ans - 3; // range: -2..+2

      if (q.factorX === "rate") rateScore += offset;
      if (q.factorX === "longevity") longevityScore += offset;
      if (q.factorX === "market") marketScore += offset;

      if (q.factorY === "rate") rateScore -= offset;
      if (q.factorY === "longevity") longevityScore -= offset;
      if (q.factorY === "market") marketScore -= offset;
    });

    const total =
      Math.abs(rateScore) + Math.abs(longevityScore) + Math.abs(marketScore);
    let wRate = 0;
    let wLong = 0;
    let wMarket = 0;

    if (total !== 0) {
      wRate = (rateScore / total + 1) / 2;
      wLong = (longevityScore / total + 1) / 2;
      wMarket = (marketScore / total + 1) / 2;
    }
    const sum = wRate + wLong + wMarket;
    if (sum > 0) {
      wRate /= sum;
      wLong /= sum;
      wMarket /= sum;
    }

    onSave({ rate: wRate, longevity: wLong, market: wMarket });
    onClose();
  }

  const likertLabels = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-2">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full md:w-3/4 mx-auto relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Investor Profile Survey
        </h2>
        <p className="text-sm text-gray-700 mb-6">
          Please rate how strongly you agree with each statement (1 = strongly
          disagree, 5 = strongly agree). Your responses will help us understand
          your investment preferences.
        </p>

        <div className="space-y-6 mb-8 max-h-[50vh] overflow-auto pr-2">
          {questions.map((q, i) => (
            <div
              key={i}
              className="rounded-lg bg-gray-50 p-4 border border-gray-200"
            >
              <p className="font-medium text-gray-800 mb-3">{q.text}</p>
              <div className="flex items-center space-x-2 justify-between max-w-md mx-auto">
                {[1, 2, 3, 4, 5].map((v, idx) => (
                  <label
                    key={v}
                    className={`flex flex-col items-center cursor-pointer w-14 h-14 rounded-md 
                    border hover:border-blue-400 transition-colors 
                    ${
                      answers[i] === v
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-blue-50"
                    }`}
                    title={likertLabels[idx]}
                  >
                    <input
                      type="radio"
                      name={`q_${i}`}
                      value={v}
                      checked={answers[i] === v}
                      onChange={() => handleChange(i, v)}
                      className="hidden"
                    />
                    <span className="text-lg font-semibold">{v}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
