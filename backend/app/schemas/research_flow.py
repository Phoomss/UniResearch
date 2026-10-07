from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class CreateWorkflow(StrictModel):
    research_question: str = Field(min_length=12, max_length=2000)
    depth: Literal["QUICK", "STANDARD", "DEEP"] = "STANDARD"


class HumanCommand(StrictModel):
    action: Literal[
        "CONTINUE", "SEARCH_MORE", "ACCEPT_CURRENT", "MODIFY_QUESTION", "RETRY_AGENT"
    ] = "CONTINUE"
    research_question: str | None = Field(default=None, min_length=12, max_length=2000)
    task_id: str | None = None


class Plan(StrictModel):
    sub_questions: list[str] = Field(min_length=1, max_length=8)
    queries: list[str] = Field(min_length=1, max_length=8)
    ambiguous: bool = False
    summary: str = Field(max_length=500)


class Statement(StrictModel):
    text: str = Field(max_length=2000)
    quote: str = Field(min_length=8, max_length=3000)


class PaperSummary(StrictModel):
    source_id: str
    objective: Statement | None = None
    methodology: Statement | None = None
    dataset: Statement | None = None
    findings: list[Statement] = Field(default_factory=list, max_length=12)
    limitations: list[Statement] = Field(default_factory=list, max_length=8)
    conclusions: list[Statement] = Field(default_factory=list, max_length=8)
    interpretation: str = Field(default="", max_length=2000)


class PaperOutput(StrictModel):
    papers: list[PaperSummary] = Field(max_length=100)


class EvidenceLink(StrictModel):
    source_id: str
    relation: Literal["supporting", "contradicting"]
    quote: str = Field(min_length=8, max_length=3000)


class ClaimOutput(StrictModel):
    text: str = Field(min_length=8, max_length=2000)
    evidence: list[EvidenceLink] = Field(max_length=20)


class EvidenceOutput(StrictModel):
    claims: list[ClaimOutput] = Field(max_length=40)


class SupportCheck(StrictModel):
    evidence_id: str
    supports_relation: bool


class VerificationOutput(StrictModel):
    checks: list[SupportCheck] = Field(max_length=800)


class CriticIssue(StrictModel):
    type: Literal[
        "INSUFFICIENT_EVIDENCE",
        "CONTRADICTION",
        "OVERGENERALIZATION",
        "CITATION",
        "MISSING_PERSPECTIVE",
    ]
    claim_id: str | None = None
    reason: str = Field(max_length=1000)
    recommended_action: Literal[
        "SEARCH_MORE",
        "READ_MORE",
        "RECHECK_EVIDENCE",
        "REWRITE",
        "RECHECK_CITATIONS",
        "REQUEST_HUMAN_REVIEW",
    ]


class CriticOutput(StrictModel):
    status: Literal["ACCEPT", "REVISION_REQUIRED"]
    action: Literal[
        "ACCEPT",
        "SEARCH_MORE",
        "READ_MORE",
        "RECHECK_EVIDENCE",
        "REWRITE",
        "RECHECK_CITATIONS",
        "REQUEST_HUMAN_REVIEW",
    ]
    issues: list[CriticIssue] = Field(default_factory=list, max_length=20)
    queries: list[str] = Field(default_factory=list, max_length=8)


class ReportSentence(StrictModel):
    section: Literal[
        "Executive Summary",
        "Background",
        "Key Findings",
        "Evidence Analysis",
        "Conflicting Evidence",
        "Conclusion",
    ]
    claim_id: str
    text: str = Field(min_length=8, max_length=2000)
    source_ids: list[str] = Field(min_length=1, max_length=20)


class WriterOutput(StrictModel):
    sentences: list[ReportSentence] = Field(min_length=1, max_length=60)


class CitationCheck(StrictModel):
    sentence_index: int = Field(ge=0)
    supported: bool


class CitationOutput(StrictModel):
    checks: list[CitationCheck] = Field(max_length=60)


class SourceCandidate(StrictModel):
    document_id: int = Field(ge=1)
    title: str = Field(min_length=1, max_length=2000)
    authors: list[str] = Field(max_length=100)
    publication: str | None = None
    year: int | None = None
    doi: str | None = None
    url: str = Field(max_length=2000)
    provider: str
    chunk_ref: str
    page: int | None = None
    retrieval_score: float = Field(ge=0, le=1)
    quality: float = Field(ge=0, le=1)
    content: str = Field(min_length=1, max_length=6000)


class SearchOutput(StrictModel):
    results: list[SourceCandidate] = Field(max_length=100)
