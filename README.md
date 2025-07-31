# chat聊天后端服务

## 技术栈

- nest.js
- typescript
- socket.io
- redis

## 状态

- 开发中

## 接口文档见localhost:3000/api

## 快速生成 typeORM实体类型

```bash
   npm install -g typeorm-model-generator
   typeorm-model-generator -h localhost -d your_database -u your_username -x your_password -e mysql -o ./output_directory

   -h: 数据库主机
   -d: 数据库名称
   -u: 用户名
   -x: 密码
   -e: 数据库类型（如 mysql、postgres 等）
   -o: 输出目录
```