from sqlalchemy import Column, UUID, text
from sqlalchemy.dialects.postgresql import JSONB

from alias import true
from database import EntityBase


class Document(EntityBase):
    __tablename__ = "document"

    id = Column(
        UUID, primary_key=true, index=true, server_default=text("gen_random_uuid()")
    )
    data = Column(JSONB)
