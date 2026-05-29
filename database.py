import sqlite3

conn = sqlite3.connect("business_history.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location TEXT,
        industry TEXT,
        investment INTEGER,
        experience INTEGER,
        success INTEGER,
        profit INTEGER,
        risk TEXT,
        advice TEXT,
        business_type TEXT,
        risk_appetite TEXT,
        break_even_months INTEGER,
        roi_percent REAL,
        working_capital INTEGER,
        city_tier INTEGER,
        labor_availability TEXT,
        rent_estimate INTEGER,
        online_offline TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
""")

conn.commit()