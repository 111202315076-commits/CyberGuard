import re
from urllib.parse import urlparse
import fitz  # PyMuPDF

# Regular expression to extract HTTP/HTTPS and domain-like URLs
URL_REGEX = re.compile(
    r'(?:(?:https?://)|(?:www\.))'
    r'(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}'
    r'(?::\d+)?'
    r'(?:/[^\s,;()<>\"]*)?',
    re.IGNORECASE
)

def normalize_url(url: str) -> str:
    """Normalize URL by stripping whitespace and adding scheme if missing."""
    url = url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "http://" + url
    return url

def validate_url(url: str) -> bool:
    """Validate if the given string is a plausible URL structure."""
    try:
        parsed = urlparse(url)
        return bool(parsed.netloc and ("." in parsed.netloc or parsed.netloc == "localhost"))
    except Exception:
        return False

def extract_urls_from_text(text: str) -> list[str]:
    """Extract and deduplicate normalized valid URLs from raw text."""
    raw_matches = URL_REGEX.findall(text)
    extracted = []
    seen = set()

    for raw in raw_matches:
        normalized = normalize_url(raw)
        if validate_url(normalized) and normalized not in seen:
            seen.add(normalized)
            extracted.append(normalized)

    return extracted

def extract_urls_from_pdf(file_bytes: bytes) -> list[str]:
    """Extract URLs from PDF text content and embedded hyperlink annotations."""
    extracted = []
    seen = set()

    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            # 1. Extract from visible text
            page_text = page.get_text()
            text_urls = URL_REGEX.findall(page_text)
            for raw in text_urls:
                norm = normalize_url(raw)
                if validate_url(norm) and norm not in seen:
                    seen.add(norm)
                    extracted.append(norm)

            # 2. Extract from PDF hyperlink annotations
            links = page.get_links()
            for link in links:
                if link.get("kind") == fitz.LINK_URI and "uri" in link:
                    norm = normalize_url(link["uri"])
                    if validate_url(norm) and norm not in seen:
                        seen.add(norm)
                        extracted.append(norm)

        doc.close()
    except Exception as e:
        print(f"Error parsing PDF: {e}")

    return extracted