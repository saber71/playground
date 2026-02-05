JSON，以文本形式存储，保留原始格式
JSONB，以二进制格式存储，不保留无关字符，支持索引和高效查询
```sql
-- 创建表
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT,
    metadata JSONB  -- 推荐使用 JSONB
);

-- 插入数据
INSERT INTO products (name, metadata) VALUES
('Laptop', '{"brand": "Dell", "price": 1200, "tags": ["electronics", "portable"]}'::JSONB),
('Book', '{"author": "Alice", "pages": 300, "in_stock": true}'::JSONB);

-- 查询 JSONB 字段
SELECT name FROM products WHERE metadata->>'brand' = 'Dell';
-- 注意：->> 返回文本，-> 返回 JSON

-- 使用索引加速查询（需创建 GIN 索引）
CREATE INDEX idx_products_metadata ON products USING GIN (metadata);
```

任意类型的数组，包括整数、文本、甚至自定义类型，数组下标默认从1开始
```sql
-- 创建带数组的表
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name TEXT,
    scores INTEGER[],        -- 整数数组
    tags TEXT[]              -- 文本数组
);

-- 插入数组数据
INSERT INTO students (name, scores, tags) VALUES
('Tom', ARRAY[95, 87, 92], ARRAY['math', 'science']),
('Jerry', '{88,91,85}', '{"art","music"}');  -- 也可用花括号语法

-- 查询数组元素（下标从 1 开始！）
SELECT name FROM students WHERE scores[1] > 90;

-- 检查是否包含某个元素
SELECT name FROM students WHERE 'math' = ANY(tags);
-- 或使用 @> 操作符（需数组是同一维度）
SELECT name FROM students WHERE tags @> ARRAY['math'];

-- 创建数组索引（GIN）
CREATE INDEX idx_students_tags ON students USING GIN (tags);
```

范围类型，表示一个连续的值区间
int4range,元素类型Integer,[10,20)
int8range,元素类BIGINT
numrange,
tstange,TIMESTAMP	["2024-01-01", "2024-12-31")
tstzrange,
daterange,DATE	[2025-01-01, 2025-12-31]
```sql
-- 创建会议预订表
CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    room TEXT,
    during TSRANGE  -- 时间范围
);

-- 插入一个会议（2026年2月5日 14:00 到 15:30）
INSERT INTO meetings (room, during) VALUES
('A101', '[2026-02-05 14:00, 2026-02-05 15:30)'::tsrange);

-- 查询与某时间段重叠的会议
SELECT * FROM meetings
WHERE during && '[2026-02-05 14:30, 2026-02-05 15:00)'::tsrange;
-- && 表示“重叠”

-- 检查是否包含某个时间点
SELECT * FROM meetings
WHERE during @> '2026-02-05 14:45'::timestamp;

-- 创建范围索引（可极大提升重叠查询性能）
CREATE INDEX idx_meetings_during ON meetings USING GIST (during);
```

几何类型，point、line、circle、polygon等
网络地址类型，inet(IP地址)、cidr(网络段)、macaddr(MAC地址)
全文搜索类型，tsvector、tsquery
UUID类型，uuid

自定义复合类型
```sql
CREATE TYPE address AS (street TEXT, city TEXT, zip TEXT);
CREATE TABLE people (name TEXT, addr address);
INSERT INTO people VALUES ('Alice', ROW('Main St', 'Beijing', '100000'));
```