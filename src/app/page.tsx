"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { PCA } from "ml-pca";

// Lazy-load large/rarely used component

const ScatterPlot = dynamic(() => import("../components/ScatterPlot"), { ssr: false });
const ArticleTable = dynamic(() => import("../components/ArticleTable"), { ssr: false });
const DetailModal = dynamic(() => import("../components/DetailModal"), { ssr: false });
const InvestorProfileModal = dynamic(() => import("../components/InvestorProfileModal"), { ssr: false });
const TernaryPlot = dynamic(() => import("@/components/TernaryPlot"), { ssr: false });
const AdvancedSettingsDrawer = dynamic(() => import('../components/AdvancedSettingsDrawer'), {
  ssr: false,
});

import { classifyProfile, ProfileMessage } from "@/utils/profileMessages";
import { ArticleData } from "../components/types";
import EmailPromptModal from "@/components/EmailPromptModal";
import EmailPromptBar from "@/components/EmailPromptBar";

// A small helper to reduce localStorage lookups
function loadFromLocalStorage<T>(key: string, defaultVal: T): T {
  if (typeof window === "undefined") return defaultVal;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultVal;
  } catch {
    return defaultVal;
  }
}

// ------------------------------
// Helpers to compute the fixed Rate / Longevity / Market metrics
// for each article (they do NOT change with user weighting).
// You can adjust these formulas if needed to better fit your data.
// ------------------------------
function computeFixedRate(d: ArticleData): number {
  // Summation of fields relevant to "rate of return"
  // (Adjust as desired; e.g. you might want to scale or average them.)

  return (
    1/8 * (d.CAGR ?? 0) +
    1/8 * (d.ROI_percent ?? 0) +
    1/8 * (d.disruption_score_1_to_10 ?? 0) +
    1/8 * (d.usd_savings_per_year ?? 0) +
    1/8 * (d.novelty_1_to_10 ?? 0) +
    1/8 * (d.improvement_compared_to_existing_1_to_10 ?? 0) +
    1/8 * (d.commercialisation_success_probability_percent ?? 0) +
    1/8 * (d.standalone_commericality_1_to_10 ?? 0)
  );
}

function computeFixedLongevity(d: ArticleData): number {
  // Summation of fields relevant to "longevity"
  return (
    - 1/7 * (d.years_to_50pct_penetration ?? 0) +
    - 1/7 * (d.adoption_risk_1_to_10 ?? 0) +
    - 1/7 * (d.technological_risk_1_to_10 ?? 0) +
      1/7 * (d.TRL ?? 0) +
    - 1/7 * (d.time_to_TRL_7_years ?? 0) +
    - 1/7 * (d.break_even_time_years ?? 0) +
      1/7 * (d.number_distinct_patents ?? 0)
  );
}

function computeFixedMarket(d: ArticleData): number {
  // Summation of fields relevant to "market size"
  return (
    - 1/6 * (d.competitors_count ?? 0) +
      1/6 * (d.five_year_market_share_percent ?? 0) +
      1/6 * (d.enables_or_reshapes_market_1_to_10 ?? 0) +
      1/6 * (d.global_market_size_USD_log ?? 0) +
      1/6 * (d.annual_revenue_USD_log ?? 0) +
    - 1/6 * (d.rnd_investment_required_log ?? 0)
  );
}

export default function Home() {
  // --------------------------
  // Persistent state
  // --------------------------
  const [scoreThreshold, setScoreThreshold] = useState(0.7);
  const [pinned, setPinned] = useState<string[]>([]);
  const [excludedCategories, setExcludedCategories] = useState<string[]>([]);

  const [weights, setWeights] = useState(() =>
    loadFromLocalStorage("weights", {
      // Rate
      cagrWeight: 0,
      roiWeight: 0,
      disruptionWeight: 0,
      usdSavingsPerYearWeight: 0,
      noveltyWeight: 0,
      improvementWeight: 0,
      comSuccessProbWeight: 0,
      standaloneCommWeight: 0,
      // Longevity
      yearsPenetrationWeight: 0,
      adoptionRiskWeight: 0,
      techRiskWeight: 0,
      TRLWeight: 0,
      timeToTRL7YearsWeight: 0,
      breakEvenTimeWeight: 0,
      numPatentsWeight: 0,
      // Market
      competitorsCountWeight: 0,
      marketShareWeight: 0,
      enablesMarketWeight: 0,
      globalMarketLogWeight: 0,
      annualRevenueLogWeight: 0,
      rndInvestmentLogWeight: 0,
    })
  );

  // The user’s investor profile (rate/longevity/market)
  const [investorProfile, setInvestorProfile] = useState<{
    rate: number;
    longevity: number;
    market: number;
  } | null>(null);

  // Classification message from the user’s ternary distribution
  const [userMessage, setUserMessage] = useState<ProfileMessage | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showBar, setShowBar] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);

  // The data from /data.json
  const [rawData, setRawData] = useState<ArticleData[]>([]);
  // PCA results
  const [pcaData, setPcaData] = useState<{ x: number; y: number }[]>([]);
  // Final computed data (after weighting -> composite score)
  const [processedData, setProcessedData] = useState<ArticleData[]>([]);

  // For the detail modal
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);

  // ==========================
  // On mount: localStorage + investorProfile + overlay
  // ==========================
  useEffect(() => {
    // Load pinned/excluded categories/threshold from localStorage
    const saved = loadFromLocalStorage("myAppState", {
      scoreThreshold: 0.7,
      pinned: [] as string[],
      excludedCategories: [] as string[],
    });
    setScoreThreshold(saved.scoreThreshold);
    setPinned(saved.pinned);
    setExcludedCategories(saved.excludedCategories);

    // Investor profile
    const storedProfile = localStorage.getItem("investorProfile");
    if (storedProfile) {
      setInvestorProfile(JSON.parse(storedProfile));
    }

    // Check localStorage on mount for email gating
    const hasSubmitted = localStorage.getItem("hasSubmittedEmail") === "true";
    if (hasSubmitted) {
      // user already submitted => do nothing
      return;
    }
    const overlayTriggered = localStorage.getItem("overlayTriggeredOnce") === "true";
    const hasDismissed = localStorage.getItem("hasDismissedEmailModal") === "true";

    if (!overlayTriggered) {
      const timer = setTimeout(() => {
        localStorage.setItem("overlayTriggeredOnce", "true");
        setShowModal(true);
      }, 60000);
      return () => clearTimeout(timer);
    } else {
      if (!hasDismissed) {
        setShowModal(true);
      } else {
        setShowBar(true);
      }
    }
  }, []);

  // If user has an investorProfile, generate classification
  useEffect(() => {
    if (!investorProfile) return;
    const msg = classifyProfile(
      investorProfile.rate,
      investorProfile.longevity,
      investorProfile.market
    );
    setUserMessage(msg);
  }, [investorProfile]);

  // ==========================
  // Load data + run PCA once
  // ==========================
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data: ArticleData[]) => {
        setRawData(data);

        // 1) Build matrix for PCA
        const numericCols = [
          "CAGR",
          "years_to_50pct_penetration",
          "TRL",
          "time_to_TRL_7_years",
          "usd_savings_per_year",
          "ROI_percent",
          "novelty_1_to_10",
          "number_distinct_patents",
          "commercialisation_success_probability_percent",
          "break_even_time_years",
          "adoption_risk_1_to_10",
          "technological_risk_1_to_10",
          "competitors_count",
          "five_year_market_share_percent",
          "disruption_score_1_to_10",
          "standalone_commericality_1_to_10",
          "improvement_compared_to_existing_1_to_10",
          "enables_or_reshapes_market_1_to_10",
          "global_market_size_USD_log",
          "annual_revenue_USD_log",
          "rnd_investment_required_log",
        ];

        const matrix = data.map((article) =>
          numericCols.map((col) => {
            const val = article[col as keyof ArticleData];
            return typeof val === "number" ? val : 0;
          })
        );

        // 2) Run PCA
        const pcaModel = new PCA(matrix, { method: "SVD", center: true, scale: false });
        const coords = pcaModel.predict(matrix, { nComponents: 2 });

        // 3) Store PCA coords
        const nextPcaData = data.map((_, i) => ({
          x: coords.get(i, 0),
          y: coords.get(i, 1),
        }));
        setPcaData(nextPcaData);
      })
      .catch((err) => console.error(err));
  }, []);

  // ==========================
  // Composite Score calculation
  // ==========================
  const computeComposite = useCallback(
    (d: ArticleData) => {
      const w = weights;
      return (
        (d.CAGR * w.cagrWeight) -
        (d.years_to_50pct_penetration * w.yearsPenetrationWeight) -
        (d.adoption_risk_1_to_10 * w.adoptionRiskWeight) -
        (d.technological_risk_1_to_10 * w.techRiskWeight) +
        (d.disruption_score_1_to_10 * w.disruptionWeight) +
        (d.ROI_percent * w.roiWeight) +
        ((d.TRL ?? 0) * w.TRLWeight) -
        ((d.time_to_TRL_7_years ?? 0) * w.timeToTRL7YearsWeight) +
        ((d.usd_savings_per_year ?? 0) * w.usdSavingsPerYearWeight) +
        ((d.novelty_1_to_10 ?? 0) * w.noveltyWeight) +
        ((d.number_distinct_patents ?? 0) * w.numPatentsWeight) +
        ((d.commercialisation_success_probability_percent ?? 0) * w.comSuccessProbWeight) -
        ((d.break_even_time_years ?? 0) * w.breakEvenTimeWeight) -
        ((d.competitors_count ?? 0) * w.competitorsCountWeight) +
        ((d.five_year_market_share_percent ?? 0) * w.marketShareWeight) +
        ((d.standalone_commericality_1_to_10 ?? 0) * w.standaloneCommWeight) +
        ((d.improvement_compared_to_existing_1_to_10 ?? 0) * w.improvementWeight) +
        ((d.enables_or_reshapes_market_1_to_10 ?? 0) * w.enablesMarketWeight) +
        ((d.global_market_size_USD_log ?? 0) * w.globalMarketLogWeight) +
        ((d.annual_revenue_USD_log ?? 0) * w.annualRevenueLogWeight) -
        ((d.rnd_investment_required_log ?? 0) * w.rndInvestmentLogWeight)
      );
    },
    [weights]
  );

  // ==========================
  // Rebuild processedData after rawData or weights or PCA data
  // ==========================
  useEffect(() => {
    if (!rawData.length || !pcaData.length) return;

    const updated = rawData.map((d, i) => {
      // 1) Recompute composite with user weighting
      const cScore = computeComposite(d);

      // 2) Also compute fixed "Rate", "Longevity", "Market" for each article
      const rateBase = computeFixedRate(d);
      const longevityBase = computeFixedLongevity(d);
      const marketBase = computeFixedMarket(d);

      return {
        ...d,
        pcaX: pcaData[i].x,
        pcaY: pcaData[i].y,
        compositeScore: cScore,
        rateBase,
        longevityBase,
        marketBase,
      };
    });

    // Normalize the composite
    const minC = Math.min(...updated.map((u) => u.compositeScore ?? 0));
    const maxC = Math.max(...updated.map((u) => u.compositeScore ?? 1));
    const finalData = updated.map((u) => {
      const cScore = u.compositeScore ?? 0;
      const norm = (cScore - minC) / (maxC - minC + 1e-9);
      return { ...u, compositeScore: norm };
    });

    setProcessedData(finalData);
  }, [rawData, pcaData, computeComposite]);

  // ==========================
  // Filtering logic
  // ==========================
  const filteredData = useMemo(() => {
    if (!processedData.length) return [];
    const afterThreshold = processedData.filter((d) => (d.compositeScore ?? 0) >= scoreThreshold);
    if (!excludedCategories.length) return afterThreshold;
    return afterThreshold.filter((art) => {
      if (art.categories === "nan") return true;
      return !art.categories.some((cat) => excludedCategories.includes(cat));
    });
  }, [processedData, scoreThreshold, excludedCategories]);

  // Show top 10 categories among the above-threshold set
  const topCategories = useMemo(() => {
    const subsetBeforeExclude = processedData.filter((d) => (d.compositeScore ?? 0) >= scoreThreshold);
    const freqMap: Record<string, number> = {};
    subsetBeforeExclude.forEach((art) => {
      if (art.categories === "nan") return;
      art.categories.forEach((cat) => {
        freqMap[cat] = (freqMap[cat] || 0) + 1;
      });
    });
    const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 10);
  }, [processedData, scoreThreshold]);

  // ==========================
  // Handlers
  // ==========================
  function handleRowOrPointClick(a: ArticleData) {
    setSelectedArticle(a);
  }

  function togglePin(a: ArticleData) {
    const t = a.title;
    if (pinned.includes(t)) {
      setPinned((prev) => prev.filter((x) => x !== t));
    } else {
      setPinned((prev) => [...prev, t]);
    }
  }

  function excludeCategory(cat: string) {
    setExcludedCategories((prev) => (prev.includes(cat) ? prev : [...prev, cat]));
  }
  function undoExcludeCategory(cat: string) {
    setExcludedCategories((prev) => prev.filter((c) => c !== cat));
  }
  function closeModal() {
    setSelectedArticle(null);
  }

  // Save to localStorage whenever pinned/excludes/threshold/weights change
  useEffect(() => {
    localStorage.setItem(
      "myAppState",
      JSON.stringify({
        scoreThreshold,
        pinned,
        excludedCategories,
      })
    );
  }, [scoreThreshold, pinned, excludedCategories]);

  useEffect(() => {
    localStorage.setItem("weights", JSON.stringify(weights));
  }, [weights]);

  // Email gating
  function handleModalClose() {
    setShowModal(false);
    setShowBar(false);
  }
  function handleModalDismiss() {
    localStorage.setItem("hasDismissedEmailModal", "true");
    setShowModal(false);
    setShowBar(true);
  }
  function handleBarSubmitted() {
    setShowBar(false);
  }

  // ==========================
  // Investor Profile
  // ==========================
  function handleProfileSave(p: { rate: number; longevity: number; market: number }) {
    setInvestorProfile(p);
    localStorage.setItem("investorProfile", JSON.stringify(p));

    // Immediately apply these new weights so we recalc
    updateAllWeights(p.rate, p.longevity, p.market);
  }

  function updateAllWeights(r: number, l: number, m: number) {
    setWeights((old) => ({
      ...old,
      // Rate
      cagrWeight: r,
      roiWeight: r,
      disruptionWeight: r,
      usdSavingsPerYearWeight: r,
      noveltyWeight: r,
      improvementWeight: r,
      comSuccessProbWeight: r,
      standaloneCommWeight: r,
      // Longevity
      yearsPenetrationWeight: l,
      adoptionRiskWeight: l,
      techRiskWeight: l,
      TRLWeight: l,
      timeToTRL7YearsWeight: l,
      breakEvenTimeWeight: l,
      numPatentsWeight: l,
      // Market
      competitorsCountWeight: m,
      marketShareWeight: m,
      enablesMarketWeight: m,
      globalMarketLogWeight: m,
      annualRevenueLogWeight: m,
      rndInvestmentLogWeight: m,
    }));
  }

  // ==========================
  // Return JSX
  // ==========================
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* If there's no investor profile stored, show the InvestorProfileModal. */}
      {investorProfile === null && (
        <InvestorProfileModal onClose={() => {}} onSave={handleProfileSave} />
      )}

      <div className="flex-1 flex flex-col p-4 overflow-auto">
        <header className="h-12 bg-gray-200 flex items-center justify-between px-4">
          <h1 className="font-bold">My App</h1>
          <button
            onClick={() => setDrawerOpen(true)}
            className="px-3 py-1 border rounded hover:bg-gray-300"
          >
            Advanced Settings
          </button>
        </header>

        {/* 
          Article Table now shows only:
          - Title
          - ChatGPT link
          - Composite Score
          - Rate
          - Longevity
          - Market
        */}
        <ArticleTable articles={filteredData} onRowClick={handleRowOrPointClick} />

        <h1 className="text-2xl font-bold mt-4">Commercial Potential Explorer</h1>

        {investorProfile && (
          <div className="mb-4">
            <h2 className="text-lg font-bold">Your Investor Profile</h2>
            <TernaryPlot
              initialRate={investorProfile.rate}
              initialLongevity={investorProfile.longevity}
              initialMarket={investorProfile.market}
              onFinish={(r, l, m) => {
                setInvestorProfile({ rate: r, longevity: l, market: m });
                updateAllWeights(r, l, m);
              }}
            />
            <p className="text-sm">
              Rate: {(investorProfile.rate * 100).toFixed(1)}% |
              Longevity: {(investorProfile.longevity * 100).toFixed(1)}% |
              Market: {(investorProfile.market * 100).toFixed(1)}%
            </p>
          </div>
        )}

        {userMessage && (
          <div className="mb-4 p-4 bg-white shadow">
            <h2 className="text-xl font-bold">{userMessage.title}</h2>
            <p className="text-sm text-gray-700 mb-2">{userMessage.description}</p>
            <p className="text-sm text-gray-700">
              <strong>Execution strategy:</strong> {userMessage.strategy}
            </p>
          </div>
        )}

        <div className="my-4">
          {filteredData.length > 0 ? (
            <ScatterPlot data={filteredData} onPointClick={handleRowOrPointClick} />
          ) : (
            <p>No articles above threshold (after exclusion).</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-1">
            Score Threshold: {scoreThreshold.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={scoreThreshold}
            onChange={(e) => setScoreThreshold(parseFloat(e.target.value))}
          />
          <p className="text-xs text-gray-600 mt-1">
            Only show articles with a composite score above this value.
          </p>
        </div>

        <div className="bg-white p-4 my-4 shadow">
          <h2 className="text-lg font-bold mb-2">Top 10 Categories (before exclusion)</h2>
          {!topCategories.length ? (
            <p className="text-sm text-gray-600">No categories found.</p>
          ) : (
            <ul className="list-disc list-inside">
              {topCategories.map(([cat, count]) => (
                <li key={cat}>
                  {cat} ({count})
                  <button
                    onClick={() => excludeCategory(cat)}
                    className="text-blue-600 hover:underline ml-2"
                  >
                    Exclude
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {excludedCategories.length > 0 && (
          <div className="bg-white p-4 my-4 shadow">
            <h2 className="text-lg font-bold mb-2">Excluded Categories</h2>
            <ul className="list-disc list-inside">
              {excludedCategories.map((cat) => (
                <li key={cat}>
                  {cat}
                  <button
                    onClick={() => undoExcludeCategory(cat)}
                    className="text-blue-600 hover:underline ml-2"
                  >
                    Undo
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 bg-white p-4 shadow">
          <h2 className="text-lg font-bold mb-2">Pinned Articles</h2>
          {!pinned.length ? (
            <p className="text-gray-600 text-sm">No pinned items yet.</p>
          ) : (
            <ul className="list-disc list-inside">
              {pinned.map((title, i) => (
                <li key={i}>{title}</li>
              ))}
            </ul>
          )}
        </div>

        <DetailModal
          article={selectedArticle}
          onClose={closeModal}
          pinned={selectedArticle ? pinned.includes(selectedArticle.title) : false}
          onPin={togglePin}
        />

        <AdvancedSettingsDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          weights={weights}
          setWeights={setWeights}
        />
      </div>

      {showModal && (
        <EmailPromptModal
          onClose={handleModalClose}
          onDismiss={handleModalDismiss}
        />
      )}
      {showBar && <EmailPromptBar onSubmitted={handleBarSubmitted} />}
    </div>
  );
}
