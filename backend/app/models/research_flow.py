"""Normalized durable research state. JSON is limited to per-entity structured payloads."""

from uuid import uuid4

from app.core.research_flow_time import utc_now
from app.db.database import Base
from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)


def uid():
    return str(uuid4())


class ResearchWorkflow(Base):
    __tablename__ = "research_flow_workflows"
    id = Column(String(36), primary_key=True, default=uid)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    research_question = Column(Text, nullable=False)
    depth = Column(String(16), nullable=False)
    status = Column(String(32), nullable=False, default="PLANNING", index=True)
    next_agent = Column(String(32), nullable=False, default="planner")
    plan = Column(JSON, nullable=False, default=dict)
    draft = Column(JSON, nullable=False, default=dict)
    critic_feedback = Column(JSON, nullable=False, default=dict)
    metrics = Column(JSON, nullable=False, default=dict)
    limitations = Column(JSON, nullable=False, default=list)
    iteration = Column(Integer, nullable=False, default=0)
    search_rounds = Column(Integer, nullable=False, default=0)
    llm_calls = Column(Integer, nullable=False, default=0)
    input_tokens = Column(Integer, nullable=False, default=0)
    output_tokens = Column(Integer, nullable=False, default=0)
    confidence = Column(Float, nullable=False, default=0)
    ready_at = Column(DateTime, nullable=True, index=True)
    started_at = Column(DateTime)
    deadline = Column(DateTime)
    lease_token = Column(String(36))
    lease_until = Column(DateTime, index=True)
    created_at = Column(DateTime, nullable=False, default=utc_now)
    updated_at = Column(DateTime, nullable=False, default=utc_now, onupdate=utc_now)


class ResearchTask(Base):
    __tablename__ = "research_flow_tasks"
    id = Column(String(36), primary_key=True, default=uid)
    workflow_id = Column(
        String(36),
        ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    agent_type = Column(String(32), nullable=False)
    status = Column(String(16), nullable=False, default="PENDING")
    depends_on = Column(String(36), ForeignKey("research_flow_tasks.id"))
    input = Column(JSON, nullable=False, default=dict)
    output = Column(JSON, nullable=False, default=dict)
    retry_count = Column(Integer, nullable=False, default=0)
    model = Column(String(128))
    input_tokens = Column(Integer, nullable=False, default=0)
    output_tokens = Column(Integer, nullable=False, default=0)
    duration_ms = Column(Integer)
    error = Column(String(80))
    started_at = Column(DateTime)
    completed_at = Column(DateTime)


class ResearchSource(Base):
    __tablename__ = "research_flow_sources"
    __table_args__ = (UniqueConstraint("workflow_id", "document_id"),)
    id = Column(String(36), primary_key=True, default=uid)
    workflow_id = Column(
        String(36),
        ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    document_id = Column(
        Integer, nullable=False
    )  # Snapshot survives original document deletion.
    title = Column(Text, nullable=False)
    authors = Column(JSON, nullable=False, default=list)
    publication = Column(Text)
    year = Column(Integer)
    doi = Column(Text)
    url = Column(Text, nullable=False)
    provider = Column(String(32), nullable=False)
    retrieved_at = Column(DateTime, nullable=False, default=utc_now)
    chunk_ref = Column(String(64), nullable=False, default="abstract")
    page = Column(Integer)
    retrieval_score = Column(Float, nullable=False, default=0)
    quality = Column(Float, nullable=False, default=0.5)
    content = Column(Text, nullable=False)


class ResearchPaper(Base):
    __tablename__ = "research_flow_papers"
    __table_args__ = (UniqueConstraint("workflow_id", "source_id"),)
    id = Column(String(36), primary_key=True, default=uid)
    workflow_id = Column(
        String(36),
        ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    source_id = Column(
        String(36), ForeignKey("research_flow_sources.id"), nullable=False
    )
    summary = Column(JSON, nullable=False)


class ResearchClaim(Base):
    __tablename__ = "research_flow_claims"
    id = Column(String(36), primary_key=True, default=uid)
    workflow_id = Column(
        String(36),
        ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    text = Column(Text, nullable=False)
    strength = Column(String(16), nullable=False, default="insufficient")
    verified = Column(Integer, nullable=False, default=0)


class ResearchEvidence(Base):
    __tablename__ = "research_flow_evidence"
    id = Column(String(36), primary_key=True, default=uid)
    workflow_id = Column(
        String(36),
        ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    claim_id = Column(String(36), ForeignKey("research_flow_claims.id"), nullable=False)
    source_id = Column(
        String(36), ForeignKey("research_flow_sources.id"), nullable=False
    )
    relation = Column(String(16), nullable=False)
    quote = Column(Text, nullable=False)
    locator = Column(String(64), nullable=False)
    support_verified = Column(Integer, nullable=False, default=0)


class ResearchCitation(Base):
    __tablename__ = "research_flow_citations"
    id = Column(String(36), primary_key=True, default=uid)
    workflow_id = Column(
        String(36),
        ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    claim_id = Column(String(36), ForeignKey("research_flow_claims.id"), nullable=False)
    source_id = Column(
        String(36), ForeignKey("research_flow_sources.id"), nullable=False
    )
    evidence_id = Column(
        String(36), ForeignKey("research_flow_evidence.id"), nullable=False
    )
    sentence_index = Column(Integer, nullable=False)


class ResearchEvent(Base):
    __tablename__ = "research_flow_events"
    id = Column(Integer, primary_key=True, autoincrement=True)
    workflow_id = Column(
        String(36),
        ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    event_type = Column(String(64), nullable=False)
    summary = Column(String(256), nullable=False)
    task_id = Column(String(36))
    created_at = Column(DateTime, nullable=False, default=utc_now)
