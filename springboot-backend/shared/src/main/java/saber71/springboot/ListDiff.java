package saber71.springboot;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import org.jetbrains.annotations.Contract;
import org.jspecify.annotations.NonNull;

/**
 * 表示列表差异的数据记录类，包含新增和删除的元素
 *
 * @param <T> 元素类型
 */
public record ListDiff<T>(List<T> added, List<T> removed) {
  /**
   * 计算两个列表之间的差异，找出新增和删除的元素
   *
   * @param newList 新列表
   * @param oldList 旧列表
   * @param <T> 列表元素类型
   * @return 包含新增元素和删除元素的ListDiff对象
   */
  @Contract("_, _ -> new")
  public static <T> @NonNull ListDiff<T> of(List<T> newList, List<T> oldList) {
    // 将列表转换为集合以便进行集合运算
    var newSet = new HashSet<>(newList);
    var oldSet = new HashSet<>(oldList);

    // 计算新增元素：新集合中存在但旧集合中不存在的元素
    var added = new HashSet<>(newSet);
    added.removeAll(oldSet);

    // 计算删除元素：旧集合中存在但新集合中不存在的元素
    var removed = new HashSet<>(oldList);
    oldList.removeAll(newSet);

    return new ListDiff<>(new ArrayList<>(added), new ArrayList<>(removed));
  }
}
