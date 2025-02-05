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
  colorBy: "cluster" | "composite_score";
  onPointClick: (article: ArticleData) => void;
}

export default function ScatterPlot({
  data,
  colorBy,
  onPointClick,
}: ScatterPlotProps) {
  // Extract X and Y for each article
  const xVals = data.map((d) => d.pcaX ?? 0);
  const yVals = data.map((d) => d.pcaY ?? 0);

  // Prepare color array
  const colorVals: number[] = data.map((d) => {
    if (colorBy === "cluster") {
      // cluster is integer or undefined
      return d.cluster ?? 0;
    } else {
      // composite_score is float or undefined
      return d.compositeScore ?? 0;
    }
  });

  // Prepare a single trace for the scatterplot
  const trace = {
    x: xVals,
    y: yVals,
    mode: "markers",
    text: data.map((d) => d.title),
    marker: {
      color: colorVals,
      colorscale: "RdBu", // or any valid Plotly colorscale
      showscale: colorBy !== "cluster", // Show legend scale only for composite_score
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
