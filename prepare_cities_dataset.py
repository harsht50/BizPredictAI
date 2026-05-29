import pandas as pd

print("Starting script...")

# load dataset
df = pd.read_csv("dataset/cities_r2.csv")

print("Dataset loaded!")

# show column names
print("Columns:", df.columns)

# select useful columns
df = df[[
    "name_of_city",
    "population_total",
    "effective_literacy_rate_total",
    "total_graduates",
    "location"
]]

# rename columns
df.columns = [
    "City",
    "Population",
    "LiteracyRate",
    "Graduates",
    "Location"
]

print("Columns cleaned!")

# remove missing values
df = df.dropna()

# save cleaned dataset
df.to_csv("dataset/clean_cities_dataset.csv", index=False)

print("Cities dataset cleaned successfully!")
print(df.head())