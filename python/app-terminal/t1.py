import asyncio

from custom_array import Array
from db import create_document, query_select, Document

arr = Array(1, 2, 3, 4)
print(arr.map(lambda x: x.value + 2))


async def t1():
    print((await create_document({"a": 22})))
    lst=await query_select({"a": 22})
    for e in lst:
        print(isinstance(e,Document))


asyncio.run(t1())
