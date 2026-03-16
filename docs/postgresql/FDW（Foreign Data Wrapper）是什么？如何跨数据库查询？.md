FDW，外部数据封装器，允许像操作本地表一样访问和操作外部数据源的数据
可以是其他pg实例、Mysql、Sqlite等关系型数据库，文件如csv、json等
支持写操作、事务一致性（支持2PC两阶段提交，保证分布式事务ACID）

FDW包括
- 外部服务器，定义远程数据源的连接信息
- 用户映射，指定本地用户如何认证远程数据源
- 外部表，在本地创建的虚拟表其结构映射远程表，查询时自动转发请求

跨pg数据库查询
1、本地数据库启用postgres_fdw，`CREATE EXTENSION postgres_fdw;`
2、外部服务器
```sql
CREATE SERVER remote_db
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (
    host '192.168.1.100',
    port '5432',
    dbname 'sales_db'
);
```
3、创建用户映射
```sql
CREATE USER MAPPING FOR current_user
SERVER remote_db
OPTIONS (user 'remote_user', password 'secure_password');
```
4、创建外部表，列定义需与远程表一致，可选取部分列
```sql
CREATE FOREIGN TABLE foreign_orders (
    id BIGINT,
    customer_id INT,
    amount NUMERIC(10,2)
)
SERVER remote_db
OPTIONS (schema_name 'public', table_name 'orders');
```
5、执行跨库查询，pg会尽可能将sql语句中条件部分交给远程服务器执行
```sql
-- 关联本地 customers 表与远程 orders 表
SELECT c.name, o.amount
FROM customers c
JOIN foreign_orders o ON c.id = o.customer_id
WHERE o.amount > 1000;
```