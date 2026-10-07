from datetime import datetime, timezone


def utc_now():
    """UTC stored without offset, matching existing UniResearch DateTime columns."""
    return datetime.now(timezone.utc).replace(tzinfo=None)
