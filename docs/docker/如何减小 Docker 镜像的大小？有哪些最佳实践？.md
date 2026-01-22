使用更小的基础镜像，如alpine(基于musl libc)、distroless（google提供，只包含运行时依赖不包含shell）、scratch（空镜像，适合静态编译的二进制程序，如Go）、ubi-minial（red hat提供的精简版）

多阶段构建，将构建环境与运行环境分离，只将最终产物复制到最终镜像中
避免将编译器、源码、中间产物打包进最终镜像
```dockerfile
# 构建阶段
FROM golang:1.22 AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp .

# 运行阶段
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/myapp .
CMD ["./myapp"]
```

合并RUN指令，因为每个RUN指令会导致镜像增加一层只读层，合并命令减少层数并清理临时文件

及时清理缓存和临时文件

使用.dockerignore排除无关文件，避免将本地开发文件（.git、node_modules、日志）复制进镜像

选择性COPY而非整个目录

docker history <image> 查看各层大小
docker image inspect 查看详细元数据