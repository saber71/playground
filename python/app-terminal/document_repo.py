from typing import Dict, Any

from sqlalchemy.ext.asyncio import AsyncSession

from database import Database
from document import Document


def _unwrapper(data: Dict[Any, Any] | object):
    if isinstance(data, Dict):
        doc_id = data.get("id")
        doc_data = data
    else:
        doc_id = getattr(data, "id", None)
        doc_data = data.__dict__
    return [doc_id, doc_data]


class DocumentRepo:
    def __init__(self, database: Database):
        self._database = database

    async def create(self, data: Dict[Any, Any] | object):
        if not isinstance(data, Dict):
            data = data.__dict__
        new_document = Document(data=data)

        def fn(session: AsyncSession):
            session.add(new_document)
            return new_document

        return await self._database.execute(fn)

    async def update(self, data: Dict[Any, Any] | object):
        doc_id, doc_data = _unwrapper(data)
        if doc_id is None:
            raise ValueError("Document must have an id field")

        async def fn(session: AsyncSession):
            document = await session.get(Document, doc_id)
            if document:
                document.data = doc_data
            else:
                raise ValueError("Document not found")
            return document

        return await self._database.execute(fn)

    async def save(self, data: Dict[Any, Any] | object):
        doc_id, doc_data = _unwrapper(data)
        if doc_id is None:
            raise ValueError("Document must have an id field")

        async def fn(session: AsyncSession):
            document = await session.get(Document, doc_id)
            if document:
                document.data = doc_data
            else:
                document = Document(id=doc_id, data=doc_data)
                session.add(document)
            return document

        return await self._database.execute(fn)
