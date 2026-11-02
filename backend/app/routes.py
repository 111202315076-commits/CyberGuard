import os
import requests

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

@api_bp.route("/chat-rag", methods=["POST"])
def chat_rag():
    try:
        data = request.get_json() or {}
        question = data.get("question", "").strip()

        if not question:
            return jsonify({"answer": "Silakan ajukan pertanyaan seputar Phishing, STKI, atau keamanan URL."}), 400

        kb_context = """
        SiberGuard STKI adalah sistem deteksi phishing URL berbasis Machine Learning dan RAG.
        Teknologi utama:
        - Shannon Entropy: Mengukur keacakan string domain URL untuk mendeteksi domain acak.
        - ReliefF: Algoritma seleksi fitur dan pembobotan fitur terpenting.
        - XGBoost: Model klasifikasi untuk memprediksi URL Phishing vs Legitimate.
        - Explainable IR: Penjelasan transparan indikator risiko URL kepada pengguna.
        - Parser Dokumen: Ekstraksi hyperlink dari PDF dan TXT.
        """

        # 1. Panggilan ke LLM jika OPENAI_API_KEY terpasang
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {
                        "role": "system",
                        "content": f"Anda adalah Asisten AI SiberGuard. Jawablah pertanyaan pengguna secara ramah, relevan, dan fleksibel. Gunakan konteks berikut jika relevan dengan pertanyaan teknis: {kb_context}"
                    },
                    {"role": "user", "content": question}
                ],
                "temperature": 0.7
            }
            res = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=10)
            if res.status_code == 200:
                answer = res.json()["choices"][0]["message"]["content"]
                return jsonify({"answer": answer}), 200

        # 2. Logika Pemrosesan Berurutan (Prioritas Topik Teknis Dulu)
        q_lower = question.lower().split() # Split menjadi kata-kata utuh
        q_text = question.lower()

        # Prioritas 1: Topik Teknis & Proyek
        if "entropy" in q_text or "shannon" in q_text:
            answer = "Shannon Entropy adalah rumus matematika yang digunakan untuk mengukur tingkat keacakan karakter pada sebuah domain URL. Domain phishing acak (seperti: d8a9x-login.com) memiliki nilai entropi yang jauh lebih tinggi dibanding domain resmi (seperti: google.com)."
        elif "phishing" in q_text:
            answer = "Phishing adalah kejahatan siber di mana pelaku mengelabui korban agar memberikan informasi sensitif (seperti kata sandi atau data perbankan) melalui situs web palsu yang dirancang mirip dengan situs resminya."
        elif "stki" in q_text:
            answer = "STKI (Sistem Temu Kembali Informasi) adalah cabang ilmu komputer yang berfokus pada pemrosesan, ekstraksi fitur, dan pemodelan data teks agar informasi relevan dapat ditemukan dan diklasifikasikan secara presisi."
        elif "xgboost" in q_text or "relieff" in q_text or "relief" in q_text:
            answer = "Sistem mengekstrak 19+ fitur struktural URL, kemudian menyeleksinya menggunakan algoritma ReliefF sebelum diklasifikasikan oleh model XGBoost untuk memprediksi status Phishing vs Legitimate."
        elif "pdf" in q_text or "dokumen" in q_text or "file" in q_text:
            answer = "Anda dapat mengunggah file PDF atau TXT di menu Analisis Dokumen. Sistem akan mengekstrak seluruh link hyperlink di dalamnya untuk dianalisis risikonya secara simultan."
        elif "siapa kamu" in q_text or "siapa anda" in q_text:
            answer = "Saya adalah Asisten AI SiberGuard STKI. Tugas saya adalah membantu Anda memahami analisis risiko URL phishing dan pemrosesan dokumen keamanan."

        # Prioritas 2: Sapaan (Mengecek kata utuh agar tidak salah deteksi kata lain)
        elif any(w in q_lower for w in ["hai", "haii", "hallo", "hello", "hi", "p"]):
            answer = "Halo juga. Ada yang bisa saya bantu terkait analisis keamanan URL, fitur Shannon Entropy, atau sistem SiberGuard hari ini?"
        elif any(w in q_text for w in ["terima kasih", "makasih", "thanks", "thx"]):
            answer = "Sama-sama! Senang bisa membantu. Jika ada hal lain yang ingin Anda tanyakan seputar keamanan siber, silakan sampaikan ya."
        else:
            answer = f"Berdasarkan analisis sistem, keamanan URL dievaluasi secara presisi berdasarkan nilai Shannon Entropy, reputasi domain, keberadaan IP address, serta keandalan sertifikat SSL."

        return jsonify({"answer": answer}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500