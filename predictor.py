"""
predictor.py
Full business intelligence engine for BizPredictAI.
Covers: city intelligence, financial projections, labor, infrastructure,
        recommendations, comparison scorecard.
"""

import math
import random
from typing import Optional

# ─── CITY DATABASE ────────────────────────────────────────────────

CITY_DB = {
    # city_key -> dict of all intelligence fields
    "mumbai":       {"tier": 1, "state": "Maharashtra",    "pop": 12478447, "literacy": 90.28, "graduates": 1802371, "avg_wage_unskilled": 18000, "avg_wage_skilled": 45000, "languages": ["Hindi","Marathi","English"], "internet": "Excellent", "roads": "Good",     "power": "Stable",       "market_access": "Excellent", "suppliers": "Excellent"},
    "delhi":        {"tier": 1, "state": "Delhi",          "pop": 11007835, "literacy": 87.60, "graduates": 2221137, "avg_wage_unskilled": 16000, "avg_wage_skilled": 42000, "languages": ["Hindi","Punjabi","English"],  "internet": "Excellent", "roads": "Good",     "power": "Stable",       "market_access": "Excellent", "suppliers": "Excellent"},
    "bangalore":    {"tier": 1, "state": "Karnataka",      "pop": 8425970,  "literacy": 89.59, "graduates": 1591163, "avg_wage_unskilled": 20000, "avg_wage_skilled": 55000, "languages": ["Kannada","English","Hindi"],  "internet": "Excellent", "roads": "Moderate", "power": "Stable",       "market_access": "Excellent", "suppliers": "Excellent"},
    "bengaluru":    {"tier": 1, "state": "Karnataka",      "pop": 8425970,  "literacy": 89.59, "graduates": 1591163, "avg_wage_unskilled": 20000, "avg_wage_skilled": 55000, "languages": ["Kannada","English","Hindi"],  "internet": "Excellent", "roads": "Moderate", "power": "Stable",       "market_access": "Excellent", "suppliers": "Excellent"},
    "hyderabad":    {"tier": 1, "state": "Telangana",      "pop": 6809970,  "literacy": 82.96, "graduates": 1164149, "avg_wage_unskilled": 17000, "avg_wage_skilled": 48000, "languages": ["Telugu","Urdu","English"],    "internet": "Excellent", "roads": "Good",     "power": "Stable",       "market_access": "Excellent", "suppliers": "Good"},
    "chennai":      {"tier": 1, "state": "Tamil Nadu",     "pop": 7088000,  "literacy": 88.00, "graduates": 1400000, "avg_wage_unskilled": 16000, "avg_wage_skilled": 43000, "languages": ["Tamil","English"],            "internet": "Excellent", "roads": "Good",     "power": "Stable",       "market_access": "Excellent", "suppliers": "Excellent"},
    "pune":         {"tier": 1, "state": "Maharashtra",    "pop": 3124458,  "literacy": 91.00, "graduates": 700000,  "avg_wage_unskilled": 17000, "avg_wage_skilled": 44000, "languages": ["Marathi","Hindi","English"],  "internet": "Excellent", "roads": "Good",     "power": "Stable",       "market_access": "Good",      "suppliers": "Good"},
    "kolkata":      {"tier": 1, "state": "West Bengal",    "pop": 4496694,  "literacy": 87.14, "graduates": 950000,  "avg_wage_unskilled": 13000, "avg_wage_skilled": 35000, "languages": ["Bengali","Hindi","English"],  "internet": "Good",      "roads": "Moderate", "power": "Mostly Stable","market_access": "Good",      "suppliers": "Good"},
    "ahmedabad":    {"tier": 1, "state": "Gujarat",        "pop": 5570585,  "literacy": 86.65, "graduates": 900000,  "avg_wage_unskilled": 14000, "avg_wage_skilled": 38000, "languages": ["Gujarati","Hindi"],           "internet": "Good",      "roads": "Good",     "power": "Stable",       "market_access": "Good",      "suppliers": "Excellent"},
    "jaipur":       {"tier": 2, "state": "Rajasthan",      "pop": 3046163,  "literacy": 79.00, "graduates": 420000,  "avg_wage_unskilled": 11000, "avg_wage_skilled": 28000, "languages": ["Hindi","Rajasthani"],         "internet": "Good",      "roads": "Good",     "power": "Mostly Stable","market_access": "Good",      "suppliers": "Moderate"},
    "surat":        {"tier": 2, "state": "Gujarat",        "pop": 4467797,  "literacy": 85.53, "graduates": 580000,  "avg_wage_unskilled": 13000, "avg_wage_skilled": 32000, "languages": ["Gujarati","Hindi"],           "internet": "Good",      "roads": "Moderate", "power": "Stable",       "market_access": "Good",      "suppliers": "Good"},
    "lucknow":      {"tier": 2, "state": "Uttar Pradesh",  "pop": 2817105,  "literacy": 77.00, "graduates": 380000,  "avg_wage_unskilled": 10000, "avg_wage_skilled": 25000, "languages": ["Hindi","Urdu"],               "internet": "Good",      "roads": "Moderate", "power": "Mostly Stable","market_access": "Moderate",  "suppliers": "Moderate"},
    "chandigarh":   {"tier": 2, "state": "Punjab",         "pop": 960787,   "literacy": 86.05, "graduates": 180000,  "avg_wage_unskilled": 14000, "avg_wage_skilled": 35000, "languages": ["Hindi","Punjabi"],            "internet": "Good",      "roads": "Excellent","power": "Stable",       "market_access": "Moderate",  "suppliers": "Moderate"},
    "indore":       {"tier": 2, "state": "Madhya Pradesh", "pop": 1960631,  "literacy": 82.00, "graduates": 320000,  "avg_wage_unskilled": 11000, "avg_wage_skilled": 27000, "languages": ["Hindi","Malwi"],              "internet": "Good",      "roads": "Good",     "power": "Mostly Stable","market_access": "Moderate",  "suppliers": "Moderate"},
    "coimbatore":   {"tier": 2, "state": "Tamil Nadu",     "pop": 1600000,  "literacy": 86.00, "graduates": 280000,  "avg_wage_unskilled": 13000, "avg_wage_skilled": 32000, "languages": ["Tamil","English"],            "internet": "Good",      "roads": "Good",     "power": "Stable",       "market_access": "Moderate",  "suppliers": "Good"},
    "kochi":        {"tier": 2, "state": "Kerala",         "pop": 2117990,  "literacy": 97.99, "graduates": 420000,  "avg_wage_unskilled": 18000, "avg_wage_skilled": 40000, "languages": ["Malayalam","English"],        "internet": "Good",      "roads": "Good",     "power": "Stable",       "market_access": "Moderate",  "suppliers": "Moderate"},
    "nagpur":       {"tier": 2, "state": "Maharashtra",    "pop": 2405421,  "literacy": 91.00, "graduates": 380000,  "avg_wage_unskilled": 12000, "avg_wage_skilled": 30000, "languages": ["Hindi","Marathi"],            "internet": "Good",      "roads": "Good",     "power": "Mostly Stable","market_access": "Moderate",  "suppliers": "Moderate"},
    "bhopal":       {"tier": 2, "state": "Madhya Pradesh", "pop": 1798218,  "literacy": 82.00, "graduates": 280000,  "avg_wage_unskilled": 10000, "avg_wage_skilled": 25000, "languages": ["Hindi"],                     "internet": "Good",      "roads": "Good",     "power": "Mostly Stable","market_access": "Moderate",  "suppliers": "Moderate"},
    "visakhapatnam":{"tier": 2, "state": "Andhra Pradesh", "pop": 1728128,  "literacy": 80.00, "graduates": 260000,  "avg_wage_unskilled": 11000, "avg_wage_skilled": 28000, "languages": ["Telugu","English"],           "internet": "Good",      "roads": "Moderate", "power": "Mostly Stable","market_access": "Moderate",  "suppliers": "Moderate"},
    "patna":        {"tier": 3, "state": "Bihar",          "pop": 1683200,  "literacy": 70.68, "graduates": 200000,  "avg_wage_unskilled": 8000,  "avg_wage_skilled": 20000, "languages": ["Hindi","Bhojpuri","Maithili"],"internet": "Moderate",  "roads": "Fair",     "power": "Occasional Cuts","market_access": "Low",    "suppliers": "Limited"},
    "agra":         {"tier": 3, "state": "Uttar Pradesh",  "pop": 1585704,  "literacy": 71.00, "graduates": 180000,  "avg_wage_unskilled": 9000,  "avg_wage_skilled": 22000, "languages": ["Hindi","Braj Bhasha"],        "internet": "Moderate",  "roads": "Moderate", "power": "Occasional Cuts","market_access": "Low",    "suppliers": "Limited"},
}

# Tier-based rent ranges (₹/month for 500 sqft commercial)
RENT_RANGES = {
    1: (40000, 150000),
    2: (15000, 50000),
    3: (5000, 18000),
}

# Industry growth multipliers (from industry_opportunity_scores.csv)
INDUSTRY_GROWTH = {
    "ai services":          0.92,
    "ev charging station":  0.88,
    "health diagnostics":   0.86,
    "cloud kitchen":        0.85,
    "e-commerce logistics": 0.84,
    "food delivery":        0.83,
    "solar installation":   0.82,
    "online education":     0.80,
    "digital marketing":    0.78,
    "pet care services":    0.75,
    "co-working space":     0.72,
    "organic grocery":      0.70,
    "gaming cafe":          0.68,
    "fitness studio":       0.65,
    "mobile repair":        0.60,
    # catch-all buckets
    "technology":           0.85,
    "food & beverage":      0.75,
    "retail":               0.68,
    "healthcare":           0.80,
    "finance":              0.72,
    "education":            0.78,
    "manufacturing":        0.65,
    "logistics":            0.80,
    "agriculture":          0.62,
    "tourism":              0.70,
    "real estate":          0.68,
}

# Business ideas pool — keyed by rough industry and risk appetite
IDEA_POOL = {
    "technology": {
        "conservative": ["Mobile Repair Shop", "Computer Training Centre", "IT Support Services", "Data Entry Franchise"],
        "moderate":     ["Digital Marketing Agency", "Software Development Studio", "E-commerce Store", "Cloud Kitchen Tech Platform"],
        "aggressive":   ["AI SaaS Product", "EV Charging Network", "Health-Tech Diagnostics App", "EdTech Platform"],
    },
    "food": {
        "conservative": ["Tiffin Service", "Chai & Snacks Stall", "Bakery Shop", "Catering Service"],
        "moderate":     ["Cloud Kitchen", "Franchise Restaurant", "Organic Grocery Store", "Food Delivery Hub"],
        "aggressive":   ["QSR Chain", "D2C Food Brand", "Food-Tech Startup", "Agri-Food Processing Unit"],
    },
    "retail": {
        "conservative": ["Kirana Store", "Stationery Shop", "Mobile Accessories Store", "Second-hand Goods Store"],
        "moderate":     ["Fashion Boutique", "Electronics Retail", "Pharmacy Franchise", "Home Décor Store"],
        "aggressive":   ["D2C Brand", "Online + Offline Retail Hybrid", "Premium Lifestyle Store", "Export-Import Trading"],
    },
    "healthcare": {
        "conservative": ["Medical Store", "Diagnostic Collection Centre", "Elder Care Service", "Yoga Studio"],
        "moderate":     ["Physiotherapy Clinic", "Health Diagnostics Lab", "Wellness Centre", "Telemedicine Platform"],
        "aggressive":   ["Speciality Clinic", "Health-Tech App", "Mental Health Platform", "MedTech Device"],
    },
    "education": {
        "conservative": ["Tuition Centre", "Skill Training Institute", "Library & Study Room", "Stationery Shop"],
        "moderate":     ["Coaching Institute", "Online Course Platform", "Vocational Training Centre", "Language School"],
        "aggressive":   ["EdTech Startup", "Franchise School", "Corporate Training Company", "STEM Lab"],
    },
    "finance": {
        "conservative": ["Insurance Agency", "Tax Consultancy", "Accounting Services", "LIC Sub-Agent"],
        "moderate":     ["Mutual Fund Distributor", "Stock Advisory", "CA/CS Firm", "NBFC Partnership"],
        "aggressive":   ["FinTech App", "P2P Lending Platform", "Wealth Management Firm", "Crypto Consultancy"],
    },
    "default": {
        "conservative": ["Franchise Outlet", "Tutoring Centre", "Medical Store", "Home Services (Plumbing/Electrician)"],
        "moderate":     ["Cloud Kitchen", "Digital Marketing Agency", "E-commerce Store", "Logistics Hub"],
        "aggressive":   ["SaaS Startup", "EV Charging Station", "HealthTech Platform", "EdTech Company"],
    },
}

MUDRA_SCHEMES = [
    {"name": "MUDRA Shishu", "max": 50000,    "note": "No collateral, up to ₹50K"},
    {"name": "MUDRA Kishor", "max": 500000,   "note": "₹50K–₹5L for expanding businesses"},
    {"name": "MUDRA Tarun",  "max": 1000000,  "note": "Up to ₹10L for established micro-enterprises"},
    {"name": "CGTMSE Loan",  "max": 10000000, "note": "Collateral-free up to ₹1Cr for MSMEs"},
]


# ─── UTILITY HELPERS ──────────────────────────────────────────────

def _lookup_city(city: str) -> dict:
    """Return city data or a sensible Tier-2 default."""
    key = city.strip().lower()
    return CITY_DB.get(key, {
        "tier": 2, "state": "India", "pop": 1000000,
        "literacy": 80.0, "graduates": 200000,
        "avg_wage_unskilled": 12000, "avg_wage_skilled": 30000,
        "languages": ["Hindi"],
        "internet": "Good", "roads": "Moderate", "power": "Mostly Stable",
        "market_access": "Moderate", "suppliers": "Moderate",
    })


def _growth_rate(industry: str) -> float:
    key = industry.strip().lower()
    for k, v in INDUSTRY_GROWTH.items():
        if k in key or key in k:
            return v
    return 0.68   # default growth rate


def _tier_multiplier(tier: int) -> float:
    return {1: 1.20, 2: 1.00, 3: 0.82}[tier]


def _experience_bonus(exp: int) -> float:
    if exp == 0:
        return -5
    elif exp <= 2:
        return 0
    elif exp <= 5:
        return 5
    elif exp <= 10:
        return 10
    else:
        return 15


def _risk_appetite_multiplier(risk: str) -> float:
    return {"conservative": 0.85, "moderate": 1.0, "aggressive": 1.15}.get(risk.lower(), 1.0)


def _online_bonus(online_offline: str) -> int:
    return {"online": 8, "hybrid": 4, "offline": 0}.get(online_offline.lower(), 0)


def _investment_score(investment: int) -> float:
    """Logarithmic score: more money = higher base score, but diminishing returns."""
    if investment <= 0:
        return 0
    return min(25, math.log10(investment) * 5)


def _get_rent(tier: int) -> int:
    lo, hi = RENT_RANGES[tier]
    return random.randint(lo, hi)


def _labor_availability(tier: int) -> str:
    return {1: "High", 2: "Moderate", 3: "Limited"}[tier]


def _eligible_schemes(investment: int) -> list:
    return [s for s in MUDRA_SCHEMES if investment <= s["max"] * 2]


# ─── MAIN PREDICTION ENGINE ───────────────────────────────────────

def predict_business(
    location: str,
    industry: str,
    investment: int,
    experience: int,
    business_type: str = "service",
    expected_customers: int = 100,
    risk_appetite: str = "moderate",
    online_offline: str = "offline",
) -> dict:

    city = _lookup_city(location)
    tier = city["tier"]
    growth = _growth_rate(industry)

    # ── Base success score (0–100) ──
    base = 45.0
    base += growth * 25                          # industry momentum
    base += _investment_score(investment)        # capital adequacy
    base += _experience_bonus(experience)        # founder experience
    base += _online_bonus(online_offline)        # online reach boost
    base += (city["literacy"] / 100) * 10        # educated customer base
    base *= _tier_multiplier(tier)               # city tier
    base *= _risk_appetite_multiplier(risk_appetite)

    # Clamp
    success = int(min(94, max(28, base + random.uniform(-4, 4))))

    # ── Risk level ──
    if success >= 72:
        risk = "Low"
    elif success >= 52:
        risk = "Medium"
    else:
        risk = "High"

    # ── Financial projections ──
    # Profit: investment × expected margin × growth
    margin_map = {"service": 0.35, "product": 0.22, "franchise": 0.18}
    margin = margin_map.get(business_type.lower(), 0.28)
    annual_profit = int(investment * margin * growth * _tier_multiplier(tier) * random.uniform(0.85, 1.15))
    monthly_profit = annual_profit // 12

    # ROI
    roi_percent = round((annual_profit / investment) * 100, 1) if investment > 0 else 0

    # Break-even
    # break_even = fixed_costs / (revenue_per_unit - variable_cost_per_unit)
    # Simplified: investment / monthly_profit
    break_even_months = int(math.ceil(investment / monthly_profit)) if monthly_profit > 0 else 36
    break_even_months = max(1, min(break_even_months, 60))

    # Working capital (monthly running cost estimate)
    rent = _get_rent(tier)
    wages_unskilled = city["avg_wage_unskilled"]
    wages_skilled   = city["avg_wage_skilled"]
    working_capital = rent + (wages_unskilled * 2) + (wages_skilled * 1) + int(investment * 0.05)

    # ── Advice ──
    advice = _generate_advice(
        success=success,
        risk=risk,
        city=city,
        industry=industry,
        investment=investment,
        experience=experience,
        break_even_months=break_even_months,
        roi_percent=roi_percent,
        risk_appetite=risk_appetite,
        online_offline=online_offline,
    )

    # ── Funding options ──
    schemes = _eligible_schemes(investment)

    # ── Scorecard (out of 100) ──
    scorecard = {
        "market_potential":  min(95, int(growth * 100 + tier * 5)),
        "competition_risk":  max(10, 100 - int(growth * 60) - (experience * 2)),
        "profit_outlook":    min(95, int(roi_percent * 2)),
        "financial_risk":    max(10, 100 - success),
        "city_readiness":    _city_readiness_score(city),
        "founder_fit":       min(95, 40 + experience * 5 + (_risk_appetite_multiplier(risk_appetite) * 15)),
    }

    return {
        "success":            success,
        "profit":             annual_profit,
        "monthly_profit":     monthly_profit,
        "risk":               risk,
        "roi_percent":        roi_percent,
        "break_even_months":  break_even_months,
        "working_capital":    working_capital,
        "rent_estimate":      rent,
        "city_tier":          tier,
        "city_state":         city["state"],
        "labor_availability": _labor_availability(tier),
        "avg_wage_unskilled": city["avg_wage_unskilled"],
        "avg_wage_skilled":   city["avg_wage_skilled"],
        "languages":          city["languages"],
        "internet":           city["internet"],
        "roads":              city["roads"],
        "power":              city["power"],
        "market_access":      city["market_access"],
        "suppliers":          city["suppliers"],
        "literacy_rate":      city["literacy"],
        "population":         city["pop"],
        "eligible_schemes":   schemes,
        "scorecard":          scorecard,
        "advice":             advice,
    }


# ─── ADVICE GENERATOR ─────────────────────────────────────────────

def _generate_advice(
    success, risk, city, industry, investment, experience,
    break_even_months, roi_percent, risk_appetite, online_offline
) -> str:
    tier = city["tier"]
    parts = []

    if success >= 72:
        parts.append(f"Strong fundamentals detected — {industry} in a Tier-{tier} city shows good market alignment.")
    elif success >= 52:
        parts.append(f"Moderate potential for {industry} here. Success is achievable with careful execution.")
    else:
        parts.append(f"High risk detected for {industry} in this location. Consider pivoting industry or city.")

    if experience == 0:
        parts.append("As a first-time entrepreneur, strongly consider a franchise or a mentor-backed model to reduce risk.")
    elif experience < 3:
        parts.append("Build your network early — local industry associations can significantly cut your customer acquisition cost.")

    if break_even_months > 24:
        parts.append(f"Break-even is projected at {break_even_months} months. Ensure you have sufficient runway capital.")
    else:
        parts.append(f"Break-even in ~{break_even_months} months is healthy. Focus on unit economics from Day 1.")

    if tier == 1:
        parts.append("Tier-1 city gives access to talent and capital, but competition is intense — differentiate clearly.")
    elif tier == 2:
        parts.append("Tier-2 cities offer lower costs with growing demand — an excellent time to capture early-mover advantage.")
    else:
        parts.append("Tier-3 markets have untapped demand but limited infrastructure — keep operations lean.")

    if online_offline == "online":
        parts.append("Going online expands your reach beyond the city — invest in SEO and social media from the start.")
    elif online_offline == "hybrid":
        parts.append("Hybrid model balances local trust with digital reach — a smart choice for current market conditions.")

    if roi_percent > 30:
        parts.append(f"Projected ROI of {roi_percent}% is above average — reinvest early profits to accelerate growth.")
    elif roi_percent < 15:
        parts.append("ROI is on the lower side — explore ways to reduce fixed costs (shared workspace, outsourcing).")

    return " ".join(parts)


def _city_readiness_score(city: dict) -> int:
    score = 0
    score += {"Excellent": 25, "Good": 20, "Moderate": 13, "Fair": 8, "Limited": 4}.get(city["internet"], 10)
    score += {"Excellent": 25, "Good": 20, "Moderate": 13, "Fair": 8}.get(city["roads"], 10)
    score += {"Stable": 25, "Mostly Stable": 18, "Occasional Cuts": 10}.get(city["power"], 10)
    score += {"Excellent": 25, "Good": 20, "Moderate": 13, "Low": 8, "Limited": 4}.get(city["market_access"], 10)
    return min(100, score)


# ─── CITY INTELLIGENCE ────────────────────────────────────────────

def get_city_intelligence(city_name: str) -> dict:
    city = _lookup_city(city_name)
    tier = city["tier"]
    rent_lo, rent_hi = RENT_RANGES[tier]

    return {
        "city":              city_name,
        "state":             city["state"],
        "tier":              tier,
        "population":        city["pop"],
        "literacy_rate":     city["literacy"],
        "graduates":         city["graduates"],
        "languages":         city["languages"],
        "infrastructure": {
            "internet": city["internet"],
            "roads":    city["roads"],
            "power":    city["power"],
        },
        "market_access":     city["market_access"],
        "suppliers":         city["suppliers"],
        "labor": {
            "availability":    _labor_availability(tier),
            "avg_wage_unskilled": city["avg_wage_unskilled"],
            "avg_wage_skilled":   city["avg_wage_skilled"],
        },
        "property": {
            "rent_range_monthly": f"₹{rent_lo:,}–₹{rent_hi:,} (500 sqft commercial)",
        },
        "readiness_score": _city_readiness_score(city),
    }


# ─── RECOMMENDATION ENGINE ────────────────────────────────────────

def generate_recommendations(
    location: str,
    investment: int,
    industry: str,
    experience: int,
    risk_appetite: str = "moderate",
    business_type: str = "service",
    online_offline: str = "offline",
) -> list[dict]:
    """
    Returns a list of rich recommendation objects with key metrics per idea.
    """
    industry_key = industry.strip().lower()
    matched_key = "default"
    for k in IDEA_POOL:
        if k in industry_key or industry_key in k:
            matched_key = k
            break

    pool = IDEA_POOL[matched_key].get(risk_appetite.lower(), IDEA_POOL[matched_key]["moderate"])
    ideas = random.sample(pool, min(4, len(pool)))

    results = []
    for idea in ideas:
        pred = predict_business(
            location=location,
            industry=idea,
            investment=investment,
            experience=experience,
            business_type=business_type,
            risk_appetite=risk_appetite,
            online_offline=online_offline,
        )
        results.append({
            "idea":               idea,
            "success":            pred["success"],
            "risk":               pred["risk"],
            "roi_percent":        pred["roi_percent"],
            "break_even_months":  pred["break_even_months"],
            "annual_profit":      pred["profit"],
            "working_capital":    pred["working_capital"],
            "advice":             pred["advice"],
            "scorecard":          pred["scorecard"],
            "eligible_schemes":   pred["eligible_schemes"],
        })

    # Sort by success descending
    results.sort(key=lambda x: x["success"], reverse=True)
    return results


# ─── COMPARISON ENGINE ────────────────────────────────────────────

def compare_businesses(
    location: str,
    investment: int,
    experience: int,
    risk_appetite: str,
    ideas: list[str],
) -> list[dict]:
    """
    Run prediction for each idea and return a unified comparison list.
    """
    results = []
    for idea in ideas[:3]:  # cap at 3
        pred = predict_business(
            location=location,
            industry=idea,
            investment=investment,
            experience=experience,
            risk_appetite=risk_appetite,
        )
        results.append({
            "idea":               idea,
            "success":            pred["success"],
            "profit":             pred["profit"],
            "roi_percent":        pred["roi_percent"],
            "break_even_months":  pred["break_even_months"],
            "risk":               pred["risk"],
            "working_capital":    pred["working_capital"],
            "city_tier":          pred["city_tier"],
            "scorecard":          pred["scorecard"],
            "advice":             pred["advice"],
        })

    # Rank by success
    results.sort(key=lambda x: x["success"], reverse=True)
    for i, r in enumerate(results):
        r["rank"] = i + 1

    return results