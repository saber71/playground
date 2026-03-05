部分索引，只对表中满足where子句条件的行创建索引
```sql
CREATE INDEX idx_unshipped_orders ON orders (order_date)
WHERE shipped = false;
```
- 处理稀疏数据，要索引查询的数据只占表总数据的一部分，此时对全表建立索引浪费空间且维护成本高
- 用来排除null值，比全表索引更快更小
- 索引越小写入更新时的维护成本就越小，内存占用也越小

表达式索引，基于列的计算结果建立索引而不是列本身的原始值。支持索引函数调用、算术运算或列的组合
会略微增加写入更新时的开销。同时查询语句中的表达式必须与建立索引时的表达式完全一致时索引才会被使用
```sql
-- 基于函数
CREATE INDEX idx_users_lower_email ON users (lower(email));

-- 基于表达式计算
CREATE INDEX idx_total_price ON order_items ((quantity * price));
```
- 如果经常需要执行不区分大小写或trim去除空格等的搜索，在列上建立普通索引是没用的，必须对`lower(column)`建立表达式索引
- 如果where子句中存在计算逻辑时，普通索引也是无效的，此时表达式索引更高效
- 提取json/数组字段建立索引，且比gin索引更灵活