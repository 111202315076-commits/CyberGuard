import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "phishing_history.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analysis_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            batch_id TEXT NOT NULL,
            source_type TEXT NOT NULL,
            total_urls INTEGER NOT NULL,
            phishing_count INTEGER NOT NULL,
            legitimate_count INTEGER NOT NULL,
            results_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def save_analysis(batch_id, source_type, total_urls, phishing_count, legitimate_count, results):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO analysis_history (batch_id, source_type, total_urls, phishing_count, legitimate_count, results_json)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (batch_id, source_type, total_urls, phishing_count, legitimate_count, json.dumps(results)))
    conn.commit()
    conn.close()

def get_all_history():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, batch_id, source_type, total_urls, phishing_count, legitimate_count, created_at
        FROM analysis_history
        ORDER BY created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_analysis_by_id(analysis_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM analysis_history WHERE id = ?
    """, (analysis_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        data = dict(row)
        data['results'] = json.loads(data['results_json'])
        return data
    return None