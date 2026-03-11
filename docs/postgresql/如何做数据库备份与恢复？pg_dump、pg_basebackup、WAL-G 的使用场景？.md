pg_dump
适合日常开发、小规模数据库
```shell
# 1. 备份为 SQL 文本（通用性强，可读）
pg_dump -U postgres -h localhost -p 5432 mydb > mydb_backup.sql

# 2. 备份为自定义格式（推荐：压缩率高，支持并行恢复）
pg_dump -U postgres -F c -b -v -f mydb_backup.dump mydb

# 3. 备份单张表
pg_dump -U postgres -t public.users mydb > users.sql

# 4. 恢复（SQL 格式）
psql -U postgres -d mydb < mydb_backup.sql

# 5. 恢复（自定义格式，支持并行 -j）
pg_restore -U postgres -d mydb -j 4 mydb_backup.dump
```

pg_basebackup，直接复制$PGDATA目录下的所有物理文件
适合快速恢复整个实例（所有数据库、用户、配置）、中大型数据库备份、整机迁移
```shell
# 1. 执行基础备份（流式传输 WAL，生成 standby.signal 自动配置从库）
pg_basebackup -h 192.168.1.100 -D /var/lib/postgresql/data -U replicator -P -v -R -X stream -F p

# 参数说明：
# -R: 生成 standby.signal 和 minimal recovery config (PG12+)
# -X stream: 流式传输备份期间产生的 WAL
# -F p: 输出为普通文件格式 (plain)

# 2. 恢复流程（简化版）
# a. 停止数据库，清空数据目录
# b. 将备份文件解压/复制到数据目录
# c. 配置 restore_command (若需 PITR)
# d. 创建 recovery.signal 文件
# e. 启动数据库
```

WAL-G，结合Basebackup和WAL归档，可一键恢复到任意时间点
适合云原生、大型数据库、需要长期保留历史备份的