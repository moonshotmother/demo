"""
generate_data.py
Generates a synthetic dataset with 20 columns (2 textual, 18 numeric).
Writes the result to 'example_dataset.csv'.
"""

import numpy as np
import pandas as pd
import random
import string

def random_title():
    """Generate a short pseudo-title by combining random words."""
    words = [
        "Study", "Analysis", "Evaluation", "Research", "Assessment", "Exploration",
        "Implementation", "Investigation", "Application", "Deployment", "Design", "Review"
    ]
    tech_terms = [
        "Quantum", "AI", "Nano", "Biotech", "Blockchain", "Neural", "Genetic",
        "Robotic", "Photonics", "Cybersecurity", "IoT", "VR"
    ]
    return f"{random.choice(words)} of {random.choice(tech_terms)} {random.choice(words)}"

def random_abstract():
    """Generate a random abstract-like string."""
    vocab = [
        "system", "approach", "method", "data", "algorithm", "process",
        "efficiency", "results", "analysis", "framework", "novel", "improvement",
        "integration", "scalable", "model", "architecture", "validation", "innovation",
        "deployment", "synthesis", "evaluation", "production"
    ]
    sentence_length = random.randint(12, 25)
    abstract_words = [random.choice(vocab) for _ in range(sentence_length)]
    return " ".join(abstract_words).capitalize() + "."

def generate_sample_data(num_rows=10000, output_csv="example_dataset.csv"):
    """
    Generate a dataset with 20 columns:
      1) title (string)
      2) abstract (string)
      3-20) numeric metrics
    """
    columns = [
        "title",
        "abstract",
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
        "public_funding_level"
    ]

    data = {col: [] for col in columns}

    for _ in range(num_rows):
        # Text columns
        data["title"].append(random_title())
        data["abstract"].append(random_abstract())

        # Numeric columns (all 0..1 or appropriate range)
        data["tech_risk"].append(np.random.rand())
        data["adoption_risk"].append(np.random.rand())

        # Market size ~ uniform from 1e6 to 1e10
        data["market_size"].append(np.random.uniform(1e6, 1e10))

        # TRL integer [1..9]
        data["trl"].append(random.randint(1, 9))

        # IP activity ~ 0..100
        data["ip_activity"].append(np.random.randint(0, 101))

        # time_to_market ~ 1..10 years
        data["time_to_market"].append(random.randint(1, 10))

        # disruption_potential ~ 0..1
        data["disruption_potential"].append(np.random.rand())

        # cost_savings ~ 0..500 million
        data["cost_savings"].append(np.random.uniform(0, 5e8))

        # environment_impact ~ 0..1 (assume 1=high environmental impact)
        data["environment_impact"].append(np.random.rand())

        # citation_count ~ 0..1000
        data["citation_count"].append(np.random.randint(0, 1001))

        # feasibility_score ~ 0..1
        data["feasibility_score"].append(np.random.rand())

        # breakthrough_potential ~ 0..1
        data["breakthrough_potential"].append(np.random.rand())

        # innovation_novelty ~ 0..1
        data["innovation_novelty"].append(np.random.rand())

        # societal_impact ~ 0..1
        data["societal_impact"].append(np.random.rand())

        # industry_applicability ~ 0..1
        data["industry_applicability"].append(np.random.rand())

        # readiness_index ~ 0..100
        data["readiness_index"].append(np.random.uniform(0, 100))

        # scalability ~ 0..1
        data["scalability"].append(np.random.rand())

        # public_funding_level ~ 0..1
        data["public_funding_level"].append(np.random.rand())

    df = pd.DataFrame(data, columns=columns)
    df.to_csv(output_csv, index=False)
    print(f"Generated {num_rows} rows. Saved to '{output_csv}'.")

if __name__ == "__main__":
    generate_sample_data(10000, "example_dataset.csv")

