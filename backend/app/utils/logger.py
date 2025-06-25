import structlog
import logging
from typing import Any, Dict

# Configure structlog
logging.basicConfig(
    format="%(message)s",
    level=logging.INFO,
)

structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

def log_user_activity(
    user_id: int,
    action: str,
    resource_type: str = None,
    resource_id: int = None,
    description: str = None,
    extra_data: Dict[str, Any] = None
):
    """사용자 활동 로깅"""
    log_data = {
        "user_id": user_id,
        "action": action,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "description": description,
    }
    
    if extra_data:
        log_data.update(extra_data)
    
    logger.info("User activity", **log_data)