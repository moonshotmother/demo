// profileMessages.ts
export interface ProfileMessage {
    title: string;
    description: string;
    strategy: string;
  }
  
  // We define 8 categories:
  const messages: Record<string, ProfileMessage> = {
    "High-High-High": {
      title: "High Rate, High Longevity, High Market Size",
      description: "Massive potential with strong returns sustained over the long term.",
      strategy: "Invest heavily in R&D, branding, and infrastructure. Secure a competitive moat early (patents, brand recognition, partnerships). Scale aggressively but maintain quality to support longevity."
    },
    "High-High-Low": {
      title: "High Rate, High Longevity, Low Market Size",
      description: "Substantial returns but in a niche market with limited overall size. Long-term dominance in that niche is possible.",
      strategy: "Focus on specialized expertise, higher margins, and consistently upgrading products/services to stay best-in-class. Build strong relationships with the small market you serve and defend that space vigorously."
    },
    "High-Low-High": {
      title: "High Rate, Low Longevity, High Market Size",
      description: "Rapid, possibly explosive returns but the window is short (trend-based, novelty, or tech that quickly becomes obsolete).",
      strategy: "Move fast, capture as many customers as possible, then exit or pivot. Emphasize marketing and quick go-to-market. Keep overhead flexible to handle a swift wind-down or transition."
    },
    "High-Low-Low": {
      title: "High Rate, Low Longevity, Low Market Size",
      description: "Quick bursts of revenue from a limited audience, with no long-term certainty.",
      strategy: "Minimal upfront investment. Exploit the niche quickly, generate profits, then shut down or transition to the next idea. Maintain a lean operation to maximize short-term profitability."
    },
    "Low-High-High": {
      title: "Low Rate, High Longevity, High Market Size",
      description: "Slow but steady returns in a large market over a long time—think stable, ‘evergreen’ industries.",
      strategy: "Focus on steady growth, customer retention, and operational efficiency. Cultivate brand trust and loyalty. Reinforce a solid reputation for reliability and consistency, letting the large market funnel steady business over decades."
    },
    "Low-High-Low": {
      title: "Low Rate, High Longevity, Low Market Size",
      description: "Slow growth in a small, niche arena, but with reliable and consistent demand.",
      strategy: "Keep a tight grip on costs. Leverage personalized relationships with the small customer base. Ensure stability and plan for small but predictable returns over time."
    },
    "Low-Low-High": {
      title: "Low Rate, Low Longevity, High Market Size",
      description: "Limited returns in a huge market, but short-lived demand (maybe a fad or a seasonal/passing trend).",
      strategy: "Avoid large overheads. Quickly set up shop to capture the trend, then dissolve or pivot when the market moves on. Focus on cost containment and short-term marketing tactics."
    },
    "Low-Low-Low": {
      title: "Low Rate, Low Longevity, Low Market Size",
      description: "Modest profits from a short-lived opportunity in a small market—likely only worthwhile if very low investment is required.",
      strategy: "Keep everything ultra-lean. Use quick, inexpensive tactics to capture what you can. Then close or reposition without sunk costs when the venture ends."
    },
  };
  
  // Simple function to get the classification key. 
  export function classifyProfile(
    rate: number,
    longevity: number,
    market: number,
    threshold = 0.5 // you can tweak this 
  ): ProfileMessage {
    const r = rate > threshold ? "High" : "Low";
    const l = longevity > threshold ? "High" : "Low";
    const m = market > threshold ? "High" : "Low";
    const key = `${r}-${l}-${m}`;
    return messages[key];
  }
  