export interface ArticleData {
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
  
    // Computed fields:
    compositeScore?: number;
    pcaX?: number;
    pcaY?: number;
    cluster?: number;
  }
  