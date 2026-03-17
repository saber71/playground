from dataclasses import dataclass
from operator import indexOf
from typing import TypeVar, Generic, Callable, Any

_T = TypeVar("_T")
_U = TypeVar("_U")

@dataclass()
class _Element(Generic[_T]):
    value:_T
    index:int


class Array(Generic[_T]):
    def __init__(self, *elements: _T):
        self._list:list[_T] = list(elements)

    @property
    def length(self):
        return len(self._list)

    def join(self,separate:str)->str:
        return separate.join(map(lambda x:str(x),self._list))

    def push(self, *elements: _T):
        for element in elements:
            self._list.append(element)

    def remove(self, *elements: _T):
        for element in elements:
            self._list.remove(element)

    def reverse(self):
        self._list.reverse()
        return self

    def reversed(self):
        return Array(reversed(self._list))

    def index_of(self, element:_T):
        return indexOf(self._list,element)

    def map(self, fn: Callable[[_Element[_T]], _U]) -> 'Array[_U]':
        index = 0
        result: list[_U] = []
        for e in self._list:
            result.append(fn(_Element(e, index)))
            index += 1
        return Array(*result)

    def filter(self, predicate: Callable[[_Element[_T]], bool]) -> 'Array[_U]':
        index = 0
        result: list[_U] = []
        for e in self._list:
            if predicate(_Element(e, index)):
                result.append(e)
            index += 1
        return Array(*result)

    def foreach(self, fn: Callable[[_Element[_T]], None]):
        index = 0
        for e in self._list:
            fn(_Element(e, index))
            index += 1
        return

    def sort(self, fn: Callable[[_T], Any], reverse: bool = False):
        self._list.sort(key=fn, reverse=reverse)
        return self

    def sorted(self, fn: Callable[[_T], Any], reverse: bool = False) -> 'Array[_T]':
        return Array(sorted(self._list, key=fn, reverse=reverse))

    def __len__(self):
        return self.length

    def __getitem__(self, item):
        return self._list[item]

    def __setitem__(self, key, value):
        self._list[key] = value

    def __bool__(self):
        return self.length > 0
