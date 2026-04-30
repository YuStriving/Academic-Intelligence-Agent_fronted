# 论文搜索引擎 API 接口文档

## 1. 引言

### 1.1 文档目的
本文档详细描述了论文搜索引擎前端项目的所有 API 接口定义，包括请求方法、URL 路径、请求参数、响应格式等。后端开发人员可参照此文档实现对应的接口。

### 1.2 适用范围
适用于前后端开发人员、测试人员及项目相关人员。

### 1.3 术语定义
- **Bearer Token**: JWT 认证令牌，通过 Authorization 请求头传递
- **AccessToken**: 访问令牌，有效期 15 分钟
- **RefreshToken**: 刷新令牌，有效期 7 天
- **RAG**: Retrieval-Augmented Generation，检索增强生成
- **Baseline**: 基准模型，用于论文对比

### 1.4 基础信息
- **Base URL**: `http://localhost:8080` (开发环境)
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8

## 2. 通用规范

### 2.1 统一响应格式
所有接口均使用以下统一响应格式：

```typescript
interface ApiResponse<T> {
  code: number        // 业务状态码，200 表示成功
  message: string     // 响应消息
  data: T            // 响应数据
  timestamp: number  // 响应时间戳
  traceId?: string   // 请求追踪 ID（可选）
}
```

### 2.2 分页响应格式
```typescript
interface PageResponse<T> {
  content: T[]                    // 当前页数据
  pageable: {
    pageNumber: number           // 当前页码
    pageSize: number             // 每页大小
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
  }
  totalElements: number          // 总记录数
  totalPages: number             // 总页数
  last: boolean                  // 是否最后一页
  first: boolean                 // 是否第一页
  numberOfElements: number       // 当前页元素数量
  size: number                   // 每页大小
  number: number                 // 当前页码
}
```

### 2.3 错误码定义
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数非法 |
| 401 | 未认证或令牌无效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突（用户名/邮箱已存在） |
| 422 | 参数校验失败 |
| 500 | 服务器内部错误 |

### 2.4 认证说明
需要在请求头中添加：
```
Authorization: Bearer {accessToken}
```

## 3. 认证模块 (Auth Module)

### 3.1 用户登录
**POST** `/api/v1/auth/login`

**说明**: 支持用户名或邮箱登录，返回双令牌（AccessToken + RefreshToken）

**请求体**:
```json
{
  "emailOrUsername": "string",  // 必填，用户名或邮箱
  "password": "string",         // 必填，用户密码
  "rememberMe": false           // 可选，记住我（前端保留字段）
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": 900,
    "refreshExpiresIn": 604800,
    "tokenType": "Bearer"
  },
  "timestamp": 1776603600000
}
```

**错误响应**:
- 401: 用户名或密码错误
- 400: 参数校验失败

---

### 3.2 用户注册
**POST** `/api/v1/auth/register`

**说明**: 新用户注册

**请求体**:
```json
{
  "username": "string",      // 必填，用户名
  "email": "string",         // 必填，邮箱地址
  "password": "string",      // 必填，密码（6-64 位）
  "agreeTerms": true         // 必填，是否同意用户协议
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "userId": "string",
    "message": "注册成功"
  },
  "timestamp": 1776603600000
}
```

**错误响应**:
- 409: 用户名已存在 / 邮箱已被注册
- 400: 参数校验失败

---

### 3.3 获取当前用户信息
**GET** `/api/v1/auth/me`

**说明**: 验证 token 有效性并获取当前登录用户信息

**认证**: 需要 Bearer Token

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "nickname": "string",
    "avatarUrl": "string",
    "role": "USER",
    "createdAt": "2026-04-19T12:00:00Z"
  },
  "timestamp": 1776603600000
}
```

**错误响应**:
- 401: 未认证或令牌无效 / 令牌已过期

---

### 3.4 用户登出
**POST** `/api/v1/auth/logout`

**说明**: 使当前 token 失效，撤销该用户的所有 RefreshToken

**认证**: 需要 Bearer Token

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": null,
  "timestamp": 1776603600000
}
```

---

### 3.5 刷新令牌
**POST** `/api/v1/auth/refresh`

**说明**: 使用 RefreshToken 换取新的 AccessToken

**请求体**:
```json
{
  "refreshToken": "string"  // 必填，刷新令牌
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": 900,
    "refreshExpiresIn": 604800,
    "tokenType": "Bearer"
  },
  "timestamp": 1776603600000
}
```

**错误响应**:
- 401: 刷新令牌无效或已过期

## 4. 会话管理模块 (Session Module)

### 4.1 创建会话
**POST** `/api/v1/sessions`

**说明**: 新建对话会话

**认证**: 需要 Bearer Token

**请求体**:
```json
{
  "title": "string",           // 可选，会话标题
  "metadata": {}               // 可选，会话元数据
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "string",
    "title": "string",
    "createdAt": "2026-04-19T12:00:00Z"
  },
  "timestamp": 1776603600000
}
```

---

### 4.2 获取会话列表
**GET** `/api/v1/sessions`

**说明**: 获取当前用户的会话列表（分页）

**认证**: 需要 Bearer Token

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 0 | 页码 |
| size | number | 否 | 20 | 每页大小 |
| sort | string | 否 | - | 排序字段 |
| keyword | string | 否 | - | 搜索关键词 |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "content": [
      {
        "id": "string",
        "title": "string",
        "lastQuery": "string",
        "messageCount": 10,
        "paperCount": 5,
        "createdAt": "2026-04-19T12:00:00Z",
        "updatedAt": "2026-04-19T12:00:00Z",
        "status": "active",
        "researchArea": "string"
      }
    ],
    "totalElements": 100,
    "totalPages": 5,
    "number": 0,
    "size": 20,
    "first": true,
    "last": false
  },
  "timestamp": 1776603600000
}
```

---

### 4.3 获取会话详情
**GET** `/api/v1/sessions/{sessionId}`

**说明**: 获取会话内消息列表和关联文献

**认证**: 需要 Bearer Token

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| sessionId | string | 会话 ID |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "string",
    "title": "string",
    "messages": [
      {
        "id": "string",
        "role": "USER",
        "content": "string",
        "timestamp": 1776603600000,
        "status": "read",
        "papersFound": 10,
        "relatedPaperIds": ["string"],
        "metadata": {}
      }
    ],
    "relatedPapers": [
      {
        "id": "string",
        "title": "string",
        "relevanceScore": 0.95,
        "citation": "string"
      }
    ],
    "createdAt": "2026-04-19T12:00:00Z",
    "updatedAt": "2026-04-19T12:00:00Z"
  },
  "timestamp": 1776603600000
}
```

---

### 4.4 删除会话
**DELETE** `/api/v1/sessions/{sessionId}`

**说明**: 删除指定会话

**认证**: 需要 Bearer Token

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| sessionId | string | 会话 ID |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": null,
  "timestamp": 1776603600000
}
```

---

### 4.5 重命名会话
**PUT** `/api/v1/sessions/{sessionId}/title`

**说明**: 修改会话标题

**认证**: 需要 Bearer Token

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| sessionId | string | 会话 ID |

**请求体**:
```json
{
  "title": "string"  // 必填，新会话标题
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": null,
  "timestamp": 1776603600000
}
```

## 5. RAG 对话模块 (RAG Chat Module)

### 5.1 发送对话消息
**POST** `/api/v1/rag/chat`

**说明**: 发送用户问题，获取 AI 回复（基于检索到的文献）

**认证**: 需要 Bearer Token

**请求体**:
```json
{
  "sessionId": "string",        // 必填，会话 ID
  "query": "string",            // 必填，用户问题
  "history": [                  // 可选，聊天历史
    {
      "role": "USER",
      "content": "string",
      "timestamp": 1776603600000
    }
  ],
  "options": {                  // 可选，对话选项
    "maxContextPapers": 10,     // 最大上下文文献数
    "includeCitations": true,   // 是否包含引用
    "filters": {
      "baselineModel": "string",
      "yearGte": 2020,
      "yearLte": 2026,
      "researchArea": "string"
    }
  }
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "messageId": "string",
    "sessionId": "string",
    "response": "string",
    "relatedPapers": [
      {
        "id": "string",
        "title": "string",
        "relevanceScore": 0.95,
        "citation": "string"
      }
    ],
    "sources": [
      {
        "paperId": "string",
        "text": "string",
        "page": 1
      }
    ]
  },
  "timestamp": 1776603600000
}
```

## 6. 检索任务模块 (Search Module)

### 6.1 创建检索任务
**POST** `/api/v1/search/tasks`

**说明**: 创建外网检索任务，立即返回 taskId，前端需轮询获取进度

**认证**: 需要 Bearer Token

**请求体**:
```json
{
  "query": "string",            // 必填，检索关键词
  "sessionId": "string",        // 可选，关联会话 ID
  "options": {                  // 可选，检索选项
    "yearRange": {
      "start": 2020,
      "end": 2026
    },
    "minMatchScore": 0.7,
    "maxResults": 50,
    "sources": ["arxiv", "ieee"]
  }
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "taskId": "string",
    "status": "PENDING",
    "createdAt": "2026-04-19T12:00:00Z"
  },
  "timestamp": 1776603600000
}
```

**任务状态枚举**:
- `PENDING`: 等待中
- `RUNNING`: 执行中
- `COMPLETED`: 已完成
- `FAILED`: 失败
- `CANCELLED`: 已取消

---

### 6.2 查询任务进度
**GET** `/api/v1/search/tasks/{taskId}`

**说明**: 轮询获取任务执行进度和结果

**认证**: 需要 Bearer Token

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| taskId | string | 任务 ID |

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| includePapers | boolean | 否 | false | 是否包含完整检索结果 |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "taskId": "string",
    "type": "SEARCH",
    "status": "COMPLETED",
    "progress": 100,
    "statusMessage": "检索完成",
    "result": {
      "papers": [
        {
          "id": "string",
          "title": "string",
          "authors": ["string"],
          "year": 2024,
          "venue": "string",
          "doi": "string",
          "abstract": "string",
          "matchScore": 0.95,
          "downloadStatus": "PENDING",
          "vectorized": false,
          "citationCount": 10,
          "createdAt": "2026-04-19T12:00:00Z",
          "updatedAt": "2026-04-19T12:00:00Z"
        }
      ],
      "totalCount": 50,
      "completedCount": 50
    }
  },
  "timestamp": 1776603600000
}
```

---

### 6.3 取消任务
**DELETE** `/api/v1/search/tasks/{taskId}`

**说明**: 取消正在执行的任务

**认证**: 需要 Bearer Token

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| taskId | string | 任务 ID |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": null,
  "timestamp": 1776603600000
}
```

---

### 6.4 获取检索历史
**GET** `/api/v1/search/history`

**说明**: 获取用户的检索历史记录（分页）

**认证**: 需要 Bearer Token

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 0 | 页码 |
| size | number | 否 | 20 | 每页大小 |
| sort | string | 否 | - | 排序字段 |
| keyword | string | 否 | - | 搜索关键词 |
| status | string | 否 | - | 状态过滤 (completed/failed/running) |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "content": [
      {
        "id": "string",
        "keyword": "string",
        "timestamp": 1776603600000,
        "resultCount": 50,
        "status": "completed",
        "researchArea": "string"
      }
    ],
    "totalElements": 100,
    "totalPages": 5,
    "number": 0,
    "size": 20,
    "first": true,
    "last": false
  },
  "timestamp": 1776603600000
}
```

---

### 6.5 删除检索历史
**DELETE** `/api/v1/search/history/{id}`

**说明**: 删除指定检索历史记录

**认证**: 需要 Bearer Token

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 历史记录 ID |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": null,
  "timestamp": 1776603600000
}
```

---

### 6.6 清空检索历史
**DELETE** `/api/v1/search/history`

**说明**: 清空所有检索历史记录

**认证**: 需要 Bearer Token

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": null,
  "timestamp": 1776603600000
}
```

## 7. 文献管理模块 (Paper Module)

### 7.1 获取文献列表
**GET** `/api/v1/papers`

**说明**: 获取文献列表（分页 + 多条件过滤）

**认证**: 需要 Bearer Token

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 0 | 页码 |
| size | number | 否 | 20 | 每页大小 |
| sort | string | 否 | - | 排序字段 |
| researchArea | string | 否 | - | 研究领域（模糊匹配） |
| baselineModel | string | 否 | - | Baseline 模型（精确匹配） |
| technicalModule | string | 否 | - | 技术模块 |
| yearGte | number | 否 | - | 年份 >= |
| yearLte | number | 否 | - | 年份 <= |
| downloadStatus | string | 否 | - | 下载状态过滤 |
| vectorized | boolean | 否 | - | 是否已向量化 |
| keyword | string | 否 | - | 全文搜索关键词 |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "content": [
      {
        "id": "string",
        "title": "string",
        "authors": ["string"],
        "year": 2024,
        "venue": "string",
        "doi": "string",
        "abstract": "string",
        "matchScore": 0.95,
        "downloadStatus": "COMPLETED",
        "filePath": "string",
        "fileSize": 1024000,
        "researchArea": "string",
        "baselineModel": "string",
        "technicalModules": ["string"],
        "vectorized": true,
        "citationCount": 10,
        "createdAt": "2026-04-19T12:00:00Z",
        "updatedAt": "2026-04-19T12:00:00Z"
      }
    ],
    "totalElements": 100,
    "totalPages": 5,
    "number": 0,
    "size": 20,
    "first": true,
    "last": false
  },
  "timestamp": 1776603600000
}
```

**下载状态枚举**:
- `PENDING`: 等待下载
- `DOWNLOADING`: 下载中
- `COMPLETED`: 下载完成
- `FAILED`: 下载失败

---

### 7.2 获取文献详情
**GET** `/api/v1/papers/{paperId}`

**说明**: 获取文献详细信息

**认证**: 需要 Bearer Token

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| paperId | string | 文献 ID |

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| includeBaselineTable | boolean | 否 | false | 是否包含 Baseline 对比表 |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "string",
    "title": "string",
    "authors": ["string"],
    "year": 2024,
    "venue": "string",
    "doi": "string",
    "abstract": "string",
    "matchScore": 0.95,
    "downloadStatus": "COMPLETED",
    "vectorized": true,
    "citationCount": 10,
    "publicationDate": "2024-01-15",
    "keywords": ["string"],
    "fullAbstract": "string",
    "baselineComparison": [
      {
        "modelName": "string",
        "corePerformance": "string",
        "testDataset": "string",
        "year": 2023,
        "isHighlighted": true
      }
    ],
    "implementationDetails": {
      "coreInnovations": ["string"],
      "technicalDetails": ["string"],
      "openSourceCode": "string"
    },
    "openSourceUrl": "string",
    "userAnnotations": {
      "notes": "string",
      "tags": ["string"],
      "rating": 5,
      "addedToComparison": true
    },
    "createdAt": "2026-04-19T12:00:00Z",
    "updatedAt": "2026-04-19T12:00:00Z"
  },
  "timestamp": 1776603600000
}
```

---

### 7.3 触发文献下载
**POST** `/api/v1/papers/{paperId}/download`

**说明**: 触发 PDF 下载任务，返回 taskId 用于轮询进度

**认证**: 需要 Bearer Token

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| paperId | string | 文献 ID |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "taskId": "string",
    "status": "PENDING"
  },
  "timestamp": 1776603600000
}
```

---

### 7.4 获取 PDF 文件
**GET** `/api/v1/papers/{paperId}/file`

**说明**: 返回 PDF 文件流，用于在线预览或下载

**认证**: 需要 Bearer Token

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| paperId | string | 文献 ID |

**响应类型**: `application/pdf` (二进制流)

---

### 7.5 导出引用格式
**GET** `/api/v1/papers/{paperId}/citation`

**说明**: 导出文献引用，支持多种格式

**认证**: 需要 Bearer Token

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| paperId | string | 文献 ID |

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| format | string | 否 | bibtex | 引用格式 (bibtex/apa/mla/chicago) |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "format": "bibtex",
    "content": "@article{...}"
  },
  "timestamp": 1776603600000
}
```

---

### 7.6 获取最近下载
**GET** `/api/v1/papers/recent`

**说明**: 获取最近下载的文献列表（侧边栏使用）

**认证**: 需要 Bearer Token

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| limit | number | 否 | 10 | 返回数量 |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": "string",
      "title": "string",
      "authors": "string",
      "year": 2024,
      "downloadStatus": "COMPLETED",
      "progress": 100,
      "matchScore": 0.95,
      "downloadedAt": "2026-04-19T12:00:00Z"
    }
  ],
  "timestamp": 1776603600000
}
```

---

### 7.7 删除文献
**DELETE** `/api/v1/papers/{paperId}`

**说明**: 删除指定文献

**认证**: 需要 Bearer Token

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| paperId | string | 文献 ID |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": null,
  "timestamp": 1776603600000
}
```

## 8. 用户设置模块 (Settings Module)

### 8.1 获取用户设置
**GET** `/api/v1/settings`

**说明**: 获取当前用户的个性化设置

**认证**: 需要 Bearer Token

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "displayName": "string",
    "email": "string",
    "yearRangeStart": 2020,
    "yearRangeEnd": 2026,
    "minMatchScore": 0.7,
    "maxResults": 50,
    "sources": ["arxiv", "ieee"],
    "maxContextPapers": 10,
    "includeCitations": true,
    "autoCollapseSidebar": true
  },
  "timestamp": 1776603600000
}
```

---

### 8.2 更新用户设置
**PUT** `/api/v1/settings`

**说明**: 更新用户的个性化设置（支持部分更新）

**认证**: 需要 Bearer Token

**请求体**:
```json
{
  "displayName": "string",
  "yearRangeStart": 2020,
  "yearRangeEnd": 2026,
  "minMatchScore": 0.7,
  "maxResults": 50,
  "sources": ["arxiv", "ieee"],
  "maxContextPapers": 10,
  "includeCitations": true,
  "autoCollapseSidebar": true
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "displayName": "string",
    "email": "string",
    "yearRangeStart": 2020,
    "yearRangeEnd": 2026,
    "minMatchScore": 0.7,
    "maxResults": 50,
    "sources": ["arxiv", "ieee"],
    "maxContextPapers": 10,
    "includeCitations": true,
    "autoCollapseSidebar": true
  },
  "timestamp": 1776603600000
}
```

---

### 8.3 清除缓存
**POST** `/api/v1/settings/clear-cache`

**说明**: 清除用户相关的缓存数据

**认证**: 需要 Bearer Token

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": null,
  "timestamp": 1776603600000
}
```

---

### 8.4 重置设置
**POST** `/api/v1/settings/reset`

**说明**: 重置所有设置为默认值

**认证**: 需要 Bearer Token

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "displayName": "string",
    "email": "string",
    "yearRangeStart": 2020,
    "yearRangeEnd": 2026,
    "minMatchScore": 0.7,
    "maxResults": 50,
    "sources": ["arxiv", "ieee"],
    "maxContextPapers": 10,
    "includeCitations": true,
    "autoCollapseSidebar": true
  },
  "timestamp": 1776603600000
}
```

---

### 8.5 删除账户
**DELETE** `/api/v1/settings/account`

**说明**: 删除当前用户账户及所有关联数据

**认证**: 需要 Bearer Token

**成功响应** (200):
```json
{
  "code": 200,
  "message": "成功",
  "data": null,
  "timestamp": 1776603600000
}
```

## 9. 附录

### 9.1 环境变量配置
| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| VITE_API_BASE_URL | 后端 API 地址 | http://localhost:8080 |

### 9.2 Token 刷新机制
- AccessToken 有效期：15 分钟（900 秒）
- RefreshToken 有效期：7 天（604800 秒）
- 当 AccessToken 过期（401）时，自动使用 RefreshToken 刷新
- 防止并发请求同时触发多次刷新
- 刷新失败后清除本地存储并跳转登录页

### 9.3 前端技术栈
- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **HTTP 客户端**: Axios
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: TailwindCSS
- **构建工具**: Vite

### 9.4 注意事项
1. 所有需要认证的接口都必须携带有效的 Bearer Token
2. 检索任务采用异步模式，创建后需轮询获取进度
3. 文献下载同样采用异步模式，返回 taskId 用于轮询
4. 分页参数 page 从 0 开始
5. 所有时间字段使用 ISO 8601 格式
6. 响应中的 code 为业务状态码，HTTP 状态码表示协议层状态

---

**版本**: 1.0  
**作者**: AI 自动生成  
**更新日期**: 2026-04-19  
**说明**: 本文档由 AI 根据前端代码自动生成，如有遗漏或错误，请手动补充修正
