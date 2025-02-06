export interface ArticleData {
    title: string;
    abstract: string;

    CAGR: number;
    years_to_50pct_penetration: number;
    TRL: number;
    time_to_TRL_7_years: number;
    usd_savings_per_year: number;
    ROI_percent: number;
    novelty_1_to_10: number;    
    number_distinct_patents: number;
    commercialisation_success_probability_percent: number;
    break_even_time_years: number;
    adoption_risk_1_to_10: number;
    technological_risk_1_to_10: number;
    competitors_count: number;
    year_market_share_percent: number;
    disruption_score_1_to_10: number;
    standalone_commericality_1_to_10: number;
    improvement_compared_to_existing_1_to_10: number;
    enables_or_reshapes_market_1_to_10: number;
    global_market_size_USD_log: number;
    annual_revenue_USD_log: number;
    rnd_investment_required_log: number;

  
    // Computed fields:
    compositeScore?: number;
    pcaX?: number;
    pcaY?: number;
    cluster?: number;
  }
  