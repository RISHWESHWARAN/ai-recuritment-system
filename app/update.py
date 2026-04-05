from app.data.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE jobs ADD COLUMN cutoff_score FLOAT DEFAULT 0.0"))
    print("Column added successfully")