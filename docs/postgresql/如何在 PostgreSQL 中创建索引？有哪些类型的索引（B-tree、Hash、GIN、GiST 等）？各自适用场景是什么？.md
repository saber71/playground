```sql
-- 创建 B-tree 索引（默认）
CREATE INDEX idx_users_email ON users(email);

-- 创建唯一索引
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- 创建 GIN 索引用于 JSONB 字段
CREATE INDEX idx_logs_data ON logs USING GIN (data);

-- 并发创建索引（避免锁表）
CREATE INDEX CONCURRENTly idx_orders_status ON orders(status);
```

between tree，平衡树，默认索引类型，支持操作符= < <= > >= between in 前缀like
适用大多数常规查询、主键外键唯一约束自动使用、支持排序和分组
不支持后缀和中缀like、数组json全文搜索等复杂数据类型

hash，哈希，仅支持=
适用哈希连接优化、极高频率的等值查询且数据分布均匀
不支持范围查询、排序、pg10之前不支持WAL日志
实际使用较少，平衡树在等值查询上性能接近

GIN，广义倒排索引，支持@> && <@ = ? ?| ?&
适用包含多个值的数据类型
适用场景：数组字段、JSON/JSONB、全文搜索、hstore类型
特点：写入较慢、查询快

GiST，广义搜索树，支持多种数据类型的近似索引
使用场景：几何类型、全文搜索（比GIN更省空间，查询稍慢）、范围类型、自定义数据类型
特点：支持有损索引、空间效率高，适合高维或复杂数据

SP-GiST，基于空间分割的变种，适用于非平衡数据结构
使用场景：电话号码前缀树、k-d树、不规则分布的数据
使用较少，需特定场景

BRIN，适用于物理存储有序的大表
原理：为每个数据块记录min、max值，快速跳过无关块
适用场景：时间序列数据、超大表且查询条件与物理顺序一致
优点：索引极小，创建快
缺点：若数据无序效果差