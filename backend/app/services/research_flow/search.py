import re

from app.services.research_service import search_research


class LocalSearchProvider:
    """Uses the existing repository search; only approved abstracts enter the corpus."""

    async def search(self, db, queries, limit):
        found = {}
        for query in queries[:8]:
            works = await search_research(
                db, query[:500], None, limit=limit * 3, log_search=False
            )
            terms = set(re.findall(r"\w+", query.lower()))
            for work in works:
                if not work.abstract or work.id in found:
                    continue
                text = f"{work.title_en} {work.title_th} {work.abstract} {work.keywords or ''}".lower()
                score = sum(t in text for t in terms) / max(len(terms), 1)
                found[work.id] = {
                    "document_id": work.id,
                    "title": work.title_en or work.title_th,
                    "authors": [
                        " ".join(filter(None, [a.user.first_name, a.user.last_name]))
                        or f"Author {a.user_id}"
                        for a in work.authors
                    ],
                    "publication": None,
                    "year": None,
                    "doi": None,
                    "url": f"/research/{work.id}",
                    "provider": "uniresearch",
                    "chunk_ref": "abstract",
                    "page": None,
                    "retrieval_score": score,
                    "quality": 0.5,
                    "content": work.abstract[:6000],
                }
        return sorted(found.values(), key=lambda x: x["retrieval_score"], reverse=True)[
            :limit
        ]
