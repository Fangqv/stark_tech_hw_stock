# Stark Tech 前端面试作业

王策

## 项目说明

🚧 WIP 🚧

## 启动说明

🚧 WIP 🚧

## 工作历史记录

1. 接收产品需求
2. 理解产品需求
3. 使用 `npx create-next-app@latest` 创建项目
4. 添加 prettier
5. 最近使用过 [gemini-cli](https://github.com/google-gemini/gemini-cli), 感觉很不错, 准备在这个项目中大规模使用
6. 添加 GEMINI.md 文件, 期望使用 vibe coding 大幅增加开发效率
7. 首次提交至 github repo
8. 了解到 [MUI](https://mui.com/) 存在 Chart 组件
9. 优先选组 Zustand 作为状态管理
   1. 了解到 [openai 的前端项目](https://github.com/openai/openai-fm)在使用 Zustand
   2. 感知到 Zustand 可能为当前前端业界跨组建状态管理的首选方案
10. 我和 gemini 说 "给我添加 MUI 依赖", 但是, 我发现 gemini 直接根据 `GEMINI.md` 把项目的逻辑写好了, 我得到了 snapshot.0.png 文件

![snapshot.0.png](./snapshots/snapshot.0.png)

11. 我发现 gemini-cli 不允许上传图片: `[API Error: {"error":{"message":"{\n  \"error\": {\n    \"code\": 400,\n    \"message\": \"Unable to process input image. Please retry or report in 
https://developers.generativeai.google/guide/troubleshooting\",\n    \"status\": \"INVALID_ARGUMENT\"\n  }\n}\n","code":400,"status":"Bad Request"}}]`
12. 发现 finmindtrade 的 API 报 `402` 了, 申请了 API key, 并添加到 `.env.local` 文件中
13. 我和 Cursor IDE 说: "按照 @statementdog.png 文件中的需求完成整个项目", 我得到了 snapshot.1.png 文件

![snapshot.1.png](./snapshots/snapshot.1.png)

14. 🚧 我准备实现一下底部的滚动条
15. 🚧 我觉得可以让底部的滚动条和上面的 chart 同步一下高亮状态
16. 🚧 我准备让 cursor 根据 PRD 和 statementdog 的需求, 再次帮我实现一下

## 技术栈

- TypeScript
- Next.js
- React.js
- [MUI](https://mui.com/)
- 使用腾讯云部署 dist/ 目录

## 涉及技术问题

- React 理解
- 项目结构理解
- 组件理解 & 拆分 & 重构

## TODO

- [ ] 了解到合作伙伴期望看到结构较好的组件分层, 让我来做一下
- [ ] 最后请一定核对一下 PRD 和 statementdog, 确保没有 Bug
- [ ] 多语言
- [ ] 深色模式
- [ ] 部署至腾讯云
- [ ] UI 美化
- [ ] 在提交前在阅读一遍 notion 上的 PRD, 看看还有没有什么疏漏
