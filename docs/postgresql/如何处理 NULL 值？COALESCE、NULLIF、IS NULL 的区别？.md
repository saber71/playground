处理null值：is null 或者 is not null

is null，一个布尔判断条件，可以用于where等子句中
coalesce，函数，返回参数列表中第一个非null值，如果全是null则返回null，用来将null值替换为默认值
nullif，比较两个表达式的值，如果两个相等返回null，如果不同返回表达式1的值，用来将特定的值转换为null