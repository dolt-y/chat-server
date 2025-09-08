# Chat 聊天后端服务说明文档

## 一、项目概况

- **项目类型**：实时聊天后端服务  
- **Node 版本要求**：v20.18.0 及以上  
- **技术栈**：
  - Nest.js（服务端框架）
  - TypeScript
  - Socket.IO（实时通信）
  - Redis（缓存/消息队列）
- **当前状态**：开发中  
- **接口文档**：[http://localhost:3000/api](http://localhost:3000/api)

---

## 二、Nest.js 常用 CLI 命令

Nest CLI 可以快速生成项目结构和模块，常用命令如下：

| 命令 | 作用 | 示例 |
|------|------|------|
| `nest new project_name` | 创建新项目 | `nest new chat-backend` |
| `nest g controller name` | 创建控制器 | `nest g controller auth` |
| `nest g service name` | 创建服务 | `nest g service chat` |
| `nest g module name` | 创建模块 | `nest g module user` |
| `nest g decorator name` | 创建装饰器 | `nest g decorator roles` |
| `nest g pipe name` | 创建管道 | `nest g pipe validation` |
| `nest g interceptor name` | 创建拦截器 | `nest g interceptor logging` |
| `nest g guard name` | 创建守卫 | `nest g guard jwt-auth` |
| `nest g filter name` | 创建过滤器 | `nest g filter http-exception` |
| `nest g provider name` | 创建提供者 | `nest g provider cache` |
| `nest g interface name` | 创建接口 | `nest g interface user` |
| `nest g enum name` | 创建枚举 | `nest g enum role` |
| `nest g dto name` | 创建数据传输对象 | `nest g dto create-user` |
| `nest g middleware name` | 创建中间件 | `nest g middleware logger` |
| `nest g res name` | 生成完整 CRUD 模块 | `nest g res products` |

> 💡 Tip：CLI 命令支持缩写，如 `nest g mo users`、`nest g co users`、`nest g s users`。

---

## 三、快速生成 TypeORM 实体

使用 `typeorm-model-generator` 可以从已有数据库生成 TypeORM 实体：

```bash
npm install -g typeorm-model-generator

typeorm-model-generator \
  -h localhost \
  -d your_database \
  -u your_username \
  -x your_password \
  -e mysql \
  -o ./output_directory

- 参数说明：

  -h：数据库主机

  -d：数据库名称

  -u：用户名

  -x：密码

  -e：数据库类型（mysql、postgres 等）

  -o：输出目录
```

## 快速启动

```bash

# 安装依赖
npm install

# 启动服务（开发模式）
npm run dev

# 访问接口文档
http://localhost:3000/api

```

## 四、项目目录结构

``` bash
nest-app
├─ .prettierrc
├─ README.md
├─ dist
│  ├─ app.module.d.ts
│  ├─ app.module.js
│  ├─ app.module.js.map
│  ├─ core
│  │  ├─ filters
│  │  │  ├─ http-exception.filter.d.ts
│  │  │  ├─ http-exception.filter.js
│  │  │  └─ http-exception.filter.js.map
│  │  ├─ guards
│  │  │  ├─ jwt-auth.guard.d.ts
│  │  │  ├─ jwt-auth.guard.js
│  │  │  ├─ jwt-auth.guard.js.map
│  │  │  ├─ local-auth.guard.d.ts
│  │  │  ├─ local-auth.guard.js
│  │  │  └─ local-auth.guard.js.map
│  │  └─ response
│  │     ├─ response.interceptor.d.ts
│  │     ├─ response.interceptor.js
│  │     └─ response.interceptor.js.map
│  ├─ main.d.ts
│  ├─ main.js
│  ├─ main.js.map
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ auth.controller.d.ts
│  │  │  ├─ auth.controller.js
│  │  │  ├─ auth.controller.js.map
│  │  │  ├─ auth.module.d.ts
│  │  │  ├─ auth.module.js
│  │  │  ├─ auth.module.js.map
│  │  │  ├─ auth.service.d.ts
│  │  │  ├─ auth.service.js
│  │  │  ├─ auth.service.js.map
│  │  │  ├─ jwt.strategy.d.ts
│  │  │  ├─ jwt.strategy.js
│  │  │  ├─ jwt.strategy.js.map
│  │  │  ├─ local.strategy.d.ts
│  │  │  ├─ local.strategy.js
│  │  │  └─ local.strategy.js.map
│  │  ├─ chat
│  │  │  ├─ chat.controller.d.ts
│  │  │  ├─ chat.controller.js
│  │  │  ├─ chat.controller.js.map
│  │  │  ├─ chat.gateway.d.ts
│  │  │  ├─ chat.gateway.js
│  │  │  ├─ chat.gateway.js.map
│  │  │  ├─ chat.module.d.ts
│  │  │  ├─ chat.module.js
│  │  │  ├─ chat.module.js.map
│  │  │  ├─ chat.service.d.ts
│  │  │  ├─ chat.service.js
│  │  │  ├─ chat.service.js.map
│  │  │  ├─ message.service.d.ts
│  │  │  ├─ message.service.js
│  │  │  └─ message.service.js.map
│  │  ├─ friend
│  │  │  ├─ Friend.module.d.ts
│  │  │  ├─ Friend.module.js
│  │  │  ├─ Friend.module.js.map
│  │  │  ├─ Friendship.controller.d.ts
│  │  │  ├─ Friendship.controller.js
│  │  │  ├─ Friendship.controller.js.map
│  │  │  ├─ Friendship.service.d.ts
│  │  │  ├─ Friendship.service.js
│  │  │  └─ Friendship.service.js.map
│  │  ├─ upload
│  │  │  ├─ file-upload.controller.d.ts
│  │  │  ├─ file-upload.controller.js
│  │  │  ├─ file-upload.controller.js.map
│  │  │  ├─ file-upload.module.d.ts
│  │  │  ├─ file-upload.module.js
│  │  │  └─ file-upload.module.js.map
│  │  └─ user
│  │     ├─ user.controller.d.ts
│  │     ├─ user.controller.js
│  │     ├─ user.controller.js.map
│  │     ├─ user.module.d.ts
│  │     ├─ user.module.js
│  │     ├─ user.module.js.map
│  │     ├─ user.service.d.ts
│  │     ├─ user.service.js
│  │     └─ user.service.js.map
│  ├─ shared
│  │  ├─ constant
│  │  │  ├─ response.enum.d.ts
│  │  │  ├─ response.enum.js
│  │  │  └─ response.enum.js.map
│  │  ├─ dto
│  │  │  ├─ Pagination
│  │  │  │  ├─ pagination.dto.d.ts
│  │  │  │  ├─ pagination.dto.js
│  │  │  │  └─ pagination.dto.js.map
│  │  │  ├─ chat
│  │  │  │  ├─ request
│  │  │  │  │  ├─ getMessageDto.d.ts
│  │  │  │  │  ├─ getMessageDto.js
│  │  │  │  │  └─ getMessageDto.js.map
│  │  │  │  └─ response
│  │  │  │     ├─ ChatListItemDto.d.ts
│  │  │  │     ├─ ChatListItemDto.js
│  │  │  │     ├─ ChatListItemDto.js.map
│  │  │  │     ├─ MessageDto.d.ts
│  │  │  │     ├─ MessageDto.js
│  │  │  │     └─ MessageDto.js.map
│  │  │  ├─ common
│  │  │  │  ├─ response.dto.d.ts
│  │  │  │  ├─ response.dto.js
│  │  │  │  └─ response.dto.js.map
│  │  │  ├─ friend
│  │  │  │  ├─ addFriend.dto.d.ts
│  │  │  │  ├─ addFriend.dto.js
│  │  │  │  └─ addFriend.dto.js.map
│  │  │  └─ user
│  │  │     ├─ login.dto.d.ts
│  │  │     ├─ login.dto.js
│  │  │     ├─ login.dto.js.map
│  │  │     ├─ register.dto.d.ts
│  │  │     ├─ register.dto.js
│  │  │     ├─ register.dto.js.map
│  │  │     ├─ update-user.dto.d.ts
│  │  │     ├─ update-user.dto.js
│  │  │     └─ update-user.dto.js.map
│  │  ├─ entities
│  │  │  ├─ ChatGroups.entity.d.ts
│  │  │  ├─ ChatGroups.entity.js
│  │  │  ├─ ChatGroups.entity.js.map
│  │  │  ├─ Chats.entity.d.ts
│  │  │  ├─ Chats.entity.js
│  │  │  ├─ Chats.entity.js.map
│  │  │  ├─ ConversationMembers.entity.d.ts
│  │  │  ├─ ConversationMembers.entity.js
│  │  │  ├─ ConversationMembers.entity.js.map
│  │  │  ├─ Friends.entity.d.ts
│  │  │  ├─ Friends.entity.js
│  │  │  ├─ Friends.entity.js.map
│  │  │  ├─ Messages.entity.d.ts
│  │  │  ├─ Messages.entity.js
│  │  │  ├─ Messages.entity.js.map
│  │  │  ├─ User.entity.d.ts
│  │  │  ├─ User.entity.js
│  │  │  └─ User.entity.js.map
│  │  └─ interfaces
│  │     ├─ validate.d.ts
│  │     ├─ validate.js
│  │     └─ validate.js.map
│  └─ tsconfig.build.tsbuildinfo
├─ eslint.config.mjs
├─ global.d.ts
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ sql
│  ├─ chat_groups.sql
│  ├─ chats.sql
│  ├─ conversation_members.sql
│  ├─ friends.sql
│  ├─ messages.sql
│  └─ user.sql
├─ src
│  ├─ app.module.ts
│  ├─ core
│  │  ├─ filters
│  │  │  └─ http-exception.filter.ts
│  │  ├─ guards
│  │  │  ├─ jwt-auth.guard.ts
│  │  │  └─ local-auth.guard.ts
│  │  └─ response
│  │     └─ response.interceptor.ts
│  ├─ main.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ jwt.strategy.ts
│  │  │  └─ local.strategy.ts
│  │  ├─ chat
│  │  │  ├─ chat.controller.ts
│  │  │  ├─ chat.gateway.ts
│  │  │  ├─ chat.module.ts
│  │  │  ├─ chat.service.ts
│  │  │  └─ message.service.ts
│  │  ├─ friend
│  │  │  ├─ Friend.module.ts
│  │  │  ├─ Friendship.controller.ts
│  │  │  └─ Friendship.service.ts
│  │  ├─ upload
│  │  │  ├─ file-upload.controller.ts
│  │  │  └─ file-upload.module.ts
│  │  └─ user
│  │     ├─ user.controller.ts
│  │     ├─ user.module.ts
│  │     └─ user.service.ts
│  └─ shared
│     ├─ constant
│     │  └─ response.enum.ts
│     ├─ dto
│     │  ├─ Pagination
│     │  │  └─ pagination.dto.ts
│     │  ├─ chat
│     │  │  ├─ request
│     │  │  │  └─ getMessageDto.ts
│     │  │  └─ response
│     │  │     ├─ ChatListItemDto.ts
│     │  │     └─ MessageDto.ts
│     │  ├─ common
│     │  │  └─ response.dto.ts
│     │  ├─ friend
│     │  │  └─ addFriend.dto.ts
│     │  └─ user
│     │     ├─ login.dto.ts
│     │     ├─ register.dto.ts
│     │     └─ update-user.dto.ts
│     ├─ entities
│     │  ├─ ChatGroups.entity.ts
│     │  ├─ Chats.entity.ts
│     │  ├─ ConversationMembers.entity.ts
│     │  ├─ Friends.entity.ts
│     │  ├─ Messages.entity.ts
│     │  └─ User.entity.ts
│     └─ interfaces
│        ├─ express.d.ts
│        └─ validate.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
