package saber71.springboot;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import org.jetbrains.annotations.Contract;
import org.jspecify.annotations.NonNull;

public record ListDiff<T>(List<T> added, List<T> removed) {
  @Contract("_, _ -> new")
  public static <T> @NonNull ListDiff<T> of(List<T> newList, List<T> oldList) {
    var newSet = new HashSet<>(newList);
    var oldSet = new HashSet<>(oldList);

    var added = new HashSet<>(newSet);
    added.removeAll(oldSet);

    var removed = new HashSet<>(oldList);
    oldList.removeAll(newSet);

    return new ListDiff<>(new ArrayList<>(added), new ArrayList<>(removed));
  }
}
