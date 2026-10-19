from flask import Blueprint, request, jsonify, Response
from app.url_extractor import extract_urls_from_text, extract_urls_from_pdf, normalize_url, validate_url
from app.ml_model import predict_single_url, predict_batch_urls
from app.database import save_analysis, get_all_history, get_analysis_by_id
from app.utils import generate_batch_id, export_results_to_csv

api_bp = Blueprint("api", __name__)

@api_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Sistem Deteksi Phishing STKI Backend Aktif"}), 200

@api_bp.route("/analyze-url", methods=["POST"])
def analyze_single_url():
    data = request.get_json() or {}
    url = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "URL tidak boleh kosong"}), 400

    norm_url = normalize_url(url)
    if not validate_url(norm_url):
        return jsonify({"error": "Format URL tidak valid"}), 400

    result = predict_single_url(norm_url)
    batch_id = generate_batch_id()
    
    phish_cnt = 1 if result["classification"] == "Phishing" else 0
    legit_cnt = 1 - phish_cnt

    save_analysis(batch_id, "Single URL", 1, phish_cnt, legit_cnt, [result])

    return jsonify({
        "batch_id": batch_id,
        "total_urls": 1,
        "phishing_count": phish_cnt,
        "legitimate_count": legit_cnt,
        "results": [result]
    })

@api_bp.route("/analyze-urls", methods=["POST"])
def analyze_multiple_urls():
    data = request.get_json() or {}
    urls = data.get("urls", [])

    if isinstance(urls, str):
        urls = urls.split("\n")

    # Extract & Deduplicate
    extracted_urls = []
    seen = set()
    for u in urls:
        if u.strip():
            norm = normalize_url(u.strip())
            if validate_url(norm) and norm not in seen:
                seen.add(norm)
                extracted_urls.append(norm)

    if not extracted_urls:
        return jsonify({"error": "Tidak ada URL valid yang ditemukan"}), 400

    results = predict_batch_urls(extracted_urls)
    batch_id = generate_batch_id()

    phish_cnt = sum(1 for r in results if r["classification"] == "Phishing")
    legit_cnt = len(results) - phish_cnt

    save_analysis(batch_id, "Batch Text", len(results), phish_cnt, legit_cnt, results)

    return jsonify({
        "batch_id": batch_id,
        "total_urls": len(results),
        "phishing_count": phish_cnt,
        "legitimate_count": legit_cnt,
        "results": results
    })

@api_bp.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "File tidak ditemukan dalam request"}), 400

    file = request.files["file"]
    filename = file.filename.lower()

    file_bytes = file.read()

    if filename.endswith(".pdf"):
        urls = extract_urls_from_pdf(file_bytes)
    elif filename.endswith(".txt"):
        text = file_bytes.decode("utf-8", errors="ignore")
        urls = extract_urls_from_text(text)
    else:
        return jsonify({"error": "Format file tidak didukung. Harap unggah PDF atau TXT"}), 400

    return jsonify({
        "filename": file.filename,
        "total_extracted": len(urls),
        "urls": urls
    })

@api_bp.route("/analyze-upload", methods=["POST"])
def analyze_uploaded_file():
    if "file" not in request.files:
        return jsonify({"error": "File tidak ditemukan dalam request"}), 400

    file = request.files["file"]
    filename = file.filename.lower()
    file_bytes = file.read()

    if filename.endswith(".pdf"):
        urls = extract_urls_from_pdf(file_bytes)
    elif filename.endswith(".txt"):
        text = file_bytes.decode("utf-8", errors="ignore")
        urls = extract_urls_from_text(text)
    else:
        return jsonify({"error": "Format file tidak didukung. Harap unggah PDF atau TXT"}), 400

    if not urls:
        return jsonify({"error": "Tidak ada URL yang terdeteksi di dalam file"}), 400

    results = predict_batch_urls(urls)
    batch_id = generate_batch_id()

    phish_cnt = sum(1 for r in results if r["classification"] == "Phishing")
    legit_cnt = len(results) - phish_cnt

    save_analysis(batch_id, f"File ({file.filename})", len(results), phish_cnt, legit_cnt, results)

    return jsonify({
        "batch_id": batch_id,
        "filename": file.filename,
        "total_urls": len(results),
        "phishing_count": phish_cnt,
        "legitimate_count": legit_cnt,
        "results": results
    })

@api_bp.route("/history", methods=["GET"])
def get_history():
    history = get_all_history()
    return jsonify({"history": history})

@api_bp.route("/export/<int:analysis_id>", methods=["GET"])
def export_csv(analysis_id):
    analysis_data = get_analysis_by_id(analysis_id)
    if not analysis_data:
        return jsonify({"error": "Data riwayat tidak ditemukan"}), 404

    csv_content = export_results_to_csv(analysis_data["results"])

    return Response(
        csv_content,
        mimetype="text/csv",
        headers={"Content-disposition": f"attachment; filename=hasil_deteksi_phishing_{analysis_id}.csv"}
    )