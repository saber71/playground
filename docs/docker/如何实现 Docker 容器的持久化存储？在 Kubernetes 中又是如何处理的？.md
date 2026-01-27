## Volumes卷
由docker管理，独立于容器的生命周期，通常在宿主机的/var/lib/docker/volumes目录下
优点：跨容器共享、可备份、平台无关

docker volume create my-vol
docker run -d --name my-container -v my-vol:/app/data nginx

## Bind Mounts 绑定挂载
将宿主机上的任意目录或文件挂载到容器中
docker run -d --name my-container -v /host/path:/container/path nginx
路径必须是绝对路径

## tmpfs mounts 内存挂载
数据仅保留在宿主机内存中，不会写入磁盘
适用于敏感数据，但不具备持久性

K8S
Volume，pod内定义的存储卷，生命周期与Pod一致非持久
PersistentVolume，PV，集群中的一块存储资源由管理员预配或动态创建
PersistentVolumeClaim，PVC，用户对存储的请求会自动绑定到合适的PV
StorageClass，定义存储类型和Provisioner，支持动态供给

基本流程：
管理员创建StorageClass（可选）
用户创建PVC，声明所需存储大小和访问模式
K8S自动创建或绑定一个PV（如果启用动态供给则自动创建）
Pod通过引用PVC来挂载持久化存储