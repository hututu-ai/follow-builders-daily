# 更新日志 · Changelog

本项目长期维护，所有重要更新都记录在这里。
This project is maintained long-term; all notable changes are documented here.

> 版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)：`主版本.次版本.修订号`。
> Versioning follows [SemVer](https://semver.org/): `MAJOR.MINOR.PATCH`.

---

## v1.1.0 — 2026-06-02

### 📬 新增：邮件订阅 · Added: Email subscription
- **中文**：现在可以把生成的报纸**直接发到你的邮箱**。邮件客户端能渲染 HTML，收件箱里就是一份排版完整的报纸。说一句「生成日报并发到邮箱」即可。
- **EN**: You can now **email the generated newspaper straight to your inbox**. Email clients render HTML, so your inbox shows a fully laid-out newspaper. Just say "generate daily and email it".
- 新增零依赖脚本 `scripts/send-email.mjs`，复用原版 follow-builders 已有的邮箱配置（`RESEND_API_KEY` + `delivery.email`），无需重复设置。
- Added the zero-dependency `scripts/send-email.mjs`, reusing the original follow-builders email config — no duplicate setup.

---

## v1.0.0 — 2026-06-01

### 🎉 首次发布 · Initial release
- **中文**：把 Follow Builders 的纯文字摘要变成**报纸风格的 HTML 日报**，包含报头、头版头条、30 秒速览、每日金句、主编按语 + 标签、Builder 分栏卡片、播客深度专题。
- **EN**: Turns the Follow Builders plain-text digest into a **newspaper-style HTML daily** — masthead, front-page headline, 30-second brief, quote of the day, editor's note + tags, columned builder cards, and an in-depth podcast feature.
- 零依赖、字体用 Google Fonts（不依赖本地字体），跨设备可移植。
- Zero dependencies; uses Google Fonts (no local font dependency); portable across machines.
- 完整中英双语 README + 零基础手把手安装教程。
- Full bilingual README + beginner-friendly install guide.
