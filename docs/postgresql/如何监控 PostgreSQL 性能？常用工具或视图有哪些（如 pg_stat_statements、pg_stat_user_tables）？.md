pg内置了一组以pg_stat_开头的系统视图，他们基于共享内存中的统计计数器，开销极小

pg_stat_statement，语句监控，需安装扩展
记录所有执行过的sql语句的统计信息，包括sql的调用次数、总耗时、平均耗时、IO读写块数等
可以用来定位最慢或最频繁的sql

pg_stat_user_tabls、pg_stat_all_tables，表级监控
监控表的访问模式和自动维护状态
包括
- seq_scan vs idx_scan，判断是否缺失索引
- n_tup_ins/upd/del，数据变更频率
- last_vacuum、last_autovacuum，最后一次执行vacuum的时间，检查vacuum是否及时运行，防止事务id回卷和表膨胀
- dead_tuples，死元组数量，过高表明vacuum执行不及时，手动执行vacuum或调整autovacuum参数

pg_stat_activity，实时活动监控
查看当前正在运行的连接和查询
用来发现长时间运行的查询、锁等待、空闲事务
- state，运行状态，active/idle/idle in transaction（占用资源且未提交）
- wait_event_type / wait_event，进程在等待什么
- query_start，查询开始时间

pg_stat_database，数据库级别的总体统计（TPS、连接数、冲突数）
pg_locks、pg_blocked_pids，诊断死锁和锁争用
pg_stat_bgwriter，监控后台写入进程效率，判断检查点checkpoint配置是否合理

轻量级命令行：pg_top、pg_activity