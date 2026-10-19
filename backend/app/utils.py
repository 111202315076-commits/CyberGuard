import uuid
import csv
import io

def generate_batch_id() -> str:
    """Generate a unique batch identifier."""
    return f"batch_{uuid.uuid4().hex[:8]}"

def export_results_to_csv(results: list[dict]) -> str:
    """Convert analysis results into CSV string format."""
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow(["URL", "Klasifikasi", "Skor Risiko (%)", "Probabilitas Phishing", "Alasan/Indikator Risiko"])

    for item in results:
        reasons_str = " | ".join(item.get("reasons", []))
        writer.writerow([
            item.get("url"),
            item.get("classification"),
            item.get("risk_score"),
            item.get("phishing_probability"),
            reasons_str
        ])

    return output.getvalue()