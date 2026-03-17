import asyncio

from sqlalchemy import select

from array_class import Array
from database import Database, DatabaseOption
from document import Document

arr = Array(1, 2, 3, 4)
print(arr.map(lambda x: x.value + 2))


async def t1():
    # print((await create_document({"a": 22})))
    database = Database(
        DatabaseOption(
            username="postgres",
            password="123456",
            address="192.168.206.128",
            databaseName="postgres",
        )
    )
    stmt = select(Document).filter(Document.data["a"].astext == "22")
    result = await database.pagination(stmt, 2, 3)
    print(result.total, result.page, result.page_size, result.values.length)


asyncio.run(t1())
