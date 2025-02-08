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

export default function CategoryBarChart({ data, onBarClick }: CategoryBarChartProps) {
  // Count frequencies
  const freqMap: Record<string, number> = {};

  data.forEach((article) => {
    // each article has categories: string[]
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

  // Layout
  const layout = {
    title: "Category Distribution",
    width: 400,
    height: 600,
  };

  // If user clicks on a bar, call onBarClick with that category name
  function handleClick(ev: any) {
    if (ev.points && ev.points.length > 0) {
      const idx = ev.points[0].pointIndex;
      const clickedCategory = categories[idx];
      onBarClick(clickedCategory);
    }
  }

  return (
    <Plot
      data={[trace]}
      layout={layout}
      onClick={handleClick}
    />
  );
}
