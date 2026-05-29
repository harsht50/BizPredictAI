import pandas as pd

# load datasets
cities = pd.read_csv("dataset/clean_cities_dataset.csv")
startup = pd.read_csv("dataset/clean_startup_dataset.csv")

print("Datasets loaded")

# count startups by city
startup_counts = startup["City"].value_counts()

cities["StartupCount"] = cities["City"].map(startup_counts)

cities["StartupCount"] = cities["StartupCount"].fillna(0)

# normalize indicators
cities["PopulationScore"] = cities["Population"] / cities["Population"].max() * 40
cities["LiteracyScore"] = cities["LiteracyRate"] / cities["LiteracyRate"].max() * 20
cities["GraduateScore"] = cities["Graduates"] / cities["Graduates"].max() * 20
cities["StartupScore"] = cities["StartupCount"] / cities["StartupCount"].max() * 20

# opportunity score
cities["OpportunityScore"] = (
    cities["PopulationScore"]
    + cities["LiteracyScore"]
    + cities["GraduateScore"]
    + cities["StartupScore"]
)

cities = cities.sort_values(by="OpportunityScore", ascending=False)

# save results
cities.to_csv("dataset/city_opportunity_scores.csv", index=False)

print("City opportunity scores generated")
print(cities[["City","OpportunityScore"]].head())