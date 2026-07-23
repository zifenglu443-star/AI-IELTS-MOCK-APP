# 小红书标题候选

1. 我做了一个开源雅思模考工具，GitHub 可下载
2. 开源分享：自动导题 + AI 批改解析的雅思模考工具
3. 雅思备考材料太散？我做了个听说读写都能练的小工具

# 正文

最近一直觉得雅思备考最麻烦的不是“没有题”，而是材料太散、反馈太慢。

听力是 PDF + 答案 + Part 1-4 音频，阅读要自己计时，写作口语练完也很难知道到底哪里要改。每次想认真做一套模考，都要在好几个软件之间来回切。

所以我做了一个开源小工具：IELTS Mock Lab。

它最核心的两个点：

1. 自动导题
PDF / 图片 / 文本 / 音频材料可以导入，尽量整理成能直接练习的 IELTS 题目。

2. AI 批改和解析
练完以后不只是看一个分数。听力、阅读可以自动批改客观题，错题可以点 AI 解析，看依据、为什么错、下次怎么避开；写作、口语也留了 AI 反馈入口，用来做评分、修改建议和复盘。

目前覆盖听说读写四科：

- Listening：导入题目 PDF、答案、Part 1-4 音频，做题后自动批改，错题可 AI 解析
- Reading：按 Passage 练习，支持题号导航、复查标记、自动批改和 AI 解析
- Writing：Task 1 / Task 2，带字数统计、保存记录，写完可走 AI 反馈入口
- Speaking：Part 1 / 2 / 3，支持录音、回放、保存记录，也预留 AI 反馈流程
- 本地运行：可以直接浏览器打开，也可以跑 Electron 桌面版

我截图里用的是桌面 demo 文件夹里的听力材料：题目 PDF、答案 PDF、四段音频。导入以后就可以生成到考试库里练习。

需要说明一下：AI 功能需要填你自己的模型 API Key，Key 是运行时输入，不建议写进代码里。不开 AI 的话，也可以手动导入 JSON 和资源文件。

项目已经放到 GitHub：

https://github.com/zifenglu443-star/AI-IELTS-MOCK-APP

这不是广告，是开源分享。大家可以下载试试，也欢迎提 issue / 交流建议。如果觉得这个方向有用，麻烦顺手点一下 Star，我会很开心，也更有动力继续把它做完整。

# 标签

#雅思 #雅思备考 #IELTS #开源项目 #GitHub #英语学习 #留学备考 #AI工具 #学习工具 #雅思听力 #雅思阅读 #雅思写作 #雅思口语

# 图片顺序

1. xhs-01-cover.jpg
2. xhs-02-pain-and-home.jpg
3. xhs-05-auto-import-ai-feedback.jpg
4. xhs-03-features.jpg
5. xhs-04-demo-import.jpg
6. xhs-05-download-guide.jpg
7. xhs-06-open-source-star.jpg
