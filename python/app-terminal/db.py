import dataclasses
from typing import Dict, Any, Optional

from sqlalchemy import Column, UUID, text, select, func, Select
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from alias import true
from custom_array import Array

DATABASE_URL = "postgresql+asyncpg://postgres:123456@192.168.206.128/postgres"
engine = create_async_engine(DATABASE_URL)
Base = declarative_base()


class Document(Base):
    __tablename__ = 'document'

    id = Column(UUID, primary_key=true, index=true, server_default=text("gen_random_uuid()"))
    data = Column(JSONB)


async def create_document(data: Dict[Any, Any] | object):
    if not isinstance(data, Dict):
        data = data.__dict__
    async_session = sessionmaker(engine, class_=AsyncSession)
    async with async_session() as session:
        new_document = Document(data=data)
        session.add(new_document)
        await session.commit()
        await session.refresh(new_document)
        return new_document.id


def _unwrapper(data: Dict[Any, Any] | object):
    if isinstance(data, Dict):
        doc_id = data.get('id')
        doc_data = data
    else:
        doc_id = getattr(data, 'id', None)
        doc_data = data.__dict__
    return [doc_id, doc_data]


async def update_document(data: Dict[Any, Any] | object):
    doc_id, doc_data = _unwrapper(data)

    if doc_id is None:
        raise ValueError("Document must have an id field")

    async_session = sessionmaker(engine, class_=AsyncSession)
    async with async_session() as session:
        document = await session.get(Document, doc_id)

        if document:
            document.data = doc_data
        else:
            raise ValueError("Document not found")

        await session.commit()
        await session.refresh(document)
        return document.id


async def save_document(data: Dict[Any, Any] | object):
    if isinstance(data, Dict):
        doc_id = data.get('id')
        doc_data = data
    else:
        doc_id = getattr(data, 'id', None)
        doc_data = data.__dict__

    if doc_id is None:
        raise ValueError("Document must have an id field")

    async_session = sessionmaker(engine, class_=AsyncSession)
    async with async_session() as session:
        document = await session.get(Document, doc_id)

        if document:
            document.data = doc_data
        else:
            document = Document(id=doc_id, data=doc_data)
            session.add(document)

        await session.commit()
        await session.refresh(document)
        return document.id


@dataclasses.dataclass
class QuerySelectPagination:
    total: int
    page: int
    page_size: int
    values: Array[Document]


async def query_select_pagination(
        filters: Optional[Dict[str, Any]] = None,
        page: int = 1,
        page_size: int = 10,
        stmt: Select[Any] = None
):
    async_session = sessionmaker(engine, class_=AsyncSession)
    async with async_session() as session:
        base_query = stmt if stmt else select(Document)

        if filters:
            for key, value in filters.items():
                condition = Document.data[key].astext == str(value)
                base_query = base_query.filter(condition)

        total = (await session.execute(
            select(func.count()).select_from(base_query.subquery())
        )).scalar()

        offset = (page - 1) * page_size
        query = base_query.offset(offset).limit(page_size)

        result = (await session.execute(query)).scalars()
        return QuerySelectPagination(total, page, page_size, Array(*result))


async def query_select(
        filters: Optional[Dict[str, Any]] = None,
        stmt: Select[Any] = None
) -> Array[Document]:
    async_session = sessionmaker(engine, class_=AsyncSession)
    async with async_session() as session:
        base_query = stmt if stmt else select(Document)

        if filters:
            for key, value in filters.items():
                condition = Document.data[key].astext == str(value)
                base_query = base_query.filter(condition)

        result = (await session.execute(base_query)).scalars()
        return Array(*result)
