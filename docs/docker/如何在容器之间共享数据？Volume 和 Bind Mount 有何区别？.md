共享数据方式有：Volume卷、bind mounts绑定挂载、tmpfs仅适用于linux数据不会被持久化

## volume
由docker管理，存储在宿主机的特定目录中
与宿主机文件系统解耦，更安全、可移植
可以通过docker volume create显示创建，也可以在运行容器时自动创建
支持跨容器共享，多个容器挂载同一个volume
可用于备份、迁移和集群环境
不依赖宿主机的具体路径适合生产环境
注意：不要直接访问宿主机上的卷所在目录，当卷第一次被挂载到容器里，如果容器的挂载点里有文件这些文件会被同步到卷里
因此如果想要往卷里放初始数据，可以通过临时容器
```shell
# 创建一个命名卷
docker volume create my-vol

# 启动容器并挂载卷
docker run -d --name app1 -v my-vol:/app/data nginx

# 另一个容器挂载同一个卷
docker run -it --name app2 -v my-vol:/shared-data alpine sh
```

## bind mount
将宿主机上的任意目录或文件直接挂载到容器中
宿主机路径必须存在，否则docker会报错或者创建为目录
对宿主机文件系统的依赖性强，可移植性差
适合开发调试、访问宿主机配置文件等场景
```shell
# 挂载当前目录下的 ./data 到容器的 /app/data
docker run -d --name app1 -v  $ (pwd)/data:/app/data nginx

# Windows 示例（PowerShell）
docker run -v C:\mydata:C:\data mcr.microsoft.com/windows/servercore
```