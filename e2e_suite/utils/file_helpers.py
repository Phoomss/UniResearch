"""
File helpers for generating valid PDFs, PNGs, and boundary files.
Ensures correct magic bytes:
- PDF: %PDF-
- PNG: \\x89PNG\\r\\n\\x1a\\n
"""

import os
import tempfile


def create_mock_png(size_bytes=1024, filename="sample_cover.png"):
    """
    Creates a temporary PNG file with valid header and specified total size.
    Magic bytes: \\x89PNG\\r\\n\\x1a\\n
    """
    header = b"\x89PNG\r\n\x1a\n"
    if size_bytes < len(header):
        content = header[:size_bytes]
    else:
        padding = b"\x00" * (size_bytes - len(header))
        content = header + padding

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".png", prefix=filename.split(".")[0])
    tmp.write(content)
    tmp.flush()
    tmp.close()
    return tmp.name


def create_mock_pdf(size_bytes=1024, filename="sample_doc.pdf"):
    """
    Creates a temporary PDF file with valid header and specified total size.
    Magic bytes: %PDF-1.4\\n
    """
    header = b"%PDF-1.4\n"
    trailer = b"\n%%EOF"
    overhead = len(header) + len(trailer)
    if size_bytes <= overhead:
        content = header
    else:
        content = header + (b"X" * (size_bytes - overhead)) + trailer

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf", prefix=filename.split(".")[0])
    tmp.write(content)
    tmp.flush()
    tmp.close()
    return tmp.name


def cleanup_temp_file(filepath):
    """Safely removes temporary test file."""
    if filepath and os.path.exists(filepath):
        try:
            os.unlink(filepath)
        except OSError:
            pass
