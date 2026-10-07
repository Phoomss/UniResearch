"""Migration validation on disposable SQLite and PostgreSQL offline DDL."""

import sqlite3
from io import StringIO
from pathlib import Path

from alembic import command
from alembic.config import Config
from app.core.config import settings


def config():
    root = Path(__file__).resolve().parents[1]
    result = Config(str(root / "alembic.ini"))
    result.set_main_option("script_location", str(root / "alembic"))
    return result


def test_migration_upgrade_adoption_and_downgrade(tmp_path, monkeypatch):
    path = tmp_path / "migration.sqlite"
    monkeypatch.setattr(settings, "DATABASE_URL", f"sqlite+aiosqlite:///{path}")
    monkeypatch.setattr(settings, "DB_SSL", False)
    with sqlite3.connect(path) as conn:
        conn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY)")
    command.upgrade(config(), "head")
    with sqlite3.connect(path) as conn:
        tables = {
            row[0]
            for row in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")
        }
        assert len([name for name in tables if name.startswith("research_flow_")]) == 8
        conn.execute("INSERT INTO users (id) VALUES (7)")
    command.downgrade(config(), "base")
    with sqlite3.connect(path) as conn:
        assert conn.execute("SELECT id FROM users").fetchall() == [(7,)]
        assert not conn.execute(
            "SELECT name FROM sqlite_master WHERE name LIKE 'research_flow_%'"
        ).fetchall()
    command.upgrade(config(), "head")
    # Existing create_all installations can adopt the revision without recreating tables.
    with sqlite3.connect(path) as conn:
        conn.execute("DELETE FROM alembic_version")
    command.upgrade(config(), "head")


def test_postgresql_offline_migration_sql(monkeypatch):
    monkeypatch.setattr(
        settings, "DATABASE_URL", "postgresql+asyncpg://unused:unused@localhost/unused"
    )
    cfg = config()
    cfg.output_buffer = StringIO()
    command.upgrade(cfg, "head", sql=True)
    sql = cfg.output_buffer.getvalue()
    assert "CREATE TABLE research_flow_workflows" in sql
    assert "FOREIGN KEY(user_id) REFERENCES users (id)" in sql
    assert "CREATE TABLE research_flow_citations" in sql
