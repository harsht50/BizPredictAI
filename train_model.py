import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import joblib

# Load cleaned dataset
df = pd.read_csv("dataset/clean_startup_dataset.csv")

# Encode categorical columns
city_encoder = LabelEncoder()
industry_encoder = LabelEncoder()

df["City"] = city_encoder.fit_transform(df["City"])
df["Industry"] = industry_encoder.fit_transform(df["Industry"])

# Features and target
X = df[["City", "Industry", "Investment"]]
y = df["Investment"]  # using investment as proxy for success

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

# Save model
joblib.dump(model, "model/startup_model.pkl")

# Save encoders
joblib.dump(city_encoder, "model/city_encoder.pkl")
joblib.dump(industry_encoder, "model/industry_encoder.pkl")

print("✅ Model trained successfully!")