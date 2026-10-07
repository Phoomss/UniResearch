"""Add ResearchFlow tables to an existing UniResearch schema. Frozen revision."""

from alembic import context, op
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
    inspect,
)

revision = "20261007_research_flow"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    if context.is_offline_mode() or not inspect(op.get_bind()).has_table(
        "research_flow_workflows"
    ):
        op.create_table(
            "research_flow_workflows",
            Column("id", String(36), primary_key=True),
            Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
            Column("research_question", Text, nullable=False),
            Column("depth", String(16), nullable=False),
            Column("status", String(32), nullable=False),
            Column("next_agent", String(32), nullable=False),
            Column("plan", JSON, nullable=False),
            Column("draft", JSON, nullable=False),
            Column("critic_feedback", JSON, nullable=False),
            Column("metrics", JSON, nullable=False),
            Column("limitations", JSON, nullable=False),
            Column("iteration", Integer, nullable=False),
            Column("search_rounds", Integer, nullable=False),
            Column("llm_calls", Integer, nullable=False),
            Column("input_tokens", Integer, nullable=False),
            Column("output_tokens", Integer, nullable=False),
            Column("confidence", Float, nullable=False),
            Column("ready_at", DateTime, nullable=True),
            Column("started_at", DateTime),
            Column("deadline", DateTime),
            Column("lease_token", String(36)),
            Column("lease_until", DateTime),
            Column("created_at", DateTime, nullable=False),
            Column("updated_at", DateTime, nullable=False),
        )
        op.create_index(
            "ix_research_flow_workflows_user_id", "research_flow_workflows", ["user_id"]
        )
        op.create_index(
            "ix_research_flow_workflows_status", "research_flow_workflows", ["status"]
        )
        op.create_index(
            "ix_research_flow_workflows_ready_at",
            "research_flow_workflows",
            ["ready_at"],
        )
        op.create_index(
            "ix_research_flow_workflows_lease_until",
            "research_flow_workflows",
            ["lease_until"],
        )
    if context.is_offline_mode() or not inspect(op.get_bind()).has_table(
        "research_flow_tasks"
    ):
        op.create_table(
            "research_flow_tasks",
            Column("id", String(36), primary_key=True),
            Column(
                "workflow_id",
                String(36),
                ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
                nullable=False,
            ),
            Column("agent_type", String(32), nullable=False),
            Column("status", String(16), nullable=False),
            Column("depends_on", String(36), ForeignKey("research_flow_tasks.id")),
            Column("input", JSON, nullable=False),
            Column("output", JSON, nullable=False),
            Column("retry_count", Integer, nullable=False),
            Column("model", String(128)),
            Column("input_tokens", Integer, nullable=False),
            Column("output_tokens", Integer, nullable=False),
            Column("duration_ms", Integer),
            Column("error", String(80)),
            Column("started_at", DateTime),
            Column("completed_at", DateTime),
        )
        op.create_index(
            "ix_research_flow_tasks_workflow_id", "research_flow_tasks", ["workflow_id"]
        )
    if context.is_offline_mode() or not inspect(op.get_bind()).has_table(
        "research_flow_sources"
    ):
        op.create_table(
            "research_flow_sources",
            Column("id", String(36), primary_key=True),
            Column(
                "workflow_id",
                String(36),
                ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
                nullable=False,
            ),
            Column("document_id", Integer, nullable=False),
            Column("title", Text, nullable=False),
            Column("authors", JSON, nullable=False),
            Column("publication", Text),
            Column("year", Integer),
            Column("doi", Text),
            Column("url", Text, nullable=False),
            Column("provider", String(32), nullable=False),
            Column("retrieved_at", DateTime, nullable=False),
            Column("chunk_ref", String(64), nullable=False),
            Column("page", Integer),
            Column("retrieval_score", Float, nullable=False),
            Column("quality", Float, nullable=False),
            Column("content", Text, nullable=False),
            UniqueConstraint("workflow_id", "document_id"),
        )
        op.create_index(
            "ix_research_flow_sources_workflow_id",
            "research_flow_sources",
            ["workflow_id"],
        )
    if context.is_offline_mode() or not inspect(op.get_bind()).has_table(
        "research_flow_papers"
    ):
        op.create_table(
            "research_flow_papers",
            Column("id", String(36), primary_key=True),
            Column(
                "workflow_id",
                String(36),
                ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
                nullable=False,
            ),
            Column(
                "source_id",
                String(36),
                ForeignKey("research_flow_sources.id"),
                nullable=False,
            ),
            Column("summary", JSON, nullable=False),
            UniqueConstraint("workflow_id", "source_id"),
        )
        op.create_index(
            "ix_research_flow_papers_workflow_id",
            "research_flow_papers",
            ["workflow_id"],
        )
    if context.is_offline_mode() or not inspect(op.get_bind()).has_table(
        "research_flow_claims"
    ):
        op.create_table(
            "research_flow_claims",
            Column("id", String(36), primary_key=True),
            Column(
                "workflow_id",
                String(36),
                ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
                nullable=False,
            ),
            Column("text", Text, nullable=False),
            Column("strength", String(16), nullable=False),
            Column("verified", Integer, nullable=False),
        )
        op.create_index(
            "ix_research_flow_claims_workflow_id",
            "research_flow_claims",
            ["workflow_id"],
        )
    if context.is_offline_mode() or not inspect(op.get_bind()).has_table(
        "research_flow_evidence"
    ):
        op.create_table(
            "research_flow_evidence",
            Column("id", String(36), primary_key=True),
            Column(
                "workflow_id",
                String(36),
                ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
                nullable=False,
            ),
            Column(
                "claim_id",
                String(36),
                ForeignKey("research_flow_claims.id"),
                nullable=False,
            ),
            Column(
                "source_id",
                String(36),
                ForeignKey("research_flow_sources.id"),
                nullable=False,
            ),
            Column("relation", String(16), nullable=False),
            Column("quote", Text, nullable=False),
            Column("locator", String(64), nullable=False),
            Column("support_verified", Integer, nullable=False),
        )
        op.create_index(
            "ix_research_flow_evidence_workflow_id",
            "research_flow_evidence",
            ["workflow_id"],
        )
    if context.is_offline_mode() or not inspect(op.get_bind()).has_table(
        "research_flow_citations"
    ):
        op.create_table(
            "research_flow_citations",
            Column("id", String(36), primary_key=True),
            Column(
                "workflow_id",
                String(36),
                ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
                nullable=False,
            ),
            Column(
                "claim_id",
                String(36),
                ForeignKey("research_flow_claims.id"),
                nullable=False,
            ),
            Column(
                "source_id",
                String(36),
                ForeignKey("research_flow_sources.id"),
                nullable=False,
            ),
            Column(
                "evidence_id",
                String(36),
                ForeignKey("research_flow_evidence.id"),
                nullable=False,
            ),
            Column("sentence_index", Integer, nullable=False),
        )
        op.create_index(
            "ix_research_flow_citations_workflow_id",
            "research_flow_citations",
            ["workflow_id"],
        )
    if context.is_offline_mode() or not inspect(op.get_bind()).has_table(
        "research_flow_events"
    ):
        op.create_table(
            "research_flow_events",
            Column("id", Integer, primary_key=True, autoincrement=True),
            Column(
                "workflow_id",
                String(36),
                ForeignKey("research_flow_workflows.id", ondelete="CASCADE"),
                nullable=False,
            ),
            Column("event_type", String(64), nullable=False),
            Column("summary", String(256), nullable=False),
            Column("task_id", String(36)),
            Column("created_at", DateTime, nullable=False),
        )
        op.create_index(
            "ix_research_flow_events_workflow_id",
            "research_flow_events",
            ["workflow_id"],
        )


def downgrade():
    op.drop_table("research_flow_events")
    op.drop_table("research_flow_citations")
    op.drop_table("research_flow_evidence")
    op.drop_table("research_flow_claims")
    op.drop_table("research_flow_papers")
    op.drop_table("research_flow_sources")
    op.drop_table("research_flow_tasks")
    op.drop_table("research_flow_workflows")
