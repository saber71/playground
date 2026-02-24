sql标准中的语法特性，用于定义命名的临时结果集。仅在当前查询执行期间有效，不会作为对象存储在数据库中。
主要用于处理树形结构、层级数据、图遍历等场景

核心特点
- 临时性，只在查询执行期间存在，查询结束后自动消失
- 可复用性，可在同一查询中多次引用
- 可读性，比嵌套子查询更清晰，易于维护
- 自引用，支持递归引用自身
- 兼容性，主流数据库均支持

注意事项
- 必须设置终止条件
- 递归深度存在限制
- 递归成员中的join字段应建立索引，性能优化
- 比起UNION，更推荐使用UNION ALL

作用：合并多个select语句结果集
UNION：自动去除重复行，同时排序，性能较慢
UNION ALL：保留所有，无排序，性能更快，资源消耗相对更少

```sql
WITH cte_name AS (
    SELECT column1, column2, ...
    FROM table_name
    WHERE condition
)
SELECT * FROM cte_name;

-- 查询员工层级结构
WITH RECURSIVE EmployeeHierarchy AS (
    -- 锚定成员：顶级领导（无上级）
    SELECT
        employee_id,
        employee_name,
        manager_id,
        1 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- 递归成员：查找下属员工
    SELECT
        e.employee_id,
        e.employee_name,
        e.manager_id,
        eh.level + 1
    FROM employees e
             INNER JOIN EmployeeHierarchy eh
                        ON e.manager_id = eh.employee_id
    WHERE eh.level < 10  -- 防止无限递归
)
SELECT * FROM EmployeeHierarchy;
```