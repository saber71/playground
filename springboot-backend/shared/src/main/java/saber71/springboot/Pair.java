package saber71.springboot;

/**
 * 表示一个包含两个不同类型的值的记录类
 * @param <V1> 第一个值的类型
 * @param <V2> 第二个值的类型
 */
public record Pair<V1, V2>(V1 value1, V2 value2) {}

