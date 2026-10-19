import math
import re
from urllib.parse import urlparse

SUSPICIOUS_WORDS = ["login", "verify", "secure", "account", "update", "confirm", "banking", "signin", "wp-content", "pay", "admin"]
SUSPICIOUS_TLDS = [".xyz", ".top", ".work", ".gq", ".cf", ".tk", ".ml", ".ga", ".click", ".link", ".club", ".online"]

def calculate_entropy(text: str) -> float:
    """Calculate Shannon Entropy of a string."""
    if not text:
        return 0.0
    prob = [float(text.count(c)) / len(text) for c in set(text)]
    return round(-sum([p * math.log(p, 2) for p in prob]), 4)

def is_ip_address(hostname: str) -> int:
    """Check if host is an IPv4 address."""
    pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
    return 1 if re.match(pattern, hostname) else 0

def extract_url_features(url: str) -> dict:
    """Extract structural and linguistic features from a given URL."""
    try:
        parsed = urlparse(url)
    except Exception:
        parsed = urlparse("http://invalid.com")

    hostname = parsed.netloc.split(':')[0]
    path = parsed.path
    
    # Calculate subdomains count
    subdomains = hostname.split('.')
    if hostname.startswith("www."):
        subdomains = subdomains[1:]
    num_subdomains = max(0, len(subdomains) - 2)

    has_susp_tld = 1 if any(hostname.endswith(tld) for tld in SUSPICIOUS_TLDS) else 0
    has_susp_words = 1 if any(word in url.lower() for word in SUSPICIOUS_WORDS) else 0

    features = {
        "url_length": len(url),
        "hostname_length": len(hostname),
        "num_dots": url.count('.'),
        "num_hyphens": url.count('-'),
        "num_at": url.count('@'),
        "num_question_mark": url.count('?'),
        "num_ampersand": url.count('&'),
        "num_equal": url.count('='),
        "num_slashes": url.count('/'),
        "num_digits": sum(c.isdigit() for c in url),
        "num_special_chars": sum(not c.isalnum() and c not in ['/', ':', '.', '-', '_', '?'] for c in url),
        "num_subdomains": num_subdomains,
        "has_ip_address": is_ip_address(hostname),
        "has_https": 1 if parsed.scheme == 'https' else 0,
        "has_suspicious_tld": has_susp_tld,
        "has_suspicious_words": has_susp_words,
        "path_depth": len([p for p in path.split('/') if p]),
        "has_multiple_subdomains": 1 if num_subdomains > 1 else 0,
        "url_entropy": calculate_entropy(url)
    }

    return features

def generate_risk_reasons(features: dict) -> list[str]:
    """Generate human-readable explanations based on structural features."""
    reasons = []
    if features.get("has_ip_address") == 1:
        reasons.append("Menggunakan IP address langsung sebagai gantinya domain name")
    if features.get("url_length", 0) > 75:
        reasons.append(f"Ukuran URL sangat panjang ({features['url_length']} karakter)")
    if features.get("num_subdomains", 0) >= 2 or features.get("has_multiple_subdomains") == 1:
        reasons.append(f"Memiliki banyak subdomain ({features['num_subdomains']} subdomain)")
    if features.get("has_suspicious_words") == 1:
        reasons.append("Mengandung kata kunci sensitif (misal: login, verify, account, secure)")
    if features.get("has_suspicious_tld") == 1:
        reasons.append("Menggunakan Ekstensi Domain (TLD) berisiko tinggi (.xyz, .top, .tk)")
    if features.get("num_at") > 0:
        reasons.append("Mengandung karakter '@' yang sering digunakan untuk menyamarkan URL")
    if features.get("has_https") == 0:
        reasons.append("Tidak menggunakan protokol HTTPS aman")
    if features.get("num_special_chars", 0) > 5:
        reasons.append("Jumlah karakter khusus berlebihan dalam URL")

    if not reasons:
        reasons.append("Struktur URL tampak normal dan standar")

    return reasons