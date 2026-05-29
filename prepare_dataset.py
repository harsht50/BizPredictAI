import pandas as pd

# Load dataset
df = pd.read_csv("dataset/startup_funding.csv")

# Select useful columns (use exact names from dataset)
df = df[[
    "City  Location",
    "Industry Vertical",
    "Amount in USD"
]]

# Rename columns for easier use
df.columns = ["City", "Industry", "Investment"]

# Remove missing values
df = df.dropna()

# Clean investment column
df["Investment"] = df["Investment"].astype(str)
df["Investment"] = df["Investment"].str.replace(",", "")
df["Investment"] = pd.to_numeric(df["Investment"], errors="coerce")

# Remove invalid rows
df = df.dropna()

# Keep realistic investments
df = df[df["Investment"] > 10000]

# Save cleaned dataset
df.to_csv("dataset/clean_startup_dataset.csv", index=False)

print("✅ Dataset cleaned successfully!")
print(df.head())