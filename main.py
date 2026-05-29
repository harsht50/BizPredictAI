from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import random
import math

from database import conn, cursor
from predictor import predict_business, compare_businesses, generate_recommendations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── REQUEST MODELS ───────────────────────────────────────────────

class EvaluateRequest(BaseModel):
    location: str
    industry: str
    investment: int
    experience: int
    businessType: str          # product / service / franchise
    expectedCustomers: int
    riskAppetite: str = "moderate"   # conservative / moderate / aggressive
    onlineOffline: str = "offline"   # online / offline / hybrid


class SuggestRequest(BaseModel):
    location: str
    investment: int
    industry: str
    experience: int
    riskAppetite: str = "moderate"
    businessType: str = "service"
    onlineOffline: str = "offline"


class CompareRequest(BaseModel):
    location: str
    investment: int
    experience: int
    riskAppetite: str = "moderate"
    ideas: list[str]           # list of 2-3 business idea names


# ─── ROOT ─────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "BizPredictAI backend running"}


# ─── PREDICT / EVALUATE ───────────────────────────────────────────

@app.post("/predict")
def predict(data: EvaluateRequest):
    result = predict_business(
        location=data.location,
        industry=data.industry,
        investment=data.investment,
        experience=data.experience,
        business_type=data.businessType,
        expected_customers=data.expectedCustomers,
        risk_appetite=data.riskAppetite,
        online_offline=data.onlineOffline,
    )

    cursor.execute("""
        INSERT INTO history
        (location, industry, investment, experience, success, profit, risk, advice,
         business_type, risk_appetite, break_even_months, roi_percent, working_capital,
         city_tier, labor_availability, rent_estimate, online_offline)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.location,
        data.industry,
        data.investment,
        data.experience,
        result["success"],
        result["profit"],
        result["risk"],
        result["advice"],
        data.businessType,
        data.riskAppetite,
        result["break_even_months"],
        result["roi_percent"],
        result["working_capital"],
        result["city_tier"],
        result["labor_availability"],
        result["rent_estimate"],
        data.onlineOffline,
    ))
    conn.commit()

    return result


# ─── SUGGEST IDEAS ────────────────────────────────────────────────

@app.post("/recommend")
def recommend(data: SuggestRequest):
    recs = generate_recommendations(
        location=data.location,
        investment=data.investment,
        industry=data.industry,
        experience=data.experience,
        risk_appetite=data.riskAppetite,
        business_type=data.businessType,
        online_offline=data.onlineOffline,
    )
    return {"mode": "suggest", "recommendations": recs}


# ─── COMPARE BUSINESSES ───────────────────────────────────────────

@app.post("/compare")
def compare(data: CompareRequest):
    results = compare_businesses(
        location=data.location,
        investment=data.investment,
        experience=data.experience,
        risk_appetite=data.riskAppetite,
        ideas=data.ideas,
    )
    return {"comparisons": results}


# ─── HISTORY ──────────────────────────────────────────────────────

@app.get("/history")
def get_history():
    cursor.execute("""
        SELECT location, industry, investment, experience,
               success, profit, risk, advice,
               business_type, risk_appetite, break_even_months,
               roi_percent, working_capital, city_tier,
               labor_availability, rent_estimate, online_offline,
               created_at
        FROM history
        ORDER BY id DESC
        LIMIT 50
    """)
    rows = cursor.fetchall()
    cols = [
        "location", "industry", "investment", "experience",
        "success", "profit", "risk", "advice",
        "business_type", "risk_appetite", "break_even_months",
        "roi_percent", "working_capital", "city_tier",
        "labor_availability", "rent_estimate", "online_offline",
        "created_at",
    ]
    return {"history": [dict(zip(cols, r)) for r in rows]}


# ─── HOTSPOTS MAP ─────────────────────────────────────────────────

CITY_COORDS = {
    "Mumbai":      {"lat": 19.076, "lng": 72.877, "state": "Maharashtra",   "tier": 1},
    "Delhi":       {"lat": 28.613, "lng": 77.209, "state": "Delhi",         "tier": 1},
    "Bangalore":   {"lat": 12.971, "lng": 77.594, "state": "Karnataka",     "tier": 1},
    "Hyderabad":   {"lat": 17.385, "lng": 78.486, "state": "Telangana",     "tier": 1},
    "Chennai":     {"lat": 13.083, "lng": 80.270, "state": "Tamil Nadu",    "tier": 1},
    "Pune":        {"lat": 18.520, "lng": 73.856, "state": "Maharashtra",   "tier": 1},
    "Kolkata":     {"lat": 22.573, "lng": 88.363, "state": "West Bengal",   "tier": 1},
    "Ahmedabad":   {"lat": 23.023, "lng": 72.572, "state": "Gujarat",       "tier": 1},
    "Jaipur":      {"lat": 26.912, "lng": 75.787, "state": "Rajasthan",     "tier": 2},
    "Surat":       {"lat": 21.170, "lng": 72.831, "state": "Gujarat",       "tier": 2},
    "Lucknow":     {"lat": 26.847, "lng": 80.947, "state": "Uttar Pradesh", "tier": 2},
    "Chandigarh":  {"lat": 30.733, "lng": 76.779, "state": "Punjab",        "tier": 2},
    "Indore":      {"lat": 22.719, "lng": 75.857, "state": "Madhya Pradesh","tier": 2},
    "Coimbatore":  {"lat": 11.017, "lng": 76.955, "state": "Tamil Nadu",    "tier": 2},
    "Kochi":       {"lat":  9.931, "lng": 76.267, "state": "Kerala",        "tier": 2},
    "Nagpur":      {"lat": 21.145, "lng": 79.088, "state": "Maharashtra",   "tier": 2},
    "Bhopal":      {"lat": 23.259, "lng": 77.413, "state": "Madhya Pradesh","tier": 2},
    "Visakhapatnam":{"lat":17.686,"lng": 83.218, "state": "Andhra Pradesh", "tier": 2},
    "Patna":       {"lat": 25.594, "lng": 85.137, "state": "Bihar",         "tier": 3},
    "Agra":        {"lat": 27.176, "lng": 78.008, "state": "Uttar Pradesh", "tier": 3},
}

INDUSTRY_HOTSPOTS = {
    "Technology":    ["Bangalore","Hyderabad","Pune","Chennai","Delhi","Mumbai"],
    "Manufacturing": ["Surat","Ahmedabad","Pune","Chennai","Coimbatore","Indore"],
    "Retail":        ["Mumbai","Delhi","Bangalore","Jaipur","Lucknow","Kolkata"],
    "Healthcare":    ["Chennai","Mumbai","Delhi","Hyderabad","Kochi","Kolkata"],
    "Finance":       ["Mumbai","Delhi","Bangalore","Kolkata","Ahmedabad","Chennai"],
    "Agriculture":   ["Jaipur","Lucknow","Indore","Chandigarh","Kolkata","Patna"],
    "Tourism":       ["Jaipur","Kochi","Mumbai","Delhi","Agra","Chennai"],
    "Education":     ["Delhi","Pune","Bangalore","Chennai","Lucknow","Chandigarh"],
    "Logistics":     ["Mumbai","Delhi","Surat","Ahmedabad","Kolkata","Hyderabad"],
    "Real Estate":   ["Mumbai","Bangalore","Delhi","Pune","Hyderabad","Chennai"],
}

CITY_INFRA = {
    1: {"internet": "Excellent", "roads": "Good",     "power": "Stable"},
    2: {"internet": "Good",      "roads": "Moderate", "power": "Mostly Stable"},
    3: {"internet": "Moderate",  "roads": "Fair",     "power": "Occasional Cuts"},
}

@app.get("/hotspots")
def get_hotspots(industry: str = "Technology"):
    cities = INDUSTRY_HOTSPOTS.get(industry, INDUSTRY_HOTSPOTS["Technology"])
    hotspots = []
    for city in cities:
        coords = CITY_COORDS[city]
        tier = coords["tier"]
        success = random.randint(60, 90)
        profit = random.randint(100000, 500000)
        risk = "Low" if success >= 75 else "Medium" if success >= 60 else "High"
        infra = CITY_INFRA[tier]

        # Rent estimate based on tier
        rent_ranges = {1: (80, 250), 2: (30, 80), 3: (10, 30)}
        rent_min, rent_max = rent_ranges[tier]
        rent = random.randint(rent_min, rent_max) * 1000

        # Labor availability
        labor_map = {1: "High", 2: "Moderate", 3: "Limited"}

        hotspots.append({
            "city": city,
            "state": coords["state"],
            "lat": coords["lat"],
            "lng": coords["lng"],
            "tier": tier,
            "success_rate": success,
            "avg_profit": profit,
            "risk": risk,
            "internet": infra["internet"],
            "roads": infra["roads"],
            "power": infra["power"],
            "rent_per_sqft": rent,
            "labor_availability": labor_map[tier],
        })

    return {"hotspots": hotspots}


# ─── CITY INTELLIGENCE ────────────────────────────────────────────

@app.get("/city-info")
def city_info(city: str):
    from predictor import get_city_intelligence
    return get_city_intelligence(city)


# ─── FUNDING SCHEMES ──────────────────────────────────────────────

@app.get("/funding-schemes")
def funding_schemes(investment: int, industry: str = ""):
    schemes = []

    if investment <= 1000000:
        schemes.append({
            "name": "MUDRA Yojana – Shishu",
            "max_amount": 50000,
            "description": "Loans up to ₹50,000 for micro-enterprises. No collateral required.",
            "eligibility": "New or existing micro business",
            "link": "https://www.mudra.org.in",
        })

    if investment <= 5000000:
        schemes.append({
            "name": "MUDRA Yojana – Kishor",
            "max_amount": 500000,
            "description": "Loans between ₹50,000–₹5 lakh for expanding businesses.",
            "eligibility": "Existing micro business with track record",
            "link": "https://www.mudra.org.in",
        })
        schemes.append({
            "name": "MUDRA Yojana – Tarun",
            "max_amount": 1000000,
            "description": "Loans up to ₹10 lakh for established micro-enterprises.",
            "eligibility": "Established micro business",
            "link": "https://www.mudra.org.in",
        })

    if investment <= 10000000:
        schemes.append({
            "name": "MSME Credit Guarantee Scheme (CGTMSE)",
            "max_amount": 10000000,
            "description": "Collateral-free loans up to ₹1 Cr for MSMEs through banks.",
            "eligibility": "Registered MSME",
            "link": "https://www.cgtmse.in",
        })

    if industry.lower() in ["technology", "ai", "fintech", "edtech"]:
        schemes.append({
            "name": "Startup India Seed Fund",
            "max_amount": 5000000,
            "description": "Seed funding up to ₹50 lakh for tech startups via DPIIT.",
            "eligibility": "DPIIT-recognized startup, <2 years old",
            "link": "https://seedfund.startupindia.gov.in",
        })

    schemes.append({
        "name": "Stand-Up India",
        "max_amount": 10000000,
        "description": "Bank loans of ₹10 lakh–₹1 Cr for SC/ST and women entrepreneurs.",
        "eligibility": "SC/ST or Women entrepreneur, greenfield enterprise",
        "link": "https://www.standupmitra.in",
    })

    return {"schemes": schemes}