"""Small valid fixtures, generated without third-party image/PDF dependencies."""

import struct
import zlib


def png_chunk(kind, data):
    return (
        struct.pack(">I", len(data))
        + kind
        + data
        + struct.pack(">I", zlib.crc32(kind + data))
    )


PNG = (
    b"\x89PNG\r\n\x1a\n"
    + png_chunk(b"IHDR", struct.pack(">IIBBBBB", 1, 1, 8, 4, 0, 0, 0))
    + png_chunk(b"IDAT", zlib.compress(b"\x00\x00\xff"))
    + png_chunk(b"IEND", b"")
)


def blank_pdf():
    objects = [
        b"<</Type /Catalog /Pages 2 0 R>>",
        b"<</Type /Pages /Kids [3 0 R] /Count 1>>",
        b"<</Type /Page /Parent 2 0 R /MediaBox [0 0 100 100] /Contents 4 0 R>>",
        b"<</Length 0>>\nstream\n\nendstream",
    ]
    content = b"%PDF-1.4\n"
    offsets = []
    for number, value in enumerate(objects, 1):
        offsets.append(len(content))
        content += f"{number} 0 obj\n".encode() + value + b"\nendobj\n"
    start = len(content)
    content += b"xref\n0 5\n0000000000 65535 f \n"
    content += b"".join(f"{offset:010d} 00000 n \n".encode() for offset in offsets)
    return (
        content
        + f"trailer\n<</Size 5 /Root 1 0 R>>\nstartxref\n{start}\n%%EOF\n".encode()
    )


PDF = blank_pdf()
