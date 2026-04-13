# 梦想职业评估 + 差距分析报告 MVP

独立新系统，用于实现职业准备度评估 + 差距分析报告演示。

本项目是一个**全新目录下的独立前端应用**，只读参考原有简历批注系统的技术栈与组织方式，**没有修改原系统的页面、路由、功能和部署逻辑**。

## 运行方式

```bash
cd /Users/Openclawworkspace/workspace/dream-career-mvp
npm install
npm run dev
```

默认访问：`http://localhost:5173`

生产构建：

```bash
npm run build
```

测试：

```bash
npm test
```

## 环境变量

先复制：

```bash
cp .env.example .env
```

当前支持的变量：

| 变量名 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_APP_TITLE` | `梦想职业评估 MVP` | 页面标题预留字段 |
| `VITE_USE_STATIC_ROLE_DATA` | `true` | 默认使用本地静态岗位与题库数据 |
| `VITE_ENABLE_DEBUG` | `false` | 预留调试开关 |
| `VITE_LEAD_WEBHOOK_URL` | 空 | 3 个承接页的主留资 webhook 地址，表单会按统一结构化 payload 真实提交 |
| `VITE_LEAD_NOTIFICATION_WEBHOOK_URL` | 空 | 可选通知 webhook 地址，主提交成功后会再发一条精简通知 payload |

## 页面说明

当前已跑通页面：

1. `/` Demo 入口 / 演示案例列表
2. `/start` 测试导航页 / 测前建档
3. `/assessment` 题目页
4. `/result` 岗位匹配度分析结果页
5. `/report` 差距分析与规划报告页

## 本次 MVP 的 10 个岗位

- 产品经理
- 市场营销
- 客户经理
- AI算法工程师
- 嵌入式开发工程师
- 战略咨询
- 策略运营
- 审计
- 财务
- 数据分析

## 当前使用 mock 的部分

以下内容当前全部为本地 mock / 静态数据：

1. `roles`
2. `role_subcategories`
3. `question_sets`
4. `result_templates`
5. `user_profiles`
6. `answer_records`
7. `assessment_results`
8. `resume_diagnosis_reports`

留资承接页说明：

- 若未配置 `VITE_LEAD_WEBHOOK_URL`，3 个承接页表单会写入浏览器 `localStorage`
- 本地留资池 key 为 `dream-career:lead_captures`
- 若已配置 `VITE_LEAD_WEBHOOK_URL`，表单会继续保留一份本地副本，同时向外部 webhook 发送 JSON 数据
- 若仅配置 `VITE_LEAD_WEBHOOK_URL` 而未配置 `VITE_LEAD_NOTIFICATION_WEBHOOK_URL`，真实留资仍正常，只是不额外推送通知
- 若 webhook 请求失败，前端会自动回退到本地留资池，并在控制台输出告警，不影响用户看到成功状态

### 真实留资接入方式（飞书多维表格 + Cloudflare Pages Function）

> 本项目已内置 `functions/api/bitable.js`，部署到 Cloudflare Pages 后自动生效。

**飞书准备（一次性）：**

1. 打开 https://open.feishu.cn/app → 创建企业自建应用，记下 App ID 和 App Secret
2. 权限管理 → 开通 `bitable:app`（多维表格读写）→ 发布版本
3. 创建多维表格，按下方列表建列（列名必须完全一致）：
   - 必填列：`线索类型` / `姓名` / `联系方式` / `目标岗位` / `当前年级` / `留学意向` / `评估得分` / `匹配度标签` / `当前问题` / `提交时间` / `来源页面` / `跟进状态`
   - 咨询类额外：`空档时间` / `咨询主题`
   - 案例类额外：`案例匹配`
   - 诊断类额外：`目标公司类型` / `简历阶段` / `诊断重点` / `简历文件`
4. 多维表格右上角分享 → 输入应用名 → 添加为协作者
5. （可选）群设置 → 群机器人 → 添加自定义机器人，记下 Webhook URL

**Cloudflare Pages 后台配置（Settings → Environment variables）：**

```
FEISHU_APP_ID                = cli_xxxxxxxxxxxxxxxx
FEISHU_APP_SECRET            = xxxxxxxxxxxxxxxxxxxxxxxx
FEISHU_BITABLE_APP_TOKEN     = xxxxxxxxxxxxxxxxxxxxxxxx   # URL 中 /base/{这里}
FEISHU_BITABLE_TABLE_ID      = tblxxxxxxxxxxxxxxxx          # URL 中 ?table={这里}
FEISHU_BOT_WEBHOOK_URL       = https://open.feishu.cn/...  # 可选，群通知
VITE_LEAD_WEBHOOK_URL        = /api/bitable               # 指向同站 Function
```

配置完成后重新部署即可。未配置飞书变量时，Function 返回 200 且前端静默使用 localStorage。

### 实时提交 payload 结构

主 webhook 会收到以下字段：

- `type`
- `name`
- `wechat`
- `role_id`
- `role_name`
- `grade`
- `overseas_intent`
- `assessment_score`
- `assessment_label`
- `note`
- `submitted_at`
- `source_url`
- `extra`

其中：

- `type` 枚举：`consultation` / `case` / `diagnosis`
- `grade` 枚举：`freshman` / `sophomore` / `junior` / `senior` / `graduate` / `graduated`
- `overseas_intent` 枚举：`yes` / `no` / `maybe`

`extra` 字段约定：

- `consultation`
  - `time_preference`
  - `consult_topic`
- `case`
  - `case_matched`
- `diagnosis`
  - `company_type`
  - `resume_stage`
  - `diagnosis_focus`
  - `resume_file_url`

通知 webhook 会收到精简字段：

- `type`
- `name`
- `wechat`
- `role_name`
- `grade`
- `overseas_intent`
- `assessment_score`
- `assessment_label`
- `submitted_at`
- `extra_summary`

说明：

- 静态岗位、岗位细分、题库、结果模板位于 `src/data/`
- 用户 profile、答题记录、测试结果、报告记录保存在浏览器 `localStorage`
- 不依赖真实后端，不依赖数据库，不依赖爬虫

## Demo 数据

已内置 10 组岗位 demo，每个岗位至少 1 组：

1. `产品经理`
2. `市场营销`
3. `客户经理`
4. `AI算法工程师`
5. `嵌入式开发工程师`
6. `战略咨询`
7. `策略运营`
8. `审计`
9. `财务`
10. `数据分析`

入口：

- 首页可直接载入 demo 并跳转结果页
- 测试导航页可选择“仅填入表单”或“直接进入结果页”

## 目录结构

```text
dream-career-mvp/
├── .env.example
├── README.md
├── package.json
├── tests/                         # 核心逻辑测试（node:test）
├── src/
│   ├── components/               # 页面公共壳与卡片组件
│   ├── data/                     # roles / question_sets / result_templates / demos
│   ├── lib/                      # validation / assessment / reporting / display
│   ├── pages/                    # 5 个核心页面
│   ├── services/                 # localStorage mock repo / role provider 接口
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── public/
```

## 架构预留

当前已按以下结构组织：

- `roles`
- `role_subcategories`
- `question_sets`
- `result_templates`
- `user_profiles`
- `answer_records`
- `assessment_results`
- `resume_diagnosis_reports`

对应实现位置：

- 静态结构：`src/data/`
- 生成逻辑：`src/lib/`
- 持久化与 mock 仓储：`src/services/mockDatabase.js`

## 岗位 crawler / provider 预留方式

MVP 默认只使用本地静态岗位数据，不把真实爬虫做成主依赖。

当前预留接口：

- `src/services/roleProvider.js`
  - `StaticRoleProvider`
  - `PlaceholderRoleCrawlerProvider`

未来接入方式建议：

1. 新增 `RemoteRoleCrawlerProvider`
2. 接入岗位来源 API / 抓取任务
3. 将抓回数据写入独立后端或缓存层
4. 前端继续走 provider 接口，不直接耦合爬虫逻辑

## 自测范围

已做以下验证：

- `npm test`
- `npm run build`
- 浏览器页面链路自测：Demo入口 -> 测试导航页 -> 题目页 -> 结果页 -> 报告页

## 设计原则

- 先跑通流程，再考虑复杂度
- 不引入不必要依赖
- 不复用原系统代码到破坏边界的程度
- 所有新功能都在独立新目录内完成
