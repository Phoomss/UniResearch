from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.notification import Notification
from app.schemas.notification import NotificationBase
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    async def create_notification(
        self, db: AsyncSession, user_id: int, title: str, message: str, type: str = "info"
    ) -> Notification:
        try:
            notification = Notification(
                user_id=user_id,
                title=title,
                message=message,
                type=type,
                is_read=False
            )
            db.add(notification)
            await db.commit()
            await db.refresh(notification)
            return notification
        except Exception as e:
            logger.exception("Failed to create notification")
            await db.rollback()
            raise e

    async def get_user_notifications(self, db: AsyncSession, user_id: int) -> list[Notification]:
        query = select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc())
        result = await db.execute(query)
        return list(result.scalars().all())

    async def mark_as_read(self, db: AsyncSession, notification_id: int, user_id: int) -> Notification:
        query = select(Notification).where(Notification.id == notification_id, Notification.user_id == user_id)
        result = await db.execute(query)
        notification = result.scalars().first()
        if notification:
            notification.is_read = True
            await db.commit()
            await db.refresh(notification)
        return notification

    async def mark_all_as_read(self, db: AsyncSession, user_id: int) -> bool:
        query = select(Notification).where(Notification.user_id == user_id, Notification.is_read == False)
        result = await db.execute(query)
        notifications = result.scalars().all()
        for n in notifications:
            n.is_read = True
        await db.commit()
        return True

notification_service = NotificationService()
