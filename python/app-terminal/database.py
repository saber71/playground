import dataclasses
from typing import Callable, TypeVar, Generic

from sqlalchemy import Select, select, func
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from array_class import Array

EntityBase = declarative_base()

_U = TypeVar("_U")
_E = TypeVar("_E", bound=EntityBase)


@dataclasses.dataclass
class QuerySelectPagination(Generic[_U]):
    total: int
    page: int
    page_size: int
    values: Array[_U]


@dataclasses.dataclass
class DatabaseOption:
    username: str
    password: str
    databaseName: str
    address: str


class Database:
    def __init__(self, option: DatabaseOption):
        self._option = option
        self._url = f"postgresql+asyncpg://{option.username}:{option.password}@{option.address}/{option.databaseName}"
        self._engine = create_async_engine(self._url)

    async def execute(self, fn: Callable[[AsyncSession], _U]) -> _U:
        async_session = sessionmaker(self._engine, class_=AsyncSession)
        # noinspection PyTypeChecker
        async with async_session() as session:
            entity = await fn(session)
            if entity is not None and isinstance(entity, EntityBase):
                await session.commit()
                await session.refresh(entity)
            return entity

    async def create(self, entity: _E) -> _E:
        def fn(session: AsyncSession):
            session.add(entity)
            return entity

        return self.execute(fn)

    async def update(self, entity: _E) -> _E:
        return self.execute(lambda _: entity)

    async def select(self, stmt: Select[_E]) -> Array[_E]:
        async def fn(session: AsyncSession):
            result = (await session.execute(stmt)).scalars()
            return Array(*result)

        # noinspection PyTypeChecker
        return await self.execute(fn)

    async def pagination(
        self, stmt: Select[_E], page: int, page_size: int
    ) -> QuerySelectPagination[_E]:
        async def fn(session: AsyncSession):
            total = (
                await session.execute(
                    select(func.count()).select_from(stmt.subquery())
                )
            ).scalar()
            offset = (page - 1) * page_size
            query = stmt.offset(offset).limit(page_size)
            result = (await session.execute(query)).scalars()
            return QuerySelectPagination(total, page, page_size, Array(*result))

        # noinspection PyTypeChecker
        return await self.execute(fn)
