# chat聊天后端服务

## node版本：v20.18.0以上

## 技术栈

- nest.js
- typescript
- socket.io
- redis

## 状态

- 开发中

## 接口文档见localhost:3000/api

## nest-cli命令

- 命令说明
```bash
   nest new project_name # 创建新项目
   nest g controller your_controller_name # 创建控制器
   nest g service your_service_name # 创建服务
   nest g module your_module_name # 创建模块
   nest g decorator your_decorator_name # 创建装饰器
   nest g pipe your_pipe_name # 创建管道
   nest g interceptor your_interceptor_name # 创建拦截器
   nest g guard your_guard_name # 创建守卫
   nest g filter your_filter_name # 创建过滤器
   nest g provider your_provider_name # 创建提供者
   nest g interface your_interface_name # 创建接口
   nest g enum your_enum_name # 创建枚举
   nest g dto your_dto_name # 创建数据传输对象
   nest g middleware your_middleware_name # 创建中间件
   nest g interceptor your_interceptor_name # 创建拦截器
   
   示例：
     nest g mo users       # 生成 Users 模块
     nest g co users       # 生成 Users 控制器
     nest g s users        # 生成 Users 服务
     nest g res products   # 生成完整的 Products CRUD 模块
```

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
```
nest-app
├─ .prettierrc
├─ README.md
├─ dist
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
│     │  │  ├─ MessageDto.ts
│     │  │  └─ getMessageDto.ts
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