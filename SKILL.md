---
name: follow-builders-daily
description: 把 Follow Builders Skill 的文字摘要变成一份报纸风格的 HTML 日报，并可邮件订阅（把报纸发到邮箱）。依赖原版 follow-builders skill 已安装。触发词："生成日报" / "今日日报" / "newspaper" / "报纸" / "daily" / "邮件订阅" / "发到邮箱" / "email me"。
---

# Follow Builders 日报 — 报纸排版工作流

> 本 Skill 是原版 Follow Builders Skill 的**输出增强层**。
> 原版输出 Markdown 文字，本 Skill 把同样的内容排成一份**报纸风格的 HTML 日报**。
>
> **架构：原版负责「数据 + 摘要」，本 Skill 负责「排版」。两者缺一不可。**

## 前置条件（重要）

⚠️ **本 Skill 依赖原版 follow-builders skill。没有它，本 Skill 无法获取任何数据。**

**第一件事**：检查原版是否已安装。
```bash
ls ${HOME}/.claude/skills/follow-builders/scripts/prepare-digest.js
```

如果文件**不存在**，停下来，明确告诉用户：

> 「生成报纸日报需要先安装原版 follow-builders skill（它负责抓取数据），本 Skill 只负责把数据排成报纸。请先运行：」

```bash
git clone https://github.com/zarazhangrui/follow-builders.git ~/.claude/skills/follow-builders
cd ~/.claude/skills/follow-builders/scripts && npm install
```

然后引导用户完成原版的首次设置（在 Claude Code 里说「初始化 follow builders」，语言选中文，推送方式选 stdout）。**原版设置完成后，再回来生成日报。**

如果文件**存在**，继续下面的工作流程。

## 工作流程

### Step 1: 获取数据

运行原版 skill 的 prepare 脚本获取 JSON 数据：
```bash
cd ${HOME}/.claude/skills/follow-builders/scripts && node prepare-digest.js 2>/dev/null
```

脚本输出一个 JSON blob，包含：
- `x` — 每位 builder 的推文（text, url, bio）
- `podcasts` — 播客剧集（transcript, title, url）
- `blogs` — 博客文章
- `prompts` — 内容摘要指令
- `config` — 用户偏好（language 等）
- `stats` — 内容统计

如果脚本失败，告诉用户检查网络。

### Step 2: 内容 Remix

用 JSON 中的 `prompts` 字段指导内容摘要：
- 用 `prompts.summarize_tweets` 逐个 remix builder 推文
- 用 `prompts.summarize_podcast` remix 播客（如有）
- 用 `prompts.summarize_blogs` remix 博客（如有）

**绝对规则（继承自原版）：**
- 绝不捏造内容，只用 JSON 里的数据
- 每条内容必须有原始 URL
- 不要猜测 job title，用 `bio` 字段
- 不要访问任何 URL 或调用任何 API

### Step 3: 选题决策

从 remix 好的内容中做以下决策：

1. **头条选择**：选互动量最高或话题最前沿的一条作为头版头条
2. **30 秒速览**：挑 3 条最重要的内容，各写一句话
3. **每日金句**：从推文原文中选一条最精彩的引用
4. **主编按语**：用 2-3 句话串联今天的主题
5. **话题标签**：提取 3-5 个关键话题标签
6. **头条 Builder**：头条 builder 的卡片使用 span-2（占两列），其余使用普通单列

### Step 4: 组装 HTML

读取本 Skill 目录下的模板和组件手册：

```bash
cat ${CLAUDE_SKILL_DIR}/templates/base.html
cat ${CLAUDE_SKILL_DIR}/templates/components.md
```

按以下结构组装完整 HTML：

#### 4.1 HTML 骨架
复制 `templates/base.html` 作为起点。这包含完整的 `<style>` CSS 和页面框架。

#### 4.2 填充报头 Masthead
替换占位符：
- `{{DATE}}` → 今天的中文日期（如 2026年6月1日 · 星期日）
- `{{VOL_NUM}}` → 期号（从 001 开始，读取 `~/.follow-builders-daily/state.json` 中的 `vol` 字段，没有就用 001）
- `{{BUILDER_COUNT}}` → 本期 builder 数量
- `{{TWEET_COUNT}}` → 本期推文总数
- `{{PODCAST_COUNT}}` → 本期播客数量（0 或 1）
- `{{NAV_ITEMS}}` → 根据内容生成导航栏

#### 4.3 填充 Lead Banner
用 Step 3 选出的头条填入：
- `lead-kicker`：头版头条 · Front Page
- `lead-headline`：头条大标题
- `lead-deck`：头条导语（1-2 句话）

#### 4.4 填充 30 秒速览
3 个 `sp-item`，每个含编号 + 一句话摘要。

#### 4.5 填充每日金句
- `qotd`：英文原文引用
- `qotd-attr`：作者 @handle · 日期

#### 4.6 填充主编按语 + 标签
- `editorial-text`：2-3 句串联叙述
- `tags-list`：3-5 个 `.tag` 标签

#### 4.7 填充 Builder 卡片网格

**排列规则（参照 components.md）：**

1. 头条 builder 使用 `.gcol.span-2`（占两列），放在第一个 `.grid-3` 的第一个位置
2. 接下来 1-2 个 builder 填满第一行（第三列）。如果只有 1 个就单列，如果有 2 个就竖向堆叠（用 `<hr class="art-divider">` 分隔）
3. 剩余 builder 每 3 个一行，用 `.grid-3` 或 `.grid-3-row2` 包裹
4. 如果某行不足 3 个，剩余位置留空即可

**每张卡片内部结构：**
- `.art-kicker` — 话题分类（如 "AI 工程 · 人机交互"）
- `.art-hed` — 标题（头条用 `.lg`，普通用默认，小稿用 `.sm`）
- `.byline` — 作者名 + @handle + 时间戳
- `.tweet-orig` — 原推引用块（如有精彩原文，附查看链接）
- `.pull` — Pull quote（如有特别精彩的一句话）
- `.sumbox` — 摘要框（重要的用 `.sumbox.lime`）
- `.engage` — 互动数据（❤ ↻ 💬）

#### 4.8 填充播客专题（如有）

如果 JSON 中有播客数据，组装 `.feature-wrap` 区块：
- `.feature-hero` — 播客标题 + 嘉宾 + 导语
- `.feat-main` — 正文（首段加 `.drop` class 实现首字下沉）+ pull quote
- `.feat-sidebar` — 五大要点（`.kp` 列表）+ 嘉宾信息 + 原视频链接

如果没有播客数据，跳过整个 `.feature-wrap`。

#### 4.9 语言处理

读取 `config.language`：
- **"zh"**：全部内容中文（标题、摘要、主编按语等都用中文）。推文原文保留英文，摘要翻译为中文。
- **"en"**：全部英文。
- **"bilingual"**：标题中文，摘要中英对照。

### Step 5: 输出

1. 确定输出目录：
```bash
mkdir -p ~/cola/outputs/follow-builders-daily
```

2. 写入 HTML 文件：
```bash
# 文件名用日期
# ~/cola/outputs/follow-builders-daily/YYYY-MM-DD.html
# 同时覆盖 index.html 作为最新一期
```

3. 更新期号状态：
```bash
mkdir -p ~/.follow-builders-daily
# 读取 state.json 中 vol 字段 +1，写回
```

4. 在浏览器中打开：
```bash
open ~/cola/outputs/follow-builders-daily/index.html
```

5. 告诉用户日报已生成，显示包含的内容统计。

### Step 6: 邮件投递（邮件订阅）

**触发条件**：用户说「邮件订阅」「发到邮箱」「email me」，**或** `~/.follow-builders/config.json` 中 `delivery.method` 为 `"email"`。

邮件能渲染 HTML，所以直接把生成的报纸 HTML 作为邮件正文发出去，收件箱里就是一份排版完整的报纸：

```bash
node ${CLAUDE_SKILL_DIR}/scripts/send-email.mjs --file ~/cola/outputs/follow-builders-daily/index.html
```

脚本会自动复用原版 follow-builders 已有的邮箱配置：
- `RESEND_API_KEY` ← `~/.follow-builders/.env`
- 收件地址 ← `~/.follow-builders/config.json` 的 `delivery.email`（也可加 `--to 邮箱` 覆盖）

**如果脚本报错没有 key 或收件人**：说明用户还没配过邮件投递。引导他们在原版里开启：在 Claude Code 里说「把投递方式改成邮件」，原版会引导注册一个免费的 [Resend](https://resend.com) key 并填入邮箱。配好后再回来即可。

> 注：发件用 Resend 免费测试域 `onboarding@resend.dev` 时，只能发给账号本人邮箱（「发给自己」场景足够）。用户验证自有域名后，可设环境变量 `FB_DAILY_FROM` 覆盖发件地址。

> Telegram 不能渲染 HTML，所以本 skill 的报纸不走 Telegram；如果用户用 Telegram，仍可用原版的纯文字摘要。

### Step 7: 每日自动订阅（可选，进阶）

「邮件订阅」要真正每天自动到达，需要一个定时器在到点时跑「生成 + 发邮件」。因为 HTML 组装依赖 Claude，无法用纯 shell 的 crontab 完成，需借助能定时唤起 agent 的工具：

- **OpenClaw 用户**：用 `openclaw cron add`，message 设为「生成日报并邮件投递」。
- **Claude Code 用户**：用支持定时唤起的调度方案（如 scheduled-tasks），到点触发「生成日报」即可，本 skill 会在 Step 6 自动发邮件。
- 没有调度器时：保持「手动触发」——用户每天说一句「生成日报并发到邮箱」，同样能收到邮件。

引导用户按其平台选择；不强制配置。

---

## 配置

用户可通过对话修改偏好，存储在 `~/.follow-builders-daily/config.json`：

- "日报输出到 XX 目录" → 修改 `outputDir`
- "期号从 XX 开始" → 修改 `state.json` 的 `vol`

其他配置（语言、推送方式等）继承原版 follow-builders 的 `~/.follow-builders/config.json`。
