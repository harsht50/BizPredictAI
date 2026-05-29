import pandas as pd

# load datasets
startup_df = pd.read_csv("dataset/clean_startup_dataset.csv")
city_df = pd.read_csv("dataset/clean_cities_dataset.csv")
industry_df = pd.read_csv("dataset/industry_growth.csv")

print("Datasets loaded successfully")

# count startups by industry
industry_counts = startup_df["Industry"].value_counts()

# merge with industry growth dataset
industry_analysis = industry_df.copy()

industry_analysis["StartupCount"] = industry_analysis["Industry"].map(industry_counts)

industry_analysis["StartupCount"] = industry_analysis["StartupCount"].fillna(0)

# calculate industry opportunity score
industry_analysis["OpportunityScore"] = (
    industry_analysis["GrowthRate"] * 50 +
    industry_analysis["StartupCount"] * 0.1
)

industry_analysis = industry_analysis.sort_values(
    by="OpportunityScore",
    ascending=False
)

# save results
industry_analysis.to_csv(
    "dataset/industry_opportunity_scores.csv",
    index=False
)

print("Industry opportunity scores generated!")
print(industry_analysis.head())