它可以在不聚合整个结果集的情况下，对一组相关的行（或窗口）执行计算。
它可以对每一行返回一个计算结果，同时保留原始行的详细信息

```sql
函数名(参数) OVER (
    [PARTITION BY 列名] 
    [ORDER BY 列名] 
    [ROWS/RANGE 子句]
)
```
over，定义窗口范围
partition by，将结果集划分为多个分区（类似group by，但不会合并行），如果不指定则整个结果集作为一个分区
row/range，定义窗口的物理范围（如当前行前后几行）

```sql
SELECT 
    salesperson,
    region,
    amount,
--     唯一行号
    ROW_NUMBER() OVER (PARTITION BY region ORDER BY amount DESC) as row_num,
--     并列排名
    RANK() OVER (PARTITION BY region ORDER BY amount DESC) as rank_num,
    DENSE_RANK() OVER (PARTITION BY region ORDER BY amount DESC) as dense_rank_num
FROM sales;
```

```sql
SELECT 
    salesperson,
    sale_date,
    amount,
--     获取上一行的amount，如果没有则返回0
    LAG(amount, 1, 0) OVER (PARTITION BY salesperson ORDER BY sale_date) as prev_amount,
    amount - LAG(amount, 1, 0) OVER (PARTITION BY salesperson ORDER BY sale_date) as difference
FROM sales
ORDER BY salesperson, sale_date;
```