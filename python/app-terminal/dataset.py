from typing import TypeVar, Generic, Dict, Protocol, Callable

DatasetItemId = int | float | str


class _DatasetItem(Protocol):
    id: DatasetItemId
    pass


T = TypeVar("T", bound=_DatasetItem)


class Dataset(Generic[T]):
    def __init__(self):
        self._items: Dict[DatasetItemId, T] = {}

    def get_item(self, item_id: DatasetItemId) -> T | None:
        return self._items.get(item_id)

    def item(self, item_id: DatasetItemId) -> T:
        if item_id not in self._items:
            raise RuntimeError("item not found")
        return self._items[item_id]

    def append(self, *items: T):
        for item in items:
            self._items[item.id] = item
        return self

    def remove(self, *items: T):
        for item in items:
            del self._items[item.id]
        return self

    def filter(self, predicate: Callable[[T, int], bool]) -> list[T]:
        index = 0
        result: list[T] = []
        for _, item in enumerate(self._items):
            if predicate(item, index):
                result.append(item)
            index += 1
        return result
