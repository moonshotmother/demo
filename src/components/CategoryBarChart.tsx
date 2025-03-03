"use client";

import dynamic from "next/dynamic";
import { ArticleData } from "./types";

// Dynamically import react-plotly.js (no SSR)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
});

interface CategoryBarChartProps {
  data: ArticleData[];
  onBarClick: (category: string) => void;
}

type PlotClickEvent = {
  points?: { pointIndex: number }[];
};

export default function CategoryBarChart({ data, onBarClick }: CategoryBarChartProps) {
  // Count frequencies
  const freqMap: Record<string, number> = {};

  data.forEach((article) => {
    // each article has categories: string[]
    if (article.categories == "nan") {
      return;
    }
    article.categories?.forEach((cat) => {
      freqMap[cat] = (freqMap[cat] || 0) + 1;
    });
  });

  const categories = Object.keys(freqMap);
  const counts = categories.map((cat) => freqMap[cat]);

  // Single trace
  const trace = {
    x: categories,
    y: counts,
    type: "bar" as const,
  };

  // Make the chart responsive for mobile
  const layout = {
    title: "Category Distribution",
    autosize: true,
    margin: { l: 40, r: 20, t: 40, b: 40 },
  };

  // If user clicks on a bar, call onBarClick with that category name
  function handleClick(ev: PlotClickEvent) {
    if (ev.points && ev.points.length > 0) {
      const idx = ev.points[0].pointIndex;
      const clickedCategory = categories[idx];
      onBarClick(clickedCategory);
    }
  }

  return (
    <div className="w-full h-[400px] md:h-[600px]">
      <Plot
        data={[trace]}
        layout={layout}
        onClick={handleClick}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        config={{ responsive: true }}
      />
    </div>
  );
}
