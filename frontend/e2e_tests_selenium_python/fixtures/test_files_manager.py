# -*- coding: utf-8 -*-
import os

FIXTURES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "files"))

NORMAL_PDF_NAME = "งานวิจัย_ธนภัทร_ฉบับสมบูรณ์.pdf"
MAX_25MB_PDF_NAME = "งานวิจัย_ธนภัทร_ขนาดสูงสุด25MB.pdf"
OVER_26MB_PDF_NAME = "งานวิจัย_ธนภัทร_ขนาดเกินกำหนด26MB.pdf"

NORMAL_PNG_NAME = "ปกงานวิจัย_ธนภัทร_ปกติ.png"
MAX_5MB_PNG_NAME = "ปกงานวิจัย_ธนภัทร_ขนาดสูงสุด5MB.png"
OVER_6MB_PNG_NAME = "ปกงานวิจัย_ธนภัทร_ขนาดเกินกำหนด6MB.png"

INVALID_TXT_NAME = "บันทึกย่อ_งานวิจัย.txt"
FAKE_PDF_NAME = "ไฟล์ปลอมแปลงโครงสร้าง.pdf"

NORMAL_PDF_PATH = os.path.join(FIXTURES_DIR, NORMAL_PDF_NAME)
MAX_25MB_PDF_PATH = os.path.join(FIXTURES_DIR, MAX_25MB_PDF_NAME)
OVER_26MB_PDF_PATH = os.path.join(FIXTURES_DIR, OVER_26MB_PDF_NAME)

NORMAL_PNG_PATH = os.path.join(FIXTURES_DIR, NORMAL_PNG_NAME)
MAX_5MB_PNG_PATH = os.path.join(FIXTURES_DIR, MAX_5MB_PNG_NAME)
OVER_6MB_PNG_PATH = os.path.join(FIXTURES_DIR, OVER_6MB_PNG_NAME)

INVALID_TXT_PATH = os.path.join(FIXTURES_DIR, INVALID_TXT_NAME)
FAKE_PDF_PATH = os.path.join(FIXTURES_DIR, FAKE_PDF_NAME)

def ensure_test_files():
    os.makedirs(FIXTURES_DIR, exist_ok=True)
    
    # 1. Normal PDF (2.4 MB)
    if not os.path.exists(NORMAL_PDF_PATH) or os.path.getsize(NORMAL_PDF_PATH) != int(2.4 * 1024 * 1024):
        size = int(2.4 * 1024 * 1024)
        header = b"%PDF-1.4\n% UniResearch Valid Test PDF\n"
        with open(NORMAL_PDF_PATH, "wb") as f:
            f.write(header + b"0" * (size - len(header)))

    # 2. Max boundary PDF (25.0 MB)
    size_25mb = 25 * 1024 * 1024
    if not os.path.exists(MAX_25MB_PDF_PATH) or os.path.getsize(MAX_25MB_PDF_PATH) != size_25mb:
        header = b"%PDF-1.4\n% UniResearch 25MB Max Boundary Test PDF\n"
        with open(MAX_25MB_PDF_PATH, "wb") as f:
            f.write(header + b"0" * (size_25mb - len(header)))

    # 3. Over limit PDF (26.0 MB)
    size_26mb = 26 * 1024 * 1024
    if not os.path.exists(OVER_26MB_PDF_PATH) or os.path.getsize(OVER_26MB_PDF_PATH) != size_26mb:
        header = b"%PDF-1.4\n% UniResearch 26MB Over Limit Test PDF\n"
        with open(OVER_26MB_PDF_PATH, "wb") as f:
            f.write(header + b"0" * (size_26mb - len(header)))

    # 4. Normal PNG (1.2 MB)
    png_header = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4"
    size_1_2mb = int(1.2 * 1024 * 1024)
    if not os.path.exists(NORMAL_PNG_PATH) or os.path.getsize(NORMAL_PNG_PATH) != size_1_2mb:
        with open(NORMAL_PNG_PATH, "wb") as f:
            f.write(png_header + b"0" * (size_1_2mb - len(png_header)))

    # 5. Max boundary PNG (5.0 MB)
    size_5mb = 5 * 1024 * 1024
    if not os.path.exists(MAX_5MB_PNG_PATH) or os.path.getsize(MAX_5MB_PNG_PATH) != size_5mb:
        with open(MAX_5MB_PNG_PATH, "wb") as f:
            f.write(png_header + b"0" * (size_5mb - len(png_header)))

    # 6. Over limit PNG (6.0 MB)
    size_6mb = 6 * 1024 * 1024
    if not os.path.exists(OVER_6MB_PNG_PATH) or os.path.getsize(OVER_6MB_PNG_PATH) != size_6mb:
        with open(OVER_6MB_PNG_PATH, "wb") as f:
            f.write(png_header + b"0" * (size_6mb - len(png_header)))

    # 7. Invalid text document (.txt)
    with open(INVALID_TXT_PATH, "w", encoding="utf-8") as f:
        f.write("นี่คือเอกสารข้อความธรรมดา (Plain Text) ไม่ใช่ไฟล์เอกสาร PDF หรือรูปภาพ")

    # 8. Fake PDF (invalid signature, no %PDF- header)
    with open(FAKE_PDF_PATH, "wb") as f:
        f.write(b"NOT A REAL PDF FILE. THIS IS PLAIN TEXT CORRUPTED SIGNATURE FOR TESTING.")

def cleanup_oversized_files():
    for p in [OVER_26MB_PDF_PATH, OVER_6MB_PNG_PATH]:
        if os.path.exists(p):
            try:
                os.remove(p)
            except Exception:
                pass

if __name__ == "__main__":
    ensure_test_files()
    print("Test files generated successfully:")
    for name in [
        NORMAL_PDF_NAME, MAX_25MB_PDF_NAME, OVER_26MB_PDF_NAME,
        NORMAL_PNG_NAME, MAX_5MB_PNG_NAME, OVER_6MB_PNG_NAME,
        INVALID_TXT_NAME, FAKE_PDF_NAME
    ]:
        p = os.path.join(FIXTURES_DIR, name)
        print(f" - {name}: {os.path.getsize(p)} bytes")
