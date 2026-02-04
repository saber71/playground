# 加速构建

## 多阶段构建
将构建环境与运行环境分离，减小镜像体积

```dockerfile
# 构建阶段
FROM golang:1.23 AS builder
WORKDIR /app
COPY 在%20CI .
RUN go build -o myapp .

# 运行阶段
FROM alpine:latest
COPY --from=builder /app/myapp /usr/local/bin/myapp
CMD ["myapp"]
```

## 合理利用docker层级缓存
将不常变化的指令放在前面，如node项目，将npm i放在靠前的位置

## 启用BuildKit
可以显著加速构建过程，支持并行构建、更智能的缓存等
```shell
export DOCKER_BUILDKIT=1
```

# 避免重复构建

- 基于git提交内容判断是否需要构建
- 使用镜像标签避免覆盖，避免频繁使用latest
- 在CI中缓存docker构建上下文和层