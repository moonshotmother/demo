"use client";

import { useState, useEffect, useMemo } from "react";
import { PCA } from "ml-pca";
import { kmeans } from "ml-kmeans"; // or wherever your kmeans function is exported
import { squaredEuclidean } from "ml-distance-euclidean";

import Sidebar from "../components/Sidebar";
import ScatterPlot from "../components/ScatterPlot";
import ArticleTable from "../components/ArticleTable";
import DetailModal from "../components/DetailModal";
import { ArticleData } from "../components/types";

export default function Home() {
  const [rawData, setRawData] = useState<ArticleData[]>([]);
  const [processedData, setProcessedData] = useState<ArticleData[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);

  // Sliders for weighting
  const [techRiskWeight, setTechRiskWeight] = useState(0.3);
  const [adoptionRiskWeight, setAdoptionRiskWeight] = useState(0.3);
  const [marketSizeWeight, setMarketSizeWeight] = useState(0.2);
  const [trlWeight, setTrlWeight] = useState(0.2);

  // Which field to color by in the scatter plot
  const [colorBy, setColorBy] = useState<"cluster" | "composite_score">("cluster");

  // Pinned articles
  const [pinned, setPinned] = useState<string[]>([]);

  // 1) Load data from /public/data.json once
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data: ArticleData[]) => {
        setRawData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // 2) Helper to compute a single "composite" viability score per article
  function computeComposite(d: ArticleData): number {
    const maxMarket = 1e10;
    const trlMax = 9.0;
    return (
      (1 - d.tech_risk) * techRiskWeight +
      (1 - d.adoption_risk) * adoptionRiskWeight +
      (d.market_size / maxMarket) * marketSizeWeight +
      (d.trl / trlMax) * trlWeight
    );
  }

  // 3) PCA + K-means on the client whenever rawData or slider weights change
  useEffect(() => {
    if (rawData.length === 0) return;

    // A) Build numeric matrix from your rawData
    const numericCols = [
      "tech_risk",
      "adoption_risk",
      "market_size",
      "trl",
      "ip_activity",
      "time_to_market",
      "disruption_potential",
      "cost_savings",
      "environment_impact",
      "citation_count",
      "feasibility_score",
      "breakthrough_potential",
      "innovation_novelty",
      "societal_impact",
      "industry_applicability",
      "readiness_index",
      "scalability",
      "public_funding_level",
    ];
    const matrix = rawData.map((d) =>
      numericCols.map((col) => {

// eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = (d as any)[col];
        return typeof val === "number" ? val : 0;
      }),
    );

    // B) PCA with explicit config
    // - method: 'SVD' (or 'NIPALS', etc.)
    // - center: true => subtract column means
    // - scale: false => do not divide by std dev (you may enable if needed)
    const pcaModel = new PCA(matrix, {
      method: "SVD",
      center: true,
      scale: false,
    });
    // Project each row into the first 2 principal components
    const coords = pcaModel.predict(matrix, { nComponents: 2 });

    // C) K-means with explicit options
    const k = 5;
    const kRes = kmeans(matrix, k, {
      maxIterations: 100,
      tolerance: 1e-6,
      initialization: "kmeans++", // or 'random', 'mostDistant', or custom array
      distanceFunction: squaredEuclidean,
    });
    // kRes.clusters => array of cluster IDs
    // kRes.centroids => final centroids

    // D) Build 'processed' dataset: attach PCA coords, cluster ID, composite score
    const updated = rawData.map((article, i) => {
      // coords is an ml-matrix => coords.get(row, col)
      const pcaX = coords.get(i, 0);
      const pcaY = coords.get(i, 1);
      const cluster = kRes.clusters[i];
      const composite = computeComposite(article);
      return {
        ...article,
        pcaX,
        pcaY,
        cluster,
        compositeScore: composite,
      };
    });

    // E) Normalize the compositeScore to 0..1
    const minC = Math.min(...updated.map((u) => u.compositeScore ?? 0));
    const maxC = Math.max(...updated.map((u) => u.compositeScore ?? 1));
    const finalData = updated.map((u) => {
      const cScore = u.compositeScore ?? 0;
      const norm = (cScore - minC) / (maxC - minC + 1e-9);
      return { ...u, compositeScore: norm };
    });

    setProcessedData(finalData);
    setSelectedCluster(null);
    setSelectedArticle(null);
  }, [rawData, techRiskWeight, adoptionRiskWeight, marketSizeWeight, trlWeight]);

  // 4) Table subset: either show all processed data or just the selected cluster
  const tableData = useMemo(() => {
    if (selectedCluster == null) return processedData;
    return processedData.filter((d) => d.cluster === selectedCluster);
  }, [processedData, selectedCluster]);

  // Handlers
  function handlePointClick(a: ArticleData) {
    setSelectedArticle(a);
  }
  function handleRowClick(a: ArticleData) {
    setSelectedArticle(a);
  }
  function closeModal() {
    setSelectedArticle(null);
  }
  function togglePin(a: ArticleData) {
    const t = a.title;
    if (pinned.includes(t)) {
      setPinned(pinned.filter((x) => x !== t));
    } else {
      setPinned([...pinned, t]);
    }
  }

  // 5) Render UI
  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <Sidebar
        techRiskWeight={techRiskWeight}
        setTechRiskWeight={setTechRiskWeight}
        adoptionRiskWeight={adoptionRiskWeight}
        setAdoptionRiskWeight={setAdoptionRiskWeight}
        marketSizeWeight={marketSizeWeight}
        setMarketSizeWeight={setMarketSizeWeight}
        trlWeight={trlWeight}
        setTrlWeight={setTrlWeight}
        pinnedCount={pinned.length}
      />

      {/* MAIN COLUMN */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Commercial Potential Explorer</h1>
          <p className="text-sm text-gray-700">
            Explore thousands of research articles. Adjust weighting in the
            sidebar to see how their composite viability changes. PCA &amp;
            clustering reveal patterns. Pin interesting articles as you go.
          </p>
        </div>

        {/* Color / Cluster Controls */}
        <div className="flex items-center space-x-4">
          <label className="block text-sm font-medium">Color By:</label>
          <select
            className="border rounded px-2 py-1"
            value={colorBy}
            onChange={(e) =>
              setColorBy(e.target.value as "cluster" | "composite_score")
            }
          >
            <option value="cluster">Cluster</option>
            <option value="composite_score">Composite Score</option>
          </select>

          <label className="ml-8 text-sm font-medium">
            Select a Cluster:
            <select
              className="ml-2 border rounded px-2 py-1"
              value={selectedCluster ?? ""}
              onChange={(e) =>
                setSelectedCluster(
                  e.target.value === "" ? null : parseInt(e.target.value),
                )
              }
            >
              <option value="">All</option>
              {[0, 1, 2, 3, 4].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* SCATTER PLOT */}
        <div className="my-4">
          {processedData.length > 0 ? (
            <ScatterPlot
              data={processedData}
              colorBy={colorBy}
              onPointClick={handlePointClick}
            />
          ) : (
            <p>Loading or processing data...</p>
          )}
        </div>

        {/* TABLE */}
        <ArticleTable articles={tableData} onRowClick={handleRowClick} />

        {/* PINNED LIST */}
        <div className="mt-4 bg-white p-4 shadow">
          <h2 className="text-lg font-bold mb-2">Pinned Articles</h2>
          {pinned.length === 0 ? (
            <p className="text-gray-600 text-sm">No pinned items yet.</p>
          ) : (
            <ul className="list-disc list-inside">
              {pinned.map((title, i) => (
                <li key={i}>{title}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      <DetailModal
        article={selectedArticle}
        onClose={closeModal}
        pinned={selectedArticle ? pinned.includes(selectedArticle.title) : false}
        onPin={togglePin}
      />
    </div>
  );
}
