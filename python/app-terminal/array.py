from operator import indexOf
from typing import TypeVar, Generic, Callable, Any

T = TypeVar("T")
U = TypeVar("U")


class Array(Generic[T]):
    def __init__(self, *elements: T):
        self._list = list(elements)

    @property
    def length(self):
        return len(self._list)

    def push(self, *elements: T):
        for element in elements:
            self._list.append(element)

    def remove(self, *elements: T):
        for element in elements:
            self._list.remove(element)

    def reverse(self):
        self._list.reverse()
        return self

    def reversed(self):
        return Array(reversed(self._list))

    def index_of(self,element:T):
        return indexOf(self._list,element)

    def map(self, fn: Callable[[T, int], U]) -> 'Array[U]':
        index = 0
        result: list[U] = []
        for e in self._list:
            result.append(fn(e, index))
            index += 1
        return Array(*result)

    def filter(self, predicate: Callable[[T, int], bool]) -> 'Array[U]':
        index = 0
        result: list[U] = []
        for e in self._list:
            if predicate(e, index):
                result.append(e)
            index += 1
        return Array(*result)

    def foreach(self, fn: Callable[[T, int], None]):
        index = 0
        for e in self._list:
            fn(e, index)
            index += 1
        return

    def sort(self, fn: Callable[[T], Any], reverse: bool = False):
        self._list.sort(key=fn, reverse=reverse)
        return self

    def sorted(self, fn: Callable[[T], Any], reverse: bool = False) -> 'Array[T]':
        return Array(sorted(self._list, key=fn, reverse=reverse))

    def __len__(self):
        return self.length

    def __getitem__(self, item):
        return self._list[item]

    def __setitem__(self, key, value):
        self._list[key] = value

    def __bool__(self):
        return self.length > 0
