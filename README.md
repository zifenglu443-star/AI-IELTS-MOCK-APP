# IELTS Mock Lab

一个支持听力、阅读、写作、口语的雅思四科模考平台。生产网页位于 [ieltsmock.luzifeng.cn](https://ieltsmock.luzifeng.cn)，Electron 桌面端加载同一受信任站点；两端共享账户和服务器数据。

## 服务器版概览

- 账号仅由管理员创建，不开放自助注册；首次登录强制修改临时密码。
- 密码使用 Argon2id 摘要，会话使用 Secure、HttpOnly、SameSite Cookie 和 CSRF Token。
- 题库、考试进度、答案、成绩、附件、录音、复习记录、口语题库和模型设置以 PostgreSQL 与受保护文件卷为准。
- API Key 使用独立主密钥进行 AES-256-GCM 加密；普通接口只返回掩码，不把明文密钥交回网页。
- 模考由服务器保存绝对截止时间；练习模式可暂停。考试写入使用租约和版本号，防止旧设备覆盖新答案。
- 默认用户容量 2 GiB、单文件上限 200 MiB，管理员可调整配额。

本地开发需要 PostgreSQL，并通过环境变量提供 `DATABASE_URL`、32 字节 Base64 `ENCRYPTION_MASTER_KEY` 和可选的首次管理员凭据：

```bash
npm install
COOKIE_SECURE=false DATABASE_URL=postgresql://... \
  ENCRYPTION_MASTER_KEY=... npm run server
```

再由任意静态服务器提供项目根目录，并把 `/api` 反向代理到 Node.js API。生产部署、备份和回滚说明见 [`deploy/ieltsmock/DEPLOYMENT.md`](deploy/ieltsmock/DEPLOYMENT.md)。

## 功能

- 支持 Listening、Academic Reading、Academic Writing、Speaking
- 支持模考模式和练习模式
- 阅读按倒计时自动交卷；听力在全部音频播放结束后给 3 分钟检查时间，然后自动交卷
- 写作支持 Task 1 / Task 2、字数统计、保存记录、AI 评分入口
- 口语支持 Part 1 / Part 2 / Part 3、录音、回放、保存记录、AI 反馈入口
- 口语支持导入当季题库，并随机抽取 Part 1 / Part 2 / Part 3 组成一套练习
- 当季口语题库可手动导入 JSON，也可上传 PDF / 图片 / 文本让 AI 整理成题库
- 支持填空题、单选题、多选题
- 阅读匹配题可简化为填字母题
- 支持自动批改
- 支持多个正确答案写法
- 多选题支持 `maxChoices` 和 `points`
- 支持导入 JSON 题目、听力音频、地图题图片
- AI 生成时支持手动填写题目 PDF 页码，把整页截图加入听力地图 / 写作 Task 1 题目
- 支持用 OCR、语音、文本三类模型从材料辅助生成 JSON，并自动加入考试库
- 选择 JSON 后先显示待添加预览，需要点击确认才会加入考试库
- Reading Passage 和 Listening Part 分页显示
- 分页答题，但整套考试统一交卷、统一批改
- 支持阅读文章、题干和说明文字高光
- 支持题号导航、已答状态、复查标记
- 模考完成后可从成绩页返回主页面
- 成绩会保存到服务器历史记录
- 听力 / 阅读错题记录支持点击“AI解析”

## 桌面软件

项目已经加入 Electron 外壳配置。第一次运行需要安装依赖：

```bash
npm install
npm start
```

Electron 默认连接生产站点，也可以通过 `IELTS_APP_URL` 指定受信任的部署地址。二进制会在安装阶段下载并校验。GitHub 下载较慢时，可使用镜像；文件仍会按 Electron 包内置的 SHA-256 校验：

```bash
ELECTRON_MIRROR=https://repo.huaweicloud.com/electron/ npm install
```

打包 macOS App：

```bash
npm run dist
```

打包产物会输出到 `dist/`。桌面版保留沙箱和上下文隔离，限制站外导航与媒体权限来源。网络不可用时会显示连接状态页，不会出现空白窗口。

模型设置安全说明：API Key 由服务器加密保存并代发模型请求，不写入代码、浏览器持久化配置、备份或普通接口响应。服务器会阻止自定义接口访问环回、内网和云元数据地址，并逐次校验重定向。

开发检查：

```bash
npm test
npm run check
```

`npm run check` 会同时检查 JavaScript 语法、考试 JSON 和安全输入测试。

## 使用方法

1. 使用管理员提供的账号登录；临时密码首次使用时必须修改。
2. 选择题目 JSON，页面会显示待添加预览。
3. 确认信息无误后，点击“确认添加到考试库”。
4. 如果是听力题，同时导入 JSON 中引用的音频文件和图片文件。
5. 在考试列表里选择模考或练习并开始。
6. 作答自动同步到服务器；断网草稿会按用户短期保存在本机，退出登录时清除。

## AI 生成考试

“AI 生成考试”区域支持上传 PDF、图片、音频、文本等材料，并按模型设置里的三个槽位自动分派任务：

- OCR 模型 / 工具：本地 PDF / 图片按官方同步文件解析接口上传（`tool_type=prime-sync`）；URL/base64 兜底使用 `glm-ocr`。
- 语音模型：默认 `glm-asr-2512`，用于口语录音转写。
- 文本模型：默认 `glm-5.2`，用于文本合并、JSON 生成、错题解析和写作/口语反馈。

注意：

- API Key 在设置页输入后由服务器加密保存，不会写入代码文件或导出备份。
- 音频和图片会作为本地资源绑定到生成的考试卡片。
- 音频会根据文件名中的 `Part1`、`Part 2`、`Section3` 等自动提示给模型匹配到对应 Part。
- 上传的本地 PDF / 图片会按官方 `multipart/form-data` 文件解析接口上传，字段为 `file`、`tool_type=prime-sync`、`file_type=PDF/PNG/JPG/JPEG`。
- 最终 JSON 由纯文本阶段合并生成，避免大批量多图请求超过多模态上下文。
- 听力地图题图片是可选项；如果题目图片在 PDF 中，请在导入界面填写“题目 PDF 第几页截图加入题目”，系统会把该页整页截图绑定到题目。
- notes / form / summary completion 应使用 `template` 保留原题整块文本，只把需要填写的位置换成输入框。
- 如果 OCR 无法读取某份材料，可以把关键题目或答案粘贴到补充文本框中。
- AI 生成可手动取消；单次 AI 请求超过 120 秒会自动超时并提示重试建议。
- 如果材料文字很多，把题目和答案文本粘贴到辅助文本框中，生成会更可靠。
- 生成成功后会自动下载一份 JSON 文件，并把该考试加入考试库。
- 生成时会要求模型只输出严格 JSON；如果第一次 JSON 校验失败，系统会把校验错误发回模型并自动重试一次。
- 生成结果会被质量门拦截：选择题不能缺题干，填空题必须有题干或 `template`，客观题分值不能异常超过常规 IELTS 上限。
- 如果材料不足，模型应返回 `INSUFFICIENT_MATERIAL` 错误，而不是编造题目。

## 质量校验

修改或生成 JSON 后，建议运行：

```bash
node tools/validate-exams.js exams/*.json
```

校验会检查：

- JSON 结构是否可用
- 客观题分值是否合理
- 选择题是否缺题干
- 填空题是否缺题干或 `template`
- `template` 中的 `{{题号}}` 占位符是否和 questions 对应
- 多选 / 题号范围的分值是否合理

## 文件引用规则

听力音频和地图图片通过文件名关联。例如 JSON 中写：

```json
{
  "audio": "part1.mp3",
  "image": "map.png"
}
```

导入资源时请选择同名文件 `part1.mp3` 和 `map.png`。文件名大小写不敏感。

## 批改规则

- 忽略大小写
- 忽略前后空格
- 多个连续空格按一个空格处理
- 填空题拼写必须正确
- 单复数默认不同，除非都写入 `answer`
- 近义表达默认不同，除非都写入 `answer`
- 单选题答案必须完全匹配
- 多选题不看顺序
- 多选题选择数量不能超过 `maxChoices`

多个正确答案示例：

```json
{
  "id": 7,
  "text": "Parking area: ____",
  "answer": ["car park", "parking lot"]
}
```

## JSON 结构

根字段：

- `testType`: `listening`、`reading`、`writing` 或 `speaking`
- `title`: 考试标题
- `durationMinutes`: 考试时长
- `audio`: 听力默认音频，可选
- `sections`: 听力 Part 或阅读 Passage 数组

题组字段：

- `title`: 题组标题
- `instructions`: 题目说明
- `questionType`: `blank`、`single_choice`、`multi_choice`
- `template`: 填空题原题整块文本，可选；用 `{{1}}`、`{{2}}` 表示输入框
- `image`: 地图题图片文件名，可选
- `image`: 地图题或图表图片文件名，可选；AI 导入时也可以通过“题目 PDF 第几页截图加入题目”生成绑定图片
- `maxChoices`: 多选最多可选数量
- `questions`: 题目数组

题目字段：

- `id`: 题号，可以是数字，也可以是 `"3-4"`
- `text`: 题干
- `options`: 选择题选项
- `answer`: 正确答案数组
- `points`: 分值，可选；多选题如 `"3-4"` 可设为 `2`

写作 JSON 示例：

```json
{
  "testType": "writing",
  "title": "Academic Writing Test",
  "durationMinutes": 60,
  "sections": [
    {
      "title": "Writing Task 1",
      "instructions": "Write at least 150 words.",
      "prompt": "The chart below shows...",
      "minWords": 150
    },
    {
      "title": "Writing Task 2",
      "instructions": "Write at least 250 words.",
      "prompt": "Some people believe...",
      "minWords": 250
    }
  ]
}
```

口语 JSON 示例：

```json
{
  "testType": "speaking",
  "title": "Speaking Practice Test",
  "durationMinutes": 14,
  "sections": [
    {
      "title": "Part 1",
      "prepSeconds": 0,
      "answerSeconds": 300,
      "questions": ["Do you work or study?"]
    },
    {
      "title": "Part 2",
      "prepSeconds": 60,
      "answerSeconds": 120,
      "cueCard": "Describe a place you visited that you enjoyed.",
      "prompts": ["where it was", "when you went there", "why you enjoyed it"]
    }
  ]
}
```

当季口语题库 JSON 示例：

```json
{
  "title": "IELTS Speaking Current Season Bank",
  "season": "2026 May-August",
  "part1": [
    {
      "topic": "Work or Study",
      "questions": ["Do you work or are you a student?"]
    }
  ],
  "part2": [
    {
      "topic": "Travel",
      "cueCard": "Describe a place you visited that you enjoyed.",
      "prompts": ["where it was", "when you went there", "why you enjoyed it"]
    }
  ],
  "part3": [
    {
      "topic": "Travel",
      "relatedTo": "Travel",
      "questions": ["Why do people like travelling to new places?"]
    }
  ]
}
```

注意：口语录音可以在考试当次回放；目前历史记录只保存录音摘要和文字转写，不把音频 blob 长期写入 localStorage。
