"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ArticleData } from "./types";

// Dynamically import react-plotly.js (no SSR)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
});

interface ScatterPlotProps {
  data: ArticleData[];
  onPointClick: (article: ArticleData) => void;
}

export default function ScatterPlot({
  data,
  onPointClick,
}: ScatterPlotProps) {
  // Extract X and Y for each article
  const xVals = data.map((d) => d.pcaX ?? 0);
  const yVals = data.map((d) => d.pcaY ?? 0);

  // Prepare color array
  const colorVals: number[] = data.map((d) => {
      return d.compositeScore ?? 0;
  });

  // Prepare a single trace for the scatterplot
  const trace = {
    x: xVals,
    y: yVals,
    mode: "markers" as const,
    text: data.map((d) => d.title),
    marker: {
      color: colorVals,
      colorscale: "RdBu", // or any valid Plotly colorscale
      showscale: true, // Show legend scale only for composite_score
      cmin: 0,
      cmax: 1,
      size: 8,
    },
    type: "scatter" as const, // 'scatter' is correct for points
  };

  // Layout config
  const layout = {
    title: "PCA Scatter",
    hovermode: "closest" as const,
    width: 800,
    height: 600,
  };

  // Click handler from Plotly event
  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (ev: any) => {
    if (ev.points && ev.points.length > 0) {
      const idx = ev.points[0].pointIndex;
      onPointClick(data[idx]);
    }
  };

  return (
    <div>
      <Plot 
        data={[trace]}
        layout={layout}
        onClick={handleClick}
      />
    </div>
  );
}
