/**
 * generate_data.ts
 * 
 * Generates a synthetic dataset of research articles and saves it to public/data.json.
 */

import * as fs from "fs";

function randomTitle(): string {
  const adjectives = [
    "Innovative", "Cutting-edge", "Exploratory", "Comprehensive", "Novel",
    "Advanced", "Proprietary", "Quantitative", "Efficient", "Scalable"
  ];
  const nouns = [
    "AI", "Quantum", "Biotech", "Nano", "Blockchain", "Photonics", 
    "Genome", "Cybersecurity", "Materials", "Robotic"
  ];
  const actions = [
    "Analysis", "Study", "Exploration", "Review", "Methodology", "Investigation"
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];

  return `${adj} ${noun} ${action}`;
}

function randomAbstract(): string {
  const words = [
    "system", "approach", "method", "implementation", "analysis", "algorithm",
    "feasibility", "scalability", "integration", "evaluation", "performance",
    "production", "framework", "computational", "architecture", "conclusion",
    "data-driven", "experimental", "results", "industry", "pilot", "deployment"
  ];
  const len = Math.floor(Math.random() * 15) + 10; // 10..25 words
  const sentence: string[] = [];
  for (let i = 0; i < len; i++) {
    const w = words[Math.floor(Math.random() * words.length)];
    sentence.push(w);
  }
  sentence[0] = sentence[0][0].toUpperCase() + sentence[0].slice(1);
  return sentence.join(" ") + ".";
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Article {
  title: string;
  abstract: string;
  tech_risk: number;
  adoption_risk: number;
  market_size: number;
  trl: number;
  ip_activity: number;
  time_to_market: number;
  disruption_potential: number;
  cost_savings: number;
  environment_impact: number;
  citation_count: number;
  feasibility_score: number;
  breakthrough_potential: number;
  innovation_novelty: number;
  societal_impact: number;
  industry_applicability: number;
  readiness_index: number;
  scalability: number;
  public_funding_level: number;
}

function generateData(numEntries: number): Article[] {
  const data: Article[] = [];

  for (let i = 0; i < numEntries; i++) {
    data.push({
      title: randomTitle(),
      abstract: randomAbstract(),
      tech_risk: parseFloat(Math.random().toFixed(2)),       // 0..1
      adoption_risk: parseFloat(Math.random().toFixed(2)),   // 0..1
      market_size: randomFloat(1e6, 1e10),                   // 1 million..10 billion
      trl: randomInt(1, 9),                                  // 1..9
      ip_activity: randomInt(0, 100),                        // 0..100
      time_to_market: randomInt(1, 10),                      // 1..10
      disruption_potential: parseFloat(Math.random().toFixed(2)), // 0..1
      cost_savings: randomFloat(0, 5e8),                     // up to 500 million
      environment_impact: parseFloat(Math.random().toFixed(2)),   // 0..1
      citation_count: randomInt(0, 1000),                    // 0..1000
      feasibility_score: parseFloat(Math.random().toFixed(2)),    // 0..1
      breakthrough_potential: parseFloat(Math.random().toFixed(2)),
      innovation_novelty: parseFloat(Math.random().toFixed(2)),
      societal_impact: parseFloat(Math.random().toFixed(2)),
      industry_applicability: parseFloat(Math.random().toFixed(2)),
      readiness_index: parseFloat(randomFloat(0, 100).toFixed(2)), // 0..100
      scalability: parseFloat(Math.random().toFixed(2)),           // 0..1
      public_funding_level: parseFloat(Math.random().toFixed(2))   // 0..1
    });
  }

  return data;
}

// Main
const NUM_ENTRIES = 2000;
const dataset = generateData(NUM_ENTRIES);

fs.writeFileSync("public/data.json", JSON.stringify(dataset, null, 2));
console.log(`Generated dataset with ${NUM_ENTRIES} articles. Saved to public/data.json.`);
